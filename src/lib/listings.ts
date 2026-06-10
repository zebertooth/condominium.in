import { properties as staticProperties } from "@/lib/properties";
import {
  getAllPublishedUserProperties,
  getUserPropertyBySlugVisible,
  type PropertyViewer,
} from "@/lib/user-properties";
import type { Property, SearchFilters } from "@/types/property";

export async function getAllListings(): Promise<Property[]> {
  const userListings = await getAllPublishedUserProperties();
  return [...userListings, ...staticProperties];
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
      const q = filters.query.toLowerCase();
      const haystack = [
        p.title,
        p.titleEn,
        p.description,
        p.district,
        p.btsStation ?? "",
        p.address,
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export async function filterListings(filters: SearchFilters): Promise<Property[]> {
  const all = await getAllListings();
  return applyFilters(all, filters);
}

export async function getFeaturedListings(): Promise<Property[]> {
  const all = await getAllListings();
  return all.filter((p) => p.featured);
}
