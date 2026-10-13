import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowUp, Mail, Phone } from "lucide-react";
import { profile } from "@/content/content";
import { GithubIcon, InstagramIcon, LinkedinIcon } from "@/components/ui/BrandIcons";
import { StatusDot } from "@/components/ui/StatusDot";
import { LocalConditions } from "./LocalConditions";

/** Navy wax seal pressed with an "A". */
function Seal() {
  return (
    <svg viewBox="0 0 100 100" className="size-[84px] shrink-0 drop-shadow-[0_8px_14px_rgb(0_0_60/0.45)] md:size-[100px]" aria-hidden>
      <defs>
        <radialGradient id="seal-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#3a3ad6" />
          <stop offset="0.45" stopColor="#0b0b9a" />
          <stop offset="1" stopColor="#00004d" />
        </radialGradient>
      </defs>
      <path
        d="M50 4c7 0 9 5 15 6s11-2 15 3 0 10 3 15 9 6 9 13-6 8-6 14 5 10 1 15-10 3-14 7-3 10-9 12-9-3-15-3-10 6-16 4-5-8-10-11-11-2-14-8 2-10 0-15-8-8-6-14 7-6 9-11-1-11 4-15 10 1 15-2 8-11 14-11Z"
        fill="url(#seal-wax)"
      />
      <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(255 255 255 / 0.22)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="26" fill="rgb(0 0 0 / 0.12)" />
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="central"
        fill="rgb(255 255 255 / 0.88)"
        style={{ font: "400 38px var(--font-handrawn), cursive" }}
      >
        A
      </text>
    </svg>
  );
}

export async function Footer() {
  const t = await getTranslations("footer");
  const tc = await getTranslations("common");

  const socials = [
    { href: profile.github, label: tc("github"), icon: <GithubIcon size={16} />, color: "var(--fg)" },
    { href: profile.linkedin, label: tc("linkedin"), icon: <LinkedinIcon size={15} />, color: "#0a66c2" },
    { href: profile.instagram, label: tc("instagram"), icon: <InstagramIcon size={16} />, color: "#e1306c" },
    { href: `mailto:${profile.email}`, label: tc("email"), icon: <Mail size={16} aria-hidden />, color: "var(--accent-ink)" },
    { href: profile.phoneHref, label: tc("phone"), icon: <Phone size={15} aria-hidden />, color: "var(--fg)" },
  ];

  return (
    <footer
      data-i18n-fade
      className="column cv-section pb-28 lg:pb-16"
      style={{ "--cis-m": "1000px", "--cis-d": "653px" } as React.CSSProperties}
    >
      <nav aria-label={t("social")} className="relative flex justify-center">
        <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-line" />
        <ul className="relative flex gap-2.5 bg-bg px-3">
          {socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith("http") ? "_blank" : undefined}
                rel={s.href.startsWith("http") ? "noreferrer noopener" : undefined}
                aria-label={s.label}
                className="grid h-8 w-10 place-items-center rounded-lg bg-surface shadow-pill ring-1 ring-line transition-transform duration-200 hover:-translate-y-0.5"
                style={{ color: s.color }}
              >
                {s.icon}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="gutter flex flex-col items-center pt-16 text-center md:pt-20">
        <div className="flex flex-col items-center gap-5 md:flex-row md:gap-6">
          <p className="text-body md:w-[240px] md:text-right">{t("thanks")}</p>
          <Seal />
          <p className="text-body md:w-[240px] md:text-left">{t("build")}</p>
        </div>

        <Image
          src="/images/signature.png"
          alt={t("signatureAlt")}
          width={1904}
          height={1996}
          className="mt-10 h-[104px] w-auto opacity-90 select-none md:mt-12 md:h-[132px]"
        />
        <p className="mt-3 font-medium text-fg">{t("fullName")}</p>
        <p className="text-muted">{t("role")}</p>

        <div className="mt-6 flex flex-col items-center gap-3 md:flex-row">
          <span className="text-micro inline-flex h-8 items-center gap-1.5 rounded-full bg-surface px-3 text-green shadow-pill ring-1 ring-line/60">
            <StatusDot size={6} pulse />
            {tc("available")}
          </span>
          <LocalConditions />
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 md:mt-12">
          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors duration-200 hover:text-fg"
          >
            <ArrowUp size={14} aria-hidden />
            {t("backToTop")}
          </a>
          <p className="text-micro text-muted">{t("copyright", { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
