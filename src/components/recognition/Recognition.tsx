import { getTranslations } from "next-intl/server";
import { awards } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { RecognitionCarousel, type AwardSlide } from "./RecognitionCarousel";

export async function Recognition() {
  const t = await getTranslations("recognition");
  const slides: AwardSlide[] = awards.map((a) => ({
    id: a.id,
    icon: a.icon,
    statement: t(`items.${a.id}.statement`),
    org: t(`items.${a.id}.org`),
    meta: t(`items.${a.id}.meta`),
  }));

  return (
    <Section id="recognition">
      <SectionHeading id="recognition" eyebrow={t("eyebrow")} title={t("title")} />
      <div data-reveal>
        <RecognitionCarousel slides={slides} region={t("title")} />
      </div>
    </Section>
  );
}
