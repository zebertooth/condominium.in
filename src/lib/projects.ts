import { prisma } from "@/lib/db";
import { dbPropertyToListing } from "@/lib/user-properties";
import type { Property } from "@/types/property";

export interface ProjectView {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  developer: string;
  location: string;
  district: string;
  btsStation?: string;
  amenities: string[];
  totalUnits?: number;
  completionDate?: string;
  imageUrl: string;
  description: string;
  descriptionEn: string;
  published: boolean;
  listingCount?: number;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
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

export async function uniqueProjectSlug(name: string, excludeId?: string): Promise<string> {
  const base = slugify(name) || "project";
  let slug = base;
  let i = 1;

  while (true) {
    const existing = await prisma.project.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) break;
    slug = `${base}-${i++}`;
  }

  return slug;
}

type DbProject = {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  developer: string;
  location: string;
  district: string;
  btsStation: string | null;
  amenities: string;
  totalUnits: number | null;
  completionDate: Date | null;
  imageUrl: string;
  description: string;
  descriptionEn: string;
  published: boolean;
  _count?: { properties: number };
};

export function dbProjectToView(row: DbProject): ProjectView {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameEn: row.nameEn,
    developer: row.developer,
    location: row.location,
    district: row.district,
    btsStation: row.btsStation ?? undefined,
    amenities: parseJsonArray(row.amenities),
    totalUnits: row.totalUnits ?? undefined,
    completionDate: row.completionDate?.toISOString().slice(0, 10),
    imageUrl: row.imageUrl,
    description: row.description,
    descriptionEn: row.descriptionEn,
    published: row.published,
    listingCount: row._count?.properties,
  };
}

export function localizedProjectName(project: ProjectView, locale: string): string {
  if (locale !== "th" && project.nameEn) return project.nameEn;
  return project.name;
}

export function localizedProjectDescription(project: ProjectView, locale: string): string {
  if (locale !== "th" && project.descriptionEn) return project.descriptionEn;
  return project.description;
}

export async function getAllProjects(): Promise<ProjectView[]> {
  const rows = await prisma.project.findMany({
    orderBy: [{ name: "asc" }],
    include: { _count: { select: { properties: { where: { status: "published" } } } } },
  });
  return rows.map(dbProjectToView);
}

export async function getPublishedProjects(): Promise<ProjectView[]> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    orderBy: [{ name: "asc" }],
    include: { _count: { select: { properties: { where: { status: "published" } } } } },
  });
  return rows.map(dbProjectToView);
}

export async function getPublishedProjectBySlug(slug: string): Promise<ProjectView | null> {
  const row = await prisma.project.findFirst({
    where: { slug, published: true },
    include: { _count: { select: { properties: { where: { status: "published" } } } } },
  });
  return row ? dbProjectToView(row) : null;
}

export async function getProjectListings(projectId: string): Promise<Property[]> {
  const rows = await prisma.userProperty.findMany({
    where: { projectId, status: "published" },
    orderBy: [{ isSponsored: "desc" }, { createdAt: "desc" }],
    include: {
      user: { select: { id: true, fullName: true, phone: true, email: true, role: true } },
      project: { select: { slug: true, name: true, nameEn: true } },
    },
  });

  return rows.map((row) => {
    const listing = dbPropertyToListing(row);
    if (row.project) {
      listing.projectSlug = row.project.slug;
      listing.projectName = row.project.name;
      listing.projectNameEn = row.project.nameEn;
    }
    return listing;
  });
}

export async function getPublishedProjectSlugs(): Promise<{ slug: string; updatedAt: Date }[]> {
  return prisma.project.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
  });
}

/** Picker options for post/edit forms */
export async function getProjectPickerOptions(): Promise<
  { id: string; name: string; nameEn: string }[]
> {
  const rows = await prisma.project.findMany({
    where: { published: true },
    select: { id: true, name: true, nameEn: true },
    orderBy: { name: "asc" },
  });
  return rows;
}

export async function validateProjectId(projectId?: string | null): Promise<string | null> {
  if (!projectId) return null;
  const project = await prisma.project.findFirst({
    where: { id: projectId, published: true },
    select: { id: true },
  });
  return project?.id ?? null;
}
