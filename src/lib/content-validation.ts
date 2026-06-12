import { z } from "zod";

export const teamAgentSchema = z.object({
  name: z.string().min(2, "กรุณากรอกชื่อ"),
  role: z.string().min(2, "กรุณากรอกตำแหน่ง"),
  roleEn: z.string().optional(),
  areas: z.array(z.string()).default([]),
  languages: z.array(z.string()).default([]),
  deals: z.number().int().min(0).max(100000).default(0),
  imageUrl: z.string().optional(),
  sortOrder: z.number().int().min(0).max(999).default(0),
  published: z.boolean().default(true),
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
});
