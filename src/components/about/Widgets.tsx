import { getTranslations } from "next-intl/server";
import { Dumbbell, Heart, House, MapPinned, Tv, Users } from "lucide-react";
import { hobbies } from "@/content/content";
import journey from "@/content/journey-map.json";
import hometown from "@/content/hometown-map.json";
import { HometownNow } from "./HometownNow";

/** App-style caption at the top of an iOS widget. */
export function WidgetLabel({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.06em] text-muted uppercase">
      <span aria-hidden className="text-accent-ink">
        {icon}
      </span>
      {children}
    </p>
  );
}

/* ── Sport glyphs (lucide has a dumbbell but no balls) ── */
const glyph = { width: 26, height: 26, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };

function Basketball() {
  return (
    <svg {...glyph}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2v20M2 12h20M4.9 4.9c2.9 2.9 2.9 11.3 0 14.2M19.1 4.9c-2.9 2.9-2.9 11.3 0 14.2" />
    </svg>
  );
}

function SoccerBall() {
  return (
    <svg {...glyph}>
      <circle cx="12" cy="12" r="10" />
      <path d="m12 8 3.8 2.8-1.5 4.4H9.7l-1.5-4.4zM12 8V3.5M15.8 10.8l4-1.3M14.3 15.2l2.5 3.6M9.7 15.2l-2.5 3.6M8.2 10.8l-4-1.3" />
    </svg>
  );
}

function Baseball() {
  return (
    <svg {...glyph}>
      <circle cx="12" cy="12" r="10" stroke="var(--fg)" />
      <path d="M6.3 4.3c2.3 4.2 2.3 11.2 0 15.4M17.7 4.3c-2.3 4.2-2.3 11.2 0 15.4" />
      <path d="M7.6 7.5l1.4-.5M8 11l1.5-.1M8 13l1.5.1M7.6 16.5l1.4.5M16.4 7.5 15 7M16 11l-1.5-.1M16 13l-1.5.1M16.4 16.5 15 17" strokeWidth="1.2" />
    </svg>
  );
}

const GLYPHS = {
  basketball: <Basketball />,
  gym: <Dumbbell size={26} strokeWidth={1.7} aria-hidden />,
  soccer: <SoccerBall />,
  baseball: <Baseball />,
} as const;

