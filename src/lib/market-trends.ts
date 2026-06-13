import { getAllListings } from "@/lib/listings";
import { prisma } from "@/lib/db";
import type { ListingType, Property } from "@/types/property";

/** District Thai → English labels (aligned with AdvancedFilters). */
export const DISTRICT_LABEL_EN: Record<string, string> = {
  วัฒนา: "Watthana",
  บางรัก: "Bang Rak",
  ราชเทวี: "Ratchathewi",
  สาทร: "Sathorn",
  ปทุมวัน: "Pathumwan",
  พญาไท: "Phayathai",
  ห้วยขวาง: "Huai Khwang",
  คลองเตย: "Khlong Toei",
  ดินแดง: "Din Daeng",
  จตุจักร: "Chatuchak",
};

export interface DistrictMarketStats {
  district: string;
  districtEn: string;
  listingCount: number;
  avgPrice: number;
  medianPrice: number;
  minPrice: number;
  maxPrice: number;
  priceReducedCount: number;
}

export interface MarketOverview {
  listingType: ListingType;
  totalListings: number;
  avgPrice: number;
  medianPrice: number;
  districtCount: number;
  priceReducedCount: number;
  recentPriceDropEvents: number;
  districts: DistrictMarketStats[];
  updatedAt: Date;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function aggregateDistricts(listings: Property[]): DistrictMarketStats[] {
  const byDistrict = new Map<string, Property[]>();

  for (const listing of listings) {
    const district = listing.district?.trim() || "อื่นๆ";
    const bucket = byDistrict.get(district) ?? [];
    bucket.push(listing);
    byDistrict.set(district, bucket);
  }

  return [...byDistrict.entries()]
    .map(([district, props]) => {
      const prices = props.map((p) => p.price);
      return {
        district,
        districtEn: DISTRICT_LABEL_EN[district] ?? district,
        listingCount: props.length,
        avgPrice: Math.round(prices.reduce((sum, p) => sum + p, 0) / prices.length),
        medianPrice: median(prices),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        priceReducedCount: props.filter((p) => p.priceReduced).length,
      };
    })
    .sort((a, b) => b.listingCount - a.listingCount);
}

async function countRecentPriceDropEvents(): Promise<number> {
  if (!process.env.DATABASE_URL) return 0;
  try {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    return await prisma.priceHistory.count({
      where: {
        changeType: "decrease",
        createdAt: { gte: cutoff },
        property: { status: "published" },
      },
    });
  } catch {
    return 0;
  }
}

export async function getMarketOverview(listingType: ListingType): Promise<MarketOverview> {
  const all = await getAllListings();
  const listings = all.filter((p) => p.listingType === listingType);
  const prices = listings.map((p) => p.price);
  const districts = aggregateDistricts(listings);
  const recentPriceDropEvents = await countRecentPriceDropEvents();

  return {
    listingType,
    totalListings: listings.length,
    avgPrice: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0,
    medianPrice: median(prices),
    districtCount: districts.length,
    priceReducedCount: listings.filter((p) => p.priceReduced).length,
    recentPriceDropEvents,
    districts,
    updatedAt: new Date(),
  };
}
