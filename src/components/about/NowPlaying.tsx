"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { nowPlaying } from "@/content/content";

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * "Now playing" widget. The disc peeks in from above and spins; the cover
 * is drawn procedurally so no album art is needed.
 */
export function NowPlaying({ className }: { className?: string }) {
  const t = useTranslations("about.playing");
  const reduce = useSafeReducedMotion();
  const { title, artist, durationSec, startAtSec, cover } = nowPlaying;
  const [elapsed, setElapsed] = useState(startAtSec);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setElapsed((e) => (e + 1) % durationSec), 1000);
    return () => window.clearInterval(id);
  }, [reduce, durationSec]);

  const pct = (elapsed / durationSec) * 100;

  return (
    <figure className={clsx("relative flex flex-col items-center overflow-hidden rounded-3xl bg-widget px-6 pb-6", className)}>
      {/* Disc: 251px circle peeking in from the top edge, the album cover printed on it. */}
      <div aria-hidden className="absolute top-0 left-1/2 aspect-square w-[min(251px,100%)] -translate-x-1/2 -translate-y-[45%]">
        <div
          className="absolute inset-0 overflow-hidden rounded-full shadow-[0_10px_30px_rgb(0_0_0/0.4)]"
          style={{ animation: reduce ? undefined : "spin 14s linear infinite" }}
        >
          <Image src={cover} alt="" fill sizes="251px" className="object-cover" />
          {/* Grooves + light sweep so it still reads as a disc */}
          <div
            className="absolute inset-0 rounded-full mix-blend-overlay"
            style={{ background: "repeating-radial-gradient(circle at 50% 50%, rgb(255 255 255 / 0.07) 0 1px, transparent 1px 4px)" }}
          />
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 300deg, transparent 0 8%, rgb(255 255 255 / 0.22) 12%, transparent 18% 58%, rgb(255 255 255 / 0.14) 62%, transparent 68%)",
            }}
          />
          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgb(255_255_255/0.12),inset_0_0_24px_rgb(0_0_0/0.35)]" />
        </div>
        {/* Clear hub + spindle hole (doesn't spin) */}
        <div className="absolute top-1/2 left-1/2 grid size-[52px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white/25 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.45)] backdrop-blur-[2px]">
          <span className="size-3.5 rounded-full bg-widget shadow-[inset_0_1px_3px_rgb(0_0_0/0.5)]" />
        </div>
      </div>

      <div className="mt-auto flex w-full flex-col items-center pt-[140px] text-center">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
          <span aria-hidden className="flex h-3 items-end gap-[2px]">
            {[0.9, 0.5, 1, 0.7].map((d, i) => (
              <span
                key={i}
                className="w-[2.5px] origin-bottom rounded-full bg-accent-ink"
                style={{
                  height: 12,
                  transform: reduce ? `scaleY(${d * 0.7})` : undefined,
                  animation: reduce ? undefined : `eq ${0.7 + i * 0.13}s ease-in-out ${i * 0.11}s infinite`,
                }}
              />
            ))}
          </span>
          {t("label")}
        </span>
        <figcaption className="mt-1.5 min-w-0">
          <span className="text-micro block truncate text-body">{artist}</span>
          <span className="block truncate text-[14px] leading-[21px] font-medium text-body md:text-[16px] md:leading-6">{title}</span>
        </figcaption>
        <div className="mt-2.5 w-full max-w-[150px]">
          <div
            role="progressbar"
            aria-label={t("label")}
            aria-valuemin={0}
            aria-valuemax={durationSec}
            aria-valuenow={elapsed}
            aria-valuetext={t("progress", { elapsed: fmt(elapsed), total: fmt(durationSec) })}
            className="h-[3px] overflow-hidden rounded-full bg-chip-strong"
          >
            <div className="h-full rounded-full bg-fg transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
          </div>
          <div aria-hidden className="text-micro mt-1.5 flex justify-between text-muted tabular-nums">
            <span>{fmt(elapsed)}</span>
            <span>{fmt(durationSec)}</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
