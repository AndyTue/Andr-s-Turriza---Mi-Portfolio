"use client";

import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const DAY = 86_400_000;

/**
 * Weeks as columns (Sunday first), most recent on the right; older weeks clip
 * off on narrow screens. Props are compact (start date + counts + a string of
 * levels) and cells are bare <i> elements styled by `.cg-cell[data-l]`.
 */
export function ContributionGraph({ start, counts, levels }: { start: string; counts: number[]; levels: string }) {
  const t = useTranslations("experience.contrib");
  const locale = useLocale();
  const [tip, setTip] = useState<{ x: number; y: number; text: string } | null>(null);
  const startMs = Date.parse(`${start}T00:00:00Z`);

  const weeks = useMemo(() => {
    const lead = new Date(startMs).getUTCDay();
    const cells = [...Array.from({ length: lead }, () => -1), ...counts.map((_, i) => i)];
    const out: number[][] = [];
    for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
    return out;
  }, [startMs, counts]);

  const fmt = useMemo(
    () => new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", { month: "short", day: "numeric", timeZone: "UTC" }),
    [locale],
  );

  const onOver = (e: React.PointerEvent<HTMLDivElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-i]");
    if (!cell) return;
    const i = Number(cell.dataset.i);
    const r = cell.getBoundingClientRect();
    const box = e.currentTarget.getBoundingClientRect();
    setTip({
      x: r.left - box.left + r.width / 2,
      y: r.top - box.top,
      text: t("day", { count: counts[i], date: fmt.format(new Date(startMs + i * DAY)) }),
    });
  };

  return (
    <div className="relative" onPointerOver={onOver} onPointerLeave={() => setTip(null)} data-graph>
      <div role="img" aria-label={t("label")} className="flex justify-end overflow-hidden">
        <div className="flex gap-[3px] md:gap-[5px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px] md:gap-[5px]">
              {week.map((i, di) => (i < 0 ? <i key={`e${di}`} className="cg-cell" data-empty="" /> : <i key={i} className="cg-cell" data-i={i} data-l={levels[i]} />))}
            </div>
          ))}
        </div>
      </div>
      {tip && (
        <span
          key={tip.text + tip.x}
          role="tooltip"
          className="pointer-events-none absolute z-20 rounded-lg bg-fg px-2.5 py-1.5 text-[12px] font-medium whitespace-nowrap text-bg shadow-[0_6px_16px_rgb(0_0_0/0.3)]"
          style={{ left: tip.x, top: tip.y - 38, animation: "framerGitHubFadeIn 0.2s ease-out forwards", transform: "translate(-50%, 0)" }}
        >
          {tip.text}
        </span>
      )}
    </div>
  );
}
