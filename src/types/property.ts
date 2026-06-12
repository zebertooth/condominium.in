export type ListingType = "sale" | "rent";
export type PropertyType = "condo" | "house" | "townhouse" | "apartment";

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
  floor?: number;
  district: string;
  districtEn: string;
  btsStation?: string;
  btsLine?: string;
  distanceToBtsMeters?: number;
  address: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  images: string[];
  status?: "pending" | "published" | "rejected" | "deleted";
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
}

export interface AISearchResult {
  summary: string;
  properties: Property[];
  suggestions: string[];
  engine?: "ai" | "rules";
}
