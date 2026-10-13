import { getTranslations, setRequestLocale } from "next-intl/server";
import { Dock } from "@/components/layout/Dock";
import { TopPill } from "@/components/layout/TopPill";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/about/About";
import { Work } from "@/components/work/Work";
import { Experience } from "@/components/experience/Experience";
import { Services } from "@/components/services/Services";
import { Recognition } from "@/components/recognition/Recognition";
import { HowIWork } from "@/components/how/HowIWork";
import { Footer } from "@/components/footer/Footer";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-full focus:bg-surface focus:px-4 focus:py-2 focus:text-fg"
      >
        {t("skip")}
      </a>
      <TopPill />
      <Dock />
      <main id="main" data-i18n-fade className="column">
        <Hero />
        <About />
        <Experience />
        <Work />
        <Services />
        <Recognition />
        <HowIWork />
      </main>
      <Footer />
    </>
  );
}
