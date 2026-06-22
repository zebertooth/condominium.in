import type { z } from "zod";
import { areaGuides } from "@/lib/areas";
import { validateProjectId } from "@/lib/projects";
import { blogArticleSchema } from "@/lib/content-validation";

type BlogArticleInput = z.infer<typeof blogArticleSchema>;

const validAreaSlugs = new Set(areaGuides.map((a) => a.slug));

function normalizeAreaSlug(value?: string | null): string {
  const slug = value?.trim() ?? "";
  if (!slug) return "";
  return validAreaSlugs.has(slug) ? slug : "";
}

export async function blogArticleToDbData(data: BlogArticleInput) {
  const projectId = await validateProjectId(data.projectId ?? null);

  return {
    title: data.title,
    titleEn: data.titleEn ?? "",
    excerpt: data.excerpt,
    excerptEn: data.excerptEn ?? "",
    content: data.content,
    contentEn: data.contentEn ?? "",
    category: data.category,
    categoryEn: data.categoryEn ?? "",
    imageUrl: data.imageUrl ?? "",
    publishedAt: new Date(data.publishedAt),
    readTime: data.readTime,
    seoTitle: data.seoTitle,
    seoTitleEn: data.seoTitleEn ?? "",
    seoDescription: data.seoDescription,
    seoDescriptionEn: data.seoDescriptionEn ?? "",
    status: data.status,
    articleType: data.articleType,
    areaSlug: normalizeAreaSlug(data.areaSlug),
    projectId,
    authorName: data.authorName ?? "",
    authorTitle: data.authorTitle ?? "",
    reviewNumber: data.reviewNumber ?? null,
    factsJson: JSON.stringify(data.facts ?? {}),
    sectionsJson: JSON.stringify(data.sections ?? []),
    galleryUrls: JSON.stringify(data.galleryUrls ?? []),
    videoUrl: data.videoUrl ?? "",
    relatedSlugs: JSON.stringify(data.relatedSlugs ?? []),
    sourceName: data.sourceName ?? "",
    sourceUrl: data.sourceUrl ?? "",
    sourceTitle: data.sourceTitle ?? "",
  };
}

export function blogArticleFromDb(row: {
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
  articleType: string;
  areaSlug: string;
  projectId: string | null;
  authorName: string;
  authorTitle: string;
  reviewNumber: number | null;
  factsJson: string;
  sectionsJson: string;
  galleryUrls: string;
  videoUrl: string;
  relatedSlugs: string;
  sourceName: string;
  sourceUrl: string;
  sourceTitle: string;
}) {
  let facts = {};
  let sections: { id: string; title: string }[] = [];
  let galleryUrls: string[] = [];
  let relatedSlugs: string[] = [];

  try {
    facts = JSON.parse(row.factsJson || "{}") as Record<string, string>;
  } catch {
    facts = {};
  }
  try {
    sections = JSON.parse(row.sectionsJson || "[]") as { id: string; title: string }[];
  } catch {
    sections = [];
  }
  try {
    galleryUrls = JSON.parse(row.galleryUrls || "[]") as string[];
  } catch {
    galleryUrls = [];
  }
  try {
    relatedSlugs = JSON.parse(row.relatedSlugs || "[]") as string[];
  } catch {
    relatedSlugs = [];
  }

  return {
    title: row.title,
    titleEn: row.titleEn,
    excerpt: row.excerpt,
    excerptEn: row.excerptEn,
    content: row.content,
    contentEn: row.contentEn,
    category: row.category,
    categoryEn: row.categoryEn,
    imageUrl: row.imageUrl,
    publishedAt: row.publishedAt.toISOString().slice(0, 10),
    readTime: row.readTime,
    seoTitle: row.seoTitle,
    seoTitleEn: row.seoTitleEn,
    seoDescription: row.seoDescription,
    seoDescriptionEn: row.seoDescriptionEn,
    status: row.status,
    articleType: row.articleType,
    areaSlug: row.areaSlug,
    projectId: row.projectId,
    authorName: row.authorName,
    authorTitle: row.authorTitle,
    reviewNumber: row.reviewNumber,
    facts,
    sections,
    galleryUrls,
    videoUrl: row.videoUrl,
    relatedSlugs,
    sourceName: row.sourceName,
    sourceUrl: row.sourceUrl,
    sourceTitle: row.sourceTitle,
  };
}
