import type { PropertyCategory } from "@/lib/property-types";
import type { AISearchRequest } from "@/types/property";

/** Cached filter/summary slice — listings are always re-matched on hit. */
export interface CachedAISearchSlice {
  listingType?: "sale" | "rent";
  propertyCategory?: PropertyCategory;
  btsStation?: string;
  district?: string;
  bedrooms?: number;
  maxPrice?: number;
  engine: "ai" | "rules";
  /** Present when engine was ai and llmSummary ran */
  summary?: string;
  /** Listing slugs when summary was generated — invalidated on cache hit if results change */
  summaryResultSlugs?: string;
  expiresAt: number;
}

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ENTRIES = 500;

const store = new Map<string, CachedAISearchSlice>();

function ttlMs(): number {
  const raw = process.env.AI_SEARCH_CACHE_TTL_MS;
  if (!raw) return DEFAULT_TTL_MS;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_TTL_MS;
}

export function normalizeAISearchQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export function aiSearchCacheKey(request: AISearchRequest): string {
  const q = normalizeAISearchQuery(request.query);
  const lt = request.listingType ?? "";
  const cat = request.propertyCategory ?? "all";
  return `${lt}|${cat}|${q}`;
}

export function getCachedAISearch(key: string): CachedAISearchSlice | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function setCachedAISearch(
  key: string,
  slice: Omit<CachedAISearchSlice, "expiresAt">,
): void {
  if (store.size >= MAX_ENTRIES) {
    const oldest = [...store.entries()].sort((a, b) => a[1].expiresAt - b[1].expiresAt)[0];
    if (oldest) store.delete(oldest[0]);
  }
  store.set(key, { ...slice, expiresAt: Date.now() + ttlMs() });
}

export function clearAISearchCache(): void {
  store.clear();
}
