"use client";

import { Award } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";

type ObjectKind = "medal" | "scroll" | "pennant" | "certificate";
export type ShowcaseItem = { id: string; object: ObjectKind; title: string; detail: string };

/* ── Keepsakes, drawn in SVG (48×48) ── */
function Medal() {
  return (
    <svg viewBox="0 0 48 48" className="size-full">
      <defs>
        <radialGradient id="bronze" cx="38%" cy="32%" r="70%">
          <stop offset="0" stopColor="#f4c896" />
          <stop offset="0.5" stopColor="#c47a35" />
          <stop offset="1" stopColor="#7f461a" />
        </radialGradient>
      </defs>
      <path d="M13 2h9l5 16h-9z" fill="#000080" />
      <path d="M35 2h-9l-5 16h9z" fill="#3b3bd1" />
      <circle cx="24" cy="31" r="13" fill="url(#bronze)" />
      <circle cx="24" cy="31" r="9.5" fill="none" stroke="#f7d9b4" strokeOpacity="0.55" />
      <text x="24" y="31.5" textAnchor="middle" dominantBaseline="central" fontSize="13" fontWeight="700" fill="#5a2f10">
        3
      </text>
    </svg>
  );
}

function Scroll() {
  return (
    <svg viewBox="0 0 48 48" className="size-full">
      <g transform="rotate(-14 24 24)">
        <rect x="5" y="18" width="38" height="13" rx="6.5" fill="#f2e7cf" />
        <ellipse cx="7" cy="24.5" rx="3" ry="6.5" fill="#e3d3b0" />
        <ellipse cx="41" cy="24.5" rx="3" ry="6.5" fill="#d8c59c" />
        <rect x="21" y="17" width="5" height="15" fill="#c8102e" />
      </g>
      <circle cx="26" cy="33" r="5" fill="#c8102e" />
      <path d="m23 37-2 8 3-1.6 1 3 1.4-8M29 37l2 8-3-1.6-1 3-1.4-8" fill="#a30d25" />
    </svg>
  );
}

function Pennant() {
  return (
    <svg viewBox="0 0 48 48" className="size-full">
      <rect x="9" y="4" width="2.4" height="40" rx="1.2" fill="#c9c9cf" />
      <ellipse cx="10.2" cy="44.5" rx="7" ry="2" fill="#8d8d95" />
      <path d="M11.4 7 44 16 11.4 25Z" fill="#ba0c2f" />
      <text x="15" y="17.6" fontSize="7" fontWeight="800" fill="#fff" letterSpacing="0.4">
        UNM
      </text>
    </svg>
  );
}

function Certificate() {
  return (
    <svg viewBox="0 0 48 48" className="size-full">
      <path d="m14 40-4 7M34 40l4 7" stroke="#6b4a2b" strokeWidth="2" strokeLinecap="round" />
      <rect x="4" y="6" width="40" height="34" rx="2" fill="#5b3b20" />
      <rect x="7.5" y="9.5" width="33" height="27" fill="#fdfbf6" />
      <rect x="11" y="13" width="5" height="2" fill="#4285f4" />
      <rect x="17" y="13" width="5" height="2" fill="#ea4335" />
      <rect x="23" y="13" width="5" height="2" fill="#fbbc05" />
      <rect x="29" y="13" width="5" height="2" fill="#34a853" />
      <path d="M11 20h20M11 24h16M11 28h18" stroke="#c9c6bf" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="34" cy="30" r="3.4" fill="#000080" />
    </svg>
  );
}

const OBJECTS: Record<ObjectKind, () => React.ReactElement> = {
  medal: Medal,
  scroll: Scroll,
  pennant: Pennant,
  certificate: Certificate,
};

/** A small glass case with four keepsakes; the caption follows whatever is hovered, focused or tapped. */
export function Showcase({ label, count, hint, items }: { label: string; count: string; hint: string; items: ShowcaseItem[] }) {
  const [active, setActive] = useState<string | null>(null);
  const current = items.find((i) => i.id === active);
  const shelves = [items.slice(0, 2), items.slice(2, 4)];

  return (
    <div className="flex h-full flex-col p-4 pr-7">
      <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
        <Award size={13} strokeWidth={2.2} aria-hidden className="text-accent-ink" />
        {label}
      </p>

      {/* Glass case */}
      <div className="relative mt-3 flex-1 overflow-hidden rounded-2xl bg-surface/70 ring-1 ring-line/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 -top-6 h-20 rounded-full opacity-70 blur-xl"
          style={{ background: "radial-gradient(ellipse at center, rgb(255 244 214 / 0.22), transparent 70%)" }}
        />
        <div className="relative flex h-full flex-col">
          {shelves.map((row, r) => (
            <div key={r} className="relative flex flex-1 items-end justify-around px-2 pb-[5px]">
              {row.map((item) => {
                const Obj = OBJECTS[item.object];
                const on = active === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-label={`${item.title}. ${item.detail}`}
                    aria-pressed={on}
                    onPointerEnter={(e) => e.pointerType === "mouse" && setActive(item.id)}
                    onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                    onFocus={(e) => e.currentTarget.matches(":focus-visible") && setActive(item.id)}
                    onBlur={() => setActive(null)}
                    onClick={(e) => {
                      // Mouse already activates on hover; clicks toggle only for touch and keyboard.
                      if ((e.nativeEvent as PointerEvent).pointerType === "mouse") return;
                      setActive(on ? null : item.id);
                    }}
                    className={clsx(
                      "relative z-10 size-11 rounded-lg transition-transform duration-300 ease-out-expo outline-offset-2",
                      on ? "-translate-y-1.5 scale-110" : "hover:-translate-y-1",
                      active && !on && "opacity-50",
                    )}
                    style={{ filter: "drop-shadow(0 6px 6px rgb(0 0 0 / 0.35))" }}
                  >
                    <Obj />
                  </button>
                );
              })}
              {/* Shelf */}
              <span aria-hidden className="absolute inset-x-2 bottom-0 h-[5px] rounded-sm bg-gradient-to-b from-chip-strong to-line shadow-[0_3px_6px_rgb(0_0_0/0.3)]" />
            </div>
          ))}
        </div>
        {/* Glass glare */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(115deg, transparent 30%, rgb(255 255 255 / 0.06) 38%, transparent 46%)" }}
        />
      </div>

      <div aria-hidden className="mt-2.5 h-[74px]">
        {current ? (
          <>
            <p className="line-clamp-2 text-[12.5px] leading-[1.2] font-semibold text-fg">{current.title}</p>
            <p className="mt-0.5 line-clamp-3 text-[11px] leading-[1.3] text-muted">{current.detail}</p>
          </>
        ) : (
          <>
            <p className="text-[13px] leading-tight font-semibold text-fg">{count}</p>
            <p className="mt-0.5 text-[11px] leading-[1.3] text-muted">{hint}</p>
          </>
        )}
      </div>
    </div>
  );
}
