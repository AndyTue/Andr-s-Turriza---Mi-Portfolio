"use client";

import { AnimatePresence, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useSafeReducedMotion } from "@/lib/motion";

export type StackPage = {
  id: string;
  /** Milliseconds this page stays up before the stack advances. */
  duration: number;
  /** Accessible names, prepared on the server. */
  slideLabel: string;
  showLabel: string;
  node: React.ReactNode;
};

/**
 * iOS-style Smart Stack: one widget at a time, rotating on its own.
 * Rotation pauses on hover/focus and off-screen; picking a page from the
 * side indicator just restarts the countdown, so it keeps moving.
 */
export function SmartStack({
  pages,
  label,
  startDelay = 0,
  className,
}: {
  pages: StackPage[];
  label: string;
  /** Extra wait before the first advance, so neighbouring stacks don't flip together. */
  startDelay?: number;
  className?: string;
}) {
  const reduce = useSafeReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const firstAdvance = useRef(true);
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || hover || focus || !inView) return;
    const wait = pages[index].duration + (firstAdvance.current ? startDelay : 0);
    const id = window.setTimeout(() => {
      firstAdvance.current = false;
      setState(([i]) => [(i + 1) % pages.length, 1]);
    }, wait);
    return () => window.clearTimeout(id);
  }, [index, hover, focus, inView, reduce, pages, startDelay]);

  const select = (i: number) => {
    if (i === index) return;
    setState([i, i > index ? 1 : -1]);
  };

  const page = pages[index];

  return (
    <div
      ref={ref}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={clsx("relative isolate overflow-hidden rounded-3xl bg-widget", className)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node) && setFocus(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") select((index + 1) % pages.length);
        if (e.key === "ArrowUp") select((index - 1 + pages.length) % pages.length);
      }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <m.div
          key={page.id}
          custom={dir}
          role="group"
          aria-roledescription="slide"
          aria-label={page.slideLabel}
          className="absolute inset-0"
          variants={{
            enter: (d: number) => (reduce ? { opacity: 0 } : { y: `${d * 26}%`, scale: 0.9, opacity: 0, filter: "blur(6px)" }),
            center: { y: "0%", scale: 1, opacity: 1, filter: "blur(0px)" },
            exit: (d: number) => (reduce ? { opacity: 0 } : { y: `${d * -26}%`, scale: 0.9, opacity: 0, filter: "blur(6px)" }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0.15 : 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {page.node}
        </m.div>
      </AnimatePresence>

      {/* Page indicator on the right edge, like iOS. */}
      <div className="absolute top-1/2 right-0.5 z-20 flex -translate-y-1/2 flex-col items-center">
        {pages.map((p, i) => (
          <button
            key={p.id}
            type="button"
            aria-label={p.showLabel}
            aria-current={i === index ? "true" : undefined}
            onClick={() => select(i)}
            className="group/dot grid size-6 place-items-center outline-offset-0"
          >
            <span
              className={clsx(
                "w-[5px] rounded-full bg-fg transition-[height,opacity] duration-300 ease-out",
                i === index ? "h-[13px] opacity-80" : "h-[5px] opacity-25 group-hover/dot:opacity-60",
              )}
            />
          </button>
        ))}
      </div>

      <p className="sr-only" aria-live="off">
        {page.slideLabel}
      </p>
    </div>
  );
}