export async function HobbiesWidget() {
  const t = await getTranslations("about.widgets.hobbies");
  return (
    <div className="flex h-full flex-col p-4 pr-7">
      <WidgetLabel icon={<Heart size={13} strokeWidth={2.2} />}>{t("label")}</WidgetLabel>
      <ul className="mt-3 grid flex-1 grid-cols-2 gap-2">
        {hobbies.map((h) => (
          <li key={h.id} className="flex flex-col justify-between rounded-2xl bg-surface/70 p-3 ring-1 ring-line/70">
            <span style={{ color: h.color }}>{GLYPHS[h.id]}</span>
            <span>
              <span className="block text-[13px] leading-tight font-semibold text-fg">{t(`items.${h.id}.name`)}</span>
              <span className="block text-[11px] leading-tight text-muted">{t(`items.${h.id}.verb`)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function TeamWidget() {
  const t = await getTranslations("about.widgets.team");
  return (
    <div className="relative flex h-full flex-col p-4 pr-7">
      <WidgetLabel icon={<Users size={13} strokeWidth={2.2} />}>{t("label")}</WidgetLabel>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-10 mx-auto size-40 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, #a50044 0%, #004d98 55%, transparent 70%)" }}
      />
      <div className="relative flex flex-1 items-center justify-center">
        {/* Club crest, a trademark of FC Barcelona, shown to identify the team. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/fc-barcelona.svg"
          alt={t("crestAlt")}
          width={96}
          height={96}
          className="size-24 object-contain drop-shadow-[0_10px_16px_rgb(0_0_0/0.4)]"
        />
      </div>
      <div className="relative">
        <p className="text-[20px] leading-tight font-bold text-fg">{t("name")}</p>
        <p className="mt-0.5 text-[12px] text-muted">{t("sub")}</p>
      </div>
    </div>
  );
}

/** "Proudly from Tizimín": dotted Yucatán Peninsula with a beating pin, plus live time and weather. */
export async function HometownWidget() {
  const t = await getTranslations("about.widgets.hometown");
  const { width, height, pin } = hometown as { width: number; height: number; pin: number[] };
  const [px, py] = pin;

  return (
    <div className="relative flex h-full flex-col p-4 pr-7">
      <WidgetLabel icon={<House size={13} strokeWidth={2.2} />}>{t("label")}</WidgetLabel>
      <p className="text-micro relative z-10 mt-2 self-start rounded-full bg-surface px-2 py-1 text-body ring-1 ring-line">{t("chip")}</p>

      <div aria-hidden className="absolute top-9 right-7 w-[146px]" style={{ aspectRatio: `${width} / ${height}` }}>
        <div
          className="absolute inset-0 bg-muted opacity-50"
          style={{
            mask: "url(/images/yucatan-dots.svg) center / 100% 100% no-repeat",
            WebkitMask: "url(/images/yucatan-dots.svg) center / 100% 100% no-repeat",
          }}
        />
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full overflow-visible">
          <circle cx={px} cy={py} r="16" className="jm-home" fill="var(--accent-ink)" />
          <circle cx={px} cy={py} r="9" fill="var(--accent-ink)" opacity="0.3" />
          <circle cx={px} cy={py} r="5.5" fill="var(--accent-ink)" stroke="var(--widget)" strokeWidth="2" />
        </svg>
      </div>

      <div className="relative mt-auto">
        <p className="text-[13px] leading-tight text-muted">{t("pre")}</p>
        <p className="text-[22px] leading-tight font-bold text-fg">{t("place")}</p>
        <div className="mt-1">
          <HometownNow />
        </div>
      </div>
    </div>
  );
}

function Element({ symbol, number, className }: { symbol: string; number: number; className?: string }) {
  return (
    <span
      className={`relative grid size-[58px] place-items-center rounded-md border border-white/25 text-[28px] font-bold text-white shadow-[0_8px_18px_-6px_rgb(0_0_0/0.5)] ${className ?? ""}`}
      style={{ background: "linear-gradient(150deg, #2f7d49, #1e6b3a 60%, #165530)" }}
    >
      <span className="absolute top-1 left-1.5 text-[9px] font-semibold">{number}</span>
      {symbol}
    </span>
  );
}

export async function SeriesWidget() {
  const t = await getTranslations("about.widgets.series");
  return (
    <div className="flex h-full flex-col p-4 pr-7">
      <WidgetLabel icon={<Tv size={13} strokeWidth={2.2} />}>{t("label")}</WidgetLabel>
      <div aria-hidden className="flex flex-1 items-center justify-center gap-2">
        <Element symbol="Br" number={35} className="-translate-y-2" />
        <Element symbol="Ba" number={56} className="translate-y-2" />
      </div>
      <div>
        <p className="text-[20px] leading-tight font-bold text-fg">{t("name")}</p>
        <p className="mt-0.5 text-[12px] text-muted">{t("sub")}</p>
      </div>
    </div>
  );
}

/**
 * Dotted world map; each leg of the route draws in its own slot while the
 * matching pin pops and the city appears below. Pure CSS (see globals.css),
 * restarted every time the stack mounts this page.
 */
export async function JourneyWidget() {
  const t = await getTranslations("about.widgets.journey");
  const { width, height, pins, order, legs } = journey as {
    width: number;
    height: number;
    pins: Record<string, number[]>;
    order: string[];
    legs: string[];
  };
  const last = order.length - 1;

  return (
    <div className="flex h-full flex-col p-4 pr-7">
      <WidgetLabel icon={<MapPinned size={13} strokeWidth={2.2} />}>{t("label")}</WidgetLabel>

      <div aria-hidden className="relative mt-4 w-full" style={{ aspectRatio: `${width} / ${height}` }}>
        <div
          className="absolute inset-0 bg-muted opacity-45"
          style={{
            mask: "url(/images/journey-dots.svg) center / 100% 100% no-repeat",
            WebkitMask: "url(/images/journey-dots.svg) center / 100% 100% no-repeat",
          }}
        />
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 h-full w-full overflow-visible">
          {legs.map((d, i) => (
            <path
              key={d}
              d={d}
              pathLength={1}
              className="jm-leg"
              style={{ "--i": i } as React.CSSProperties}
              fill="none"
              stroke="var(--accent-ink)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          ))}
          {order.map((id, i) => {
            const [x, y] = pins[id];
            return (
              <g key={id} className="jm-pin" style={{ "--i": i } as React.CSSProperties}>
                {i === 0 && <circle cx={x} cy={y} r="5" className="jm-home" fill="var(--accent-ink)" />}
                <circle cx={x} cy={y} r="3.4" fill="var(--accent-ink)" opacity="0.25" />
                <circle cx={x} cy={y} r="1.9" fill="var(--accent-ink)" stroke="var(--widget)" strokeWidth="0.6" />
              </g>
            );
          })}
        </svg>
      </div>

      <div aria-hidden className="relative mt-auto h-[46px]">
        {order.map((id, i) => (
          <p key={id} className={i === last ? "jm-stop jm-stop-last" : "jm-stop"} style={{ "--i": i } as React.CSSProperties}>
            {/* Generated content: a decorative echo of the sr-only list below, so mid-fade frames aren't read as text. */}
            <span
              data-text={t(`stops.${id}.city`)}
              className="block truncate text-[15px] font-semibold text-fg before:content-[attr(data-text)]"
            />
            <span data-text={t(`stops.${id}.note`)} className="block truncate text-[11px] text-muted before:content-[attr(data-text)]" />
          </p>
        ))}
      </div>
      <p className="text-micro mt-2 self-start rounded-full bg-chip px-2 py-1 text-body">{t("count")}</p>

      <ol className="sr-only">
        {order.map((id) => (
          <li key={id}>
            {t(`stops.${id}.city`)}: {t(`stops.${id}.note`)}
          </li>
        ))}
      </ol>
    </div>
  );
}
