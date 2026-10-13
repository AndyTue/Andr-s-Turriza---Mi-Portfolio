import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { fragmentMono, handrawn, inter, satoshi } from "../fonts";
import { DotBackground } from "@/components/layout/DotBackground";
import { ProgressiveBlur } from "@/components/layout/ProgressiveBlur";
import { LocaleScrollKeeper } from "@/components/layout/LocaleScrollKeeper";
import { RevealObserver } from "@/components/layout/RevealObserver";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "../globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Runs before paint: dark is the default, a stored "light" overrides it.
const themeScript = `(function(){var d=document.documentElement;d.classList.add('js-reveal');try{var t=localStorage.getItem('theme');var dark=t!=='light';d.classList.toggle('dark',dark);d.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", es: "/es", "x-default": "/en" },
    },
    openGraph: {
      type: "website",
      url: `/${locale}`,
      title: t("title"),
      description: t("description"),
      siteName: "Andrés Turriza",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? ["en_US"] : ["es_MX"],
      images: [{ url: "/images/andres-portrait.jpg", width: 1200, height: 1800, alt: t("ogAlt") }],
    },
    twitter: { card: "summary_large_image", title: t("title"), description: t("description") },
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
  ],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  // Only what client components translate goes over the wire; server components read the full set.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all = (await getMessages()) as any;
  const clientMessages = {
    common: all.common,
    nav: all.nav,
    pill: all.pill,
    weather: all.weather,
    contact: all.contact,
    hero: { lanyard: all.hero.lanyard },
    about: { intro: all.about.intro, note: all.about.note, noteHint: all.about.noteHint, carousel: all.about.carousel, playing: all.about.playing },
    experience: { contrib: all.experience.contrib },
    recognition: { prev: all.recognition.prev, next: all.recognition.next, slide: all.recognition.slide },
    footer: { time: all.footer.time, weatherIn: all.footer.weatherIn, weatherUnavailable: all.footer.weatherUnavailable },
  };

  return (
    <html
      lang={locale}
      className={`dark ${satoshi.variable} ${inter.variable} ${fragmentMono.variable} ${handrawn.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
          <MotionProvider>
          <DotBackground />
          {children}
          <ProgressiveBlur />
          <LocaleScrollKeeper />
          <RevealObserver />
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
