import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "@/lib/db";
import { parseCsv, validateAndParseRow, type ImportResult } from "@/lib/csv-import";
import { normalizeListingImages, parseListingImageUrls } from "@/lib/listing-images";
import { logPriceChange } from "@/lib/price-history";
import { notifySearchAlertsForPublishedListing } from "@/lib/search-alert-digest";
import {
  validateAndParseProjectRow,
  type ProjectImportResult,
} from "@/lib/project-csv-import";
import { uniqueProjectSlug } from "@/lib/projects";
import { dbPropertyToListing, uniqueSlug } from "@/lib/user-properties";

async function resolveProjectId(projectSlug?: string): Promise<{ id: string } | { error: string } | null> {
  if (!projectSlug) return null;

  const project = await prisma.project.findFirst({
    where: { slug: projectSlug.trim() },
    select: { id: true },
  });

  if (!project) {
    return { error: `Project not found: "${projectSlug}"` };
  }

  return { id: project.id };
}

export interface ImportListingsOptions {
  /** Default `published` (admin import). User bulk import uses `pending`. */
  status?: "pending" | "published";
  agentManaged?: boolean;
}

export async function importListingsCsv(
  content: string,
  userId: string,
  options: ImportListingsOptions = {},
): Promise<ImportResult> {
  const status = options.status ?? "published";
  const agentManaged = options.agentManaged ?? status === "published";
  const { headers, rows } = parseCsv(content);

  if (headers.length === 0) {
    return { success: false, imported: 0, errors: [{ row: 0, message: "Empty CSV file" }] };
  }

  const result: ImportResult = {
    success: true,
    imported: 0,
    errors: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const values = rows[i];

    if (values.every((v) => !v.trim())) continue;

    const parsed = validateAndParseRow(headers, values, rowNum);

    if (parsed.error) {
      result.errors.push({ row: rowNum, message: parsed.error });
      continue;
    }

    if (!parsed.data) continue;

    const data = parsed.data;

    try {
      const projectResult = await resolveProjectId(data.projectSlug);
      if (projectResult && "error" in projectResult) {
        result.errors.push({ row: rowNum, message: projectResult.error });
        continue;
      }

      const slug = await uniqueSlug(data.title);

      const features = data.features
        ? data.features.split(",").map((f) => f.trim()).filter(Boolean)
        : [];

      const furnishingValues = ["furnished", "unfurnished", "partially", "unknown"] as const;
      const furnishingRaw = data.furnishing?.trim().toLowerCase();
      const furnishing =
        furnishingRaw && furnishingValues.includes(furnishingRaw as (typeof furnishingValues)[number])
          ? furnishingRaw
          : "unknown";

      const imageUrls = parseListingImageUrls(data.images);
      if (data.images?.trim() && imageUrls.length === 0) {
        result.errors.push({
          row: rowNum,
          message:
            "No valid image URLs in images column (need https://…). If features contain commas, wrap that column in double quotes.",
        });
        continue;
      }
      const images = normalizeListingImages(imageUrls);

      const created = await prisma.userProperty.create({
        data: {
          userId,
          slug,
          title: data.title,
          titleEn: data.titleEn ?? "",
          description: data.description,
          descriptionEn: data.descriptionEn ?? "",
          highlights: data.highlights || "",
          listingType: data.listingType,
          propertyType: data.propertyType,
          price: data.price,
          priceUnit: data.priceUnit,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          areaSqm: data.areaSqm,
          landSqWah: data.landSqWah,
          floor: data.floor,
          district: data.district,
          btsStation: data.btsStation,
          address: data.address,
          latitude: data.latitude,
          longitude: data.longitude,
          npaBank: data.npaBank,
          npaReferenceUrl: data.npaReferenceUrl,
          projectId: projectResult && "id" in projectResult ? projectResult.id : null,
          features: JSON.stringify(features),
          furnishing,
          images: JSON.stringify(images),
          status,
          needsReview: status === "pending",
          agentManaged,
        },
      });
      await logPriceChange(created.id, data.price, data.listingType);

      if (status === "published") {
        void notifySearchAlertsForPublishedListing(dbPropertyToListing(created)).catch((err) => {
          console.error("[search-alerts] import notify failed", err);
        });
      }

      result.imported++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      result.errors.push({ row: rowNum, message: `Database error: ${message}` });
    }
  }

  result.success = result.errors.length === 0;
  return result;
}

