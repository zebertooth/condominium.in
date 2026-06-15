import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { parseCsv } from "@/lib/csv-import";
import {
  validateAndParseProjectRow,
  type ProjectImportResult,
} from "@/lib/project-csv-import";
import { uniqueProjectSlug } from "@/lib/projects";

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
        const slug = data.slug
          ? await uniqueProjectSlug(data.slug)
          : await uniqueProjectSlug(data.name);

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

    return NextResponse.json(result);
  } catch (err) {
    console.error("Project CSV import error:", err);
    return NextResponse.json(
      { error: "Import failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
