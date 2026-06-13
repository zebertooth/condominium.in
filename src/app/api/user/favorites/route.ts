import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const saved = await prisma.savedProperty.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { propertySlug: true, createdAt: true },
    });

    return NextResponse.json({ favorites: saved });
  } catch (err) {
    console.error("Get favorites error:", err);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { propertySlug?: string };
    const { propertySlug } = body;

    if (!propertySlug) {
      return NextResponse.json({ error: "Missing propertySlug" }, { status: 400 });
    }

    const existing = await prisma.savedProperty.findUnique({
      where: {
        userId_propertySlug: { userId: user.id, propertySlug },
      },
    });

    if (existing) {
      await prisma.savedProperty.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ saved: false, message: "Removed from favorites" });
    }

    await prisma.savedProperty.create({
      data: {
        userId: user.id,
        propertySlug,
      },
    });

    return NextResponse.json({ saved: true, message: "Added to favorites" });
  } catch (err) {
    console.error("Toggle favorite error:", err);
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
