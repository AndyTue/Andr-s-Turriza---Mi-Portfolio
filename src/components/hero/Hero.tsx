import { getLocale, getTranslations } from "next-intl/server";
import { Download, MapPin } from "lucide-react";
import { profile } from "@/content/content";
import { ConnectButton } from "@/components/ui/ConnectButton";
import { StatusDot } from "@/components/ui/StatusDot";
import { Greeting } from "./Greeting";
import { Lanyard } from "./Lanyard";

export async function Hero() {
  const t = await getTranslations("hero");
  const tc = await getTranslations("common");
  const locale = (await getLocale()) as "en" | "es";
  // "Software Engineer · Applied AI & Full-Stack" wraps as two whole phrases.
  const [role, focus] = t("role").split(" · ");

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
          {/* TODO(andres): add the real CV PDFs to /public/cv. */}
          <a
            href={profile.cv[locale]}
            download
            className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[14px] font-medium text-body transition-[transform,background-color,color] duration-200 hover:bg-surface hover:text-fg active:scale-[0.98] md:text-[16px]"
          >
            <Download size={16} strokeWidth={2} aria-hidden className="text-muted" />
            {tc("downloadCv")}
          </a>
          <ConnectButton href="#contact">{tc("letsConnect")}</ConnectButton>
        </div>
      </div>

      <Lanyard />
    </section>
  );
}
