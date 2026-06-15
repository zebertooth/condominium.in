import Link from "next/link";
import { t, type Locale } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";

function footerSectionLabel(
  locale: Locale,
  section: "menu" | "services" | "legal" | "rights",
): string {
  const labels: Record<Locale, Record<typeof section, string>> = {
    th: { menu: "เมนูหลัก", services: "บริการ", legal: "กฎหมาย", rights: "สงวนลิขสิทธิ์." },
    en: { menu: "Menu", services: "Services", legal: "Legal", rights: "All rights reserved." },
    zh: { menu: "菜单", services: "服务", legal: "法律", rights: "保留所有权利。" },
    ja: { menu: "メニュー", services: "サービス", legal: "法的情報", rights: "All rights reserved." },
    ar: { menu: "القائمة", services: "الخدمات", legal: "قانوني", rights: "جميع الحقوق محفوظة." },
  };
  return labels[locale][section];
}

export function Footer({ locale }: { locale: Locale }) {
  const lp = (path: string) => localePath(path, locale);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-5 sm:px-6">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-white">{t("siteName", locale)}</h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed">{t("footerAbout", locale)}</p>
        </div>

        <div>
          <h3 className="font-semibold text-white">{footerSectionLabel(locale, "menu")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={lp("/buy")} className="hover:text-white">{t("buy", locale)}</Link></li>
            <li><Link href={lp("/rent")} className="hover:text-white">{t("rent", locale)}</Link></li>
            <li><Link href={lp("/areas")} className="hover:text-white">{t("areas", locale)}</Link></li>
            <li><Link href={lp("/ai-search")} className="hover:text-white">{t("aiSearch", locale)}</Link></li>
            <li><Link href={lp("/list-property")} className="hover:text-white">{t("listProperty", locale)}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">{footerSectionLabel(locale, "services")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={lp("/agents")} className="hover:text-white">{t("agents", locale)}</Link></li>
            <li><Link href={lp("/blog")} className="hover:text-white">{t("blog", locale)}</Link></li>
            <li><Link href={lp("/contact")} className="hover:text-white">{t("contact", locale)}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-white">{footerSectionLabel(locale, "legal")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href={lp("/privacy")} className="hover:text-white">{t("privacyPolicy", locale)}</Link></li>
            <li><Link href={lp("/terms")} className="hover:text-white">{t("termsOfService", locale)}</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-800 px-4 py-4 text-center text-xs text-slate-500 sm:px-6">
        © {new Date().getFullYear()} {t("siteName", locale)}. {footerSectionLabel(locale, "rights")}
      </div>
    </footer>
  );
}
