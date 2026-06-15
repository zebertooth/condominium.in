import { prisma } from "@/lib/db";
import { blogPosts as staticBlogPosts } from "@/lib/blog-static";
import type {
  BlogArticleType,
  BlogFactSheet,
  BlogPost,
  BlogSection,
} from "@/types/property";
import { BLOG_ARTICLE_TYPES } from "@/types/property";

const REVIEW_TYPES: BlogArticleType[] = ["project_review", "project_preview"];
const GUIDE_TYPES: BlogArticleType[] = ["guide", "area_review"];

type DbArticle = {
  slug: string;
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  category: string;
  categoryEn: string;
  imageUrl: string;
  publishedAt: Date;
  readTime: number;
  seoTitle: string;
  seoTitleEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
  status: string;
  articleType?: string;
  projectId?: string | null;
  authorName?: string;
  authorTitle?: string;
  reviewNumber?: number | null;
  factsJson?: string;
  sectionsJson?: string;
  galleryUrls?: string;
  videoUrl?: string;
  relatedSlugs?: string;
  project?: { slug: string; name: string } | null;
};

function parseJsonArray(value: string | undefined): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function parseFacts(value: string | undefined): BlogFactSheet | undefined {
  if (!value || value === "{}") return undefined;
  try {
    const parsed = JSON.parse(value) as BlogFactSheet;
    return typeof parsed === "object" && parsed !== null ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function parseSections(value: string | undefined): BlogSection[] {
  if (!value || value === "[]") return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (s): s is BlogSection =>
        typeof s === "object" &&
        s !== null &&
        typeof (s as BlogSection).id === "string" &&
        typeof (s as BlogSection).title === "string",
    );
  } catch {
    return [];
  }
}

export function dbArticleToPost(row: DbArticle): BlogPost {
  const articleType = (row.articleType ?? "guide") as BlogArticleType;
  const facts = parseFacts(row.factsJson);
  const sections = parseSections(row.sectionsJson);
  const galleryUrls = parseJsonArray(row.galleryUrls);
  const relatedSlugs = parseJsonArray(row.relatedSlugs);

  return {
    slug: row.slug,
    title: row.title,
    titleEn: row.titleEn || undefined,
    excerpt: row.excerpt,
    excerptEn: row.excerptEn || undefined,
    content: row.content,
    contentEn: row.contentEn || undefined,
    category: row.category,
    categoryEn: row.categoryEn || undefined,
    imageUrl: row.imageUrl || undefined,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    readTime: row.readTime,
    seoTitle: row.seoTitle,
    seoTitleEn: row.seoTitleEn || undefined,
    seoDescription: row.seoDescription,
    seoDescriptionEn: row.seoDescriptionEn || undefined,
    articleType,
    projectId: row.projectId ?? undefined,
    projectSlug: row.project?.slug,
    projectName: row.project?.name,
    authorName: row.authorName || undefined,
    authorTitle: row.authorTitle || undefined,
    reviewNumber: row.reviewNumber ?? undefined,
    facts,
    sections: sections.length > 0 ? sections : undefined,
    galleryUrls: galleryUrls.length > 0 ? galleryUrls : undefined,
    videoUrl: row.videoUrl || undefined,
    relatedSlugs: relatedSlugs.length > 0 ? relatedSlugs : undefined,
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

export async function uniqueBlogSlug(title: string, excludeId?: string): Promise<string> {
  const base = slugify(title) || "article";
  let slug = base;
  let i = 1;

  while (true) {
    const existing = await prisma.blogArticle.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

const articleInclude = {
  project: { select: { slug: true, name: true } },
} as const;

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogArticle.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      include: articleInclude,
    });
    if (rows.length > 0) return rows.map(dbArticleToPost);
  } catch {
    // DB unavailable at build — fall back to static
  }
  return staticBlogPosts;
}

export async function getBlogPostsByTypes(types: BlogArticleType[]): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogArticle.findMany({
      where: { status: "published", articleType: { in: types } },
      orderBy: { publishedAt: "desc" },
      include: articleInclude,
    });
    if (rows.length > 0) return rows.map(dbArticleToPost);
  } catch {
    // fallback below
  }

  if (types.includes("guide")) {
    return staticBlogPosts.filter(
      (p) => !p.articleType || types.includes(p.articleType ?? "guide"),
    );
  }
  return [];
}

export async function getLatestReviewPosts(limit = 3): Promise<BlogPost[]> {
  const reviews = await getBlogPostsByTypes(REVIEW_TYPES);
  return reviews.slice(0, limit);
}

export async function getGuidePosts(): Promise<BlogPost[]> {
  const dbGuides = await getBlogPostsByTypes(GUIDE_TYPES);
  if (dbGuides.length > 0) return dbGuides;
  return staticBlogPosts;
}

export async function getBlogPostsByProjectSlug(projectSlug: string): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogArticle.findMany({
      where: {
        status: "published",
        project: { slug: projectSlug },
      },
      orderBy: { publishedAt: "desc" },
      include: articleInclude,
    });
    return rows.map(dbArticleToPost);
  } catch {
    return [];
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const row = await prisma.blogArticle.findFirst({
      where: { slug, status: "published" },
      include: articleInclude,
    });
    if (row) return dbArticleToPost(row);
  } catch {
    // fallback
  }
  return staticBlogPosts.find((p) => p.slug === slug);
}

export async function getAllBlogArticlesAdmin() {
  return prisma.blogArticle.findMany({
    orderBy: { publishedAt: "desc" },
    include: articleInclude,
  });
}

export async function getBlogArticleById(id: string) {
  return prisma.blogArticle.findUnique({
    where: { id },
    include: articleInclude,
  });
}

export function isReviewArticle(post: BlogPost): boolean {
  return post.articleType === "project_review" || post.articleType === "project_preview";
}

export { BLOG_ARTICLE_TYPES };
