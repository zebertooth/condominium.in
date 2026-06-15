import { t, tf, type Locale } from "@/lib/i18n";
import type { ListingSort, Property } from "@/types/property";
import { LISTING_SORT_OPTIONS } from "@/types/property";

export function parseListingSort(value?: string): ListingSort {
  if (value && LISTING_SORT_OPTIONS.includes(value as ListingSort)) {
    return value as ListingSort;
  }
  return "recommended";
}

export function sortListings(list: Property[], sort: ListingSort = "recommended"): Property[] {
  const items = [...list];

  switch (sort) {
    case "newest":
      return items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    case "price_asc":
      return items.sort((a, b) => a.price - b.price);
    case "price_desc":
      return items.sort((a, b) => b.price - a.price);
    case "recommended":
    default:
      return items.sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;
        return b.publishedAt.localeCompare(a.publishedAt);
      });
  }
}

export function formatPricePerSqm(
  price: number,
  areaSqm: number,
  listingType: Property["listingType"],
  locale: Locale,
): string | null {
  if (areaSqm <= 0 || listingType !== "sale") return null;
  const perSqm = Math.round(price / areaSqm);
  return tf("pricePerSqm", locale, { price: perSqm.toLocaleString(locale === "th" ? "th-TH" : "en-US") });
}

export function formatListedAge(publishedAt: string, locale: Locale): string {
  const published = new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return "";

  const now = new Date();
  const diffMs = now.getTime() - published.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return t("listedToday", locale);
  if (days === 1) return t("listedYesterday", locale);
  if (days < 7) return tf("listedDaysAgo", locale, { days });
  if (days < 30) return tf("listedWeeksAgo", locale, { weeks: Math.floor(days / 7) });
  return tf("listedMonthsAgo", locale, { months: Math.floor(days / 30) });
}
