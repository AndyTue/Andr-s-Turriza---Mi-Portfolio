import { getTranslations } from "next-intl/server";
import { showcase } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PhotoCarousel } from "./PhotoCarousel";
import { NowPlaying } from "./NowPlaying";
import { IntroCard } from "./IntroCard";
import { SmartStack, type StackPage } from "./SmartStack";
import { HobbiesWidget, HometownWidget, JourneyWidget, SeriesWidget, TeamWidget } from "./Widgets";
import { Showcase } from "./Showcase";

/**
 * Bento: tall photo carousel on the left; two iOS-style widget stacks on top
 * of the intro card on the right. Stacks on phones.
 */
export async function About() {
  const t = await getTranslations("about");

  const stack = (entries: { id: string; name: string; duration: number; node: React.ReactNode }[]): StackPage[] =>
    entries.map((e, i) => ({
      id: e.id,
      duration: e.duration,
      node: e.node,
      slideLabel: t("stack.slide", { current: i + 1, total: entries.length, name: e.name }),
      showLabel: t("stack.show", { name: e.name }),
    }));

  const personal = stack([
    { id: "playing", name: t("playing.label"), duration: 6500, node: <NowPlaying className="h-full" /> },
    { id: "hobbies", name: t("widgets.hobbies.label"), duration: 5000, node: <HobbiesWidget /> },
    { id: "team", name: t("widgets.team.label"), duration: 4500, node: <TeamWidget /> },
    { id: "series", name: t("widgets.series.label"), duration: 4500, node: <SeriesWidget /> },
  ]);

  const journey = stack([
    { id: "hometown", name: t("widgets.hometown.label"), duration: 5500, node: <HometownWidget /> },
    { id: "journey", name: t("widgets.journey.label"), duration: 7500, node: <JourneyWidget /> },
    {
      id: "showcase",
      name: t("widgets.showcase.label"),
      duration: 7000,
      node: (
        <Showcase
          label={t("widgets.showcase.label")}
          count={t("widgets.showcase.count")}
          hint={t("widgets.showcase.hint")}
          items={showcase.map((s) => ({
            id: s.id,
            object: s.object,
            title: t(`widgets.showcase.items.${s.id}.title`),
            detail: t(`widgets.showcase.items.${s.id}.detail`),
          }))}
        />
      ),
    },
  ]);

  return (
    <Section id="about">
      <SectionHeading id="about" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1.44fr_1fr_1fr] md:grid-rows-[264px_minmax(240px,auto)]">
        <div data-reveal className="md:row-span-2">
          <PhotoCarousel className="aspect-[4/5] h-full w-full md:aspect-auto md:min-h-[520px]" />
        </div>
        <div data-reveal data-reveal-delay="80">
          <SmartStack pages={personal} label={t("stack.personal")} className="h-[264px]" />
        </div>
        <div data-reveal data-reveal-delay="160">
          <SmartStack pages={journey} label={t("stack.journey")} startDelay={2600} className="h-[264px]" />
        </div>
        <div data-reveal data-reveal-delay="120" className="md:col-span-2">
          <IntroCard className="h-full" />
        </div>
      </div>
    </Section>
  );
}
