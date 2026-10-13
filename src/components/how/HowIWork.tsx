import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { MapPin } from "lucide-react";
import { profile, stats } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { StatusDot } from "@/components/ui/StatusDot";

function HexBadge({ label }: { label: string }) {
  return (
    <span className="absolute -bottom-3 left-1/2 -translate-x-1/2" title={label}>
      <svg width="30" height="33" viewBox="0 0 30 33" aria-hidden>
        <path d="M15 1.5 28 9v15l-13 7.5L2 24V9z" fill="#000080" stroke="var(--surface)" strokeWidth="2.5" strokeLinejoin="round" />
        <path
          d="m15 9.2 1.9 3.9 4.3.6-3.1 3 .7 4.3L15 19l-3.8 2 .7-4.3-3.1-3 4.3-.6z"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}

export async function HowIWork() {
  const t = await getTranslations("how");
  const tc = await getTranslations("common");
  const points = t.raw("card.points") as string[];
  const statRows = [
    { value: stats.gpa, label: t("profile.stats.gpa") },
    { value: stats.clients, label: t("profile.stats.clients") },
    { value: stats.students, label: t("profile.stats.students") },
  ];

  return (
    <Section id="how">
      <SectionHeading id="how" eyebrow={t("eyebrow")} title={t("title")} />

      <div className="grid gap-4 md:grid-cols-[minmax(0,332fr)_minmax(0,548fr)]">
        {/* Left: tilted profile card overlapping a bordered card */}
        <div data-reveal className="relative flex flex-col rounded-3xl border border-line">
          <div className="relative z-10 -mx-2 mt-3 md:-ml-3 md:mr-[-12px]" style={{ perspective: 1200 }}>
            <div className="group/profile rotate-[1.33deg] rounded-3xl bg-surface p-4 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.45),0_0_0_1px_var(--line)] transition-transform duration-500 ease-out-expo hover:-translate-y-1 hover:rotate-0">
              <div className="flex items-stretch gap-3">
                <div className="flex min-w-0 flex-1 flex-col items-center text-center">
                  <div className="relative">
                    <Image
                      src={profile.images.headshot}
                      alt={t("profile.name")}
                      width={112}
                      height={112}
                      className="size-[104px] rounded-full object-cover object-top md:size-[112px]"
                    />
                    <HexBadge label={t("profile.badge")} />
                  </div>
                  <p className="mt-5 text-[22px] leading-[1.05] font-bold text-fg md:text-[24px]">{t("profile.name")}</p>
                  <p className="mt-2 flex items-center gap-1 text-[14px] text-body">
                    <MapPin size={14} aria-hidden className="text-muted" />
                    {t("profile.location")}
                  </p>
                </div>
                <dl className="flex w-[118px] shrink-0 flex-col justify-between">
                  {statRows.map((s, i) => (
                    <div key={s.label} className={i > 0 ? "border-t border-line pt-2.5" : "pb-2.5"}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="text-center">
                        <span className="block text-[20px] leading-tight font-medium text-fg tabular-nums md:text-[22px]">{s.value}</span>
                        <span aria-hidden className="mt-0.5 block text-[12px] leading-tight text-body md:text-[13px]">
                          {s.label}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>

          <div className="mt-auto p-6 pt-10 md:pt-14">
            <span className="text-micro inline-flex items-center gap-1.5 rounded-full bg-surface px-2 py-1 text-green shadow-pill">
              <StatusDot size={6} />
              {t("relocate.badge")}
            </span>
            <h3 className="mt-3 text-[22px] leading-tight font-medium text-body md:text-[30px]">{t("relocate.title")}</h3>
            <p className="mt-2 text-muted">{t("relocate.text")}</p>
          </div>
        </div>

        {/* Right: how to work together */}
        <div data-reveal data-reveal-delay="100" className="flex flex-col rounded-3xl border border-line p-6 md:p-6">
          <h3 className="text-[22px] leading-tight font-medium text-body md:text-[30px]">{t("card.title")}</h3>
          <p className="mt-2 text-muted">{t("card.lead")}</p>
          <hr className="my-6 border-line md:my-8" />
          <span className="text-micro self-start rounded-full bg-chip px-2 py-1 text-body">{t("card.badge")}</span>
          <p className="mt-3 text-[28px] leading-[1.1] font-bold text-fg md:text-[44px]">{t("card.headline")}</p>
          <p className="mt-2 text-muted">{t("card.sub")}</p>
          <ul className="mt-6 grid gap-x-6 gap-y-2.5 lg:grid-cols-2">
            {points.map((point) => (
              <li key={point} className="flex gap-2.5 text-[15px] leading-snug text-body md:text-[16px]">
                <span aria-hidden className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-accent-ink" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8">
            <ConnectButton href="#contact">{tc("letsConnect")}</ConnectButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
