"use client";

import { useLocale } from "next-intl";
import { useLayoutEffect } from "react";

export const LOCALE_SCROLL_KEY = "i18n-scroll";

/**
 * After a locale switch, puts the reader back where they were and lifts the
 * cross-fade veil that LocaleSwitch raised before navigating.
 */
export function LocaleScrollKeeper() {
  const locale = useLocale();

  useLayoutEffect(() => {
    const html = document.documentElement;
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(LOCALE_SCROLL_KEY);
      sessionStorage.removeItem(LOCALE_SCROLL_KEY);
    } catch {
      /* storage blocked */
    }
    if (stored !== null) {
      const y = Number(stored);
      if (Number.isFinite(y)) window.scrollTo({ top: y, behavior: "instant" });
    }
    const id = requestAnimationFrame(() => html.removeAttribute("data-locale-switching"));
    return () => cancelAnimationFrame(id);
  }, [locale]);

  return null;
}
