import { properties as staticProperties } from "@/lib/properties";
import { getPropertySearchText } from "@/lib/property-search-text";
import {
  getAllPublishedUserProperties,
  getUserPropertyBySlugVisible,
  type PropertyViewer,
} from "@/lib/user-properties";
import type { Property, SearchFilters } from "@/types/property";

function sortListingsFeaturedFirst(list: Property[]): Property[] {
  return [...list].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.publishedAt.localeCompare(a.publishedAt);
  });
}

export async function getAllListings(): Promise<Property[]> {
  const userListings = await getAllPublishedUserProperties();
  return sortListingsFeaturedFirst([...userListings, ...staticProperties]);
}

export async function getListingBySlug(
  slug: string,
  viewer?: PropertyViewer,
): Promise<Property | undefined> {
  const normalized = decodeURIComponent(slug).trim();
  const userListing = await getUserPropertyBySlugVisible(normalized, viewer);
  if (userListing) return userListing;
  return staticProperties.find((p) => p.slug === normalized);
}

function applyFilters(list: Property[], filters: SearchFilters): Property[] {
  return list.filter((p) => {
    if (filters.listingType && p.listingType !== filters.listingType) return false;
    if (filters.district && p.district !== filters.district) return false;
    if (filters.btsStation && p.btsStation !== filters.btsStation) return false;
    if (filters.bedrooms && p.bedrooms < filters.bedrooms) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
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
  return sortListingsFeaturedFirst(applyFilters(all, filters));
}

export async function getFeaturedListings(): Promise<Property[]> {
  const all = await getAllListings();
  return all.filter((p) => p.featured);
}
