import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getIntegrationStatus } from "@/lib/integrations";
import { PAID_FEATURES_ENABLED } from "@/lib/packages";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const integrations = getIntegrationStatus();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      paidFeatures: PAID_FEATURES_ENABLED,
      integrations,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[health] database check failed", error);
    return NextResponse.json(
      {
        status: "error",
        database: "disconnected",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
