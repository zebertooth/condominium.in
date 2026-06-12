import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";

/** Agent profile / signup category — team staff, freelance, or partner agency. */
export const AGENT_CATEGORIES = ["team", "freelance", "company"] as const;
export type AgentCategory = (typeof AGENT_CATEGORIES)[number];

/** @deprecated use AGENT_CATEGORIES */
export const AGENT_APPLICATION_TYPES = AGENT_CATEGORIES;
/** @deprecated use AgentCategory */
export type AgentApplicationType = AgentCategory;

export function parseAgentCategory(value?: string | null): AgentCategory {
  if (value && AGENT_CATEGORIES.includes(value as AgentCategory)) {
    return value as AgentCategory;
  }
  return "team";
}

export function agentCategoryLabel(category: AgentCategory | string, locale: Locale): string {
  const key = `agentCategory_${category}` as Parameters<typeof t>[0];
  return AGENT_CATEGORIES.includes(category as AgentCategory)
    ? t(key, locale)
    : String(category);
}

export function agentCategoryHint(category: AgentCategory, locale: Locale): string {
  const key = `agentCategoryHint_${category}` as Parameters<typeof t>[0];
  return t(key, locale);
}

/** @deprecated use agentCategoryLabel */
export function agentApplicationTypeLabel(type: string, locale: Locale): string {
  return agentCategoryLabel(type, locale);
}

/** @deprecated use agentCategoryHint */
export function agentApplicationTypeHint(type: AgentCategory, locale: Locale): string {
  return agentCategoryHint(type, locale);
}

export function groupByAgentCategory<T extends { agentCategory: AgentCategory }>(
  items: T[],
): Record<AgentCategory, T[]> {
  return {
    team: items.filter((i) => i.agentCategory === "team"),
    freelance: items.filter((i) => i.agentCategory === "freelance"),
    company: items.filter((i) => i.agentCategory === "company"),
  };
}
