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

interface BuyPageProps {
  searchParams: Promise<{ category?: string }>;
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
  const { category: categoryParam } = await searchParams;
  const category = parsePropertyCategory(categoryParam);

  const [listings, locale, settings] = await Promise.all([
    filterListings({ listingType: "sale", propertyCategory: category }),
    getLocale(),
    getSiteSettings(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("buyPageTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{t("buyPageDesc", locale)}</p>

      <div className="mt-6">
        <AdSlot position="listingTop" format="auto" />
      </div>

      <div className="mt-8 max-w-3xl">
        <PropertySearch defaultType="sale" />
      </div>

      <div className="mt-6">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
          <PropertyCategoryFilter />
        </Suspense>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold text-slate-900">
          {t("allSaleListings", locale)} ({listings.length})
        </h2>
        <PropertyGrid
          properties={listings}
          locale={locale}
          listingType="sale"
          infeedSlotId={settings.adSlots.listingInfeed}
        />
      </div>
    </div>
  );
}
