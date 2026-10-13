"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { AnimatePresence, m } from "motion/react";
import { ArrowLeft, ArrowRight, Award, BadgeCheck, Flag, Plane, Quote, ShieldCheck, Trophy, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import clsx from "clsx";

export type AwardSlide = {
  id: string;
  icon: "trophy" | "flag" | "shield" | "plane" | "certificate";
  statement: string;
  org: string;
  meta: string;
};

const ICONS: Record<AwardSlide["icon"], LucideIcon> = {
  trophy: Trophy,
  flag: Flag,
  shield: ShieldCheck,
  plane: Plane,
  certificate: BadgeCheck,
};

/** Three columns of faint tiles drifting vertically; the centre tile holds the active award. */
function TileWall({ active }: { active: AwardSlide }) {
  const reduce = useSafeReducedMotion();
  const Icon = ICONS[active.icon];
  // 12 tiles whose look repeats every 6, so translating by -50% loops seamlessly.
  const column = (delay: number, dir: "up" | "down", seconds: number) => (
    <div className="relative h-full overflow-hidden">
      <div className="flex flex-col" style={{ animation: reduce ? undefined : `tiles-${dir} ${seconds}s linear ${delay}s infinite` }}>
        {Array.from({ length: 12 }, (_, i) => (
          <span
            key={i}
            className="mb-2 aspect-square w-full shrink-0 rounded-lg bg-widget/70 ring-1 ring-line/50"
            style={{ opacity: 0.3 + ((i * 5) % 6) * 0.07 }}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div
      aria-hidden
      className="relative mx-auto grid h-[300px] w-full max-w-[300px] grid-cols-3 gap-2 md:h-[320px]"
      style={{
        maskImage: "linear-gradient(transparent, black 22%, black 78%, transparent)",
        WebkitMaskImage: "linear-gradient(transparent, black 22%, black 78%, transparent)",
      }}
    >
      {column(-4, "up", 26)}
      {column(-11, "down", 30)}
      {column(-19, "up", 34)}
      <div className="absolute top-1/2 left-1/2 grid aspect-square w-[31.5%] -translate-x-1/2 -translate-y-1/2 place-items-center">
        <span className="absolute inset-[-30%] rounded-full bg-accent-ink/25 blur-2xl" />
        <AnimatePresence mode="popLayout" initial={false}>
          <m.span
            key={active.id}
            initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotate: 8 }}
            transition={{ duration: reduce ? 0 : 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid size-full place-items-center rounded-lg bg-accent text-white shadow-[0_14px_30px_-8px_rgb(0_0_128/0.6),inset_0_1px_0_rgb(255_255_255/0.2)] dark:shadow-[0_14px_30px_-8px_rgb(0_0_0/0.8),inset_0_0_0_1px_rgb(107_107_245/0.45)]"
          >
            <Icon size={34} strokeWidth={1.6} />
          </m.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

export function RecognitionCarousel({ slides, region }: { slides: AwardSlide[]; region: string }) {
  const t = useTranslations("recognition");
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const go = (step: number) => setIndex((i) => Math.min(total - 1, Math.max(0, i + step)));

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={region}
      className="grid items-center gap-10 md:grid-cols-[300px_1fr] md:gap-10 lg:gap-12"
    >
      <TileWall active={slides[index]} />

      <div className="md:px-4">
        <Quote size={32} strokeWidth={0} fill="currentColor" aria-hidden className="rotate-180 text-accent-ink" />
        <div className="mt-5 grid">
          {slides.map((s, i) => (
            <figure
              key={s.id}
              aria-hidden={i !== index}
              className={clsx(
                "col-start-1 row-start-1 transition-opacity duration-[400ms] ease-out",
                i === index ? "opacity-100" : "pointer-events-none invisible opacity-0",
              )}
              style={{ transitionProperty: "opacity, visibility" }}
            >
              <blockquote className="text-card-title max-w-[560px] !leading-[1.25]">{s.statement}</blockquote>
              <figcaption className="mt-6">
                <p className="text-body">{s.org}</p>
                <p className="text-micro mt-1 flex items-center gap-1.5 text-muted">
                  <Award size={12} aria-hidden />
                  {s.meta}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-8 flex items-center gap-2">
          {[
            { step: -1, icon: ArrowLeft, label: t("prev"), disabled: index === 0 },
            { step: 1, icon: ArrowRight, label: t("next"), disabled: index === total - 1 },
          ].map(({ step, icon: Icon, label, disabled }) => (
            <button
              key={step}
              type="button"
              aria-label={label}
              disabled={disabled}
              onClick={() => go(step)}
              className="grid size-8 place-items-center rounded-full bg-surface text-accent-ink shadow-[0_0_0_1px_var(--line)] transition-[opacity,transform,background-color] duration-200 hover:bg-widget active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            >
              <Icon size={16} strokeWidth={2.2} aria-hidden />
            </button>
          ))}
          <span className="text-micro ml-2 text-muted tabular-nums" aria-live="polite">
            {t("slide", { current: index + 1, total })}
          </span>
        </div>
      </div>
    </div>
  );
}
