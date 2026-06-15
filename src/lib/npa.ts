import { prisma } from "@/lib/db";
import { filterListings } from "@/lib/listings";
import type { Property } from "@/types/property";

export async function getNpaBankNames(): Promise<string[]> {
  if (!process.env.DATABASE_URL) return [];

  try {
    const rows = await prisma.userProperty.findMany({
      where: {
        status: "published",
        propertyType: "npa",
        npaBank: { not: null },
      },
      select: { npaBank: true },
      distinct: ["npaBank"],
      orderBy: { npaBank: "asc" },
    });

    return rows
      .map((r) => r.npaBank?.trim())
      .filter((name): name is string => !!name);
  } catch {
    return [];
  }
}

export async function getNpaListings(options?: {
  listingType?: "sale" | "rent";
  npaBank?: string;
}): Promise<Property[]> {
  const listingType = options?.listingType;
  const npaBank = options?.npaBank?.trim();

  const sale = listingType !== "rent"
    ? await filterListings({ listingType: "sale", propertyType: "npa" })
    : [];
  const rent = listingType !== "sale"
    ? await filterListings({ listingType: "rent", propertyType: "npa" })
    : [];

  let listings = listingType === "sale" ? sale : listingType === "rent" ? rent : [...sale, ...rent];

  if (npaBank) {
    listings = listings.filter(
      (p) => p.npaBank?.toLowerCase() === npaBank.toLowerCase(),
    );
  }

  return listings;
}
