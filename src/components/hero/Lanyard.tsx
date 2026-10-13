"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { profile } from "@/content/content";

/* Rope geometry, in px relative to the card slot's top-left corner. */
const CARD_W = 220;
const CARD_H = 290;
const CLIP = 30; // carabiner height above the card
const ANCHOR_ABOVE = 60; // anchor sits this far above the hero's top edge
const SEGMENTS = 12;
const GRAVITY = 1500; // px/s²
const STEP = 1 / 60;
const DAMPING = 0.988;
const ITERATIONS = 24;
const CANVAS_MARGIN = 24;

type P = { x: number; y: number; px: number; py: number };

export function Lanyard() {
  const t = useTranslations("hero.lanyard");
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  // Below 810px the badge hangs at half size; re-run the setup when the breakpoint flips.
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 810px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const slot = slotRef.current;
    const canvas = canvasRef.current;
    const card = cardRef.current;
    const tilt = tiltRef.current;
    if (!slot || !canvas || !card || !tilt) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    slot.dataset.live = "";

    // The slot may be CSS-scaled (phones); physics runs in unscaled card coordinates.
    const scale = slot.getBoundingClientRect().width / CARD_W || 1;

    // Anchor directly above the card, ANCHOR_ABOVE px over the hero's top edge.
    const anchorY = -(slot.offsetTop + ANCHOR_ABOVE) / scale;
    const anchor = { x: CARD_W / 2, y: anchorY };
    const restEnd = { x: CARD_W / 2, y: -CLIP };
    const length = restEnd.y - anchor.y;
    const seg = length / SEGMENTS;

    const pts: P[] = Array.from({ length: SEGMENTS + 1 }, (_, i) => {
      const y = anchor.y + seg * i;
      return { x: anchor.x, y, px: anchor.x, py: y };
    });
    // A gentle swing on arrival.
    if (!reduce) pts[SEGMENTS].px -= 7;

    let strap = "#2c2c30";
    let strapHi = "rgba(255,255,255,0.10)";
    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      strap = cs.getPropertyValue("--strap").trim() || strap;
      strapHi = cs.getPropertyValue("--strap-hi").trim() || strapHi;
    };
    readColors();

    // The rope can only sweep a half-disc of radius `length` under the anchor,
    // so the canvas covers exactly that (plus the strap width). No pointer events.
    const dpr = Math.min((window.devicePixelRatio || 1) / scale, 3);
    const reach = Math.ceil(length) + CANVAS_MARGIN;
    const cw = reach * 2;
    const ch = reach + CANVAS_MARGIN;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;
    canvas.style.left = `${anchor.x - reach}px`;
    canvas.style.top = `${anchor.y - CANVAS_MARGIN}px`;
    const ox = reach - anchor.x;
    const oy = CANVAS_MARGIN - anchor.y;

    let dragging = false;
    let target = { x: 0, y: 0 };
    let grab = { x: 0, y: 0 };
    let raf = 0;
    let still = 0;
    let visible = true;
    let last = 0;
    let acc = 0;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.translate(ox, oy);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      const path = () => {
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length - 1; i++) {
          const mx = (pts[i].x + pts[i + 1].x) / 2;
          const my = (pts[i].y + pts[i + 1].y) / 2;
          ctx.quadraticCurveTo(pts[i].x, pts[i].y, mx, my);
        }
        const end = pts[pts.length - 1];
        ctx.lineTo(end.x, end.y);
      };
      path();
      ctx.strokeStyle = strap;
      ctx.lineWidth = 14;
      ctx.stroke();
      path();
      ctx.strokeStyle = strapHi;
      ctx.lineWidth = 4;
      ctx.stroke();

      // Card follows the rope end; rotation follows the last segment, tilt follows velocity.
      const end = pts[SEGMENTS];
      const prev = pts[SEGMENTS - 2];
      const angle = Math.atan2(end.x - prev.x, end.y - prev.y);
      const vx = end.x - end.px;
      const vy = end.y - end.py;
      const dx = end.x - restEnd.x;
      const dy = end.y - restEnd.y;
      card.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${-angle}rad)`;
      const ry = Math.max(-28, Math.min(28, vx * 2.4));
      const rx = Math.max(-22, Math.min(22, -vy * 1.8));
      tilt.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };

    const simulate = () => {
      const g = GRAVITY * STEP * STEP;
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i];
        const vx = (p.x - p.px) * DAMPING;
        const vy = (p.y - p.py) * DAMPING;
        p.px = p.x;
        p.py = p.y;
        p.x += vx;
        p.y += vy + g;
      }
      const end = pts[SEGMENTS];
      if (dragging) {
        end.x = target.x;
        end.y = target.y;
      }
      for (let k = 0; k < ITERATIONS; k++) {
        for (let i = 0; i < SEGMENTS; i++) {
          const a = pts[i];
          const b = pts[i + 1];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.0001;
          const diff = (d - seg) / d;
          // Anchor is pinned; the card end is heavy (or pinned while dragged).
          let wa = i === 0 ? 0 : 0.5;
          let wb = i === 0 ? 1 : 0.5;
          if (i + 1 === SEGMENTS) {
            wb = dragging ? 0 : 0.18;
            wa = i === 0 ? 0 : 1 - wb;
          }
          if (wa + wb === 0) continue;
          const norm = 1 / (wa + wb);
          a.x += dx * diff * wa * norm;
          a.y += dy * diff * wa * norm;
          b.x -= dx * diff * wb * norm;
          b.y -= dy * diff * wb * norm;
        }
      }
    };

    const energy = () => pts.reduce((m, p) => Math.max(m, Math.abs(p.x - p.px) + Math.abs(p.y - p.py)), 0);

    const frame = (now: number) => {
      raf = 0;
      if (!last) last = now;
      acc += Math.min(0.05, (now - last) / 1000);
      last = now;
      while (acc >= STEP) {
        simulate();
        acc -= STEP;
      }
      draw();
      still = !dragging && energy() < 0.02 ? still + 1 : 0;
      if (visible && still < 90) raf = requestAnimationFrame(frame);
      else last = 0;
    };

    const wake = () => {
      still = 0;
      if (!raf && visible && !reduce) raf = requestAnimationFrame(frame);
    };

    const local = (e: PointerEvent) => {
      const r = slot.getBoundingClientRect();
      return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
    };

    const clampToRope = (p: { x: number; y: number }) => {
      const dx = p.x - anchor.x;
      const dy = p.y - anchor.y;
      const d = Math.hypot(dx, dy);
      const max = length * 0.995;
      return d > max ? { x: anchor.x + (dx / d) * max, y: anchor.y + (dy / d) * max } : p;
    };

    const onDown = (e: PointerEvent) => {
      if (reduce || e.button !== 0) return;
      card.setPointerCapture(e.pointerId);
      dragging = true;
      const p = local(e);
      const end = pts[SEGMENTS];
      grab = { x: p.x - end.x, y: p.y - end.y };
      target = { x: end.x, y: end.y };
      card.style.cursor = "grabbing";
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const p = local(e);
      target = clampToRope({ x: p.x - grab.x, y: p.y - grab.y });
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      card.style.cursor = "";
      if (card.hasPointerCapture(e.pointerId)) card.releasePointerCapture(e.pointerId);
      wake();
    };

    card.addEventListener("pointerdown", onDown);
    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerup", onUp);
    card.addEventListener("pointercancel", onUp);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(slot);

    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    draw();
    wake();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      card.removeEventListener("pointerdown", onDown);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerup", onUp);
      card.removeEventListener("pointercancel", onUp);
      delete slot.dataset.live;
    };
  }, [wide]);

  return (
    <div
      ref={slotRef}
      className="group/lanyard absolute top-[26px] right-4 h-[290px] w-[220px] origin-top-right scale-50 md:top-[175px] md:right-[55px] md:scale-100 lg:top-[180px] lg:right-[100px]"
    >
      {/* Static strap for the no-JS render; the canvas replaces it once live. */}
      <span
        aria-hidden
        className="absolute bottom-[calc(100%+22px)] left-1/2 h-[400px] w-3.5 -translate-x-1/2 rounded-full bg-[var(--strap)] group-data-[live]/lanyard:hidden"
      />
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute" />

      <div
        ref={cardRef}
        role="img"
        aria-label={`${t("alt")}. ${t("label")}`}
        className="absolute inset-0 cursor-grab touch-none select-none will-change-transform"
        style={{ transformOrigin: `50% -${CLIP}px` }}
      >
        <div className="h-full w-full" style={{ perspective: 800 }}>
          <div ref={tiltRef} className="relative h-full w-full will-change-transform" style={{ transformStyle: "preserve-3d" }}>
            <Carabiner />
            <div
              className="relative h-full w-full overflow-hidden rounded-2xl"
              style={{
                background: "linear-gradient(145deg, var(--badge-from), var(--badge-to))",
                boxShadow: "0 20px 60px rgb(0 0 0 / 0.2), inset 0 0 0 1px rgb(255 255 255 / 0.06)",
              }}
            >
              <div className="absolute inset-x-0 top-0 z-10 h-2 bg-[linear-gradient(90deg,#000080,#0000a0,#000080)]" />
              <div className="absolute inset-x-0 top-2 bottom-0">
                <Image
                  src={profile.images.headshot}
                  alt=""
                  fill
                  sizes="220px"
                  priority
                  draggable={false}
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_18px,rgb(255_255_255/0.025)_18px,rgb(255_255_255/0.025)_19px)]" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-[linear-gradient(rgb(255_255_255/0.07),transparent)]" />
                <div className="absolute inset-x-0 bottom-0 h-[46%] bg-[linear-gradient(transparent,rgb(0_0_0/0.72))]" />
                <div aria-hidden className="absolute inset-x-0 bottom-0 px-4 pb-3.5 text-white">
                  <p className="text-[15px] leading-tight font-bold">{t("name")}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-white/80">{t("caption")}</p>
                </div>
              </div>
              {/* Eyelet punched through the stripe */}
              <span
                aria-hidden
                className="absolute top-[-5px] left-1/2 z-20 grid size-4 -translate-x-1/2 place-items-center rounded-full"
                style={{
                  background: "radial-gradient(circle at 35% 30%, #d9d9de, #9a9aa3 55%, #6b6b73)",
                  boxShadow: "inset 0 1px 2px rgb(255 255 255 / 0.45), 0 1px 2px rgb(0 0 0 / 0.4)",
                }}
              >
                <span className="size-1.5 rounded-full bg-[#4a4a52] shadow-[inset_0_1px_3px_rgb(0_0_0/0.6)]" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Small metal carabiner joining the strap to the eyelet. */
function Carabiner() {
  return (
    <svg
      aria-hidden
      width="20"
      height="42"
      viewBox="0 0 20 42"
      className="absolute top-[-34px] left-1/2 z-30 -translate-x-1/2"
      style={{ filter: "drop-shadow(0 1px 1px rgb(0 0 0 / 0.35))" }}
    >
      <defs>
        <linearGradient id="lanyard-metal" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#7d7d86" />
          <stop offset="0.45" stopColor="#e4e4ea" />
          <stop offset="0.6" stopColor="#b4b4bc" />
          <stop offset="1" stopColor="#6e6e77" />
        </linearGradient>
      </defs>
      <rect x="3" y="1.5" width="14" height="13" rx="5" fill="none" stroke="url(#lanyard-metal)" strokeWidth="3" />
      <rect x="4.5" y="13" width="11" height="22" rx="5.5" fill="none" stroke="url(#lanyard-metal)" strokeWidth="3" />
      <path d="M10 35 v6" stroke="url(#lanyard-metal)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
