import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { profile } from "@/content/content";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { StatusDot } from "@/components/ui/StatusDot";
import { CvButton } from "./CvButton";
import { Greeting } from "./Greeting";
import { Lanyard } from "./Lanyard";

export async function Hero() {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const tf = await getTranslations("footer");
  const locale = (await getLocale()) as "en" | "es";
  // "Software Engineer · Applied AI & Full-Stack" wraps as two whole phrases.
  const [role, focus] = t("role").split(" · ");

  const socials = [
    { href: profile.github, label: tc("github"), icon: <GithubIcon size={18} />, color: "var(--fg)" },
    { href: profile.linkedin, label: tc("linkedin"), icon: <LinkedinIcon size={17} />, color: "#0a66c2" },
    { href: profile.instagram, label: tc("instagram"), icon: <InstagramIcon size={18} />, color: "#e1306c" },
    { href: `mailto:${profile.email}`, label: tc("email"), icon: <Mail size={18} aria-hidden />, color: "var(--accent-ink)" },
    { href: profile.phoneHref, label: tc("phone"), icon: <Phone size={17} aria-hidden />, color: "var(--fg)" },
  ];
  const socialLinks = socials.map((s) => (
    <li key={s.label}>
      <a
        href={s.href}
        target={s.href.startsWith("http") ? "_blank" : undefined}
        rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
        aria-label={s.label}
        className="grid size-11 place-items-center rounded-full bg-surface shadow-pill ring-1 ring-line transition-transform duration-200 hover:-translate-y-0.5"
        style={{ color: s.color }}
      >
        {s.icon}
      </a>
    </li>
  ));

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      className="gutter relative border-b border-line pt-[72px] pb-14 md:min-h-[668px] md:pt-[132px] md:pb-24 lg:min-h-[629px]"
    >
      <div className="max-w-[560px] md:max-w-[400px] lg:max-w-[560px]">
        <p className="inline-flex h-[26px] items-center gap-2 rounded-full bg-surface px-2.5 text-[10px] text-green shadow-pill md:text-[12px]">
          <StatusDot size={6} pulse />
          {tc("available")}
        </p>

        <h1
          id="hero-title"
          className="mt-6 text-[clamp(36px,10.4vw,44px)] leading-[1.18] font-bold text-fg md:text-[52px] lg:text-[64px] lg:leading-[1.2]"
        >
          <span className="sr-only">{t("greetingSr")} </span>
          <Greeting />
          <span className="block whitespace-nowrap">
            {t("intro")}{" "}
            {/* An image, like the reference: a text emoji forces a costly system-font fallback during first layout. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/wave.svg"
              alt=""
              width={64}
              height={64}
              className="wave inline-block size-[0.92em] origin-[70%_75%] align-[-0.1em]"
            />
          </span>
        </h1>

        <p className="mt-1 text-[22px] leading-[1.2] font-medium text-muted md:text-[24px] lg:text-[28px]">
          <span className="inline-block">{role}</span>
          {focus && (
            <>
              <span aria-hidden className="inline-block px-[0.3em] text-muted/60">
                ·
              </span>
              <span className="inline-block">{focus}</span>
            </>
          )}
        </p>

        <p className="mt-7 max-w-[520px] md:mt-8">{t("summary")}</p>
        <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-muted md:text-[14px]">
          <MapPin size={14} aria-hidden className="shrink-0" />
          {tc("location")}
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2.5 md:mt-9">
          <CvButton
            href={profile.cv[locale]}
            downloadName={`CV_AndresTurriza_${locale.toUpperCase()}.pdf`}
            labels={{
              button: tc("downloadCv"),
              title: tc("cvTitle"),
              download: tc("cvDownload"),
              close: tc("close"),
              loading: tc("cvLoading"),
              error: tc("cvError"),
            }}
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] font-medium text-body transition-[transform,background-color,color] duration-200 hover:bg-surface hover:text-fg active:scale-[0.98] md:text-[16px]"
          />
          {/* Below md (no badge) the icons wrap under the CV button. From md up they're pulled
              under the badge with only `right` set: `top: auto` keeps them in this row, so they
              stay level with the button however the copy wraps. Rendered before <Lanyard /> so a
              dragged card passes over them. */}
          <ul
            aria-label={tf("social")}
            className="flex gap-2.5 md:absolute md:right-[25px] md:w-[280px] md:justify-center lg:right-[70px]"
          >
            {socialLinks}
          </ul>
        </div>
      </div>

      <Lanyard />
    </section>
  );
}
