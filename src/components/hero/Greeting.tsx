"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { AnimatePresence, m } from "motion/react";
import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { greetings } from "@/content/content";

const HOLD_MS = 1450;

/** Rotating greeting: each word rises in from below while the previous one leaves upward. */
export function Greeting() {
  const reduce = useSafeReducedMotion();
  const locale = useLocale();
  // Start on the visitor's own greeting and keep the cycle order (नमस्ते → Hola → Hello → Bonjour).
  // This also keeps the Devanagari word, and its system-font fallback, out of the first paint.
  const localIndex = Math.max(0, greetings.findIndex((g) => g.lang === locale));
  const [index, setIndex] = useState(localIndex);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % greetings.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, [reduce]);

  // With reduced motion the greeting stays put, in the visitor's language.
  const current = greetings[reduce ? localIndex : index];

  return (
    <span aria-hidden className="relative block h-[1.18em] overflow-hidden">
      <AnimatePresence initial={false}>
        {/* Drawn as generated content: purely decorative (the h1 carries a static greeting for AT),
            and checkers can't mistake a mid-fade frame for low-contrast text. */}
        <m.span
          key={current.word}
          lang={current.lang}
          data-word={current.word}
          className="absolute inset-x-0 top-0 block whitespace-nowrap before:content-[attr(data-word)]"
          initial={{ y: "90%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-90%", opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.25, 1, 0.5, 1] }}
        />
      </AnimatePresence>
    </span>
  );
}
