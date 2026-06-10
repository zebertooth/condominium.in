import { t, type Locale, type TranslationKey } from "@/lib/i18n";

export const LEAD_STATUS_VALUES = ["new", "contacted", "viewing", "closed", "lost"] as const;

const LEAD_STATUS_KEYS: Record<string, TranslationKey> = {
  new: "leadStatusNew",
  contacted: "leadStatusContacted",
  viewing: "leadStatusViewing",
  closed: "leadStatusClosed",
  lost: "leadStatusLost",
};

const LEAD_SOURCE_KEYS: Record<string, TranslationKey> = {
  contact: "leadSourceContact",
  property: "leadSourceProperty",
  "ai-search": "leadSourceAiSearch",
};

const LEAD_MODE_KEYS: Record<string, TranslationKey> = {
  agent_team: "leadModeAgent",
  owner_direct: "leadModeOwner",
};

/** @deprecated use getLeadStatuses(locale) */
export const LEAD_STATUSES = [
  { value: "new", label: "ใหม่" },
  { value: "contacted", label: "ติดต่อแล้ว" },
  { value: "viewing", label: "นัดชม" },
  { value: "closed", label: "ปิดการขาย" },
  { value: "lost", label: "ไม่สำเร็จ" },
] as const;

export function getLeadStatuses(locale: Locale) {
  return LEAD_STATUS_VALUES.map((value) => ({
    value,
    label: t(LEAD_STATUS_KEYS[value], locale),
  }));
}

export function leadStatusLabelFor(status: string, locale: Locale): string {
  const key = LEAD_STATUS_KEYS[status];
  return key ? t(key, locale) : status;
}

export function leadSourceLabelFor(source: string, locale: Locale): string {
  const key = LEAD_SOURCE_KEYS[source];
  return key ? t(key, locale) : source;
}

export function leadContactModeLabelFor(mode: string, locale: Locale): string {
  const key = LEAD_MODE_KEYS[mode];
  return key ? t(key, locale) : mode;
}

/** @deprecated use leadStatusLabelFor */
export const leadStatusLabel: Record<string, string> = Object.fromEntries(
  LEAD_STATUSES.map((s) => [s.value, s.label]),
);

/** @deprecated use leadSourceLabelFor */
export const LEAD_SOURCE_LABEL: Record<string, string> = {
  contact: "ฟอร์มติดต่อ",
  property: "หน้าประกาศ",
  "ai-search": "AI ค้นหา",
};

/** @deprecated use leadContactModeLabelFor */
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
  viewingDate?: string;
  viewingTime?: string;
}
