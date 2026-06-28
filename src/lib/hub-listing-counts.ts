import {
  BANGKOK_DISTRICTS,
  districtFilterValue,
  type BangkokDistrict,
} from "@/lib/bangkok-districts";
import { districtMatchesFilter } from "@/lib/district-match";
import { getAllListings } from "@/lib/listings";
import { stationMatchesFilter } from "@/lib/station-match";
import {
  TRANSIT_STATIONS,
  stationFilterValue,
  type TransitStation,
} from "@/lib/transit-stations";

export type ListingTypeCount = { sale: number; rent: number };

export interface HubListingCounts {
  byDistrictSlug: Record<string, ListingTypeCount>;
  byStationId: Record<string, ListingTypeCount>;
}

function emptyCount(): ListingTypeCount {
  return { sale: 0, rent: 0 };
}

let cached: HubListingCounts | null = null;
let cachedAt = 0;
const CACHE_MS = 60_000;

/** Count published listings per district slug and transit station id (single DB pass). */
export async function getHubListingCounts(): Promise<HubListingCounts> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_MS) return cached;

  const listings = await getAllListings();
  const byDistrictSlug: Record<string, ListingTypeCount> = Object.fromEntries(
    BANGKOK_DISTRICTS.map((d) => [d.slug, emptyCount()]),
  );
  const byStationId: Record<string, ListingTypeCount> = Object.fromEntries(
    TRANSIT_STATIONS.map((s) => [s.id, emptyCount()]),
  );

  for (const listing of listings) {
    for (const district of BANGKOK_DISTRICTS) {
      if (districtMatchesFilter(listing.district, districtFilterValue(district))) {
        byDistrictSlug[district.slug][listing.listingType]++;
        break;
      }
    }

    if (listing.btsStation) {
      for (const station of TRANSIT_STATIONS) {
        if (stationMatchesFilter(listing.btsStation, stationFilterValue(station))) {
          byStationId[station.id][listing.listingType]++;
          break;
        }
      }
    }
  }

  cached = { byDistrictSlug, byStationId };
  cachedAt = now;
  return cached;
}

export function districtCountLabel(
  counts: ListingTypeCount,
  locale: string,
): string {
  const total = counts.sale + counts.rent;
  if (locale === "th") {
    if (total === 0) return "ยังไม่มีประกาศ";
    return `${total} ประกาศ (ขาย ${counts.sale} · เช่า ${counts.rent})`;
  }
  if (total === 0) return "No listings yet";
  return `${total} listings (${counts.sale} sale · ${counts.rent} rent)`;
}

export function stationCountLabel(
  counts: ListingTypeCount,
  locale: string,
): string {
  return districtCountLabel(counts, locale);
}

export function countForDistrict(
  counts: HubListingCounts,
  district: BangkokDistrict,
): ListingTypeCount {
  return counts.byDistrictSlug[district.slug] ?? emptyCount();
}

export function countForStation(
  counts: HubListingCounts,
  station: TransitStation,
): ListingTypeCount {
  return counts.byStationId[station.id] ?? emptyCount();
}
