import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { parseCsv, validateAndParseRow, type ImportResult } from "@/lib/csv-import";
import { normalizeListingImages, parseListingImageUrls } from "@/lib/listing-images";
import { logPriceChange } from "@/lib/price-history";
import { uniqueSlug } from "@/lib/user-properties";

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

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const content = await file.text();
    const { headers, rows } = parseCsv(content);

    if (headers.length === 0) {
      return NextResponse.json({ error: "Empty CSV file" }, { status: 400 });
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

        const imageUrls = parseListingImageUrls(data.images);
        if (data.images?.trim() && imageUrls.length === 0) {
          result.errors.push({
            row: rowNum,
            message:
              "No valid image URLs in images column (need https://…). If features contain commas, wrap that column in double quotes.",
          });
        }
        const images = normalizeListingImages(imageUrls);

        const created = await prisma.userProperty.create({
          data: {
            userId: admin.id,
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
            images: JSON.stringify(images),
            status: "published",
            needsReview: false,
            agentManaged: true,
          },
        });
        await logPriceChange(created.id, data.price, data.listingType);

        result.imported++;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        result.errors.push({ row: rowNum, message: `Database error: ${message}` });
      }
    }

    result.success = result.errors.length === 0;

    return NextResponse.json(result);
  } catch (err) {
    console.error("CSV import error:", err);
    return NextResponse.json(
      { error: "Import failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
