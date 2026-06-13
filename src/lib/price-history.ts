import { prisma } from "@/lib/db";

export type PriceChangeType = "initial" | "increase" | "decrease" | "update";

export interface PriceHistoryEntry {
  id: string;
  price: number;
  listingType: string;
  changeType: PriceChangeType;
  createdAt: Date;
}

function resolveChangeType(
  price: number,
  listingType: string,
  previous?: { price: number; listingType: string } | null,
): PriceChangeType | null {
  if (!previous) return "initial";
  if (price > previous.price) return "increase";
  if (price < previous.price) return "decrease";
  if (listingType !== previous.listingType) return "update";
  return null;
}

export async function logPriceChange(
  propertyId: string,
  price: number,
  listingType: string,
  previous?: { price: number; listingType: string } | null,
): Promise<void> {
  const changeType = resolveChangeType(price, listingType, previous);
  if (!changeType) return;

  await prisma.priceHistory.create({
    data: {
      propertyId,
      price,
      listingType,
      changeType,
    },
  });
}

export async function getPriceHistoryBySlug(slug: string): Promise<PriceHistoryEntry[]> {
  const property = await prisma.userProperty.findUnique({
    where: { slug },
    select: { id: true },
  });
  if (!property) return [];

  const rows = await prisma.priceHistory.findMany({
    where: { propertyId: property.id },
    orderBy: { createdAt: "asc" },
  });

  return rows.map((row) => ({
    id: row.id,
    price: row.price,
    listingType: row.listingType,
    changeType: row.changeType as PriceChangeType,
    createdAt: row.createdAt,
  }));
}

const REDUCTION_WINDOW_DAYS = 30;

export function isRecentPriceReduction(history: PriceHistoryEntry[]): boolean {
  if (history.length < 2) return false;
  const last = history[history.length - 1];
  if (last.changeType !== "decrease") return false;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - REDUCTION_WINDOW_DAYS);
  return last.createdAt >= cutoff;
}

export async function getPriceReducedSlugSet(slugs: string[]): Promise<Set<string>> {
  if (slugs.length === 0) return new Set();

  const properties = await prisma.userProperty.findMany({
    where: { slug: { in: slugs } },
    select: { id: true, slug: true },
  });
  if (properties.length === 0) return new Set();

  const idToSlug = new Map(properties.map((p) => [p.id, p.slug]));
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - REDUCTION_WINDOW_DAYS);

  const recentDecreases = await prisma.priceHistory.findMany({
    where: {
      propertyId: { in: properties.map((p) => p.id) },
      changeType: "decrease",
      createdAt: { gte: cutoff },
    },
    select: { propertyId: true },
    distinct: ["propertyId"],
  });

  const reduced = new Set<string>();
  for (const row of recentDecreases) {
    const slug = idToSlug.get(row.propertyId);
    if (slug) reduced.add(slug);
  }
  return reduced;
}
