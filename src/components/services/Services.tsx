import { getTranslations } from "next-intl/server";
import { projects, services } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ProjectVisual } from "@/components/work/Mockups";
import { ServicesAccordion, type ServiceItem } from "./ServicesAccordion";

export async function Services() {
  const t = await getTranslations("services");
  const tw = await getTranslations("work");

  const items: ServiceItem[] = services.map((s) => {
    const project = projects.find((p) => p.id === s.preview)!;
    const title = tw(`projects.${project.id}.title`);
    return {
      id: s.id,
      title: t(`items.${s.id}.title`),
      category: t(`items.${s.id}.category`),
      description: t(`items.${s.id}.description`),
      tags: s.tags,
      preview: <ProjectVisual project={project} alt={tw("mockupAlt", { title })} illustrationLabel={tw("illustration")} sizes="240px" />,
    };
  });

  return (
    <Section id="services">
      <SectionHeading id="services" eyebrow={t("eyebrow")} title={t("title")} />
      <div data-reveal>
        <ServicesAccordion items={items} />
      </div>
    </Section>
  );
}
