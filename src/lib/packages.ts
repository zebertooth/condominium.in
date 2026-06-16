export const FREE_PROPERTY_LIMIT = 2;

/** Default listing limit for an `agent` account before an admin sets a custom one. */
export const AGENT_DEFAULT_LIMIT = 5;

/**
 * Master switch for paid features (sponsor boost only — listing packages disabled).
 * Auto-enables when PROMPTPAY_ID is set on Vercel/local .env (server-only).
 * Override with PAID_FEATURES_ENABLED=false to force-disable.
 *
 * Client components must receive this via props from a Server Component parent,
 * or use NEXT_PUBLIC_PAID_FEATURES_ENABLED=true on Vercel (matches PROMPTPAY_ID on).
 */
export const PAID_FEATURES_ENABLED =
  process.env.PAID_FEATURES_ENABLED !== "false" && Boolean(process.env.PROMPTPAY_ID?.trim());

/** Client bundle — set NEXT_PUBLIC_PAID_FEATURES_ENABLED=true when paid features are on. */
export const PAID_FEATURES_UI_ENABLED =
  process.env.NEXT_PUBLIC_PAID_FEATURES_ENABLED !== "false" &&
  process.env.NEXT_PUBLIC_PAID_FEATURES_ENABLED === "true";

/** Listing slot packages — disabled; kept for legacy subscriptions in DB. */
export interface ListingPackage {
  id: string;
  name: string;
  description: string;
  extraSlots: number;
  priceBaht: number;
  durationDays: number;
  badge?: string;
}

export const LISTING_PACKAGES: ListingPackage[] = [
  {
    id: "extra_4_monthly",
    name: "แพ็กเพิ่ม 4 ประกาศ",
    description: "ลงประกาศเพิ่มได้ 4 รายการ นาน 30 วัน",
    extraSlots: 4,
    priceBaht: 100,
    durationDays: 30,
    badge: "ยอดนิยม",
  },
  {
    id: "extra_10_monthly",
    name: "แพ็กเพิ่ม 10 ประกาศ",
    description: "ลงประกาศเพิ่มได้ 10 รายการ นาน 30 วัน",
    extraSlots: 10,
    priceBaht: 220,
    durationDays: 30,
  },
];

export interface SponsorPackage {
  id: string;
  name: string;
  description: string;
  priceBaht: number;
  durationDays: number;
  badge?: string;
}

/** ประกาศแนะนำ / featured listing — paid boost only. */
export const SPONSOR_PACKAGES: SponsorPackage[] = [
  {
    id: "sponsor_1d",
    name: "ประกาศแนะนำ 1 วัน",
    description: "ขึ้นอันดับต้น + ป้ายแนะนำ 1 วัน",
    priceBaht: 29,
    durationDays: 1,
  },
  {
    id: "sponsor_3d",
    name: "ประกาศแนะนำ 3 วัน",
    description: "ขึ้นอันดับต้น + ป้ายแนะนำ 3 วัน",
    priceBaht: 79,
    durationDays: 3,
    badge: "คุ้ม",
  },
  {
    id: "sponsor_7d",
    name: "ประกาศแนะนำ 7 วัน",
    description: "ขึ้นอันดับต้น + ป้ายแนะนำ 7 วัน",
    priceBaht: 159,
    durationDays: 7,
    badge: "ยอดนิยม",
  },
];

/** @deprecated Use SPONSOR_PACKAGES — longest tier for backward-compat references. */
export const SPONSOR_PACKAGE = SPONSOR_PACKAGES.find((p) => p.id === "sponsor_7d")!;

export function getPackageById(id: string): ListingPackage | undefined {
  return LISTING_PACKAGES.find((p) => p.id === id);
}

export function getSponsorPackageById(id: string): SponsorPackage | undefined {
  return SPONSOR_PACKAGES.find((p) => p.id === id);
}

/** Session storage key for resuming PromptPay checkout after sponsor click. */
export const PENDING_PAYMENT_STORAGE = "condo_pending_payment";
