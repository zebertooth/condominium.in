import { cache } from "react";
import { prisma } from "@/lib/db";
import type { AdSlots } from "@/lib/adsense";
import { EMPTY_AD_SLOTS } from "@/lib/adsense";
import type { Locale } from "@/lib/i18n";

export type { AdSlots };
export { EMPTY_AD_SLOTS };

export interface SiteSettingsData {
  homeTitle: string;
  homeDescription: string;
  homeTitleEn: string;
  homeDescriptionEn: string;
  keywords: string[];
  titleSuffix: string;
  adSlots: AdSlots;
}

export const DEFAULT_SITE_SETTINGS: SiteSettingsData = {
  homeTitle: "Condominium.in.th | ซื้อ-เช่าคอนโดใกล้ BTS กรุงเทพฯ",
  homeDescription:
    "ซื้อ-เช่าคอนโดและบ้านในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI ทีมเอเจนต์พาไปชมทรัพย์จริง ลงประกาศฟรี",
  homeTitleEn: "Condominium.in.th | Buy & Rent Condos Near BTS Bangkok",
  homeDescriptionEn:
    "Bangkok condo & home marketplace near BTS. AI search, agent viewings, free owner listings.",
  keywords: [
    "คอนโด",
    "เช่าคอนโด",
    "ซื้อคอนโด",
    "คอนโดใกล้ BTS",
    "condominium bangkok",
    "rent condo bangkok",
    "bts condo",
  ],
  titleSuffix: "| Condominium.in.th",
  adSlots: { ...EMPTY_AD_SLOTS },
};

function parseKeywords(raw: string): string[] {
  if (!raw.trim()) return DEFAULT_SITE_SETTINGS.keywords;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function mapRow(row: {
  homeTitle: string;
  homeDescription: string;
  homeTitleEn: string;
  homeDescriptionEn: string;
  keywords: string;
  titleSuffix: string;
  adSlotHomeLeaderboard: string;
  adSlotHomeMid: string;
  adSlotListingTop: string;
  adSlotListingInfeed: string;
  adSlotPropertyTop: string;
  adSlotPropertySidebar: string;
  adSlotBlogTop: string;
  adSlotBlogInarticle: string;
  adSlotFooter: string;
}): SiteSettingsData {
  return {
    homeTitle: row.homeTitle,
    homeDescription: row.homeDescription,
    homeTitleEn: row.homeTitleEn || DEFAULT_SITE_SETTINGS.homeTitleEn,
    homeDescriptionEn: row.homeDescriptionEn || DEFAULT_SITE_SETTINGS.homeDescriptionEn,
    keywords: parseKeywords(row.keywords),
    titleSuffix: row.titleSuffix || DEFAULT_SITE_SETTINGS.titleSuffix,
    adSlots: {
      homeLeaderboard: row.adSlotHomeLeaderboard,
      homeMid: row.adSlotHomeMid,
      listingTop: row.adSlotListingTop,
      listingInfeed: row.adSlotListingInfeed,
      propertyTop: row.adSlotPropertyTop,
      propertySidebar: row.adSlotPropertySidebar,
      blogTop: row.adSlotBlogTop,
      blogInarticle: row.adSlotBlogInarticle,
      footer: row.adSlotFooter,
    },
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "default" } });
    if (!row) return DEFAULT_SITE_SETTINGS;
    return mapRow(row);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
});

export function resolveHomeMeta(
  settings: SiteSettingsData,
  locale: Locale,
): { title: string; description: string } {
  if (locale === "th") {
    return { title: settings.homeTitle, description: settings.homeDescription };
  }
  return {
    title: settings.homeTitleEn,
    description: settings.homeDescriptionEn,
  };
}

export function formatPageTitle(pageTitle: string, settings: SiteSettingsData): string {
  const suffix = settings.titleSuffix.trim();
  if (!suffix) return pageTitle;
  if (pageTitle.includes(suffix.replace(/^\|\s*/, ""))) return pageTitle;
  return `${pageTitle} ${suffix}`;
}

export async function updateSiteSettings(data: {
  homeTitle: string;
  homeDescription: string;
  homeTitleEn: string;
  homeDescriptionEn: string;
  keywords: string;
  titleSuffix: string;
  adSlots: AdSlots;
}): Promise<SiteSettingsData> {
  const row = await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      homeTitle: data.homeTitle.trim(),
      homeDescription: data.homeDescription.trim(),
      homeTitleEn: data.homeTitleEn.trim(),
      homeDescriptionEn: data.homeDescriptionEn.trim(),
      keywords: data.keywords.trim(),
      titleSuffix: data.titleSuffix.trim() || DEFAULT_SITE_SETTINGS.titleSuffix,
      adSlotHomeLeaderboard: data.adSlots.homeLeaderboard.trim(),
      adSlotHomeMid: data.adSlots.homeMid.trim(),
      adSlotListingTop: data.adSlots.listingTop.trim(),
      adSlotListingInfeed: data.adSlots.listingInfeed.trim(),
      adSlotPropertyTop: data.adSlots.propertyTop.trim(),
      adSlotPropertySidebar: data.adSlots.propertySidebar.trim(),
      adSlotBlogTop: data.adSlots.blogTop.trim(),
      adSlotBlogInarticle: data.adSlots.blogInarticle.trim(),
      adSlotFooter: data.adSlots.footer.trim(),
    },
    update: {
      homeTitle: data.homeTitle.trim(),
      homeDescription: data.homeDescription.trim(),
      homeTitleEn: data.homeTitleEn.trim(),
      homeDescriptionEn: data.homeDescriptionEn.trim(),
      keywords: data.keywords.trim(),
      titleSuffix: data.titleSuffix.trim() || DEFAULT_SITE_SETTINGS.titleSuffix,
      adSlotHomeLeaderboard: data.adSlots.homeLeaderboard.trim(),
      adSlotHomeMid: data.adSlots.homeMid.trim(),
      adSlotListingTop: data.adSlots.listingTop.trim(),
      adSlotListingInfeed: data.adSlots.listingInfeed.trim(),
      adSlotPropertyTop: data.adSlots.propertyTop.trim(),
      adSlotPropertySidebar: data.adSlots.propertySidebar.trim(),
      adSlotBlogTop: data.adSlots.blogTop.trim(),
      adSlotBlogInarticle: data.adSlots.blogInarticle.trim(),
      adSlotFooter: data.adSlots.footer.trim(),
    },
  });

  return mapRow(row);
}
