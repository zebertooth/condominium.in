import { prisma } from "@/lib/db";
import type { CreateLeadInput } from "@/lib/lead-constants";

export {
  LEAD_STATUSES,
  LEAD_SOURCE_LABEL,
  leadStatusLabel,
  type CreateLeadInput,
} from "@/lib/lead-constants";

export async function createLead(input: CreateLeadInput) {
  return prisma.lead.create({
    data: {
      name: input.name.trim(),
      phone: input.phone?.trim() || null,
      email: input.email?.toLowerCase().trim() || null,
      message: input.message.trim(),
      source: input.source,
      contactMode: input.contactMode ?? "agent_team",
      propertySlug: input.propertySlug || null,
      propertyTitle: input.propertyTitle || null,
      btsStation: input.btsStation || null,
      ownerUserId: input.ownerUserId || null,
      posterRole: input.posterRole || null,
      viewingDate: input.viewingDate || null,
      viewingTime: input.viewingTime || null,
    },
  });
}

export async function getLeadStats() {
  const [total, newLeads, viewing] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "viewing" } }),
  ]);
  return { total, newLeads, viewing };
}
