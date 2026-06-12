import Link from "next/link";
import { t, type Locale, defaultLocale } from "@/lib/i18n";

export function DemoListingBanner({ locale = defaultLocale }: { locale?: Locale }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      <p className="font-medium">{t("demoListingBannerTitle", locale)}</p>
      <p className="mt-1 text-amber-900">{t("demoListingBannerDesc", locale)}</p>
    </div>
  );
}

export function ListingsEmptyState({
  locale = defaultLocale,
  listingType,
}: {
  locale?: Locale;
  listingType?: "sale" | "rent";
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
      <p className="text-lg font-medium text-slate-900">{t("noPropertiesFound", locale)}</p>
      <p className="mt-2 text-slate-600">{t("noPropertiesFoundHint", locale)}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          href="/list-property"
          className="rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          {t("listProperty", locale)}
        </Link>
        <Link
          href={`/ai-search?type=${listingType ?? "rent"}`}
          className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-800 hover:bg-white"
        >
          {t("aiSearch", locale)}
        </Link>
      </div>
    </div>
  );
}
