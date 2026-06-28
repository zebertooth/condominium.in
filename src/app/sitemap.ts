import type { MetadataRoute } from "next";
import type { Locale } from "@/lib/i18n";
import { areaGuides } from "@/lib/areas";
import { BANGKOK_DISTRICTS } from "@/lib/bangkok-districts";
import { getAllBlogPosts, getBlogPostsByProjectSlug } from "@/lib/blog";
import { getAllListings } from "@/lib/listings";
import { ALL_LOCALES, publicPageUrl } from "@/lib/locale-routing";
import { getPublishedProjectSlugs } from "@/lib/projects";
import { siteConfig } from "@/lib/seo";

type SitemapEntry = MetadataRoute.Sitemap[number];

function entriesForPath(
  path: string,
  opts: {
    lastModified: Date;
    changeFrequency: SitemapEntry["changeFrequency"];
    priority: number;
  },
): MetadataRoute.Sitemap {
  return ALL_LOCALES.map((locale: Locale) => ({
    url: publicPageUrl(path, locale, siteConfig.url),
    lastModified: opts.lastModified,
    changeFrequency: opts.changeFrequency,
    priority: opts.priority,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "",
    "/buy",
    "/rent",
    "/projects",
    "/map",
    "/stations",
    "/districts",
    "/npa",
    "/market",
    "/compare",
    "/areas",
    "/ai-search",
    "/blog",
    "/blog/reviews",
    "/blog/guides",
    "/agents",
    "/list-property",
    "/contact",
    "/privacy",
    "/terms",
  ];

  const staticPages = staticPaths.flatMap((path) =>
    entriesForPath(path, {
      lastModified: now,
      changeFrequency: "daily",
      priority: path === "" ? 1 : 0.8,
    }),
  );

  let listings: Awaited<ReturnType<typeof getAllListings>> = [];
  if (process.env.DATABASE_URL) {
    try {
      listings = await getAllListings();
    } catch (error) {
      console.warn("[sitemap] Could not fetch listings:", error);
    }
  }

  const propertyPages = listings.flatMap((p) =>
    entriesForPath(`/property/${p.slug}`, {
      lastModified: new Date(p.publishedAt),
      changeFrequency: "weekly",
      priority: p.isDemo ? 0.5 : p.isUserListing ? 0.65 : 0.7,
    }),
  );

  const areaPages = areaGuides.flatMap((a) =>
    entriesForPath(`/areas/${a.slug}`, {
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    }),
  );

  const blogPosts = await getAllBlogPosts();

  let projectPages: MetadataRoute.Sitemap = [];
  if (process.env.DATABASE_URL) {
    try {
      const projects = await getPublishedProjectSlugs();
      projectPages = projects.flatMap((p) =>
        entriesForPath(`/projects/${p.slug}`, {
          lastModified: p.updatedAt,
          changeFrequency: "weekly",
          priority: 0.75,
        }),
      );
    } catch (error) {
      console.warn("[sitemap] Could not fetch projects:", error);
    }
  }

  const blogPages = blogPosts.flatMap((b) =>
    entriesForPath(`/blog/${b.slug}`, {
      lastModified: new Date(b.publishedAt),
      changeFrequency: "monthly",
      priority: b.articleType?.includes("review") || b.articleType === "project_preview" ? 0.8 : 0.75,
    }),
  );

  const blogProjectPages: MetadataRoute.Sitemap = [];
  if (process.env.DATABASE_URL) {
    try {
      const projects = await getPublishedProjectSlugs();
      for (const p of projects) {
        const articles = await getBlogPostsByProjectSlug(p.slug);
        if (articles.length > 0) {
          blogProjectPages.push(
            ...entriesForPath(`/blog/project/${p.slug}`, {
              lastModified: p.updatedAt,
              changeFrequency: "weekly",
              priority: 0.7,
            }),
          );
        }
      }
    } catch (error) {
      console.warn("[sitemap] Could not fetch blog project pages:", error);
    }
  }

  const rentUnderPages = ["15000", "25000", "40000", "60000"].flatMap((price) =>
    entriesForPath(`/rent/under/${price}`, {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    }),
  );

  const buyBedroomPages = ["1-bedroom", "2-bedroom", "3-bedroom"].flatMap((slug) =>
    entriesForPath(`/buy/${slug}`, {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.75,
    }),
  );

  const btsHubPages = areaGuides.flatMap((area) => {
    const station = area.slug.replace(/-bts$/, "");
    return [
      ...entriesForPath(`/buy/bts/${station}`, {
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      }),
      ...entriesForPath(`/rent/bts/${station}`, {
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      }),
    ];
  });

  const districtHubPages = BANGKOK_DISTRICTS.flatMap((d) => [
    ...entriesForPath(`/buy/district/${encodeURIComponent(d.slug)}`, {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.78,
    }),
    ...entriesForPath(`/rent/district/${encodeURIComponent(d.slug)}`, {
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.78,
    }),
  ]);

  return [
    ...staticPages,
    ...areaPages,
    ...btsHubPages,
    ...districtHubPages,
    ...rentUnderPages,
    ...buyBedroomPages,
    ...propertyPages,
    ...projectPages,
    ...blogPages,
    ...blogProjectPages,
  ];
}
