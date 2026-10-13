import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { routing } from "@/i18n/routing";
import { Link } from "@/i18n/navigation";
import { projects } from "@/content/content";
import { Chip, Monogram } from "@/components/work/ProjectCard";
import { ProjectVisual } from "@/components/work/Mockups";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { Dock } from "@/components/layout/Dock";

type Params = { locale: string; slug: string };

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const t = await getTranslations({ locale, namespace: "work.projects" });
  const tm = await getTranslations({ locale, namespace: "meta" });
  const title = t(`${project.id}.title`);
  return {
    title: tm("projectTitle", { title }),
    description: t(`${project.id}.description`),
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: { en: `/en/projects/${slug}`, es: `/es/projects/${slug}`, "x-default": `/en/projects/${slug}` },
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const t = await getTranslations("work");
  const tp = await getTranslations("project");
  const tc = await getTranslations("common");
  const p = (key: string) => t(`projects.${project.id}.${key}`);
  const title = p("title");
  const details = t.raw(`projects.${project.id}.details`) as string[];
  const others = projects.filter((x) => x.id !== project.id).slice(0, 3);

  return (
    <>
      <Dock />
      <main id="main" data-i18n-fade className="column min-h-dvh">
        <article className="gutter border-b border-line pt-10 pb-16 md:pt-16 lg:pt-20 lg:pb-24">
          <Link
            href="/#work"
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[14px] font-medium text-body transition-colors duration-200 hover:bg-surface hover:text-fg"
          >
            <ArrowLeft size={16} aria-hidden />
            {tp("back")}
          </Link>

          <header className="mt-10 md:mt-14">
            <div className="flex flex-wrap gap-2.5">
              <Chip>{p("period")}</Chip>
              <Chip>{project.tech}</Chip>
            </div>
            <h1 className="mt-4 max-w-[760px] text-[32px] leading-[1.15] font-bold text-fg md:text-[44px] lg:text-[52px]">{title}</h1>
            <p className="mt-5 max-w-[680px] text-[16px] text-body md:text-[18px] md:leading-[1.6]">{p("description")}</p>
          </header>

          <div className="mt-10 aspect-[16/10] overflow-hidden rounded-3xl ring-1 ring-line md:mt-12">
            <ProjectVisual project={project} alt={t("mockupAlt", { title })} illustrationLabel={t("illustration")} sizes="(min-width: 1200px) 896px, 100vw" />
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-[1fr_260px] md:gap-14">
            <section aria-labelledby="highlights">
              <h2 id="highlights" className="text-eyebrow">
                {tp("highlights")}
              </h2>
              <ul className="mt-5 space-y-4">
                {details.map((d) => (
                  <li key={d} className="flex gap-3 text-body">
                    <span aria-hidden className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-accent-ink" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-[14px] text-muted">{tp("stub")}</p>
            </section>

            <aside className="space-y-6 md:border-l md:border-line md:pl-8">
              <div className="flex items-center gap-3">
                <Monogram text={project.monogram} />
                <div>
                  <p className="font-medium text-body">{p("org")}</p>
                  <p className="text-muted">{p("role")}</p>
                </div>
              </div>
              <dl className="space-y-4 text-[14px]">
                <div>
                  <dt className="text-muted">{tp("period")}</dt>
                  <dd className="mt-0.5 text-body">{p("period")}</dd>
                </div>
                <div>
                  <dt className="text-muted">{tp("stack")}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {project.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </dd>
                </div>
              </dl>
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-accent px-4 text-[14px] font-medium text-on-accent transition-[transform,background-color] duration-200 hover:bg-accent-hover active:scale-[0.98] dark:shadow-[inset_0_0_0_1px_rgb(107_107_245/0.45)]"
              >
                <GithubIcon size={16} />
                {tp("repo")}
                <ArrowUpRight size={16} aria-hidden />
                <span className="sr-only">({tc("githubRepo", { title })})</span>
              </a>
            </aside>
          </div>
        </article>

        <nav aria-labelledby="more-work" className="gutter py-14 md:py-20">
          <h2 id="more-work" className="text-eyebrow">
            {tp("more")}
          </h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/projects/${o.slug}`}
                  className="group flex h-full items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-card ring-1 ring-line/60 transition-colors duration-200 hover:bg-widget"
                >
                  <span className="font-medium text-body group-hover:text-fg">{t(`projects.${o.id}.title`)}</span>
                  <ArrowUpRight size={18} aria-hidden className="shrink-0 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </main>
    </>
  );
}
