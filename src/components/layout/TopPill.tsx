"use client";

import { useSafeReducedMotion } from "@/lib/motion";
import Image from "next/image";
import { m } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { profile } from "@/content/content";
import { StatusDot } from "@/components/ui/StatusDot";

/** Concave fillet that joins the notch to the top edge of the viewport. */
function Fillet({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className="absolute top-0 size-5"
      style={{
        [side]: -20,
        background: `radial-gradient(circle at ${side === "left" ? "0 100%" : "100% 100%"}, transparent 19.5px, var(--surface) 20px)`,
      }}
    />
  );
}

export function TopPill() {
  const t = useTranslations("pill");
  const tc = useTranslations("common");
  const reduce = useSafeReducedMotion();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState({ closed: 230, open: 300 });

  // The hidden detail row must not widen the collapsed notch, so both widths are measured.
  useLayoutEffect(() => {
    // Intrinsic width = children + flex gaps; reading the rows themselves would echo the current width back.
    const intrinsic = (row: HTMLElement | null) => {
      if (!row) return 0;
      const kids = Array.from(row.children) as HTMLElement[];
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      return kids.reduce((sum, k) => sum + k.getBoundingClientRect().width, 0) + gap * Math.max(0, kids.length - 1);
    };
    const pad = 16;
    const closed = Math.max(230, Math.ceil(intrinsic(topRef.current)) + pad);
    const open = Math.max(closed, Math.ceil(intrinsic(rowRef.current)) + pad);
    setWidths({ closed, open });
  }, []);

  useEffect(() => {
    const hero = document.getElementById("top");
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 120 : 520;
      setVisible(window.scrollY > limit);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <m.div
      className="fixed top-[-1px] left-1/2 z-[60]"
      initial={false}
      animate={{ y: visible ? 0 : -150, opacity: visible ? 1 : 0, x: "-50%" }}
      transition={reduce ? { duration: 0 } : { duration: 0.3, ease: [0.25, 1, 0.5, 1] }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      aria-hidden={!visible}
    >
      <div
        className="relative"
        style={{ filter: "drop-shadow(0 1px 1px rgb(0 0 0 / 0.14)) drop-shadow(0 6px 10px rgb(0 0 0 / 0.08))" }}
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
      >
        <Fillet side="left" />
        <Fillet side="right" />
        <a
          href="#top"
          tabIndex={visible ? 0 : -1}
          className="block overflow-hidden rounded-b-[20px] bg-surface px-2 pt-2 pb-2 transition-[width] duration-300 ease-out-expo focus-visible:outline-offset-0"
          style={{ width: open ? widths.open : widths.closed }}
        >
          <div ref={topRef} className="flex h-[39px] w-max min-w-full items-center gap-2">
            <Image
              src={profile.images.avatar}
              alt=""
              width={39}
              height={39}
              className="size-[39px] rounded-full object-cover"
            />
            <div className="min-w-0 leading-tight">
              <p className="text-[14px] font-medium text-fg">{t("name")}</p>
              <p className="text-[12px] text-muted">{t("role")}</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 pr-1 pl-2 text-[12px] text-green">
              <StatusDot size={6} />
              {t("status")}
            </span>
          </div>

          <div
            className="grid transition-[grid-template-rows,opacity] duration-300 ease-out-expo"
            style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
          >
            <div className="overflow-hidden">
              <div
                ref={rowRef}
                className="mt-2 flex w-max min-w-full items-center justify-between gap-3 border-t border-line pt-2 pb-0.5 text-[12px] text-muted"
              >
                <span className="flex flex-col gap-0.5 whitespace-nowrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} aria-hidden />
                    {tc("location")}
                  </span>
                  <span className="pl-4">{tc("available")}</span>
                </span>
              </div>
            </div>
          </div>
        </a>
      </div>
    </m.div>
  );
}
