import { NextResponse } from "next/server";
import { adminRouteError, requireAdmin } from "@/lib/admin";
import { getBlogArticleById, uniqueBlogSlug } from "@/lib/blog-articles";
import { blogArticleSchema } from "@/lib/content-validation";
import { prisma } from "@/lib/db";
import { parseRequestJson } from "@/lib/request";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const article = await getBlogArticleById(id);
    if (!article) {
      return NextResponse.json({ error: "ไม่พบบทความ" }, { status: 404 });
    }
    return NextResponse.json({ article });
  } catch (error) {
    return adminRouteError(error, "โหลดบทความไม่สำเร็จ");
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    const existing = await getBlogArticleById(id);
    if (!existing) {
      return NextResponse.json({ error: "ไม่พบบทความ" }, { status: 404 });
    }

    const body = await parseRequestJson(request);
    const parsed = blogArticleSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const slug =
      existing.title !== data.title
        ? await uniqueBlogSlug(data.title, id)
        : existing.slug;

    const article = await prisma.blogArticle.update({
      where: { id },
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

    return NextResponse.json({ message: "บันทึกบทความแล้ว", article });
  } catch (error) {
    return adminRouteError(error, "บันทึกบทความไม่สำเร็จ");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = await context.params;
    await prisma.blogArticle.delete({ where: { id } });
    return NextResponse.json({ message: "ลบบทความแล้ว" });
  } catch (error) {
    return adminRouteError(error, "ลบบทความไม่สำเร็จ");
  }
}
