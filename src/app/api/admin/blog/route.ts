import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { blogArticleToDbData } from "@/lib/blog-admin";
import { getAllBlogArticlesAdmin, uniqueBlogSlug } from "@/lib/blog-articles";
import { blogArticleSchema } from "@/lib/content-validation";
import { prisma } from "@/lib/db";
import { notifyNewsletterSubscribersForArticle } from "@/lib/newsletter-digest";
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
    const dbData = await blogArticleToDbData(data);

    const article = await prisma.blogArticle.create({
      data: {
        slug,
        ...dbData,
      },
    });

    if (data.status === "published") {
      void notifyNewsletterSubscribersForArticle({
        slug: article.slug,
        title: article.title,
        titleEn: article.titleEn,
        excerpt: article.excerpt,
        excerptEn: article.excerptEn,
      }).catch((err) => console.error("[newsletter] publish notify failed", err));
    }

    return NextResponse.json({ message: "สร้างบทความแล้ว", article });
  } catch (error) {
    return adminRouteError(error, "สร้างบทความไม่สำเร็จ");
  }
}
