import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

export const siteConfig = {
  name: "Condominium.in.th",
  url: "https://condominium.in.th",
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

export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
}): Metadata {
  const url = `${siteConfig.url}${path}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
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
