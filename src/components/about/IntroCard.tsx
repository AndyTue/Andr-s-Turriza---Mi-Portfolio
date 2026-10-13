"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { Hand } from "lucide-react";
import { useRef } from "react";
import clsx from "clsx";

/** Bento card with the first-person intro and a sticky note you can drag around. */
export function IntroCard({ className }: { className?: string }) {
  const t = useTranslations("about");
  const reduce = useSafeReducedMotion();
  const bounds = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={bounds}
      className={clsx(
        "relative flex flex-col gap-6 overflow-hidden rounded-3xl bg-widget p-6 md:flex-row md:items-center md:gap-7 md:p-7",
        className,
      )}
    >
      <div className="relative shrink-0 self-start md:self-center">
        <m.div
          drag={!reduce}
          dragConstraints={bounds}
          dragElastic={0.18}
          dragTransition={{ bounceStiffness: 380, bounceDamping: 18 }}
          whileDrag={{ scale: 1.06, rotate: 0, cursor: "grabbing" }}
          initial={{ rotate: -4 }}
          className={clsx("relative z-10 touch-none", !reduce && "cursor-grab")}
        >
          {/* Paper clip */}
          <svg width="14" height="34" viewBox="0 0 14 34" className="absolute -top-3 right-5 z-10" aria-hidden>
            <path
              d="M4 28V7a3 3 0 0 1 6 0v19a5 5 0 0 1-10 0V9"
              fill="none"
              stroke="#9a9aa3"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <div
            className="relative grid size-[118px] place-items-center px-3 text-center"
            style={{
              background: "linear-gradient(170deg, #fbe98c, #f4dc6c)",
              boxShadow: "0 1px 1px rgb(0 0 0 / 0.08), 0 10px 18px -6px rgb(0 0 0 / 0.35)",
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 16% 100%, 0 84%)",
            }}
          >
            <span className="font-hand text-[19px] leading-[1.05] text-[#000080]">{t("note")}</span>
            {/* Curled corner */}
            <span
              className="absolute bottom-0 left-0 size-[19px]"
              style={{ background: "linear-gradient(45deg, transparent 50%, #e6cb52 50%)" }}
            />
          </div>
        </m.div>
        {!reduce && (
          <p className="text-micro mt-2.5 flex items-center gap-1 text-muted md:justify-center">
            <Hand size={12} aria-hidden />
            {t("noteHint")}
          </p>
        )}
      </div>

      <p className="text-[15px] leading-[1.55] text-body md:text-[16px]">{t("intro")}</p>
    </div>
  );
}
