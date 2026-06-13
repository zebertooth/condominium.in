import type { MetadataRoute } from "next";
import { areaGuides } from "@/lib/areas";
import { getAllBlogPosts } from "@/lib/blog";
import { getAllListings } from "@/lib/listings";
import { getPublishedProjectSlugs } from "@/lib/projects";
import { siteConfig } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticPages = [
    "",
    "/buy",
    "/rent",
    "/projects",
    "/map",
    "/npa",
    "/market",
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

  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  if (process.env.DATABASE_URL) {
    try {
      listings = await getAllListings();
    } catch (error) {
      console.warn("[sitemap] Could not fetch listings:", error);
    }
  }

  const propertyPages = listings.map((p) => ({
    url: `${base}/property/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "weekly" as const,
    priority: p.isDemo ? 0.5 : p.isUserListing ? 0.65 : 0.7,
  }));

  const areaPages = areaGuides.map((a) => ({
    url: `${base}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const blogPosts = await getAllBlogPosts();

  let projectPages: MetadataRoute.Sitemap = [];
  if (process.env.DATABASE_URL) {
    try {
      const projects = await getPublishedProjectSlugs();
      projectPages = projects.map((p) => ({
        url: `${base}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    } catch (error) {
      console.warn("[sitemap] Could not fetch projects:", error);
    }
  }

  const blogPages = blogPosts.map((b) => ({
    url: `${base}/blog/${b.slug}`,
    lastModified: new Date(b.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...staticPages, ...areaPages, ...propertyPages, ...projectPages, ...blogPages];
}
