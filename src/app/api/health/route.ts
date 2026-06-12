import { NextResponse } from "next/server";
import { getDemoListingStatus } from "@/lib/demo-listings";
import { prisma } from "@/lib/db";
import { getIntegrationStatus } from "@/lib/integrations";
import { PAID_FEATURES_ENABLED } from "@/lib/packages";
import {
  checkThaiBulkSmsCredit,
  getThaiBulkSmsSender,
  thaiBulkSmsConfigured,
} from "@/lib/notifications";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    const integrations = getIntegrationStatus();
    const thaibulksms = thaiBulkSmsConfigured()
      ? await checkThaiBulkSmsCredit()
      : { ok: false, sender: getThaiBulkSmsSender(), error: "not configured" };
    const demoListings = await getDemoListingStatus();

    return NextResponse.json({
      status: "ok",
      database: "connected",
      paidFeatures: PAID_FEATURES_ENABLED,
      integrations,
      thaibulksms,
      demoListings,
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
