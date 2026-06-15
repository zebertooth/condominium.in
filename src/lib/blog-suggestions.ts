import { getLatestListings, getRecommendedListings } from "@/lib/listings";
import type { Property } from "@/types/property";

export const BLOG_SUGGESTED_LIMIT = 6;

/** Listings for blog hub + article footers — featured first, else latest. */
export async function getBlogSuggestedListings(
  limit = BLOG_SUGGESTED_LIMIT,
): Promise<Property[]> {
  const recommended = await getRecommendedListings();
  if (recommended.length >= 3) return recommended.slice(0, limit);
  return getLatestListings(limit);
}

export const BLOG_COVER_FALLBACK =
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80";
