import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import {
  formatPageTitle,
  getSiteSettings,
  resolveHomeMeta,
  type SiteSettingsData,
} from "@/lib/site-settings";

export const siteConfig = {
  name: "Condominium.in.th",
  url: "https://www.condominium.in.th",
  description:
    "ซื้อ-เช่าคอนโดและบ้านในกรุงเทพฯ ใกล้ BTS ค้นหาด้วย AI ทีมเอเจนต์พาไปชมทรัพย์จริง ลงประกาศฟรี",
  keywords: [
    "คอนโด",
    "เช่าคอนโด",
    "ซื้อคอนโด",
    "คอนโดใกล้ BTS",
    "คอนโดกรุงเทพ",
    "เช่าบ้านกรุงเทพ",
    "condominium bangkok",
    "rent condo bangkok",
    "bts condo",
  ],
  ogImage: "/api/og",
  locale: "th_TH",
};

const HREFLANG_MAP: Record<Locale, string> = {
  th: "th-TH",
  en: "en-US",
  zh: "zh-Hans",
  ja: "ja-JP",
  ar: "ar-SA",
};

export function hreflangAlternates(path = ""): Record<string, string> {
  const url = `${siteConfig.url}${path}`;
  const languages: Record<string, string> = { "x-default": url };
  for (const loc of ["th", "en", "zh", "ja", "ar"] as Locale[]) {
    languages[HREFLANG_MAP[loc]] = url;
  }
  return languages;
}

function buildMetadata(
  settings: SiteSettingsData,
  {
    title,
    description,
    path = "",
    keywords = [],
    fullTitle = false,
  }: {
    title: string;
    description: string;
    path?: string;
    keywords?: string[];
    fullTitle?: boolean;
  },
): Metadata {
  const url = `${siteConfig.url}${path}`;
  const ogTitle = fullTitle ? title : formatPageTitle(title, settings);
  const keywordList = [...new Set([...settings.keywords, ...keywords])];

  return {
    metadataBase: new URL(siteConfig.url),
    title: fullTitle ? ogTitle : title,
    description,
    keywords: keywordList,
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: ogTitle,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export async function createRootMetadata(locale?: Locale): Promise<Metadata> {
  const [settings, resolvedLocale] = await Promise.all([
    getSiteSettings(),
    locale ? Promise.resolve(locale) : getLocale(),
  ]);
  const home = resolveHomeMeta(settings, resolvedLocale);
  const base = buildMetadata(settings, {
    title: home.title,
    description: home.description,
    path: "",
    fullTitle: true,
  });

  return {
    ...base,
    title: {
      default: home.title,
      template: `%s ${settings.titleSuffix}`.replace(/\s+/g, " ").trim(),
    },
    icons: {
      icon: "/logo.svg",
      shortcut: "/logo.svg",
    },
  };
}

export async function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  locale,
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  locale?: Locale;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const resolvedLocale = locale ?? (await getLocale());
  const home = resolveHomeMeta(settings, resolvedLocale);

  return buildMetadata(settings, {
    title,
    description: description || home.description,
    path,
    keywords,
  });
}

export async function createHomeMetadata(locale?: Locale): Promise<Metadata> {
  const [settings, resolvedLocale] = await Promise.all([
    getSiteSettings(),
    locale ? Promise.resolve(locale) : getLocale(),
  ]);
  const home = resolveHomeMeta(settings, resolvedLocale);

  return buildMetadata(settings, {
    title: home.title,
    description: home.description,
    path: "/",
    fullTitle: true,
  });
}
