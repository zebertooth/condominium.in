import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { localePath } from "@/lib/locale-routing";
import { createMetadata, siteConfig } from "@/lib/seo";
import { resolveStationHub, stationHubStaticParams } from "@/lib/station-seo";
import { getTransitLine } from "@/lib/transit-stations";

interface BuyStationHubProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return stationHubStaticParams();
}

export async function generateMetadata({ params }: BuyStationHubProps) {
  const { id } = await params;
  const station = resolveStationHub(id);
  if (!station) return {};

  const locale = await getLocale();
  const stationName = locale === "th" ? station.name : station.nameEn;
  const line = getTransitLine(station.lineId);
  const lineName = locale === "th" ? line.nameTh : line.nameEn;

  return createMetadata({
    title: tf("stationHubBuyTitle", locale, { station: stationName, line: lineName }),
    description: tf("stationHubBuyDesc", locale, { station: stationName, line: lineName }),
    path: `/buy/station/${encodeURIComponent(station.id)}`,
    keywords: ["ซื้อคอนโด", station.name, line.prefix],
    locale,
  });
}

export default async function BuyStationHubPage({ params, searchParams }: BuyStationHubProps) {
  const [{ id }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const station = resolveStationHub(id);
  if (!station) notFound();

  const line = getTransitLine(station.lineId);
  const stationName = locale === "th" ? station.name : station.nameEn;
  const lineName = locale === "th" ? line.nameTh : line.nameEn;
  const hubPath = `/buy/station/${encodeURIComponent(station.id)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: tf("stationHubBuyTitle", locale, { station: stationName, line: lineName }),
    description: tf("stationHubBuyDesc", locale, { station: stationName, line: lineName }),
    url: `${siteConfig.url}${localePath(hubPath, locale)}`,
    isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <ListingResultsLayout
        listingType="sale"
        basePath={hubPath}
        lockedBts={station.name}
        searchParams={query}
        heading={tf("stationHubBuyTitle", locale, { station: stationName, line: lineName })}
        description={tf("stationHubBuyDesc", locale, { station: stationName, line: lineName })}
        hubIntro={tf("stationHubIntro", locale, {
          station: station.label,
          line: lineName,
        })}
        resultsTitle={t("allSaleListings", locale)}
      />
    </>
  );
}
