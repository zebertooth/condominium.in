import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { districtStaticParams, getDistrictBySlug } from "@/lib/bangkok-districts";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

interface BuyDistrictHubProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return districtStaticParams();
}

export async function generateMetadata({ params }: BuyDistrictHubProps) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  if (!district) return {};

  const locale = await getLocale();
  const name = locale === "th" ? district.labelTh : district.labelEn;

  return createMetadata({
    title: tf("districtHubBuyTitle", locale, { district: name }),
    description: tf("districtHubBuyDesc", locale, { district: name }),
    path: `/buy/district/${district.slug}`,
    keywords: ["ซื้อคอนโด", district.nameTh, "เขตกรุงเทพ"],
    locale,
  });
}

export default async function BuyDistrictHubPage({ params, searchParams }: BuyDistrictHubProps) {
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const district = getDistrictBySlug(slug);
  if (!district) notFound();

  const name = locale === "th" ? district.labelTh : district.labelEn;

  return (
    <ListingResultsLayout
      listingType="sale"
      basePath={`/buy/district/${district.slug}`}
      lockedDistrict={district.nameTh}
      searchParams={query}
      heading={tf("districtHubBuyTitle", locale, { district: name })}
      description={tf("districtHubBuyDesc", locale, { district: name })}
      resultsTitle={t("allSaleListings", locale)}
      mapFocusDistrict={district}
    />
  );
}
