import { NextResponse } from "next/server";
import { logMatchingEvent, type MatchingEventType } from "@/lib/matching";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const eventTypes = [
  "owner_contact_view",
  "owner_phone_click",
  "owner_email_click",
  "owner_inquiry",
] as const;

const schema = z.object({
  eventType: z.enum(eventTypes),
  propertySlug: z.string().optional(),
  propertyTitle: z.string().optional(),
  ownerUserId: z.string().optional(),
  posterRole: z.string().optional(),
  visitorName: z.string().optional(),
  visitorPhone: z.string().optional(),
  visitorEmail: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`matching:${ip}`, 30, 60_000);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await logMatchingEvent({
      ...parsed.data,
      eventType: parsed.data.eventType as MatchingEventType,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
