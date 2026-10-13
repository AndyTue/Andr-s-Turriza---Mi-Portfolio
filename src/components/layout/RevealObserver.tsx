"use client";

import { useEffect } from "react";

const PENDING = "[data-reveal]:not([data-revealed])";

/**
 * One observer for every `[data-reveal]` element: fade + 20px rise, once.
 * The head script hides them before paint (`.js-reveal`); a CSS fallback
 * un-hides everything if this never hydrates.
 */
export function RevealObserver() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-reveal-ready", "");

    const reveal = (el: HTMLElement) => {
      const delay = Number(el.dataset.revealDelay ?? 0);
      if (delay) el.style.transitionDelay = `${delay}ms`;
      el.setAttribute("data-revealed", "");
      io.unobserve(el);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) reveal(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    // A fast fling or an anchor jump can carry an element from below the
    // viewport to above it without ever intersecting, which the observer never
    // reports. Sweep those up so nothing stays hidden behind the reader.
    // Measures sections first: a section still below the fold may be skipped by
    // content-visibility, and measuring its children would force its layout.
    let raf = 0;
    const sweep = () => {
      raf = 0;
      const bySection = new Map<Element, HTMLElement[]>();
      document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => {
        const host = el.closest("section, footer") ?? document.body;
        bySection.set(host, [...(bySection.get(host) ?? []), el]);
      });
      bySection.forEach((els, host) => {
        const box = host.getBoundingClientRect();
        if (box.bottom < 0) els.forEach(reveal);
        else if (box.top < window.innerHeight) els.forEach((el) => el.getBoundingClientRect().bottom < 0 && reveal(el));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sweep);
    };

    const observeAll = () => document.querySelectorAll<HTMLElement>(PENDING).forEach((el) => io.observe(el));
    observeAll();
    sweep();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Sections rendered later (locale switch, client islands) get picked up too.
    let pendingObserve = 0;
    const mo = new MutationObserver(() => {
      if (!pendingObserve) pendingObserve = requestAnimationFrame(() => ((pendingObserve = 0), observeAll()));
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      if (pendingObserve) cancelAnimationFrame(pendingObserve);
    };
  }, []);

  return null;
}