export async function importProjectsCsv(content: string): Promise<ProjectImportResult> {
  const { headers, rows } = parseCsv(content);

  if (headers.length === 0) {
    return { success: false, imported: 0, errors: [{ row: 0, message: "Empty CSV file" }] };
  }

  const result: ProjectImportResult = {
    success: true,
    imported: 0,
    errors: [],
  };

  for (let i = 0; i < rows.length; i++) {
    const rowNum = i + 2;
    const values = rows[i];

    if (values.every((v) => !v.trim())) continue;

    const parsed = validateAndParseProjectRow(headers, values, rowNum);

    if (parsed.error) {
      result.errors.push({ row: rowNum, message: parsed.error });
      continue;
    }

    if (!parsed.data) continue;

    const data = parsed.data;

    try {
      const slug = data.slug ? await uniqueProjectSlug(data.slug) : await uniqueProjectSlug(data.name);

      const amenities = data.amenities
        ? data.amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : [];

      await prisma.project.create({
        data: {
          slug,
          name: data.name,
          nameEn: data.nameEn ?? "",
          developer: data.developer,
          location: data.location,
          district: data.district ?? "",
          btsStation: data.btsStation,
          description: data.description ?? "",
          descriptionEn: data.descriptionEn ?? "",
          imageUrl: data.imageUrl ?? "",
          amenities: JSON.stringify(amenities),
          totalUnits: data.totalUnits,
          completionDate: data.completionDate ? new Date(data.completionDate) : null,
          published: data.published ?? true,
        },
      });

      result.imported++;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      result.errors.push({ row: rowNum, message: `Database error: ${message}` });
    }
  }

  result.success = result.errors.length === 0;
  return result;
}

/** Mark the newest published listings as sponsored (homepage ประกาศแนะนำ). */
export async function sponsorLatestListings(count: number, days = 30): Promise<number> {
  const until = new Date();
  until.setDate(until.getDate() + days);
  until.setHours(23, 59, 59, 999);

  const listings = await prisma.userProperty.findMany({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
    take: count,
    select: { id: true },
  });

  if (listings.length === 0) return 0;

  await prisma.userProperty.updateMany({
    where: { id: { in: listings.map((l) => l.id) } },
    data: {
      isSponsored: true,
      sponsoredUntil: until,
      sponsorReminder3dAt: null,
      sponsorReminder1dAt: null,
    },
  });

  return listings.length;
}

export async function resolveImportAdminUserId(): Promise<string> {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (adminEmail) {
    const byEmail = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, role: true },
    });
    if (byEmail?.role === "admin") return byEmail.id;
  }

  const admin = await prisma.user.findFirst({
    where: { role: "admin" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  if (!admin) {
    throw new Error("No admin user found — run npm run db:seed first");
  }

  return admin.id;
}

export interface StarterImportOptions {
  force?: boolean;
  sponsor?: number;
  listingsOnly?: boolean;
  projectsOnly?: boolean;
}

export interface StarterImportResult {
  publishedBefore: number;
  publishedAfter: number;
  projects: ProjectImportResult | null;
  listings: ImportResult | null;
  sponsored: number;
  skipped: { projects?: string; listings?: string };
}

function readStarterCsv(name: "starter-projects.csv" | "starter-listings.csv"): string {
  return readFileSync(join(process.cwd(), "public", "inventory", name), "utf8");
}

/** One-click starter pack — same data as `npm run db:import-inventory`. */
export async function runStarterInventoryImport(
  options: StarterImportOptions = {},
): Promise<StarterImportResult> {
  const { force = false, sponsor = 0, listingsOnly = false, projectsOnly = false } = options;
  const adminUserId = await resolveImportAdminUserId();

  const publishedBefore = await prisma.userProperty.count({ where: { status: "published" } });
  const projectCount = await prisma.project.count();

  let projects: ProjectImportResult | null = null;
  let listings: ImportResult | null = null;
  const skipped: StarterImportResult["skipped"] = {};

  if (!listingsOnly && projectCount >= 5 && !force) {
    skipped.projects = `${projectCount} projects already exist`;
  } else if (!listingsOnly) {
    projects = await importProjectsCsv(readStarterCsv("starter-projects.csv"));
  }

  if (!projectsOnly && publishedBefore >= 10 && !force) {
    skipped.listings = `${publishedBefore} published listings already exist`;
  } else if (!projectsOnly) {
    listings = await importListingsCsv(readStarterCsv("starter-listings.csv"), adminUserId);
  }

  let sponsored = 0;
  if (sponsor > 0) {
    sponsored = await sponsorLatestListings(sponsor, 30);
  }

  const publishedAfter = await prisma.userProperty.count({ where: { status: "published" } });

  return {
    publishedBefore,
    publishedAfter,
    projects,
    listings,
    sponsored,
    skipped,
  };
}
