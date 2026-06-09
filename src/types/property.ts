export type ListingType = "sale" | "rent";
export type PropertyType = "condo" | "house" | "townhouse" | "apartment";

export interface Property {
  id: string;
  slug: string;
  title: string;
  titleEn: string;
  description: string;
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
}

export interface AreaGuide {
  slug: string;
  name: string;
  nameEn: string;
  btsLine: string;
  btsStation: string;
  description: string;
  seoTitle: string;
  seoDescription: string;
  highlights: string[];
  avgRentPrice: number;
  avgSalePrice: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: number;
  seoTitle: string;
  seoDescription: string;
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
