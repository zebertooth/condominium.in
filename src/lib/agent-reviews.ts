import { prisma } from "@/lib/db";

export interface AgentRatingSummary {
  averageRating: number;
  reviewCount: number;
}

export async function getAgentRatingMap(
  teamAgentIds: string[],
): Promise<Map<string, AgentRatingSummary>> {
  const map = new Map<string, AgentRatingSummary>();
  if (teamAgentIds.length === 0) return map;

  const rows = await prisma.agentReview.groupBy({
    by: ["teamAgentId"],
    where: {
      teamAgentId: { in: teamAgentIds },
      status: "approved",
    },
    _avg: { rating: true },
    _count: { rating: true },
  });

  for (const row of rows) {
    map.set(row.teamAgentId, {
      averageRating: Math.round((row._avg.rating ?? 0) * 10) / 10,
      reviewCount: row._count.rating,
    });
  }
  return map;
}

export async function getApprovedReviewsForAgent(teamAgentId: string, limit = 5) {
  return prisma.agentReview.findMany({
    where: { teamAgentId, status: "approved" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      user: { select: { fullName: true } },
    },
  });
}
