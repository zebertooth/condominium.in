import { getAreaBySlug } from "@/lib/areas";
import { getAllListings, getListingsBySlugs } from "@/lib/listings";
import { stationMatchesFilter } from "@/lib/station-match";
import type { BlogPost, Property } from "@/types/property";

const REVIEW_RELATED_LIMIT = 6;

/** Related listings for review articles — explicit slugs, else area/project match. */
export async function getReviewRelatedListings(post: BlogPost): Promise<Property[]> {
  const explicit = post.relatedSlugs ?? [];
  if (explicit.length > 0) {
    return (await getListingsBySlugs(explicit)).slice(0, REVIEW_RELATED_LIMIT);
  }

  const listings = await getAllListings();
  let pool = listings.filter((p) => !p.isDemo);

  if (post.areaSlug) {
    const area = getAreaBySlug(post.areaSlug);
    if (area) {
      const byStation = pool.filter((p) =>
        stationMatchesFilter(p.btsStation, area.btsStation),
      );
      if (byStation.length > 0) pool = byStation;
    }
  }

  if (post.projectSlug) {
    const byProject = pool.filter((p) => p.projectSlug === post.projectSlug);
    if (byProject.length > 0) pool = byProject;
  }

  return pool.slice(0, REVIEW_RELATED_LIMIT);
}
