import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createAlertSchema = z.object({
  name: z.string().min(1).max(100),
  listingType: z.enum(["sale", "rent"]),
  filters: z.object({
    district: z.string().optional(),
    btsStation: z.string().optional(),
    minPrice: z.number().optional(),
    maxPrice: z.number().optional(),
    bedrooms: z.number().optional(),
    propertyCategory: z.string().optional(),
  }),
  frequency: z.enum(["daily", "weekly"]).default("daily"),
});

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alerts = await prisma.searchAlert.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      alerts: alerts.map((a) => ({
        ...a,
        filters: JSON.parse(a.filters),
      })),
    });
  } catch (err) {
    console.error("Get alerts error:", err);
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createAlertSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const existingCount = await prisma.searchAlert.count({
      where: { userId: user.id },
    });

    if (existingCount >= 10) {
      return NextResponse.json(
        { error: "Maximum 10 alerts allowed" },
        { status: 400 },
      );
    }

    const alert = await prisma.searchAlert.create({
      data: {
        userId: user.id,
        name: parsed.data.name,
        listingType: parsed.data.listingType,
        filters: JSON.stringify(parsed.data.filters),
        frequency: parsed.data.frequency,
      },
    });

    return NextResponse.json({
      alert: {
        ...alert,
        filters: JSON.parse(alert.filters),
      },
    });
  } catch (err) {
    console.error("Create alert error:", err);
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const alertId = searchParams.get("id");

    if (!alertId) {
      return NextResponse.json({ error: "Missing alert ID" }, { status: 400 });
    }

    const alert = await prisma.searchAlert.findUnique({
      where: { id: alertId },
    });

    if (!alert || alert.userId !== user.id) {
      return NextResponse.json({ error: "Alert not found" }, { status: 404 });
    }

    await prisma.searchAlert.delete({
      where: { id: alertId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete alert error:", err);
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 });
  }
}
