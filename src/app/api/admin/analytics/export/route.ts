import { NextResponse } from "next/server";
import { toCsv } from "@/lib/analytics";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/db";

type ExportType = "searches" | "views" | "matching" | "leads";

export async function GET(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const type = (searchParams.get("type") ?? "searches") as ExportType;
    const days = Math.min(365, Math.max(1, parseInt(searchParams.get("days") ?? "30", 10) || 30));
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    let csv = "";
    let filename = "export.csv";

    if (type === "searches") {
      const rows = await prisma.searchEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10_000,
      });
      csv = toCsv(
        rows.map((r) => ({
          createdAt: r.createdAt.toISOString(),
          query: r.query,
          listingType: r.listingType,
          btsStation: r.btsStation,
          district: r.district,
          propertyType: r.propertyType,
          resultCount: r.resultCount,
          source: r.source,
        })),
      );
      filename = `searches-${days}d.csv`;
    } else if (type === "views") {
      const rows = await prisma.propertyViewEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10_000,
      });
      csv = toCsv(
        rows.map((r) => ({
          createdAt: r.createdAt.toISOString(),
          propertySlug: r.propertySlug,
          propertyType: r.propertyType,
          listingType: r.listingType,
          district: r.district,
          btsStation: r.btsStation,
          source: r.source,
        })),
      );
      filename = `property-views-${days}d.csv`;
    } else if (type === "matching") {
      const rows = await prisma.matchingEvent.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10_000,
      });
      csv = toCsv(
        rows.map((r) => ({
          createdAt: r.createdAt.toISOString(),
          eventType: r.eventType,
          propertySlug: r.propertySlug,
          propertyTitle: r.propertyTitle,
          ownerUserId: r.ownerUserId,
          posterRole: r.posterRole,
          visitorName: r.visitorName,
          visitorPhone: r.visitorPhone,
          visitorEmail: r.visitorEmail,
        })),
      );
      filename = `matching-events-${days}d.csv`;
    } else if (type === "leads") {
      const rows = await prisma.lead.findMany({
        where: { createdAt: { gte: since } },
        orderBy: { createdAt: "desc" },
        take: 10_000,
      });
      csv = toCsv(
        rows.map((r) => ({
          createdAt: r.createdAt.toISOString(),
          name: r.name,
          phone: r.phone,
          email: r.email,
          source: r.source,
          contactMode: r.contactMode,
          propertySlug: r.propertySlug,
          ownerUserId: r.ownerUserId,
          status: r.status,
        })),
      );
      filename = `leads-${days}d.csv`;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
