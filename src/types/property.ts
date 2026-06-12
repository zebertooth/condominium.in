import type { PropertyCategory } from "@/lib/property-types";

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
}

export interface SearchFilters {
  listingType?: ListingType;
  propertyCategory?: PropertyCategory;
  propertyType?: PropertyType;
  district?: string;
  btsStation?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  query?: string;
}

export interface AISearchRequest {
  query: string;
  listingType?: ListingType;
  propertyCategory?: PropertyCategory;
}

export interface AISearchResult {
  summary: string;
  properties: Property[];
  suggestions: string[];
  engine?: "ai" | "rules";
}
