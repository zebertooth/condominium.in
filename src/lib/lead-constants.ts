export const LEAD_STATUSES = [
  { value: "new", label: "ใหม่" },
  { value: "contacted", label: "ติดต่อแล้ว" },
  { value: "viewing", label: "นัดชม" },
  { value: "closed", label: "ปิดการขาย" },
  { value: "lost", label: "ไม่สำเร็จ" },
] as const;

export const leadStatusLabel: Record<string, string> = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s.value, s.label]),
);

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  contact: "ฟอร์มติดต่อ",
  property: "หน้าประกาศ",
  "ai-search": "AI ค้นหา",
};

export const LEAD_CONTACT_MODE_LABEL: Record<string, string> = {
  agent_team: "ทีมเอเจนต์",
  owner_direct: "เจ้าของโดยตรง",
};

export interface CreateLeadInput {
  name: string;
  phone?: string;
  email?: string;
  message: string;
  source: "contact" | "property" | "ai-search";
  contactMode?: "agent_team" | "owner_direct";
  propertySlug?: string;
  propertyTitle?: string;
  btsStation?: string;
  ownerUserId?: string;
  posterRole?: string;
}
