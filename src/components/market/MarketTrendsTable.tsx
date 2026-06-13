import Link from "next/link";
import { formatPrice, t, type Locale } from "@/lib/i18n";
import type { DistrictMarketStats, MarketOverview } from "@/lib/market-trends";

function districtLabel(row: DistrictMarketStats, locale: Locale): string {
  return locale === "th" ? row.district : row.districtEn;
}

interface MarketTrendsTableProps {
  overview: MarketOverview;
  locale: Locale;
}

export function MarketTrendsTable({ overview, locale }: MarketTrendsTableProps) {
  if (overview.districts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-600">
        {t("marketEmpty", locale)}
      </p>
    );
  }

  const maxAvg = Math.max(...overview.districts.map((d) => d.avgPrice), 1);
  const listingPath = overview.listingType === "rent" ? "/rent" : "/buy";
  const priceUnit = overview.listingType === "rent" ? "THB/month" as const : "THB" as const;

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">{t("marketDistrict", locale)}</th>
            <th className="px-4 py-3 font-medium">{t("marketCount", locale)}</th>
            <th className="px-4 py-3 font-medium">{t("marketAvg", locale)}</th>
            <th className="px-4 py-3 font-medium">{t("marketMedian", locale)}</th>
            <th className="px-4 py-3 font-medium">{t("marketRange", locale)}</th>
            <th className="px-4 py-3 font-medium">{t("marketReduced", locale)}</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {overview.districts.map((row) => {
            const barWidth = Math.max(8, Math.round((row.avgPrice / maxAvg) * 100));
            return (
              <tr key={row.district} className="border-b border-slate-100 last:border-0">
                <td className="px-4 py-4">
                  <p className="font-medium text-slate-900">{districtLabel(row, locale)}</p>
                  <div className="mt-2 h-1.5 w-full max-w-[12rem] rounded-full bg-slate-100">
                    <div
                      className="h-1.5 rounded-full bg-teal-500"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-700">{row.listingCount}</td>
                <td className="px-4 py-4 font-semibold text-teal-700">
                  {formatPrice(row.avgPrice, priceUnit, locale)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {formatPrice(row.medianPrice, priceUnit, locale)}
                </td>
                <td className="px-4 py-4 text-slate-600">
                  {formatPrice(row.minPrice, priceUnit, locale)}
                  {" – "}
                  {formatPrice(row.maxPrice, priceUnit, locale)}
                </td>
                <td className="px-4 py-4">
                  {row.priceReducedCount > 0 ? (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                      {row.priceReducedCount}
                    </span>
                  ) : (
                    <span className="text-slate-400">—</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`${listingPath}?district=${encodeURIComponent(row.district)}`}
                    className="font-medium text-teal-700 hover:underline"
                  >
                    {t("marketViewListings", locale)} →
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
