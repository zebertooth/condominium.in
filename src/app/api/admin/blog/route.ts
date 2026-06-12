import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { getAllBlogArticlesAdmin, uniqueBlogSlug } from "@/lib/blog-articles";
import { blogArticleSchema } from "@/lib/content-validation";
import { prisma } from "@/lib/db";
import { parseRequestJson } from "@/lib/request";

export async function GET() {
  try {
    await requireAdmin();
    const articles = await getAllBlogArticlesAdmin();
    return NextResponse.json({ articles });
  } catch (error) {
    return adminRouteError(error, "โหลดบทความไม่สำเร็จ");
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await parseRequestJson(request);
    const parsed = blogArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const slug = await uniqueBlogSlug(data.title);

    const article = await prisma.blogArticle.create({
      data: {
        slug,
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
      },
    });

    return NextResponse.json({ message: "สร้างบทความแล้ว", article });
  } catch (error) {
    return adminRouteError(error, "สร้างบทความไม่สำเร็จ");
  }
}
