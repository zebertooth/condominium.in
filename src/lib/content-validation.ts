import { z } from "zod";

export const teamAgentSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อ"),
  role: z.string().min(2, "กรุณากรอกตำแหน่ง"),
  roleEn: z.string().optional(),
  areas: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  deals: z.number().int().min(0).max(100000).default(0),
  imageUrl: z.string().optional(),
  agentCategory: z.enum(["team", "freelance", "company"]).default("team"),
  sortOrder: z.number().int().min(0).max(999).default(0),
  published: z.boolean().default(true),
});

export const projectSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อโครงการ"),
  nameEn: z.string().optional(),
  developer: z.string().min(2, "กรุณากรอกชื่อผู้พัฒนา"),
  location: z.string().min(2, "กรุณากรอกที่ตั้ง"),
  district: z.string().optional(),
  btsStation: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  totalUnits: z.number().int().min(1).max(100000).optional(),
  completionDate: z.string().optional(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  published: z.boolean().default(true),
});

export const blogFactSchema = z.object({
  developer: z.string().optional(),
  totalUnits: z.string().optional(),
  pricePerSqm: z.string().optional(),
  btsDistance: z.string().optional(),
  completion: z.string().optional(),
  parking: z.string().optional(),
  facilities: z.string().optional(),
  suitableFor: z.string().optional(),
});

export const blogSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
});

export const blogArticleSchema = z.object({
  title: z.string().min(5),
  titleEn: z.string().optional(),
  excerpt: z.string().min(10),
  excerptEn: z.string().optional(),
  content: z.string().min(20),
  contentEn: z.string().optional(),
  category: z.string().min(2),
  categoryEn: z.string().optional(),
  imageUrl: z.string().optional(),
  publishedAt: z.string().min(1),
  readTime: z.number().int().min(1).max(120).default(5),
  seoTitle: z.string().min(5),
  seoTitleEn: z.string().optional(),
  seoDescription: z.string().min(10),
  seoDescriptionEn: z.string().optional(),
  status: z.enum(["draft", "published"]).default("published"),
  articleType: z
    .enum(["guide", "project_review", "project_preview", "area_review", "news"])
    .default("guide"),
  areaSlug: z.string().optional(),
  projectId: z.string().nullable().optional(),
  authorName: z.string().optional(),
  authorTitle: z.string().optional(),
  reviewNumber: z.number().int().min(1).max(999).nullable().optional(),
  facts: blogFactSchema.optional(),
  sections: z.array(blogSectionSchema).optional(),
  galleryUrls: z.array(z.string()).optional(),
  videoUrl: z.string().optional(),
  relatedSlugs: z.array(z.string()).optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
  sourceTitle: z.string().optional(),
});
