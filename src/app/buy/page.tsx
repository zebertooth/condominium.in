import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";
import type { ListingSearchParams } from "@/lib/listing-search-params";

interface BuyPageProps {
  searchParams: Promise<ListingSearchParams>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "ซื้อคอนโดกรุงเทพ ใกล้ BTS",
    description:
      "รวมประกาศขายคอนโดและบ้านในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI นัดชมทรัพย์จริงกับทีมเอเจนต์",
    path: "/buy",
    keywords: ["ซื้อคอนโด", "ขายคอนโด", "คอนโดกรุงเทพ"],
  });
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const locale = await getLocale();

  return (
    <ListingResultsLayout
      listingType="sale"
      basePath="/buy"
      searchParams={params}
      heading={t("buyPageTitle", locale)}
      description={t("buyPageDesc", locale)}
      resultsTitle={t("allSaleListings", locale)}
    />
  );
}
