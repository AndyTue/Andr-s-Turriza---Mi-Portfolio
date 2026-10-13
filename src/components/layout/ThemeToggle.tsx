"use client";

import { Moon, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import clsx from "clsx";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const html = document.documentElement;
  html.classList.toggle("dark", theme === "dark");
  html.style.colorScheme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage blocked: the choice lasts for this page view */
  }
}

/** Fallback when View Transitions are unavailable: a short global colour fade. */
function fadeTheme(theme: Theme) {
  const style = document.createElement("style");
  style.textContent =
    "*,*::before,*::after{transition:background-color .35s ease,color .35s ease,border-color .35s ease,fill .35s ease!important}";
  document.head.appendChild(style);
  applyTheme(theme);
  window.setTimeout(() => style.remove(), 400);
}

export function ThemeToggle({ className, labelClassName }: { className?: string; labelClassName?: string }) {
  const t = useTranslations("nav");
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!document.startViewTransition || reduce) {
      if (reduce) applyTheme(next);
      else fadeTheme(next);
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        applyTheme(next);
        setTheme(next);
      });
    });

    transition.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
          { duration: 520, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
  };

  const label = theme === "dark" ? t("toLight") : t("toDark");

  return (
    <button type="button" onClick={toggle} aria-label={label} title={label} className={className}>
      <span className="relative grid size-6 shrink-0 place-items-center rounded-full border border-current/25">
        {theme === "dark" ? <Sun size={13} strokeWidth={2} aria-hidden /> : <Moon size={13} strokeWidth={2} aria-hidden />}
      </span>
      <span className={clsx(labelClassName)}>{t("theme")}</span>
    </button>
  );
}
