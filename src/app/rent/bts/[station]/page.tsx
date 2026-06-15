import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { btsHubStaticParams, resolveBtsGuide } from "@/lib/bts-seo";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

interface RentBtsHubProps {
  params: Promise<{ station: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return btsHubStaticParams();
}

export async function generateMetadata({ params }: RentBtsHubProps) {
  const { station } = await params;
  const guide = resolveBtsGuide(station);
  if (!guide) return {};

  const locale = await getLocale();
  const stationName = locale === "th" ? guide.name : guide.nameEn;

  return createMetadata({
    title: tf("btsHubRentTitle", locale, { station: stationName }),
    description: tf("btsHubRentDesc", locale, { station: stationName }),
    path: `/rent/bts/${station.replace(/-bts$/, "")}`,
    keywords: ["เช่าคอนโด", guide.btsStation, "BTS"],
    locale,
  });
}

export default async function RentBtsHubPage({ params, searchParams }: RentBtsHubProps) {
  const [{ station }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const guide = resolveBtsGuide(station);
  if (!guide) notFound();

  const hubStation = station.replace(/-bts$/, "");
  const stationName = locale === "th" ? guide.name : guide.nameEn;

  return (
    <ListingResultsLayout
      listingType="rent"
      basePath={`/rent/bts/${hubStation}`}
      lockedBts={guide.btsStation}
      searchParams={query}
      heading={tf("btsHubRentTitle", locale, { station: stationName })}
      description={tf("btsHubRentDesc", locale, { station: stationName })}
      resultsTitle={t("allRentListings", locale)}
    />
  );
}
