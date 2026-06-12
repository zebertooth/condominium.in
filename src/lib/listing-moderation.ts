/** Post-publish moderation — listings go live immediately; admin rechecks flagged items. */

export const MODERATION_FLAGS = ["new_listing", "edited", "profanity", "legacy_pending"] as const;
export type ModerationFlag = (typeof MODERATION_FLAGS)[number];

/** Lowercase substrings — Thai + English rude/profanity (extend as needed). */
const BAD_TERMS = [
  "ควย",
  "เหี้ย",
  "แม่ง",
  "ไอสั",
  "ไอ้สั",
  "สัส",
  "ชิบ",
  "fuck",
  "shit",
  "bitch",
  "asshole",
  "bastard",
  "damn",
  "cunt",
  "dick",
  "pussy",
  "whore",
  "slut",
] as const;

export interface ListingTextFields {
  title: string;
  description: string;
  highlights?: string | null;
}

export function parseModerationFlags(raw: string | null | undefined): ModerationFlag[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((f): f is ModerationFlag =>
      MODERATION_FLAGS.includes(f as ModerationFlag),
    );
  } catch {
    return [];
  }
}

export function scanListingText(fields: ListingTextFields): {
  hasProfanity: boolean;
  matchedTerms: string[];
} {
  const haystack = [fields.title, fields.description, fields.highlights ?? ""]
    .join(" ")
    .toLowerCase()
    .normalize("NFKC");

  const matchedTerms: string[] = [];
  for (const term of BAD_TERMS) {
    if (haystack.includes(term)) matchedTerms.push(term);
  }

  return { hasProfanity: matchedTerms.length > 0, matchedTerms };
}

export function buildModerationUpdate(
  fields: ListingTextFields,
  event: "new_listing" | "edited",
): { needsReview: boolean; moderationFlags: string } {
  const { hasProfanity } = scanListingText(fields);
  const flags = new Set<ModerationFlag>([event]);
  if (hasProfanity) flags.add("profanity");

  return {
    needsReview: true,
    moderationFlags: JSON.stringify([...flags]),
  };
}
