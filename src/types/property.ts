import type { PropertyCategory } from "@/lib/property-types";
import type { FurnishingStatus } from "@/lib/furnishing";

export type ListingType = "sale" | "rent";
export type PropertyType =
  | "condo"
  | "apartment"
  | "house"
  | "townhouse"
  | "land"
  | "commercial"
  | "npa";

export interface ListingPoster {
  userId: string;
  fullName: string;
  phone?: string;
  email?: string;
  role: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
  /** Owner listing locale fields (Phase 7) — empty for static demos */
  descriptionEn?: string;
  titleZh?: string;
  descriptionZh?: string;
  titleJa?: string;
  descriptionJa?: string;
  titleAr?: string;
  descriptionAr?: string;
  /** Nearby places, schools, malls — free text for search matching */
  highlights?: string;
  listingType: ListingType;
  propertyType: PropertyType;
  price: number;
  priceUnit: "THB" | "THB/month";
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  /** Land plot size in square wah (ตร.ว.) */
  landSqWah?: number;
  floor?: number;
  district: string;
  districtEn: string;
  btsStation?: string;
  btsLine?: string;
  distanceToBtsMeters?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  /** NPA / bank foreclosure listing */
  npaBank?: string;
  npaReferenceUrl?: string;
  features: string[];
  /** DB listings — furnished, unfurnished, partially, unknown */
  furnishing?: FurnishingStatus;
  images: string[];
  status?: "pending" | "published" | "rejected" | "deleted";
  /** Admin recheck queue — listing may still be published */
  needsReview?: boolean;
  moderationFlags?: string[];
  featured: boolean;
  publishedAt: string;
  /** Set for user-submitted listings */
  poster?: ListingPoster;
  /** owner_direct when owner handles contact; agent_team for agent/admin or agent-managed */
  contactMode?: "owner_direct" | "agent_team";
  /** Owner opted in for platform agent to handle all inquiries */
  agentManaged?: boolean;
  isUserListing?: boolean;
  viewsCount?: number;
  inquiriesCount?: number;
  contactClicksCount?: number;
  viewsCount30d?: number;
  inquiriesCount30d?: number;
  contactClicksCount30d?: number;
  /** ISO date — active sponsored placement expiry */
  sponsoredUntil?: string;
  /** Sample listing from src/lib/properties.ts — hidden when real inventory is enough */
  isDemo?: boolean;
  /** Linked condo/development project */
  projectSlug?: string;
  projectName?: string;
  projectNameEn?: string;
  projectId?: string;
  /** Recent price decrease within 30 days */
  priceReduced?: boolean;
}

export interface AreaGuide {
  slug: string;
  name: string;
  nameEn: string;
  btsLine: string;
  btsStation: string;
  description: string;
  descriptionEn?: string;
  seoTitle: string;
  seoTitleEn?: string;
  seoDescription: string;
  seoDescriptionEn?: string;
  highlights: string[];
  highlightsEn?: string[];
  avgRentPrice: number;
  avgSalePrice: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string;
  contentEn?: string;
  category: string;
  categoryEn?: string;
  publishedAt: string;
  readTime: number;
  seoTitle: string;
  seoTitleEn?: string;
  seoDescription: string;
  seoDescriptionEn?: string;
  /** Cover / hero image for list and article page */
  imageUrl?: string;
  /** Phase 9 — editorial review fields (DB articles only) */
  articleType?: BlogArticleType;
  /** BTS area guide slug for conversion CTAs — e.g. asoke-bts */
  areaSlug?: string;
  projectId?: string;
  projectSlug?: string;
  projectName?: string;
  projectBtsStation?: string;
  authorName?: string;
  authorTitle?: string;
  reviewNumber?: number;
  facts?: BlogFactSheet;
  sections?: BlogSection[];
  galleryUrls?: string[];
  videoUrl?: string;
  relatedSlugs?: string[];
  /** Syndicated / referenced editorial — credit shown at article footer */
  sourceName?: string;
  sourceUrl?: string;
  sourceTitle?: string;
}

export type BlogArticleType =
  | "guide"
  | "project_review"
  | "project_preview"
  | "area_review"
  | "news";

export const BLOG_ARTICLE_TYPES: BlogArticleType[] = [
  "guide",
  "project_review",
  "project_preview",
  "area_review",
  "news",
];

export interface BlogFactSheet {
  developer?: string;
  totalUnits?: string;
  pricePerSqm?: string;
  btsDistance?: string;
  completion?: string;
  parking?: string;
  facilities?: string;
  suitableFor?: string;
}

export interface BlogSection {
  id: string;
  title: string;
}

export interface SearchFilters {
  listingType?: ListingType;
  propertyCategory?: PropertyCategory;
  propertyType?: PropertyType;
  district?: string;
  btsStation?: string;
  minPrice?: number;
  maxPrice?: number;
  minSqm?: number;
  maxSqm?: number;
  furnishing?: FurnishingFilter;
  bedrooms?: number;
  query?: string;
  sort?: ListingSort;
}

export type ListingSort = "recommended" | "newest" | "price_asc" | "price_desc";

export type FurnishingFilter = "furnished" | "unfurnished";

export const LISTING_SORT_OPTIONS: ListingSort[] = [
  "recommended",
  "newest",
  "price_asc",
  "price_desc",
];

export interface AISearchRequest {
  query: string;
  listingType?: ListingType;
  propertyCategory?: PropertyCategory;
}

export interface AISearchExtractedFilters {
  listingType?: ListingType;
  btsStation?: string;
  district?: string;
  bedrooms?: number;
  maxPrice?: number;
}

export interface AISearchHubLink {
  label: string;
  href: string;
}

export interface AISearchResult {
  summary: string;
  properties: Property[];
  suggestions: string[];
  engine?: "ai" | "rules";
  filters?: AISearchExtractedFilters;
  hubLinks?: AISearchHubLink[];
  /** True when filters/summary were served from in-memory cache */
  cacheHit?: boolean;
  /** True when LLM extract was skipped because rules already parsed enough */
  skipLlmExtract?: boolean;
}
