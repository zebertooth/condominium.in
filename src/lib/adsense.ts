export type AdSlotKey =
  | "homeLeaderboard"
  | "homeMid"
  | "listingTop"
  | "listingInfeed"
  | "propertyTop"
  | "propertySidebar"
  | "blogTop"
  | "blogInarticle"
  | "footer";

export type AdSlots = Record<AdSlotKey, string>;

export const EMPTY_AD_SLOTS: AdSlots = {
  homeLeaderboard: "",
  homeMid: "",
  listingTop: "",
  listingInfeed: "",
  propertyTop: "",
  propertySidebar: "",
  blogTop: "",
  blogInarticle: "",
  footer: "",
};

export interface AdSlotConfig {
  key: AdSlotKey;
  /** Label shown in Admin — paste matching AdSense unit name */
  adminLabel: string;
  /** Where it renders on the site */
  placement: string;
  /** Recommended AdSense ad format */
  adsenseFormat: "Display ads — Responsive" | "In-feed ads" | "Multiplex ads" | "Display ads — Vertical";
  /** Typical size hint for AdSense dashboard */
  sizeHint: string;
}

export const AD_SLOT_CATALOG: AdSlotConfig[] = [
  {
    key: "homeLeaderboard",
    adminLabel: "Home — Leaderboard (below hero)",
    placement: "/",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "728×90 / 320×100 responsive",
  },
  {
    key: "homeMid",
    adminLabel: "Home — Mid page (between sections)",
    placement: "/",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "336×280 / responsive",
  },
  {
    key: "listingTop",
    adminLabel: "Buy / Rent — Top banner",
    placement: "/buy, /rent",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "728×90 responsive",
  },
  {
    key: "listingInfeed",
    adminLabel: "Buy / Rent / Home grid — In-feed",
    placement: "Property grid every 6 cards",
    adsenseFormat: "In-feed ads",
    sizeHint: "Native in-feed unit",
  },
  {
    key: "propertyTop",
    adminLabel: "Property detail — Below breadcrumb",
    placement: "/property/[slug]",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "728×90 responsive",
  },
  {
    key: "propertySidebar",
    adminLabel: "Property detail — Sidebar (desktop)",
    placement: "/property/[slug] right column",
    adsenseFormat: "Display ads — Vertical",
    sizeHint: "300×600 / 160×600",
  },
  {
    key: "blogTop",
    adminLabel: "Blog article — Top",
    placement: "/blog/[slug]",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "728×90 responsive",
  },
  {
    key: "blogInarticle",
    adminLabel: "Blog article — Mid content",
    placement: "/blog/[slug] after intro",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "336×280 responsive",
  },
  {
    key: "footer",
    adminLabel: "Site-wide — Above footer",
    placement: "All pages (layout)",
    adsenseFormat: "Display ads — Responsive",
    sizeHint: "728×90 responsive",
  },
];

export function adsenseClientId(): string | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return client || null;
}

export function adsenseConfigured(clientId: string | null, slotId?: string | null): boolean {
  return Boolean(clientId && slotId?.trim());
}

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function pushAdSenseSlot(): void {
  try {
    window.adsbygoogle = window.adsbygoogle || [];
    window.adsbygoogle.push({});
  } catch {
    // Ad blockers or script not loaded yet
  }
}
