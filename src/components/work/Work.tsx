import { getTranslations } from "next-intl/server";
import clsx from "clsx";
import { projects } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ProjectCard } from "./ProjectCard";

/** 1 wide · 2 tall · 1 wide (reversed) · 2 tall; a single column on phones. */
export async function Work() {
  const t = await getTranslations("work");

  return (
    <Section id="work">
      <SectionHeading id="work" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {projects.map((project) => (
          <div key={project.id} className={clsx(project.layout !== "tall" && "md:col-span-2")}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </Section>
  );
}
