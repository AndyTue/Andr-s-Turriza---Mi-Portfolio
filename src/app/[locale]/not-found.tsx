import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <main id="main" className="column grid min-h-dvh place-items-center">
      <div className="gutter text-center">
        <p className="font-hand text-[96px] leading-none text-muted/50">404</p>
        <h1 className="mt-4 text-[28px] font-bold text-fg md:text-[36px]">{t("title")}</h1>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-line px-4 text-[15px] font-medium text-body transition-colors duration-200 hover:bg-surface hover:text-fg"
        >
          <ArrowLeft size={16} aria-hidden />
          {t("back")}
        </Link>
      </div>
    </main>
  );
}
