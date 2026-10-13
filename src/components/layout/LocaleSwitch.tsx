"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import clsx from "clsx";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { LOCALE_SCROLL_KEY } from "./LocaleScrollKeeper";

const FADE_MS = 250;

/** ES | EN segmented switch. Keeps the reader's scroll position and cross-fades the copy. */
export function LocaleSwitch({ orientation }: { orientation: "vertical" | "horizontal" }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("nav");
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  const select = (next: Locale) => {
    if (next === locale || pending) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Starts the fade and lifts content-visibility (see globals.css). Set before reading
    // scrollY so placeholder heights are already resolved into real ones.
    document.documentElement.setAttribute("data-locale-switching", "");
    try {
      sessionStorage.setItem(LOCALE_SCROLL_KEY, String(window.scrollY));
    } catch {
      /* storage blocked: we still switch, just without restoring scroll */
    }
    window.setTimeout(
      () => startTransition(() => router.replace(pathname, { locale: next, scroll: false })),
      reduce ? 0 : FADE_MS,
    );
  };

  // Display order is fixed (ES | EN) regardless of the default locale.
  const order: Locale[] = ["es", "en"];

  return (
    <div
      role="group"
      aria-label={t("language")}
      className={clsx(
        "flex shrink-0 rounded-lg bg-chip p-0.5 text-[11px] leading-none font-medium ring-1 ring-line",
        orientation === "vertical" ? "w-[34px] flex-col gap-0.5" : "h-10 items-center gap-0.5",
      )}
    >
      {order
        .filter((l) => routing.locales.includes(l))
        .map((l) => (
          <button
            key={l}
            type="button"
            lang={l}
            aria-pressed={l === locale}
            aria-label={l === locale ? undefined : t("switchTo")}
            onClick={() => select(l)}
            className={clsx(
              "grid place-items-center rounded-md uppercase transition-colors duration-200",
              orientation === "vertical" ? "h-[26px] w-full" : "h-9 w-8 min-[460px]:w-9",
              l === locale ? "bg-accent-soft font-semibold text-accent-ink" : "text-muted hover:text-fg",
            )}
          >
            {l}
          </button>
        ))}
    </div>
  );
}
