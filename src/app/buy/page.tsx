import { Suspense } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdvancedFilters } from "@/components/property/AdvancedFilters";
import { CreateAlertButton } from "@/components/property/CreateAlertButton";
import { PropertyCategoryFilter } from "@/components/property/PropertyCategoryFilter";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertySearch } from "@/components/property/PropertySearch";
import { getCurrentUser } from "@/lib/auth";
import { getUserSavedSlugs } from "@/lib/favorites";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePathWithQuery } from "@/lib/locale-routing";
import { parsePropertyCategory } from "@/lib/property-types";
import { createMetadata } from "@/lib/seo";
import { filterListings } from "@/lib/listings";
import { getSiteSettings } from "@/lib/site-settings";

interface BuyPageProps {
  searchParams: Promise<{
    category?: string;
    bts?: string;
    district?: string;
    price?: string;
    beds?: string;
  }>;
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

function parsePriceRange(price?: string): { minPrice?: number; maxPrice?: number } {
  if (!price) return {};
  const [minStr, maxStr] = price.split("-");
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  return {
    minPrice: min > 0 ? min : undefined,
    maxPrice: max > 0 ? max : undefined,
  };
}

export default async function BuyPage({ searchParams }: BuyPageProps) {
  const params = await searchParams;
  const category = parsePropertyCategory(params.category);
  const { minPrice, maxPrice } = parsePriceRange(params.price);
  const bedrooms = params.beds ? parseInt(params.beds, 10) : undefined;

  const [listings, locale, settings, user] = await Promise.all([
    filterListings({
      listingType: "sale",
      propertyCategory: category,
      btsStation: params.bts,
      district: params.district,
      minPrice,
      maxPrice,
      bedrooms,
    }),
    getLocale(),
    getSiteSettings(),
    getCurrentUser(),
  ]);

  const savedSlugs = user ? await getUserSavedSlugs(user.id) : undefined;
  const hasFilters = params.bts || params.district || params.price || params.beds;

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

      <div className="mt-4">
        <Suspense fallback={<div className="h-12 animate-pulse rounded-2xl bg-slate-100" />}>
          <AdvancedFilters listingType="sale" currentCategory={category} />
        </Suspense>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {t("allSaleListings", locale)} ({listings.length})
            {hasFilters && (
              <span className="ml-2 text-base font-normal text-slate-500">
                {locale === "th" ? "- กรองแล้ว" : "- filtered"}
              </span>
            )}
          </h2>
          <a
            href={localePathWithQuery("/map", locale, {
              type: "sale",
              category: params.category,
            })}
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            {locale === "th" ? "ดูบนแผนที่" : "View on map"}
          </a>
          {user && (
            <Suspense fallback={null}>
              <CreateAlertButton listingType="sale" locale={locale} />
            </Suspense>
          )}
        </div>
        <PropertyGrid
          properties={listings}
          locale={locale}
          listingType="sale"
          infeedSlotId={settings.adSlots.listingInfeed}
          showSaveButtons={!!user}
          savedSlugs={savedSlugs}
        />
      </div>
    </div>
  );
}
