import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

const RENT_UNDER_PRESETS = ["15000", "25000", "40000", "60000"] as const;

interface RentUnderPageProps {
  params: Promise<{ price: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return RENT_UNDER_PRESETS.map((price) => ({ price }));
}

export async function generateMetadata({ params }: RentUnderPageProps) {
  const { price } = await params;
  const maxPrice = parseInt(price, 10);
  if (!maxPrice) return {};

  const locale = await getLocale();
  const formatted = maxPrice.toLocaleString(locale === "th" ? "th-TH" : "en-US");

  return createMetadata({
    title: tf("rentUnderTitle", locale, { price: formatted }),
    description: tf("rentUnderDesc", locale, { price: formatted }),
    path: `/rent/under/${price}`,
    keywords: ["เช่าคอนโด", "เช่าถูก", "BTS"],
    locale,
  });
}

export default async function RentUnderPage({ params, searchParams }: RentUnderPageProps) {
  const [{ price }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const maxPrice = parseInt(price, 10);
  if (!maxPrice || !RENT_UNDER_PRESETS.includes(price as (typeof RENT_UNDER_PRESETS)[number])) {
    notFound();
  }

  const formatted = maxPrice.toLocaleString(locale === "th" ? "th-TH" : "en-US");

  return (
    <ListingResultsLayout
      listingType="rent"
      basePath={`/rent/under/${price}`}
      searchParams={{ ...query, price: `0-${maxPrice}` }}
      heading={tf("rentUnderTitle", locale, { price: formatted })}
      description={tf("rentUnderDesc", locale, { price: formatted })}
      resultsTitle={t("allRentListings", locale)}
    />
  );
}
