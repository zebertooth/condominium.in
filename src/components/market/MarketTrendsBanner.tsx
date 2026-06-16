import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";

interface MarketTrendsBannerProps {
  locale: Locale;
  district?: string;
}

export function MarketTrendsBanner({ locale, district }: MarketTrendsBannerProps) {
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/80 p-5">
      <h2 className="text-lg font-semibold text-teal-900">{t("marketTrendsBannerTitle", locale)}</h2>
      <p className="mt-1 text-sm text-teal-800">
        {district
          ? t("marketTrendsBannerDistrict", locale)
          : t("marketTrendsBannerDesc", locale)}
      </p>
      <Link
        href={lp("/market")}
        className="mt-3 inline-block rounded-xl bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
      >
        {t("marketTrendsBannerCta", locale)}
      </Link>
    </div>
  );
}
