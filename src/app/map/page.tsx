import { Suspense } from "react";
import Link from "next/link";
import { AdvancedFilters } from "@/components/property/AdvancedFilters";
import { PropertyCategoryFilter } from "@/components/property/PropertyCategoryFilter";
import { PropertyListingsMapLazy } from "@/components/property/PropertyListingsMapLazy";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath, localePathWithQuery } from "@/lib/locale-routing";
import { parseListingSearchParams, type ListingSearchParams } from "@/lib/listing-search-params";
import { filterListings } from "@/lib/listings";
import { createMetadata } from "@/lib/seo";

interface MapPageProps {
  searchParams: Promise<
    ListingSearchParams & {
      type?: string;
    }
  >;
}

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title: t("mapPageTitle", locale),
    description: t("mapPageMetaDesc", locale),
    path: "/map",
    locale,
  });
}

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const listingType = (params.type === "sale" ? "sale" : "rent") as "sale" | "rent";
  const filters = parseListingSearchParams(params, listingType);

  const [listings, locale] = await Promise.all([filterListings(filters), getLocale()]);

  const propertiesWithCoords = listings.filter((p) => p.latitude && p.longitude);
  const category = filters.propertyCategory ?? "all";
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("mapPageTitle", locale)}</h1>
          <p className="mt-1 text-slate-600">
            {tf("mapPageCount", locale, { count: propertiesWithCoords.length })}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={localePathWithQuery("/map", locale, { ...params, type: "rent" })}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              listingType === "rent"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t("rent", locale)}
          </Link>
          <Link
            href={localePathWithQuery("/map", locale, { ...params, type: "sale" })}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              listingType === "sale"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t("buy", locale)}
          </Link>
        </div>
      </div>

      <div className="mb-6 space-y-4">
        <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-slate-100" />}>
          <PropertyCategoryFilter />
        </Suspense>
        <Suspense fallback={<div className="h-12 animate-pulse rounded-2xl bg-slate-100" />}>
          <AdvancedFilters listingType={listingType} currentCategory={category} basePath="/map" />
        </Suspense>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <PropertyListingsMapLazy properties={propertiesWithCoords} locale={locale} />
      </div>

      {propertiesWithCoords.length === 0 && (
        <div className="mt-6 rounded-xl bg-amber-50 p-6 text-center">
          <p className="text-amber-800">{t("mapPageEmpty", locale)}</p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <Link
          href={localePathWithQuery(listingType === "rent" ? "/rent" : "/buy", locale, params)}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {t("mapPageViewList", locale)}
        </Link>
      </div>
    </div>
  );
}
