import { NextResponse } from "next/server";
import { logPropertyView } from "@/lib/analytics";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  propertySlug: z.string().min(1),
  propertyType: z.string().optional(),
  listingType: z.string().optional(),
  district: z.string().optional(),
  btsStation: z.string().optional(),
  source: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`property-view:${ip}`, 60, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await logPropertyView(parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
