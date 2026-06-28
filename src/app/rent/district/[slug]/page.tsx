import { notFound } from "next/navigation";
import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { districtStaticParams, getDistrictBySlug } from "@/lib/bangkok-districts";
import { tf, t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import type { ListingSearchParams } from "@/lib/listing-search-params";
import { createMetadata } from "@/lib/seo";

interface RentDistrictHubProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ListingSearchParams>;
}

export async function generateStaticParams() {
  return districtStaticParams();
}

export async function generateMetadata({ params }: RentDistrictHubProps) {
  const { slug } = await params;
  const district = getDistrictBySlug(slug);
  if (!district) return {};

  const locale = await getLocale();
  const name = locale === "th" ? district.labelTh : district.labelEn;

  return createMetadata({
    title: tf("districtHubRentTitle", locale, { district: name }),
    description: tf("districtHubRentDesc", locale, { district: name }),
    path: `/rent/district/${district.slug}`,
    keywords: ["เช่าคอนโด", district.nameTh, "เขตกรุงเทพ"],
    locale,
  });
}

export default async function RentDistrictHubPage({ params, searchParams }: RentDistrictHubProps) {
  const [{ slug }, query, locale] = await Promise.all([params, searchParams, getLocale()]);
  const district = getDistrictBySlug(slug);
  if (!district) notFound();

  const name = locale === "th" ? district.labelTh : district.labelEn;

  return (
    <ListingResultsLayout
      listingType="rent"
      basePath={`/rent/district/${district.slug}`}
      lockedDistrict={district.nameTh}
      searchParams={query}
      heading={tf("districtHubRentTitle", locale, { district: name })}
      description={tf("districtHubRentDesc", locale, { district: name })}
      resultsTitle={t("allRentListings", locale)}
      mapFocusDistrict={district}
    />
  );
}
