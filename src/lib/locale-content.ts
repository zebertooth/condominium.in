import type { AreaGuide, BlogPost, Property } from "@/types/property";
import type { Locale } from "@/lib/i18n";
import { areaLocalePacks } from "@/lib/content/areas-locale";
import { blogLocalePacks } from "@/lib/content/blog-locale";
import { propertyLocalePacks } from "@/lib/content/properties-locale";

/** Pick localized string with fallback chain: locale → en → th */
export function resolveLocalized(
  locale: Locale,
  th: string,
  en?: string,
  zh?: string,
  ja?: string,
  ar?: string,
): string {
  switch (locale) {
    case "th":
      return th;
    case "en":
      return en ?? th;
    case "zh":
      return zh ?? en ?? th;
    case "ja":
      return ja ?? en ?? th;
    case "ar":
      return ar ?? en ?? th;
    default:
      return th;
  }
}

export function resolveLocalizedList(
  locale: Locale,
  th: string[],
  en?: string[],
  zh?: string[],
  ja?: string[],
  ar?: string[],
): string[] {
  switch (locale) {
    case "th":
      return th;
    case "en":
      return en ?? th;
    case "zh":
      return zh ?? en ?? th;
    case "ja":
      return ja ?? en ?? th;
    case "ar":
      return ar ?? en ?? th;
    default:
      return th;
  }
}

export function isRtlLocale(locale: Locale): boolean {
  return locale === "ar";
}

export function htmlLang(locale: Locale): string {
  const map: Record<Locale, string> = {
    th: "th",
    en: "en",
    zh: "zh-Hans",
    ja: "ja",
    ar: "ar",
  };
  return map[locale];
}

export function dateLocale(locale: Locale): string {
  const map: Record<Locale, string> = {
    th: "th-TH",
    en: "en-US",
    zh: "zh-CN",
    ja: "ja-JP",
    ar: "ar-SA",
  };
  return map[locale];
}

export function numberLocale(locale: Locale): string {
  return dateLocale(locale);
}

/** @deprecated use locale-specific content helpers */
export function usesEnglishContent(locale: Locale): boolean {
  return locale !== "th";
}

export function areaName(area: AreaGuide, locale: Locale): string {
  const pack = areaLocalePacks[area.slug];
  return resolveLocalized(locale, area.name, area.nameEn, pack?.name.zh, pack?.name.ja, pack?.name.ar);
}

export function areaDescription(area: AreaGuide, locale: Locale): string {
  const pack = areaLocalePacks[area.slug];
  return resolveLocalized(
    locale,
    area.description,
    area.descriptionEn,
    pack?.description.zh,
    pack?.description.ja,
    pack?.description.ar,
  );
}

export function areaSeoTitle(area: AreaGuide, locale: Locale): string {
  const pack = areaLocalePacks[area.slug];
  return resolveLocalized(
    locale,
    area.seoTitle,
    area.seoTitleEn,
    pack?.seoTitle.zh,
    pack?.seoTitle.ja,
    pack?.seoTitle.ar,
  );
}

export function areaSeoDescription(area: AreaGuide, locale: Locale): string {
  const pack = areaLocalePacks[area.slug];
  return resolveLocalized(
    locale,
    area.seoDescription,
    area.seoDescriptionEn,
    pack?.seoDescription.zh,
    pack?.seoDescription.ja,
    pack?.seoDescription.ar,
  );
}

export function areaHighlights(area: AreaGuide, locale: Locale): string[] {
  const pack = areaLocalePacks[area.slug];
  return resolveLocalizedList(
    locale,
    area.highlights,
    area.highlightsEn,
    pack?.highlights.zh,
    pack?.highlights.ja,
    pack?.highlights.ar,
  );
}

export function areaBtsLineLabel(btsLine: string, locale: Locale): string {
  if (locale === "th") return `สาย${btsLine}`;
  if (btsLine === "สุขุมวิท") return locale === "ar" ? "خط سوخومvit" : locale === "zh" ? "素坤逸线" : locale === "ja" ? "スクンビット線" : "Sukhumvit Line";
  if (btsLine === "สีลม") return locale === "ar" ? "خط سيلوم" : locale === "zh" ? "是隆线" : locale === "ja" ? "シーロム線" : "Silom Line";
  return locale === "ar"
    ? "محطة تبادل سوخومvit/سيلوم"
    : locale === "zh"
      ? "素坤逸/是隆换乘站"
      : locale === "ja"
        ? "スクンビット/シーロム乗換"
        : "Sukhumvit/Silom Interchange";
}

export function blogTitle(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(locale, post.title, post.titleEn, pack?.title.zh, pack?.title.ja, pack?.title.ar);
}

export function blogExcerpt(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(
    locale,
    post.excerpt,
    post.excerptEn,
    pack?.excerpt.zh,
    pack?.excerpt.ja,
    pack?.excerpt.ar,
  );
}

export function blogContent(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(
    locale,
    post.content,
    post.contentEn,
    pack?.content.zh,
    pack?.content.ja,
    pack?.content.ar,
  );
}

export function blogCategory(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(
    locale,
    post.category,
    post.categoryEn,
    pack?.category.zh,
    pack?.category.ja,
    pack?.category.ar,
  );
}

export function blogSeoTitle(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(
    locale,
    post.seoTitle,
    post.seoTitleEn,
    pack?.seoTitle.zh,
    pack?.seoTitle.ja,
    pack?.seoTitle.ar,
  );
}

export function blogSeoDescription(post: BlogPost, locale: Locale): string {
  const pack = blogLocalePacks[post.slug];
  return resolveLocalized(
    locale,
    post.seoDescription,
    post.seoDescriptionEn,
    pack?.seoDescription.zh,
    pack?.seoDescription.ja,
    pack?.seoDescription.ar,
  );
}

export function localizedPropertyTitle(property: Property, locale: Locale): string {
  if (property.isUserListing) {
    return resolveLocalized(
      locale,
      property.title,
      property.titleEn?.trim() || undefined,
      property.titleZh?.trim() || undefined,
      property.titleJa?.trim() || undefined,
      property.titleAr?.trim() || undefined,
    );
  }
  const pack = propertyLocalePacks[property.slug];
  return resolveLocalized(
    locale,
    property.title,
    property.titleEn,
    pack?.title.zh,
    pack?.title.ja,
    pack?.title.ar,
  );
}

export function localizedPropertyDescription(property: Property, locale: Locale): string {
  if (property.isUserListing) {
    return resolveLocalized(
      locale,
      property.description,
      property.descriptionEn?.trim() || undefined,
      property.descriptionZh?.trim() || undefined,
      property.descriptionJa?.trim() || undefined,
      property.descriptionAr?.trim() || undefined,
    );
  }
  const pack = propertyLocalePacks[property.slug];
  return resolveLocalized(
    locale,
    property.description,
    pack?.description.en,
    pack?.description.zh,
    pack?.description.ja,
    pack?.description.ar,
  );
}

export function localizedPropertyDistrict(property: Property, locale: Locale): string {
  const pack = propertyLocalePacks[property.slug];
  return resolveLocalized(
    locale,
    property.district,
    property.districtEn,
    pack?.district.zh,
    pack?.district.ja,
    pack?.district.ar,
  );
}

export function isNonThaiLocale(locale: Locale): boolean {
  return locale !== "th";
}
