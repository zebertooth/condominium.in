import { parseListingSort } from "@/lib/listing-sort";
import { parsePropertyCategory } from "@/lib/property-types";
import type { FurnishingFilter, ListingType, SearchFilters } from "@/types/property";

export type ListingSearchParams = {
  category?: string;
  bts?: string;
  district?: string;
  price?: string;
  beds?: string;
  sqm?: string;
  furnish?: string;
  sort?: string;
  view?: string;
};

export function parsePriceRange(price?: string): { minPrice?: number; maxPrice?: number } {
  if (!price) return {};
  const [minStr, maxStr] = price.split("-");
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  return {
    minPrice: min > 0 ? min : undefined,
    maxPrice: max > 0 ? max : undefined,
  };
}

export function parseSqmRange(sqm?: string): { minSqm?: number; maxSqm?: number } {
  if (!sqm) return {};
  const [minStr, maxStr] = sqm.split("-");
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  return {
    minSqm: min > 0 ? min : undefined,
    maxSqm: max > 0 ? max : undefined,
  };
}

export function parseFurnishing(value?: string): FurnishingFilter | undefined {
  if (value === "furnished" || value === "unfurnished") return value;
  return undefined;
}

export function parseListingSearchParams(
  params: ListingSearchParams,
  listingType: ListingType,
): SearchFilters {
  const { minPrice, maxPrice } = parsePriceRange(params.price);
  const { minSqm, maxSqm } = parseSqmRange(params.sqm);
  const bedrooms = params.beds ? parseInt(params.beds, 10) : undefined;

  return {
    listingType,
    propertyCategory: parsePropertyCategory(params.category),
    btsStation: params.bts,
    district: params.district,
    minPrice,
    maxPrice,
    minSqm,
    maxSqm,
    furnishing: parseFurnishing(params.furnish),
    bedrooms: bedrooms && bedrooms > 0 ? bedrooms : undefined,
    sort: parseListingSort(params.sort),
  };
}

export function listingQueryFromParams(
  params: ListingSearchParams,
  overrides?: Partial<ListingSearchParams>,
): Record<string, string | undefined> {
  const merged = { ...params, ...overrides };
  return {
    category: merged.category,
    bts: merged.bts,
    district: merged.district,
    price: merged.price,
    beds: merged.beds,
    sqm: merged.sqm,
    furnish: merged.furnish,
    sort: merged.sort && merged.sort !== "recommended" ? merged.sort : undefined,
    view: merged.view && merged.view !== "list" ? merged.view : undefined,
  };
}

export function hasActiveListingFilters(params: ListingSearchParams): boolean {
  return !!(
    params.bts ||
    params.district ||
    params.price ||
    params.beds ||
    params.sqm ||
    params.furnish
  );
}

export function isMapView(params: ListingSearchParams): boolean {
  return params.view === "map";
}
