"use client";

import { PenTool, SquareTerminal, UserRound, MessageSquareText, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitch } from "./LocaleSwitch";

type NavId = "about" | "work" | "services" | "contact";

/** Each dock item lights up for its own section and the ones that follow it. */
const NAV: { id: NavId; icon: LucideIcon; covers: string[] }[] = [
  { id: "about", icon: UserRound, covers: ["about", "experience"] },
  { id: "work", icon: PenTool, covers: ["work"] },
  { id: "services", icon: SquareTerminal, covers: ["services", "recognition"] },
  { id: "contact", icon: MessageSquareText, covers: ["how", "contact"] },
];

const SPY_ORDER = NAV.flatMap((n) => n.covers);

function useScrollSpy() {
  const [active, setActive] = useState<NavId | null>(null);
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const probe = window.innerHeight * 0.45;
      let current: string | null = null;
      for (const id of SPY_ORDER) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= probe) current = id;
      }
      // Past the footer's start, keep "contact" lit.
      const nav = current ? NAV.find((n) => n.covers.includes(current!)) : undefined;
      setActive(nav?.id ?? null);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return active;
}

const itemBase =
  "flex h-10 items-center rounded-lg text-muted outline-offset-2 transition-[background-color,color,width] duration-200 hover:text-fg";

export function Dock() {
  const t = useTranslations("nav");
  const active = useScrollSpy();

  return (
    <nav
      aria-label={t("label")}
      className={clsx(
        "fixed z-50",
        // Phones & tablets: horizontal pill at the bottom.
        "bottom-[max(16px,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2",
        // Desktop: vertical rail on the left edge, centred.
        "lg:bottom-auto lg:top-1/2 lg:left-6 lg:translate-x-0 lg:-translate-y-1/2",
      )}
    >
      <div
        className={clsx(
          "group/dock flex items-center gap-1.5 rounded-2xl bg-surface p-2 shadow-dock min-[400px]:gap-2",
          "lg:w-12 lg:flex-col lg:items-stretch lg:gap-2 lg:overflow-hidden lg:p-[7px]",
          "lg:transition-[width] lg:duration-300 lg:ease-out-expo lg:hover:w-[150px] lg:focus-within:w-[150px]",
        )}
      >
        <ul className="flex items-center gap-1.5 min-[400px]:gap-2 lg:flex-col lg:items-stretch lg:gap-2">
          {NAV.map(({ id, icon: Icon }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={clsx(
                    itemBase,
                    "w-10 justify-center min-[400px]:w-11 lg:w-full lg:justify-start lg:gap-3 lg:px-[7px]",
                    isActive && "bg-accent-soft !text-accent-ink",
                  )}
                >
                  <Icon size={20} strokeWidth={1.9} aria-hidden className="shrink-0" />
                  <span className="text-[15px] font-medium whitespace-nowrap max-lg:sr-only lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover/dock:opacity-100 lg:group-focus-within/dock:opacity-100">
                    {t(id)}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        <span aria-hidden className="h-7 w-px bg-line lg:h-px lg:w-auto" />

        <ThemeToggle
          className={clsx(itemBase, "w-10 justify-center min-[400px]:w-11 lg:w-full lg:justify-start lg:gap-3 lg:px-[5px]")}
          labelClassName="text-[15px] font-medium whitespace-nowrap max-lg:sr-only lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover/dock:opacity-100 lg:group-focus-within/dock:opacity-100"
        />

        <span aria-hidden className="h-7 w-px bg-line lg:h-px lg:w-auto" />

        <div className="lg:hidden">
          <LocaleSwitch orientation="horizontal" />
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <LocaleSwitch orientation="vertical" />
          <span className="text-[15px] font-medium whitespace-nowrap text-muted opacity-0 transition-opacity duration-200 group-hover/dock:opacity-100 group-focus-within/dock:opacity-100">
            {t("language")}
          </span>
        </div>
      </div>
    </nav>
  );
}
