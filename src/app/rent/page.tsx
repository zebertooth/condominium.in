import { ListingResultsLayout } from "@/components/property/ListingResultsLayout";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";
import type { ListingSearchParams } from "@/lib/listing-search-params";

interface RentPageProps {
  searchParams: Promise<ListingSearchParams>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "เช่าคอนโดกรุงเทพ ใกล้ BTS",
    description:
      "รวมประกาศเช่าคอนโดในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI หาทรัพย์ที่ตรงงบ นัดชมจริงกับทีมเอเจนต์",
    path: "/rent",
    keywords: ["เช่าคอนโด", "เช่าคอนโดกรุงเทพ", "คอนโดใกล้ BTS"],
  });
}

export default async function RentPage({ searchParams }: RentPageProps) {
  const params = await searchParams;
  const locale = await getLocale();

  return (
    <ListingResultsLayout
      listingType="rent"
      basePath="/rent"
      searchParams={params}
      heading={t("rentPageTitle", locale)}
      description={t("rentPageDesc", locale)}
      resultsTitle={t("allRentListings", locale)}
    />
  );
}
