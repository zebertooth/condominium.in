import { prisma } from "@/lib/db";
import { getAgentRatingMap } from "@/lib/agent-reviews";
import { DEFAULT_TEAM_AGENTS } from "@/lib/default-content";
import type { AgentCategory } from "@/lib/agent-application";

export interface TeamAgentView {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  agentCategory: AgentCategory;
  areas: string[];
  languages: string[];
  deals: number;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
  averageRating?: number;
  reviewCount?: number;
}

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

type DbTeamAgent = {
  id: string;
  name: string;
  role: string;
  roleEn: string;
  agentCategory: string;
  areas: string;
  languages: string;
  deals: number;
  imageUrl: string;
  sortOrder: number;
  published: boolean;
};

export function dbTeamAgentToView(row: DbTeamAgent): TeamAgentView {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    roleEn: row.roleEn,
    agentCategory: (row.agentCategory as AgentCategory) || "team",
    areas: parseJsonArray(row.areas),
    languages: parseJsonArray(row.languages),
    deals: row.deals,
    imageUrl: row.imageUrl,
    sortOrder: row.sortOrder,
    published: row.published,
  };
}

export async function getPublishedTeamAgents(): Promise<TeamAgentView[]> {
  try {
    const rows = await prisma.teamAgent.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });
    if (rows.length > 0) {
      const views = rows.map(dbTeamAgentToView);
      const ratingMap = await getAgentRatingMap(views.map((v) => v.id));
      return views.map((view) => {
        const stats = ratingMap.get(view.id);
        return {
          ...view,
          averageRating: stats?.averageRating,
          reviewCount: stats?.reviewCount,
        };
      });
    }
  } catch {
    // DB unavailable — fall back to static defaults
  }
  return DEFAULT_TEAM_AGENTS.map((a, i) => ({
    id: `default-${i}`,
    name: a.name,
    role: a.role,
    roleEn: a.roleEn,
    agentCategory: "team" as const,
    areas: a.areas,
    languages: a.languages,
    deals: a.deals,
    imageUrl: a.imageUrl,
    sortOrder: a.sortOrder,
    published: true,
  }));
}

export async function getAllTeamAgents(): Promise<TeamAgentView[]> {
  const rows = await prisma.teamAgent.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return rows.map(dbTeamAgentToView);
}
