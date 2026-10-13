"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { m, useScroll, useTransform } from "motion/react";
import { CalendarDays, CodeXml, Layers, Sparkles } from "lucide-react";
import clsx from "clsx";
import { useRef } from "react";

export type TimelineEntry = {
  id: string;
  index: string;
  logo: { src: string; w: number; h: number; wide?: boolean } | null;
  org: string;
  role: string;
  roleNote?: string;
  start: string;
  current: boolean;
  tags: string[];
  highlight: string;
  description: string;
};

function Row({ entry, presentLabel, last }: { entry: TimelineEntry; presentLabel: string; last: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const reduce = useSafeReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 72%", "end 60%"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const indexOpacity = useTransform(scrollYProgress, [0, 0.04], [0.3, 1]);

  return (
    <li ref={ref} className="relative grid grid-cols-[40px_1fr] gap-x-4 md:grid-cols-[100px_1fr] md:gap-x-8">
      <div className="flex flex-col items-center">
        {/* Decorative index drawn as generated content so its faint "not reached yet" state isn't read as text. */}
        <m.span
          className="text-eyebrow !text-muted leading-none before:content-[attr(data-index)]"
          data-index={entry.index}
          style={{ opacity: reduce ? 1 : indexOpacity }}
          aria-hidden
        />
        <span className="relative mt-4 mb-4 w-0.5 flex-1 overflow-hidden rounded-full bg-line">
          <m.span
            className="absolute inset-0 origin-top rounded-full"
            style={{
              scaleY: reduce ? 1 : fill,
              background: "linear-gradient(to bottom, var(--accent-line), var(--accent-line) 85%, color-mix(in oklab, var(--accent-line) 30%, transparent))",
            }}
          />
        </span>
      </div>

      <article className={last ? "pb-2" : "pb-14 md:pb-20"}>
        <header className="flex items-center gap-3 md:gap-4">
          {/* Organisation mark on a white tile (the logos are drawn for white); freelance gets a generic code icon. */}
          <span
            aria-hidden
            className={clsx(
              "grid h-10 shrink-0 place-items-center overflow-hidden rounded-xl ring-1 ring-line md:h-[54px]",
              entry.logo ? "bg-white p-1.5" : "bg-accent text-white dark:ring-accent-line",
              entry.logo?.wide ? "w-[76px] md:w-[108px]" : "min-w-10 md:min-w-[54px]",
            )}
          >
            {entry.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={entry.logo.src} alt="" width={entry.logo.w} height={entry.logo.h} className={entry.logo.wide ? "max-h-full max-w-full object-contain" : "h-7 w-auto max-w-none object-contain md:h-[42px]"} />
            ) : (
              <CodeXml className="size-5 md:size-6" strokeWidth={1.9} />
            )}
          </span>
          <div className="min-w-0">
            <p className="text-[14px] text-muted md:text-[16px]">
              {entry.org}
              {entry.roleNote && <span className="text-muted/80"> · {entry.roleNote}</span>}
            </p>
            <h3 className="text-[20px] leading-tight font-medium text-fg md:text-[26px]">{entry.role}</h3>
          </div>
        </header>

        <div className="mt-5 space-y-3 md:mt-6">
          <p className="flex items-center gap-2.5 text-[15px] text-body md:text-[16px]">
            <CalendarDays size={18} strokeWidth={1.8} aria-hidden className="shrink-0 text-accent-ink" />
            <span>
              {entry.start}
              {entry.current && (
                <>
                  {" – "}
                  <span className="font-medium text-green">{presentLabel}</span>
                </>
              )}
            </span>
          </p>
          {entry.tags.length > 0 && (
            <div className="flex gap-2.5">
              <Layers size={18} strokeWidth={1.8} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
              <ul className="flex flex-wrap gap-1.5">
                {entry.tags.map((tag) => (
                  <li key={tag} className="text-micro rounded-full bg-chip px-2 py-1 text-body">
                    {tag}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <p className="flex gap-2.5 font-medium text-fg">
            <Sparkles size={18} strokeWidth={1.8} aria-hidden className="mt-0.5 shrink-0 text-accent-ink" />
            <span>{entry.highlight}</span>
          </p>
          <p className="max-w-[580px] pl-[28px] text-muted">{entry.description}</p>
        </div>
      </article>
    </li>
  );
}

export function Timeline({ entries, presentLabel, label }: { entries: TimelineEntry[]; presentLabel: string; label: string }) {
  return (
    <ol aria-label={label} className="mt-16 md:mt-24 md:px-5">
      {entries.map((entry, i) => (
        <Row key={entry.id} entry={entry} presentLabel={presentLabel} last={i === entries.length - 1} />
      ))}
    </ol>
  );
}
