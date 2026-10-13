"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { AnimatePresence, m, useMotionValue, useSpring } from "motion/react";
import { useId, useRef, useState } from "react";
import clsx from "clsx";

export type ServiceItem = {
  id: string;
  title: string;
  category: string;
  tags: string[];
  description: string;
  preview: React.ReactNode;
};

function PlusIcon({ open }: { open: boolean }) {
  return (
    <span aria-hidden className="relative grid size-6 shrink-0 place-items-center rounded-full bg-surface shadow-[0_0_0_1px_var(--line)]">
      <span className="absolute h-px w-3 bg-accent-ink" />
      <span
        className="absolute h-px w-3 bg-accent-ink transition-transform duration-300 ease-out"
        style={{ transform: open ? "rotate(0deg) scaleX(0)" : "rotate(90deg)" }}
      />
    </span>
  );
}

/**
 * One-open-at-a-time accordion. On fine pointers a tilted preview card
 * trails the cursor over the list (native cursor stays visible).
 */
export function ServicesAccordion({ items }: { items: ServiceItem[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const reduce = useSafeReducedMotion();
  const baseId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !listRef.current) return;
    const r = listRef.current.getBoundingClientRect();
    x.set(e.clientX - r.left);
    y.set(e.clientY - r.top);
  };

  const preview = items.find((i) => i.id === hovered)?.preview;

  return (
    <div className="relative">
      <ul ref={listRef} onPointerMove={onMove} onPointerLeave={() => setHovered(null)}>
        {items.map((item, i) => {
          const isOpen = open === item.id;
          const btnId = `${baseId}-btn-${item.id}`;
          const panelId = `${baseId}-panel-${item.id}`;
          return (
            <li key={item.id} className="border-b border-line" onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(item.id)}>
              <h3>
                <button
                  id={btnId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : item.id)}
                  className="flex w-full items-center justify-between gap-6 py-[18px] text-left outline-offset-4"
                >
                  <span className="text-card-title">
                    {i + 1}. {item.title}
                  </span>
                  <PlusIcon open={isOpen} />
                </button>
              </h3>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <m.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.25, 1, 0.5, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pb-6 lg:max-w-[600px]">
                      <p className="font-mono text-[12px] tracking-[0.08em] text-fg uppercase md:text-[13px]">{item.category}</p>
                      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] font-medium text-body uppercase md:text-[14px]">
                        {item.tags.map((tag, ti) => (
                          <span key={tag} className="flex items-center gap-3">
                            {ti > 0 && (
                              <span aria-hidden className="text-accent-ink">
                                ✦
                              </span>
                            )}
                            {tag}
                          </span>
                        ))}
                      </p>
                      <p className="mt-2 text-muted">{item.description}</p>
                    </div>
                  </m.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>

      {/* Floating preview: mouse only, hidden on touch and for reduced motion. */}
      {!reduce && (
        <m.div
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-20 hidden [@media(hover:hover)_and_(pointer:fine)]:block"
          style={{ x: sx, y: sy }}
        >
          <AnimatePresence>
            {preview && (
              <m.div
                key={hovered}
                initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: 4 }}
                exit={{ opacity: 0, scale: 0.85, rotate: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                className="absolute -top-[95px] -left-[120px] w-[240px] overflow-hidden rounded-[10px] bg-white p-1.5 shadow-[0_24px_50px_-12px_rgb(0_0_0/0.45)]"
              >
                <div className="relative aspect-[16/11] overflow-hidden rounded-[6px]">{preview}</div>
              </m.div>
            )}
          </AnimatePresence>
        </m.div>
      )}
    </div>
  );
}
