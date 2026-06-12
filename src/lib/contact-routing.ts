/** How property page contact form routes inquiries. */
export function resolveListingContactMode(
  posterRole: string,
  agentManaged: boolean,
): "owner_direct" | "agent_team" {
  if (posterRole === "agent" || posterRole === "admin") return "agent_team";
  if (agentManaged) return "agent_team";
  return "owner_direct";
}

/** Auto-assign CRM lead to poster when they posted as agent/admin. */
export function resolveLeadAssigneeId(
  posterRole: string,
  posterUserId: string,
  agentManaged: boolean,
): string | null {
  if (posterRole === "agent" || posterRole === "admin") return posterUserId;
  if (agentManaged) return null;
  return null;
}
