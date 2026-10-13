"use client";

import { useEffect, useRef, useState } from "react";
import { useSafeReducedMotion } from "@/lib/motion";

/**
 * Calls `advance` every `delay` ms while the element is on screen and the tab is visible.
 * Pauses on hover/focus and for reduced motion. Changing `resetKey` (e.g. the current
 * index after a manual pick) restarts the countdown, so the rotation never stops for good.
 */
export function useAutoAdvance<T extends HTMLElement>(delay: number, advance: () => void, resetKey: unknown) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<T>(null);
  const advanceRef = useRef(advance);
  advanceRef.current = advance;
  const [inView, setInView] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    const onVis = () => setHidden(document.hidden);
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (reduce || hover || focus || hidden || !inView) return;
    const id = window.setTimeout(() => advanceRef.current(), delay);
    return () => window.clearTimeout(id);
  }, [reduce, hover, focus, hidden, inView, delay, resetKey]);

  return {
    ref,
    pauseProps: {
      onPointerEnter: (e: React.PointerEvent) => e.pointerType === "mouse" && setHover(true),
      onPointerLeave: () => setHover(false),
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
    },
  };
}
