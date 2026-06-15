import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { importListingsCsv } from "@/lib/inventory-import";

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
    const result = await importListingsCsv(content, admin.id);

    return NextResponse.json(result);
  } catch (err) {
    console.error("CSV import error:", err);
    return NextResponse.json(
      { error: "Import failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
