import Link from "next/link";
import { MarketTrendsTable } from "@/components/market/MarketTrendsTable";
import { formatPrice, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { isNonThaiLocale, numberLocale } from "@/lib/locale-content";
import { getMarketOverview } from "@/lib/market-trends";
import { createMetadata } from "@/lib/seo";
import type { ListingType } from "@/types/property";

interface MarketPageProps {
  searchParams: Promise<{ type?: string }>;
}

function parseListingType(raw?: string): ListingType {
  return raw === "rent" ? "rent" : "sale";
}

export async function generateMetadata({ searchParams }: MarketPageProps) {
  const { type } = await searchParams;
  const listingType = parseListingType(type);
  const locale = await getLocale();
  const isRent = listingType === "rent";

  return createMetadata({
    title: isRent ? t("marketTitleRent", locale) : t("marketTitleSale", locale),
    description: t("marketSubtitle", locale),
    path: `/market${isRent ? "?type=rent" : ""}`,
    keywords: ["ราคาคอนโด", "แนวโน้มราคา", "BTS", "กรุงเทพ", "market trends"],
    locale,
  });
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default async function MarketPage({ searchParams }: MarketPageProps) {
  const { type } = await searchParams;
  const listingType = parseListingType(type);
  const [overview, locale] = await Promise.all([
    getMarketOverview(listingType),
    getLocale(),
  ]);

  const priceUnit = listingType === "rent" ? ("THB/month" as const) : ("THB" as const);
  const numLoc = numberLocale(locale);
  const nonTh = isNonThaiLocale(locale);
  const updated = overview.updatedAt.toLocaleDateString(numLoc, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const tabClass = (active: boolean) =>
    active
      ? "rounded-full bg-teal-600 px-4 py-2 text-sm font-semibold text-white"
      : "rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("marketTitle", locale)}</h1>
      <p className="mt-2 max-w-3xl text-slate-600">{t("marketSubtitle", locale)}</p>
      <p className="mt-2 text-sm text-slate-500">
        {t("marketUpdated", locale)}: {updated}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/market" className={tabClass(listingType === "sale")}>
          {t("marketSaleTab", locale)}
        </Link>
        <Link href="/market?type=rent" className={tabClass(listingType === "rent")}>
          {t("marketRentTab", locale)}
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label={t("marketTotalListings", locale)}
          value={overview.totalListings.toLocaleString(numLoc)}
        />
        <StatCard
          label={t("marketAvgPrice", locale)}
          value={overview.totalListings ? formatPrice(overview.avgPrice, priceUnit, locale) : "—"}
        />
        <StatCard
          label={t("marketDistricts", locale)}
          value={overview.districtCount.toLocaleString(numLoc)}
        />
        <StatCard
          label={t("marketPriceReduced", locale)}
          value={overview.priceReducedCount.toLocaleString(numLoc)}
          hint={
            overview.recentPriceDropEvents > 0
              ? nonTh
                ? `${overview.recentPriceDropEvents} price cuts (30d)`
                : `ปรับลง ${overview.recentPriceDropEvents} ครั้ง (30 วัน)`
              : undefined
          }
        />
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          {listingType === "rent" ? t("marketByDistrictRent", locale) : t("marketByDistrictSale", locale)}
        </h2>
        <p className="mt-2 text-sm text-slate-600">{t("marketTableHint", locale)}</p>
        <div className="mt-6">
          <MarketTrendsTable overview={overview} locale={locale} />
        </div>
      </section>

      <div className="mt-10 rounded-2xl bg-slate-900 px-6 py-8 text-white">
        <h2 className="text-lg font-bold">{t("marketCtaTitle", locale)}</h2>
        <p className="mt-2 max-w-2xl text-slate-300">{t("marketCtaDesc", locale)}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={listingType === "rent" ? "/rent" : "/buy"}
            className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-medium hover:bg-teal-400"
          >
            {listingType === "rent" ? t("rent", locale) : t("buy", locale)} →
          </Link>
          <Link
            href="/map"
            className="rounded-xl border border-slate-600 px-5 py-2.5 text-sm font-medium hover:bg-slate-800"
          >
            {t("navMap", locale)} →
          </Link>
        </div>
      </div>
    </div>
  );
}
