import { getTranslations } from "next-intl/server";
import clsx from "clsx";
import type { Project } from "@/content/content";
import { ArrowButton } from "@/components/ui/ArrowButton";
import { ProjectVisual } from "./Mockups";

export function Chip({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={clsx("text-micro inline-flex items-center rounded-full bg-chip px-2 py-1 whitespace-nowrap text-body", className)}>
      {children}
    </span>
  );
}

export function Monogram({ text, size = 44, className }: { text: string; size?: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={clsx("grid shrink-0 place-items-center rounded-full bg-widget text-[13px] font-bold tracking-wide text-fg ring-1 ring-line", className)}
      style={{ width: size, height: size }}
    >
      {text}
    </span>
  );
}

/**
 * Wide cards put text and mockup side by side (mockup right, or left when
 * reversed); tall cards stack the mockup on top. Everything stacks on phones.
 * The title link stretches over the whole card and opens the repository on GitHub.
 */
export async function ProjectCard({ project }: { project: Project }) {
  const t = await getTranslations("work");
  const tc = await getTranslations("common");
  const p = (key: string) => t(`projects.${project.id}.${key}`);
  const title = p("title");
  const wide = project.layout !== "tall";
  const reverse = project.layout === "wide-reverse";

  return (
    <article
      data-reveal
      className={clsx(
        "group/card relative isolate flex h-full flex-col overflow-hidden rounded-3xl bg-surface shadow-card ring-1 ring-line/60",
        wide && "md:min-h-[318px] md:flex-row",
      )}
    >
      <div
        className={clsx(
          "relative aspect-[16/10] w-full shrink-0 overflow-hidden",
          wide ? "md:aspect-auto md:w-[47.3%]" : "md:aspect-[432/272]",
          wide && !reverse && "md:order-2",
        )}
      >
        <ProjectVisual
          project={project}
          alt={t("mockupAlt", { title })}
          illustrationLabel={t("illustration")}
          sizes={wide ? "(min-width: 1200px) 424px, (min-width: 810px) 47vw, 100vw" : "(min-width: 1200px) 432px, (min-width: 810px) 50vw, 100vw"}
        />
      </div>

      <div className={clsx("flex flex-1 flex-col p-6", wide && "md:py-8")}>
        <h3 className="text-card-title">
          <a
            href={project.repo}
            target="_blank"
            rel="noreferrer noopener"
            className="outline-none after:absolute after:inset-0 after:z-0 after:rounded-3xl focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-accent-ink"
            aria-label={tc("githubRepo", { title })}
          >
            {title}
          </a>
        </h3>
        <div className="mt-3 flex flex-wrap gap-2.5">
          <Chip>{p("period")}</Chip>
          <Chip>{project.tech}</Chip>
        </div>
        <p className="mt-4 text-muted md:mt-[18px]">{p("description")}</p>

        <div className="mt-auto pt-5">
          <div className="flex items-center gap-3 border-t border-line pt-4">
            <Monogram text={project.monogram} />
            <div className="min-w-0 flex-1">
              <p className="leading-snug font-medium text-body">{p("org")}</p>
              <p className="leading-snug text-muted">{p("role")}</p>
            </div>
            <ArrowButton />
          </div>
        </div>
      </div>
    </article>
  );
}
