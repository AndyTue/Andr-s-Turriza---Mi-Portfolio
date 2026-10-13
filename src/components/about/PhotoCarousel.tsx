"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import Image from "next/image";
import { AnimatePresence, m } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import clsx from "clsx";
import { aboutPhotos } from "@/content/content";
import { Placeholder } from "@/components/ui/Placeholder";
import { useAutoAdvance } from "@/lib/useAutoAdvance";

/** Time each photo stays up before the gallery advances on its own. */
const PHOTO_MS = 4500;

/** Layered backdrop blur that intensifies toward one edge. */
const SIZES = "(min-width: 1200px) 362px, (min-width: 810px) 40vw, 100vw";

function EdgeBlur({ side, active }: { side: "left" | "right"; active: boolean }) {
  const layers = [
    { blur: 1, from: 0, to: 60 },
    { blur: 3, from: 30, to: 80 },
    { blur: 6, from: 55, to: 100 },
  ];
  const dir = side === "left" ? "to left" : "to right";
  return (
    <div
      aria-hidden
      className={clsx(
        "pointer-events-none absolute inset-y-0 w-[58%] transition-opacity duration-300 ease-out",
        side === "left" ? "left-0" : "right-0",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      {layers.map((l) => (
        <div
          key={l.blur}
          className="absolute inset-0"
          style={{
            backdropFilter: `blur(${l.blur}px)`,
            WebkitBackdropFilter: `blur(${l.blur}px)`,
            maskImage: `linear-gradient(${dir}, transparent ${l.from}%, black ${l.to}%)`,
            WebkitMaskImage: `linear-gradient(${dir}, transparent ${l.from}%, black ${l.to}%)`,
          }}
        />
      ))}
    </div>
  );
}

export function PhotoCarousel({ className }: { className?: string }) {
  const t = useTranslations("about.carousel");
  const alts = t.raw("alts") as string[];
  const reduce = useSafeReducedMotion();
  const [[index, dir], setState] = useState<[number, 1 | -1]>([0, 1]);
  const [hover, setHover] = useState<"left" | "right" | null>(null);
  const touch = useRef<number | null>(null);
  const total = aboutPhotos.length;

  const go = (step: 1 | -1) => setState(([i]) => [(i + step + total) % total, step]);
  const { ref, pauseProps } = useAutoAdvance<HTMLDivElement>(PHOTO_MS, () => go(1), index);

  const photo = aboutPhotos[index];

  return (
    <div
      ref={ref}
      {...pauseProps}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("label")}
      className={clsx("group/car relative overflow-hidden rounded-3xl bg-widget", className)}
      style={{ perspective: 2000 }}
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touch.current = null;
      }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <m.div
          key={index}
          custom={dir}
          role="group"
          aria-roledescription="slide"
          aria-label={t("slide", { current: index + 1, total })}
          className="absolute inset-0"
          variants={{
            enter: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, rotateY: d * 14, scale: 0.94, x: `${d * 6}%` }),
            center: { opacity: 1, rotateY: 0, scale: 1, x: "0%" },
            exit: (d: number) => (reduce ? { opacity: 0 } : { opacity: 0, rotateY: d * -14, scale: 0.94, x: `${d * -6}%` }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: reduce ? 0.2 : 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {photo.src && photo.fit === "contain" ? (
            <>
              {/* Landscape shot: shown whole over a blurred copy of itself. */}
              <Image src={photo.src} alt="" fill sizes={SIZES} className="scale-110 object-cover opacity-70 blur-2xl" aria-hidden />
              <Image src={photo.src} alt={alts[index]} fill sizes={SIZES} className="object-contain" draggable={false} />
            </>
          ) : photo.src ? (
            <Image
              src={photo.src}
              alt={alts[index]}
              fill
              sizes={SIZES}
              className="object-cover"
              style={{ objectPosition: photo.position }}
              priority={index === 0}
              draggable={false}
            />
          ) : (
            <Placeholder label={alts[index]} className="h-full w-full" tint={index % 2 ? "#3b3bd1" : "#000080"} />
          )}
        </m.div>
      </AnimatePresence>

      <EdgeBlur side="left" active={hover === "left"} />
      <EdgeBlur side="right" active={hover === "right"} />

      {/* Neighbours load ahead of time so stepping through feels instant. */}
      <div aria-hidden className="pointer-events-none invisible absolute size-px overflow-hidden">
        {[aboutPhotos[(index + 1) % total], aboutPhotos[(index - 1 + total) % total]].map((p, i) =>
          p.src ? <Image key={`${p.src}-${i}`} src={p.src} alt="" fill sizes={SIZES} loading="eager" /> : null,
        )}
      </div>

      {/* Progress: the reference's thin white line, now a fill over a 48×2 track, plus a counter. */}
      <div aria-hidden className="absolute top-[50px] right-[39px] flex items-center gap-2 drop-shadow-[0_1px_2px_rgb(0_0_0/0.5)]">
        <span className="text-[10px] font-medium text-white/85 tabular-nums">
          {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
        </span>
        <span className="relative h-0.5 w-12 overflow-hidden rounded-full bg-white/25">
          <span
            className="absolute inset-y-0 left-0 rounded-full bg-white transition-[width] duration-500 ease-out-expo"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </span>
      </div>

      {(["left", "right"] as const).map((side) => (
        <button
          key={side}
          type="button"
          aria-label={side === "left" ? t("prev") : t("next")}
          onClick={() => go(side === "left" ? -1 : 1)}
          onPointerEnter={() => setHover(side)}
          onPointerLeave={() => setHover(null)}
          onFocus={() => setHover(side)}
          onBlur={() => setHover(null)}
          className={clsx(
            "absolute inset-y-0 grid w-[67px] place-items-center text-white focus-visible:outline-offset-[-6px]",
            side === "left" ? "left-0 rounded-l-3xl" : "right-0 rounded-r-3xl",
          )}
        >
          {side === "left" ? (
            <ChevronLeft
              size={24}
              aria-hidden
              className={clsx("drop-shadow transition-opacity duration-200", hover === side ? "opacity-100" : "opacity-25")}
            />
          ) : (
            <ChevronRight
              size={24}
              aria-hidden
              className={clsx("drop-shadow transition-opacity duration-200", hover === side ? "opacity-100" : "opacity-25")}
            />
          )}
        </button>
      ))}

      <p aria-live="polite" className="sr-only">
        {t("slide", { current: index + 1, total })}
      </p>
    </div>
  );
}
