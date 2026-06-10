export const FREE_PROPERTY_LIMIT = 2;

/** Default listing limit for an `agent` account before an admin sets a custom one. */
export const AGENT_DEFAULT_LIMIT = 5;

/**
 * Master switch for paid features (package purchase + sponsor boost).
 * Auto-enables when PROMPTPAY_ID is set on Vercel/local .env.
 * Override with PAID_FEATURES_ENABLED=false to force-disable.
 */
export const PAID_FEATURES_ENABLED =
  process.env.PAID_FEATURES_ENABLED !== "false" && Boolean(process.env.PROMPTPAY_ID?.trim());

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

export const SPONSOR_PACKAGE = {
  id: "sponsor_7days",
  name: "ประกาศเด่น (สปอนเซอร์)",
  description: "ทำให้ประกาศขึ้นอันดับต้นและมีป้ายเด่น 7 วัน",
  priceBaht: 50,
  durationDays: 7,
};

export function getPackageById(id: string): ListingPackage | undefined {
  return LISTING_PACKAGES.find((p) => p.id === id);
}

/** Session storage key for resuming PromptPay checkout after sponsor click. */
export const PENDING_PAYMENT_STORAGE = "condo_pending_payment";
