import { Suspense } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { PropertyCategoryFilter } from "@/components/property/PropertyCategoryFilter";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertySearch } from "@/components/property/PropertySearch";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { parsePropertyCategory } from "@/lib/property-types";
import { createMetadata } from "@/lib/seo";
import { filterListings } from "@/lib/listings";
import { getSiteSettings } from "@/lib/site-settings";

interface RentPageProps {
  searchParams: Promise<{ category?: string }>;
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
  const { category: categoryParam } = await searchParams;
  const category = parsePropertyCategory(categoryParam);

  const [listings, locale, settings] = await Promise.all([
    filterListings({ listingType: "rent", propertyCategory: category }),
    getLocale(),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("rentPageTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t("rentPageDesc", locale)}</p>

      <div className="mt-6">
        <AdSlot position="listingTop" format="auto" />
      </div>

      <div className="mt-8 max-w-3xl">
        <PropertySearch defaultType="rent" />
      </div>

      <div className="mt-6">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
          <PropertyCategoryFilter />
        </Suspense>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          {t("allRentListings", locale)} ({listings.length})
        </h2>
        <PropertyGrid
          properties={listings}
          locale={locale}
          listingType="rent"
          infeedSlotId={settings.adSlots.listingInfeed}
        />
      </div>
    </div>
  );
}
