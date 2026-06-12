import { prisma } from "@/lib/db";
import { blogPosts as staticBlogPosts } from "@/lib/blog-static";
import type { BlogPost } from "@/types/property";

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
};

export function dbArticleToPost(row: DbArticle): BlogPost {
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

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await prisma.blogArticle.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
    });
    if (rows.length > 0) return rows.map(dbArticleToPost);
  } catch {
    // DB unavailable at build — fall back to static
  }
  return staticBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const row = await prisma.blogArticle.findFirst({
      where: { slug, status: "published" },
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
  });
}

export async function getBlogArticleById(id: string) {
  return prisma.blogArticle.findUnique({ where: { id } });
}
