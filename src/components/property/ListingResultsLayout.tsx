import { Suspense } from "react";
import { AdSlot } from "@/components/ads/AdSlot";
import { AdvancedFilters } from "@/components/property/AdvancedFilters";
import { CreateAlertButton } from "@/components/property/CreateAlertButton";
import { ListingSortBar } from "@/components/property/ListingSortBar";
import { ListingViewToggle } from "@/components/property/ListingViewToggle";
import { PropertyCategoryFilter } from "@/components/property/PropertyCategoryFilter";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { PropertyListingsMapLazy } from "@/components/property/PropertyListingsMapLazy";
import { PropertySearch } from "@/components/property/PropertySearch";
import { getCurrentUser } from "@/lib/auth";
import { getUserSavedSlugs } from "@/lib/favorites";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import {
  hasActiveListingFilters,
  isMapView,
  parseListingSearchParams,
  type ListingSearchParams,
} from "@/lib/listing-search-params";
import { filterListings } from "@/lib/listings";
import { getSiteSettings } from "@/lib/site-settings";
import type { ListingType } from "@/types/property";

interface ListingResultsLayoutProps {
  listingType: ListingType;
  basePath: string;
  searchParams: ListingSearchParams;
  heading: string;
  description: string;
  resultsTitle: string;
  lockedBts?: string;
  showSearch?: boolean;
  showAds?: boolean;
}

export async function ListingResultsLayout({
  listingType,
  basePath,
  searchParams,
  heading,
  description,
  resultsTitle,
  showSearch = true,
  showAds = true,
  lockedBts,
}: ListingResultsLayoutProps) {
  const filters = parseListingSearchParams(
    lockedBts ? { ...searchParams, bts: lockedBts } : searchParams,
    listingType,
  );
  const category = filters.propertyCategory ?? "all";
  const mapView = isMapView(searchParams);

  const [listings, settings, user, locale] = await Promise.all([
    filterListings(filters),
    getSiteSettings(),
    getCurrentUser(),
    getLocale(),
  ]);

  const savedSlugs = user ? await getUserSavedSlugs(user.id) : undefined;
  const hasFilters = hasActiveListingFilters(searchParams);
  const mapListings = listings.filter((p) => p.latitude && p.longitude);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{heading}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{description}</p>

      {showAds && (
        <div className="mt-6">
          <AdSlot position="listingTop" format="auto" />
        </div>
      )}

      {showSearch && (
        <div className="mt-8 max-w-3xl">
          <PropertySearch defaultType={listingType} />
        </div>
      )}

      <div className="mt-6">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
          <PropertyCategoryFilter />
        </Suspense>
      </div>

      <div className="mt-4">
        <Suspense fallback={<div className="h-12 animate-pulse rounded-2xl bg-slate-100" />}>
          <AdvancedFilters
            listingType={listingType}
            currentCategory={category}
            basePath={basePath}
            lockedBts={lockedBts}
          />
        </Suspense>
      </div>

      <div className="mt-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-slate-900">
            {resultsTitle} ({listings.length})
            {hasFilters && (
              <span className="ml-2 text-base font-normal text-slate-500">
                {locale === "th" ? "- กรองแล้ว" : "- filtered"}
              </span>
            )}
          </h2>
          <div className="flex flex-wrap items-center gap-3">
            <Suspense fallback={<div className="h-10 w-36 animate-pulse rounded-lg bg-slate-100" />}>
              <ListingSortBar basePath={basePath} />
            </Suspense>
            <Suspense fallback={<div className="h-10 w-28 animate-pulse rounded-lg bg-slate-100" />}>
              <ListingViewToggle basePath={basePath} />
            </Suspense>
            {user && (
              <Suspense fallback={null}>
                <CreateAlertButton listingType={listingType} locale={locale} />
              </Suspense>
            )}
          </div>
        </div>

        {mapView ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <PropertyListingsMapLazy properties={mapListings} locale={locale} />
            {mapListings.length === 0 && (
              <p className="mt-4 text-center text-sm text-amber-800">{t("mapPageEmpty", locale)}</p>
            )}
          </div>
        ) : (
          <PropertyGrid
            properties={listings}
            locale={locale}
            listingType={listingType}
            infeedSlotId={settings.adSlots.listingInfeed}
            showSaveButtons={!!user}
            savedSlugs={savedSlugs}
          />
        )}
      </div>
    </div>
  );
}
