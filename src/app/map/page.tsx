import { Suspense } from "react";
import Link from "next/link";
import { AdvancedFilters } from "@/components/property/AdvancedFilters";
import { PropertyCategoryFilter } from "@/components/property/PropertyCategoryFilter";
import { PropertyListingsMap } from "@/components/property/PropertyListingsMap";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { parsePropertyCategory } from "@/lib/property-types";
import { createMetadata } from "@/lib/seo";
import { filterListings } from "@/lib/listings";

interface MapPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    bts?: string;
    district?: string;
    price?: string;
    beds?: string;
  }>;
}

export async function generateMetadata() {
  return createMetadata({
    title: "Map Search | Condominium.in.th",
    description: "ค้นหาคอนโดและบ้านบนแผนที่ ดูตำแหน่งทรัพย์ใกล้ BTS และสถานที่สำคัญ",
    path: "/map",
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

export default async function MapPage({ searchParams }: MapPageProps) {
  const params = await searchParams;
  const listingType = (params.type === "sale" ? "sale" : "rent") as "sale" | "rent";
  const category = parsePropertyCategory(params.category);
  const { minPrice, maxPrice } = parsePriceRange(params.price);
  const bedrooms = params.beds ? parseInt(params.beds, 10) : undefined;

  const [listings, locale] = await Promise.all([
    filterListings({
      listingType,
      propertyCategory: category,
      btsStation: params.bts,
      district: params.district,
      minPrice,
      maxPrice,
      bedrooms,
    }),
    getLocale(),
  ]);

  const propertiesWithCoords = listings.filter((p) => p.latitude && p.longitude);
  const nonTh = locale !== "th";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {nonTh ? "Map Search" : "ค้นหาบนแผนที่"}
          </h1>
          <p className="mt-1 text-slate-600">
            {nonTh
              ? `${propertiesWithCoords.length} properties with location`
              : `${propertiesWithCoords.length} ทรัพย์มีพิกัด`}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/map?type=rent${params.category ? `&category=${params.category}` : ""}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              listingType === "rent"
                ? "bg-teal-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {t("rent", locale)}
          </Link>
          <Link
            href={`/map?type=sale${params.category ? `&category=${params.category}` : ""}`}
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
          <MapAdvancedFilters listingType={listingType} currentCategory={category} />
        </Suspense>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <PropertyListingsMap properties={propertiesWithCoords} locale={locale} />
      </div>

      {propertiesWithCoords.length === 0 && (
        <div className="mt-6 rounded-xl bg-amber-50 p-6 text-center">
          <p className="text-amber-800">
            {nonTh
              ? "No properties with location data found. Try adjusting your filters."
              : "ไม่พบทรัพย์ที่มีข้อมูลพิกัด ลองปรับตัวกรองใหม่"}
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-4">
        <Link
          href={listingType === "rent" ? "/rent" : "/buy"}
          className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {nonTh ? "View as list" : "ดูแบบรายการ"}
        </Link>
      </div>
    </div>
  );
}

function MapAdvancedFilters({
  listingType,
  currentCategory,
}: {
  listingType: "sale" | "rent";
  currentCategory?: string;
}) {
  return <AdvancedFilters listingType={listingType} currentCategory={currentCategory} basePath="/map" />;
}
