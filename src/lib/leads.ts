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
      assignedToId: input.assignedToId ?? null,
      viewingDate: input.viewingDate || null,
      viewingTime: input.viewingTime || null,
      agentType: input.agentType || null,
    },
  });
}

/** Default CRM assignee — prefers agent covering the BTS area, else admin, then oldest agent. */
export async function pickLeadAssignee(btsStation?: string | null): Promise<string | null> {
  const station = btsStation?.trim();
  if (station) {
    const teamAgents = await prisma.teamAgent.findMany({
      where: { published: true, userId: { not: null } },
      select: { userId: true, areas: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    for (const row of teamAgents) {
      let areas: string[] = [];
      try {
        const parsed = JSON.parse(row.areas) as unknown;
        areas = Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
      } catch {
        areas = [];
      }

      const matches = areas.some(
        (area) =>
          station.includes(area) ||
          area.includes(station) ||
          station.toLowerCase().includes(area.toLowerCase()),
      );

      if (matches && row.userId) {
        const user = await prisma.user.findUnique({
          where: { id: row.userId },
          select: { id: true, role: true },
        });
        if (user?.role === "agent") return user.id;
      }
    }
  }

  return pickDefaultLeadAssignee();
}

/** @deprecated use pickLeadAssignee */
export async function pickDefaultLeadAssignee(): Promise<string | null> {
  const admin = await prisma.user.findFirst({
    where: { role: "admin" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (admin) return admin.id;

  const agent = await prisma.user.findFirst({
    where: { role: "agent" },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return agent?.id ?? null;
}

export async function getLeadStats() {
  const [total, newLeads, viewing] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "viewing" } }),
  ]);
  return { total, newLeads, viewing };
}
