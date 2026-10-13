"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * `useReducedMotion` reads matchMedia during the first client render, which
 * differs from the server (null) and breaks hydration. This version answers
 * `false` until mounted, then the real preference.
 */
export function useSafeReducedMotion() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted ? Boolean(reduce) : false;
}
