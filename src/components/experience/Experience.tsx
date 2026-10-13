import { getTranslations } from "next-intl/server";
import { marqueeRows, stackGroups, timeline } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Marquee } from "./Marquee";
import { Timeline, type TimelineEntry } from "./Timeline";

export async function Experience() {
  const t = await getTranslations("experience");
  const tc = await getTranslations("common");

  const entries: TimelineEntry[] = timeline.map((item, i) => {
    const k = (key: string) => `items.${item.id}.${key}`;
    const tags = item.tags ?? (item.id === "uady" ? (t.raw(k("courses")) as string[]) : (t.raw(k("tags")) as string[]));
    return {
      id: item.id,
      index: String(i + 1).padStart(2, "0"),
      logo: item.logo,
      org: t(k("org")),
      role: t(k("role")),
      roleNote: t.has(k("roleNote")) ? t(k("roleNote")) : undefined,
      start: t(k("dates")),
      current: Boolean(item.current),
      tags,
      highlight: t(k("highlight")),
      description: t(k("description")),
    };
  });

  return (
    <Section id="experience">
      <SectionHeading id="experience" eyebrow={t("eyebrow")} title={t("title")} />

      {/* Logo marquees. */}
      <div data-reveal className="overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line/60">
        <div className="space-y-3 py-5 md:space-y-4 md:py-6">
          <Marquee items={marqueeRows[0]} direction="left" seconds={42} />
          <Marquee items={marqueeRows[1]} direction="right" seconds={50} />
          <ul className="sr-only" aria-label={t("marqueeLabel")}>
            {[...marqueeRows[0], ...marqueeRows[1]].map((x) => (
              <li key={x.name}>{x.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Toolbox: the same stack, grouped. */}
      <div data-reveal className="mt-4 rounded-3xl bg-surface p-5 shadow-card ring-1 ring-line/60 md:mt-5 md:p-6">
        <h3 className="text-[14px] font-semibold text-fg">{t("stackTitle")}</h3>
        <dl className="mt-4 grid gap-x-8 gap-y-5 md:grid-cols-2">
          {stackGroups.map((g) => (
            <div key={g.id} className={g.id === "tools" ? "md:col-span-2" : undefined}>
              <dt className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{t(`groups.${g.id}`)}</dt>
              <dd className="mt-2 flex flex-wrap gap-1.5">
                {g.items.map((item) => (
                  <span key={item} className="text-micro rounded-full bg-chip px-2 py-1 whitespace-nowrap text-body">
                    {item}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Timeline entries={entries} presentLabel={tc("present")} label={t("timelineLabel")} />
    </Section>
  );
}
