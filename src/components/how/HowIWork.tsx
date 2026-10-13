import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { awards, profile } from "@/content/content";
import { Section, SectionHeading } from "@/components/layout/Section";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";

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

type Point = { title: string; text: string };

export async function HowIWork() {
  const t = await getTranslations("how");
  const tc = await getTranslations("common");
  const points = t.raw("card.points") as Point[];
  const focus = t.raw("profile.focus") as string[];
  const statRows = [
    { value: t("profile.languagesValue"), label: t("profile.stats.languages") },
    { value: t("profile.locationValue"), label: t("profile.stats.location") },
    { value: String(awards.length), label: t("profile.stats.awards") },
  ];
  const socials = [
    { href: profile.github, label: tc("github"), value: "@" + profile.githubUser, icon: <GithubIcon size={17} /> },
    { href: profile.linkedin, label: tc("linkedin"), value: profile.linkedin.split("/in/")[1], icon: <LinkedinIcon size={16} /> },
    { href: profile.instagram, label: tc("instagram"), value: "@" + profile.instagram.split("/").filter(Boolean).pop(), icon: <InstagramIcon size={17} /> },
    { href: `mailto:${profile.email}`, label: tc("email"), value: profile.email, icon: <Mail size={17} aria-hidden /> },
    { href: profile.phoneHref, label: tc("phone"), value: profile.phone, icon: <Phone size={16} aria-hidden /> },
  ];

  return (
    <Section id="how" rule={false}>
      <SectionHeading id="how" eyebrow={t("eyebrow")} title={t("title")} />

      <div className="grid gap-4 md:grid-cols-[minmax(0,332fr)_minmax(0,548fr)]">
        {/* Left: tilted profile card overlapping a bordered card, with contact links below */}
        <div data-reveal className="relative flex flex-col rounded-3xl border border-line">
          <div className="relative z-10 -mx-2 mt-3 md:-ml-3 md:mr-[-12px]" style={{ perspective: 1200 }}>
            <div className="group/profile rotate-[1.33deg] rounded-3xl bg-surface p-4 shadow-[0_18px_40px_-14px_rgb(0_0_0/0.45),0_0_0_1px_var(--line)] transition-transform duration-500 ease-out-expo hover:-translate-y-1 hover:rotate-0">
              <div className="flex items-stretch gap-3">
                <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
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
                </div>
                <dl className="flex w-[118px] shrink-0 flex-col justify-between">
                  {statRows.map((s, i) => (
                    <div key={s.label} className={i > 0 ? "border-t border-line pt-2.5" : "pb-2.5"}>
                      <dt className="sr-only">{s.label}</dt>
                      <dd className="text-center">
                        <span className="block text-[18px] leading-tight font-medium text-fg md:text-[20px]">{s.value}</span>
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

          <div className="flex flex-1 flex-col gap-6 p-6 pt-10 md:pt-14">
            <div>
              <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{t("profile.focusLabel")}</p>
              <ul className="mt-2 flex flex-wrap gap-1.5">
                {focus.map((item) => (
                  <li key={item} className="text-micro rounded-full bg-chip px-2 py-1 whitespace-nowrap text-body">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-1 flex-col">
              <p className="font-mono text-[11px] tracking-[0.08em] text-muted uppercase">{t("profile.contactLabel")}</p>
              <ul className="mt-2 flex flex-1 flex-col border-t border-line">
                {socials.map((s) => (
                  <li key={s.label} className="flex flex-1 border-b border-line last:border-b-0">
                    <a
                      href={s.href}
                      target={s.href.startsWith("http") ? "_blank" : undefined}
                      rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                      className="group/link flex min-h-12 w-full items-center gap-3 text-muted transition-colors duration-200 hover:text-fg"
                    >
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-chip transition-colors duration-200 group-hover/link:bg-accent-soft group-hover/link:text-accent-ink">
                        {s.icon}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[14px] leading-tight font-medium text-body">{s.label}</span>
                        <span className="block truncate text-[12px] leading-tight">{s.value}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: how to work together */}
        <div data-reveal data-reveal-delay="100" className="flex flex-col rounded-3xl border border-line p-6 md:p-8">
          <p className="text-[32px] leading-[1.05] font-bold text-fg md:text-[52px]">{t("card.headline")}</p>
          <p className="mt-3 max-w-[44ch] text-muted">{t("card.sub")}</p>
          <ol className="mt-8 flex flex-1 flex-col justify-between border-t border-line">
            {points.map((point, i) => (
              <li key={point.title} className="flex flex-1 gap-4 border-b border-line py-5 last:border-b-0">
                <span aria-hidden className="font-mono text-[12px] pt-[0.35em] text-accent-ink tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-[17px] leading-snug font-medium text-body md:text-[19px]">{point.title}</h3>
                  <p className="mt-1 text-[14px] leading-snug text-muted md:text-[15px]">{point.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}
