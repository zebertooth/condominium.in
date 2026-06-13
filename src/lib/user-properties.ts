import { prisma } from "@/lib/db";
import { resolveListingContactMode } from "@/lib/contact-routing";
import { parseModerationFlags } from "@/lib/listing-moderation";
import { properties as staticProperties } from "@/lib/properties";
import type { Property } from "@/types/property";

const staticSlugs = new Set(staticProperties.map((p) => p.slug));

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

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

  while (
    staticSlugs.has(slug) ||
    (await prisma.userProperty.findUnique({ where: { slug } }))
  ) {
    slug = `${base}-${i++}`;
  }

  return slug;
}

type DbProperty = {
  id: string;
  slug: string;
  title: string;
  description: string;
  titleEn: string;
  descriptionEn: string;
  titleZh: string;
  descriptionZh: string;
  titleJa: string;
  descriptionJa: string;
  titleAr: string;
  descriptionAr: string;
  highlights: string;
  listingType: string;
  propertyType: string;
  price: number;
  priceUnit: string;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  landSqWah: number | null;
  floor: number | null;
  district: string;
  btsStation: string | null;
  address: string;
  latitude: number | null;
  longitude: number | null;
  npaBank: string | null;
  npaReferenceUrl: string | null;
  features: string;
  images: string;
  status: string;
  needsReview?: boolean;
  moderationFlags?: string;
  isSponsored: boolean;
  sponsoredUntil: Date | null;
  agentManaged: boolean;
  projectId?: string | null;
  createdAt: Date;
  user?: {
    id?: string;
    fullName: string;
    phone: string | null;
    email: string | null;
    role?: string;
  };
  project?: {
    slug: string;
    name: string;
    nameEn: string;
  } | null;
};

export function isActiveSponsor(
  isSponsored: boolean,
  sponsoredUntil: Date | null,
  now = new Date(),
): boolean {
  return isSponsored && (!sponsoredUntil || sponsoredUntil > now);
}

export function dbPropertyToListing(p: DbProperty): Property {
  const poster =
    p.user && p.user.id && p.user.role
      ? {
          userId: p.user.id,
          fullName: p.user.fullName,
          phone: p.user.phone ?? undefined,
          email: p.user.email ?? undefined,
          role: p.user.role,
        }
      : undefined;

  const posterRole = poster?.role ?? "user";
  const agentManaged = p.agentManaged ?? false;
  const ownerDirect = resolveListingContactMode(posterRole, agentManaged) === "owner_direct";
  const activeSponsor = isActiveSponsor(p.isSponsored, p.sponsoredUntil);

  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    titleEn: p.titleEn,
    description: p.description,
    descriptionEn: p.descriptionEn || undefined,
    titleZh: p.titleZh || undefined,
    descriptionZh: p.descriptionZh || undefined,
    titleJa: p.titleJa || undefined,
    descriptionJa: p.descriptionJa || undefined,
    titleAr: p.titleAr || undefined,
    descriptionAr: p.descriptionAr || undefined,
    highlights: p.highlights || undefined,
    listingType: p.listingType as Property["listingType"],
    propertyType: p.propertyType as Property["propertyType"],
    price: p.price,
    priceUnit: p.priceUnit as Property["priceUnit"],
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    areaSqm: p.areaSqm,
    landSqWah: p.landSqWah ?? undefined,
    floor: p.floor ?? undefined,
    district: p.district,
    districtEn: p.district,
    btsStation: p.btsStation ?? undefined,
    address: p.address,
    latitude: p.latitude ?? undefined,
    longitude: p.longitude ?? undefined,
    npaBank: p.npaBank ?? undefined,
    npaReferenceUrl: p.npaReferenceUrl ?? undefined,
    features: parseJsonArray(p.features),
    images: parseJsonArray(p.images),
    featured: activeSponsor,
    sponsoredUntil: p.sponsoredUntil?.toISOString() ?? undefined,
    publishedAt: p.createdAt.toISOString().slice(0, 10),
    status: p.status as Property["status"],
    needsReview: p.needsReview ?? false,
    moderationFlags: parseModerationFlags(p.moderationFlags),
    poster,
    contactMode: ownerDirect ? "owner_direct" : "agent_team",
    agentManaged,
    isUserListing: true,
    projectId: p.projectId ?? undefined,
    projectSlug: p.project?.slug,
    projectName: p.project?.name,
    projectNameEn: p.project?.nameEn,
  };
}

const userSelect = {
  id: true,
  fullName: true,
  phone: true,
  email: true,
  role: true,
} as const;

const projectSelect = {
  slug: true,
  name: true,
  nameEn: true,
} as const;

export async function getAllPublishedUserProperties(): Promise<Property[]> {
  const rows = await prisma.userProperty.findMany({
    where: { status: "published" },
    orderBy: [{ isSponsored: "desc" }, { createdAt: "desc" }],
    include: { user: { select: userSelect }, project: { select: projectSelect } },
  });

  return rows.map((p) => dbPropertyToListing(p));
}

export async function getUserPropertyBySlug(slug: string): Promise<Property | null> {
  return getUserPropertyBySlugVisible(slug, { publishedOnly: true });
}

export interface PropertyViewer {
  userId?: string;
  isAdmin?: boolean;
}

/** Public: published only. Owner/admin: can preview pending/rejected listings. */
export async function getUserPropertyBySlugVisible(
  slug: string,
  viewer?: PropertyViewer & { publishedOnly?: boolean },
): Promise<Property | null> {
  const normalized = decodeURIComponent(slug).trim();
  const p = await prisma.userProperty.findFirst({
    where: { slug: normalized },
    include: { user: { select: userSelect }, project: { select: projectSelect } },
  });
  if (!p || p.status === "deleted") return null;

  if (p.status === "published") {
    return dbPropertyToListing(p);
  }

  if (viewer?.publishedOnly) return null;

  const isOwner = viewer?.userId && p.userId === viewer.userId;
  if (viewer?.isAdmin || isOwner) {
    return dbPropertyToListing(p);
  }

  return null;
}
