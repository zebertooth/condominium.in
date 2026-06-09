import { prisma } from "@/lib/db";

export type MatchingEventType =
  | "owner_contact_view"
  | "owner_phone_click"
  | "owner_email_click"
  | "owner_inquiry";

export interface LogMatchingInput {
  eventType: MatchingEventType;
  propertySlug?: string;
  propertyTitle?: string;
  ownerUserId?: string;
  posterRole?: string;
  leadId?: string;
  visitorName?: string;
  visitorPhone?: string;
  visitorEmail?: string;
  metadata?: Record<string, unknown>;
}

export async function logMatchingEvent(input: LogMatchingInput) {
  return prisma.matchingEvent.create({
    data: {
      eventType: input.eventType,
      propertySlug: input.propertySlug ?? null,
      propertyTitle: input.propertyTitle ?? null,
      ownerUserId: input.ownerUserId ?? null,
      posterRole: input.posterRole ?? null,
      leadId: input.leadId ?? null,
      visitorName: input.visitorName ?? null,
      visitorPhone: input.visitorPhone ?? null,
      visitorEmail: input.visitorEmail ?? null,
      metadata: JSON.stringify(input.metadata ?? {}),
    },
  });
}

export function isOwnerDirectListing(posterRole?: string): boolean {
  return posterRole !== "agent";
}
