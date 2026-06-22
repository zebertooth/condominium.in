import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/admin";
import { runStarterInventoryImport } from "@/lib/inventory-import";

export async function POST(request: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      force?: boolean;
      sponsor?: number;
      listingsOnly?: boolean;
      projectsOnly?: boolean;
    };

    const result = await runStarterInventoryImport({
      force: Boolean(body.force),
      sponsor: typeof body.sponsor === "number" ? Math.max(0, body.sponsor) : 3,
      listingsOnly: Boolean(body.listingsOnly),
      projectsOnly: Boolean(body.projectsOnly),
    });

    return NextResponse.json({
      ok: true,
      message: `นำเข้าเสร็จ — เผยแพร่ ${result.publishedBefore} → ${result.publishedAfter} ประกาศ`,
      ...result,
    });
  } catch (err) {
    console.error("[starter-import]", err);
    return NextResponse.json(
      { error: "Import failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
