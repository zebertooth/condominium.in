import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { btsHubStaticParams, resolveBtsGuide } from "@/lib/bts-seo";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

interface BuyBtsHubProps {
  params: Promise<{ station: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return btsHubStaticParams();
}

export async function generateMetadata({ params }: BuyBtsHubProps) {
  const { station } = await params;
  const guide = resolveBtsGuide(station);
  if (!guide) return {};

  const locale = await getLocale();
  const stationName = locale === "th" ? guide.name : guide.nameEn;

  return createMetadata({
    title: tf("btsHubBuyTitle", locale, { station: stationName }),
    description: tf("btsHubBuyDesc", locale, { station: stationName }),
    path: `/buy/bts/${station.replace(/-bts$/, "")}`,
    keywords: ["ซื้อคอนโด", guide.btsStation, "BTS"],
    locale,
  });
}

export default async function BuyBtsHubPage({ params, searchParams }: BuyBtsHubProps) {
  const [{ station }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const guide = resolveBtsGuide(station);
  if (!guide) notFound();

  const hubStation = station.replace(/-bts$/, "");
  const stationName = locale === "th" ? guide.name : guide.nameEn;

  return (
    <ListingResultsLayout
      listingType="sale"
      basePath={`/buy/bts/${hubStation}`}
      lockedBts={guide.btsStation}
      searchParams={query}
      heading={tf("btsHubBuyTitle", locale, { station: stationName })}
      description={tf("btsHubBuyDesc", locale, { station: stationName })}
      resultsTitle={t("allSaleListings", locale)}
    />
  );
}
