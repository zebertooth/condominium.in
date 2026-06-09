import { prisma } from "@/lib/db";
import type { Property } from "@/types/property";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u0E00-\u0E7F\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);
}

export async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title) || "property";
  let slug = base;
  let i = 1;

  while (await prisma.userProperty.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  return slug;
}

type DbProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  listingType: string;
  propertyType: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  floor: number | null;
  district: string;
  btsStation: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  features: string;
  images: string;
  status: string;
  isSponsored: boolean;
  sponsoredUntil: Date | null;
  createdAt: Date;
};

export function dbPropertyToListing(p: DbProperty): Property {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleEn: p.title,
    description: p.description,
    listingType: p.listingType as Property["listingType"],
    propertyType: p.propertyType as Property["propertyType"],
    price: p.price,
    priceUnit: p.priceUnit as Property["priceUnit"],
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    areaSqm: p.areaSqm,
    floor: p.floor ?? undefined,
    district: p.district,
    districtEn: p.district,
    btsStation: p.btsStation ?? undefined,
    address: p.address,
    latitude: p.latitude ?? undefined,
    longitude: p.longitude ?? undefined,
    features: JSON.parse(p.features) as string[],
    images: JSON.parse(p.images) as string[],
    featured: p.isSponsored,
    publishedAt: p.createdAt.toISOString().slice(0, 10),
    status: p.status as Property["status"],
  };
}

export async function getAllPublishedUserProperties(): Promise<Property[]> {
  const now = new Date();
  const rows = await prisma.userProperty.findMany({
    where: { status: "published" },
    orderBy: [{ isSponsored: "desc" }, { createdAt: "desc" }],
  });

  return rows.map((p) =>
    dbPropertyToListing({
      ...p,
      isSponsored: p.isSponsored && (!p.sponsoredUntil || p.sponsoredUntil > now),
    }),
  );
}

export async function getUserPropertyBySlug(slug: string): Promise<Property | null> {
  const p = await prisma.userProperty.findFirst({
    where: { slug, status: "published" },
  });
  if (!p) return null;
  return dbPropertyToListing(p);
}
