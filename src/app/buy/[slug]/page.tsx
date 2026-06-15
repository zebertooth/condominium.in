import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

const BEDROOM_HUBS = ["1", "2", "3"] as const;

interface BuyBedroomHubProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return BEDROOM_HUBS.map((beds) => ({ slug: `${beds}-bedroom` }));
}

function parseBedroomHub(slug: string): string | null {
  const match = slug.match(/^(\d+)-bedroom$/);
  if (!match) return null;
  const beds = match[1];
  return BEDROOM_HUBS.includes(beds as (typeof BEDROOM_HUBS)[number]) ? beds : null;
}

export async function generateMetadata({ params }: BuyBedroomHubProps) {
  const { slug } = await params;
  const beds = parseBedroomHub(slug);
  if (!beds) return {};

  const locale = await getLocale();
  return createMetadata({
    title: tf("buyBedroomTitle", locale, { beds }),
    description: tf("buyBedroomDesc", locale, { beds }),
    path: `/buy/${slug}`,
    keywords: ["ซื้อคอนโด", `${beds} ห้องนอน`, "BTS"],
    locale,
  });
}

export default async function BuyBedroomHubPage({ params, searchParams }: BuyBedroomHubProps) {
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const beds = parseBedroomHub(slug);
  if (!beds) notFound();

  return (
    <ListingResultsLayout
      listingType="sale"
      basePath={`/buy/${slug}`}
      searchParams={{ ...query, beds }}
      heading={tf("buyBedroomTitle", locale, { beds })}
      description={tf("buyBedroomDesc", locale, { beds })}
      resultsTitle={t("allSaleListings", locale)}
    />
  );
}
