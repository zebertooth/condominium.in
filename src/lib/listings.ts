import { properties as staticProperties } from "@/lib/properties";
import { getPropertySearchText } from "@/lib/property-search-text";
import { isPropertyFurnished } from "@/lib/furnishing";
import { shouldShowDemoListings } from "@/lib/demo-listings";
import { sortListings } from "@/lib/listing-sort";
import { getPriceReducedSlugSet } from "@/lib/price-history";
import { CATEGORY_PROPERTY_TYPES } from "@/lib/property-types";
import {
  getAllPublishedUserProperties,
  getUserPropertyBySlugVisible,
  type PropertyViewer,
} from "@/lib/user-properties";
import { getOwnerPropertyStats } from "@/lib/analytics";
import type { Property, SearchFilters } from "@/types/property";

export const HOME_LISTINGS_LIMIT = 6;

async function enrichWithPriceReduced(list: Property[]): Promise<Property[]> {
  const userSlugs = list.filter((p) => p.isUserListing).map((p) => p.slug);
  if (userSlugs.length === 0) return list;
  try {
    const reduced = await getPriceReducedSlugSet(userSlugs);
    return list.map((p) => ({ ...p, priceReduced: reduced.has(p.slug) }));
  } catch {
    return list;
  }
}

function sortListingsFeaturedFirst(list: Property[]): Property[] {
  return sortListings(list, "recommended");
}

export async function getAllListings(): Promise<Property[]> {
  const [userListings, showDemos] = await Promise.all([
    getAllPublishedUserProperties(),
    shouldShowDemoListings(),
  ]);
  const demos = showDemos ? staticProperties : [];
  return enrichWithPriceReduced(sortListingsFeaturedFirst([...userListings, ...demos]));
}

export async function getListingsBySlugs(slugs: string[]): Promise<Property[]> {
  const unique = [...new Set(slugs.map((s) => decodeURIComponent(s).trim()).filter(Boolean))];
  const results = await Promise.all(unique.map((slug) => getListingBySlug(slug)));
  return results.filter((p): p is Property => p !== undefined);
}

export async function getListingBySlug(
  slug: string,
  viewer?: PropertyViewer,
): Promise<Property | undefined> {
  const normalized = decodeURIComponent(slug).trim();
  const userListing = await getUserPropertyBySlugVisible(normalized, viewer);
  if (userListing) return userListing;

  const demo = staticProperties.find((p) => p.slug === normalized);
  if (!demo) return undefined;
  if (!(await shouldShowDemoListings())) return undefined;
  return demo;
}

function applyFilters(list: Property[], filters: SearchFilters): Property[] {
  return list.filter((p) => {
    if (filters.listingType && p.listingType !== filters.listingType) return false;
    if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
    if (filters.propertyCategory && filters.propertyCategory !== "all") {
      const allowed = CATEGORY_PROPERTY_TYPES[filters.propertyCategory];
      if (!allowed.includes(p.propertyType)) return false;
    }
    if (filters.district && p.district !== filters.district) return false;
    if (filters.btsStation && p.btsStation !== filters.btsStation) return false;
    if (filters.bedrooms && p.bedrooms < filters.bedrooms) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.minSqm && p.areaSqm < filters.minSqm) return false;
    if (filters.maxSqm && p.areaSqm > filters.maxSqm) return false;
    if (filters.furnishing === "furnished" && !isPropertyFurnished(p)) return false;
    if (filters.furnishing === "unfurnished" && isPropertyFurnished(p)) return false;
    if (filters.query) {
      const tokens = filters.query.toLowerCase().split(/[\s,]+/).filter((t) => t.length >= 2);
      const haystack = getPropertySearchText(p);
      if (tokens.length > 0 && !tokens.some((t) => haystack.includes(t))) return false;
    }
    return true;
  });
}

export async function filterListings(filters: SearchFilters): Promise<Property[]> {
  const all = await getAllListings();
  const filtered = applyFilters(all, filters);
  return sortListings(filtered, filters.sort ?? "recommended");
}

export async function getFeaturedListings(): Promise<Property[]> {
  const all = await getAllListings();
  return all.filter((p) => p.featured).slice(0, HOME_LISTINGS_LIMIT);
}

/** ประกาศแนะนำ — active sponsored / featured listings for homepage. */
export async function getRecommendedListings(): Promise<Property[]> {
  return getFeaturedListings();
}

/** ประกาศล่าสุด — newest published listings. */
export async function getLatestListings(limit = HOME_LISTINGS_LIMIT): Promise<Property[]> {
  const all = await getAllListings();
  return [...all]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, limit);
}

/** ยอดนิยม — most viewed listings (falls back to newest when no view data). */
export async function getPopularListings(limit = HOME_LISTINGS_LIMIT): Promise<Property[]> {
  const all = await getAllListings();
  if (all.length === 0) return [];

  const slugs = all.map((p) => p.slug);
  const stats = await getOwnerPropertyStats(slugs);

  return [...all]
    .sort((a, b) => {
      const viewsDiff = (stats[b.slug]?.viewsCount ?? 0) - (stats[a.slug]?.viewsCount ?? 0);
      if (viewsDiff !== 0) return viewsDiff;
      return b.publishedAt.localeCompare(a.publishedAt);
    })
    .slice(0, limit);
}
