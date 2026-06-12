import type { MetadataRoute } from "next";
import { areaGuides } from "@/lib/areas";
import { getAllBlogPosts } from "@/lib/blog";
import { properties } from "@/lib/properties";
import { siteConfig } from "@/lib/seo";
import { getAllPublishedUserProperties } from "@/lib/user-properties";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages = [
    "",
    "/buy",
    "/rent",
    "/areas",
    "/ai-search",
    "/blog",
    "/agents",
    "/list-property",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  let userListings: Awaited<ReturnType<typeof getAllPublishedUserProperties>> = [];
  if (process.env.DATABASE_URL) {
    try {
      userListings = await getAllPublishedUserProperties();
    } catch (error) {
      console.warn("[sitemap] Could not fetch user listings:", error);
    }
  }

  const propertyPages = [
    ...properties.map((p) => ({
      url: `${base}/property/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...userListings.map((p) => ({
      url: `${base}/property/${p.slug}`,
      lastModified: new Date(p.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })),
  ];

  const areaPages = areaGuides.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const blogPosts = await getAllBlogPosts();

  const blogPages = blogPosts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...areaPages, ...propertyPages, ...blogPages];
}
