import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { profile } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { GithubIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { StatusDot } from "@/components/ui/StatusDot";
import { ContactWizard } from "./ContactWizard";

export async function Contact() {
  const t = await getTranslations("contact");
  const tc = await getTranslations("common");

  const socials = [
    { href: profile.github, label: tc("github"), icon: <GithubIcon size={18} /> },
    { href: profile.linkedin, label: tc("linkedin"), icon: <LinkedinIcon size={17} /> },
    { href: `mailto:${profile.email}`, label: tc("email"), icon: <Mail size={18} aria-hidden /> },
  ];

  return (
    <Section id="contact" rule={false}>
      <SectionHeading id="contact" eyebrow={t("eyebrow")} title={t("title")} />
      <div className="grid items-start gap-8 md:grid-cols-2 md:gap-8">
        <div data-reveal className="flex flex-col items-center">
          <div className="relative aspect-[432/506] w-full overflow-hidden rounded-3xl bg-widget">
            <Image
              src={profile.images.portrait}
              alt={t("photoAlt")}
              fill
              sizes="(min-width: 1200px) 432px, (min-width: 810px) 45vw, 100vw"
              className="object-cover object-[50%_22%]"
            />
            <span className="absolute bottom-0 left-1/2 flex h-[30px] -translate-x-1/2 items-center gap-1.5 rounded-t-xl bg-surface px-3 text-[13px] font-medium tracking-[0.04em] text-green uppercase">
              <StatusDot size={6} />
              {t("tag")}
            </span>
          </div>
          <p className="mt-4 flex items-center gap-2 text-body">
            <span className="font-medium">{t("name")}</span>
            <span aria-hidden className="size-1.5 rounded-full bg-muted" />
            <span className="text-muted">{t("role")}</span>
          </p>
          <ul className="mt-3 flex items-center gap-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                  aria-label={s.label}
                  className="grid size-10 place-items-center rounded-full text-muted transition-colors duration-200 hover:bg-surface hover:text-fg"
                >
                  {s.icon}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={profile.phoneHref}
            className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-muted tabular-nums transition-colors hover:text-fg"
          >
            <Phone size={14} aria-hidden />
            <span className="sr-only">{tc("phone")}: </span>
            {profile.phone}
          </a>
        </div>

        <div data-reveal data-reveal-delay="100">
          <ContactWizard />
        </div>
      </div>
    </Section>
  );
}
