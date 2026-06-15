export const DEFAULT_LISTING_IMAGE =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80";

/** Accept only absolute http(s) URLs or site-relative upload paths. */
export function isValidImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith("/uploads/") || trimmed.startsWith("/images/")) {
    return true;
  }

  if (!/^https?:\/\//i.test(trimmed)) {
    return false;
  }

  try {
    const url = new URL(trimmed);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/** Parse comma-separated image URLs from CSV (ignores non-URL tokens like Thai feature names). */
export function parseListingImageUrls(raw?: string | null): string[] {
  if (!raw?.trim()) return [];

  return raw
    .split(",")
    .map((part) => part.trim())
    .filter(isValidImageSrc);
}

/** Ensure at least one render-safe image URL for cards and galleries. */
export function normalizeListingImages(images?: string[] | null): string[] {
  const valid = (images ?? []).map((src) => src.trim()).filter(isValidImageSrc);
  return valid.length > 0 ? valid : [DEFAULT_LISTING_IMAGE];
}

export function resolveListingImage(images?: string[] | null, index = 0): string {
  return normalizeListingImages(images)[index] ?? DEFAULT_LISTING_IMAGE;
}
