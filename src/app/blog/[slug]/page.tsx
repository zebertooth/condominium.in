import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogSuggestedListings } from "@/components/blog/BlogSuggestedListings";
import { BlogVideoEmbed } from "@/components/blog/BlogVideoEmbed";
import { SourceCredit } from "@/components/blog/SourceCredit";
import { ReviewArticleLayout } from "@/components/blog/ReviewArticleLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPostBySlug, isReviewArticle } from "@/lib/blog";
import { getBlogSuggestedListings } from "@/lib/blog-suggestions";
import { renderBlogContent } from "@/lib/blog-render";
import {
  blogCategory,
  blogContent,
  blogExcerpt,
  blogSeoDescription,
  blogSeoTitle,
  blogTitle,
  dateLocale,
  isNonThaiLocale,
} from "@/lib/locale-content";
import { getReviewRelatedListings } from "@/lib/blog-related-listings";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata, siteConfig } from "@/lib/seo";
import { t } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};

  const locale = await getLocale();

  return createMetadata({
    title: blogSeoTitle(post, locale),
    description: blogSeoDescription(post, locale),
    path: `/blog/${slug}`,
    keywords: [blogCategory(post, locale)],
    locale,
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const [locale, suggestedListings] = await Promise.all([
    getLocale(),
    getBlogSuggestedListings(),
  ]);

  if (isReviewArticle(post)) {
    const relatedListings = await getReviewRelatedListings(post);
    return (
      <ReviewArticleLayout
        post={post}
        locale={locale}
        relatedListings={relatedListings}
        suggestedListings={suggestedListings}
      />
    );
  }

  const lp = (path: string) => localePath(path, locale);
  const nonTh = isNonThaiLocale(locale);
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const content = blogContent(post, locale);
  const category = blogCategory(post, locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.publishedAt,
    author: { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:max-w-4xl">
        <JsonLd data={jsonLd} />

        <nav className="mb-6 text-sm text-slate-500">
          <Link href={lp("/")} className="hover:text-teal-700">
            {t("home", locale)}
          </Link>
          {" / "}
          <Link href={lp("/blog")} className="hover:text-teal-700">
            {t("blog", locale)}
          </Link>
          {" / "}
          <Link href={lp("/blog/guides")} className="hover:text-teal-700">
            {t("blogHubGuides", locale)}
          </Link>
          {" / "}
          <span className="text-slate-900">{title}</span>
        </nav>

        <AdSlot position="blogTop" format="auto" className="mb-6" />

        {post.imageUrl && (
          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={post.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
          {category}
        </span>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-slate-500">
          {new Date(post.publishedAt).toLocaleDateString(dateLocale(locale), {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readTime} {t("readTime", locale)}
        </p>

        <AdSlot position="blogInarticle" format="rectangle" className="my-8" />

        {post.videoUrl && (
          <BlogVideoEmbed url={post.videoUrl} title={title} className="mt-8" />
        )}

        <div className="prose mt-8 max-w-none">{renderBlogContent(content)}</div>

        <SourceCredit post={post} locale={locale} />

        <div className="mt-12 rounded-2xl bg-teal-50 p-6">
          <h2 className="font-bold text-teal-900">
            {nonTh ? "Ready to find your condo?" : "พร้อมหาคอนโดแล้ว?"}
          </h2>
          <p className="mt-2 text-teal-800">
            {nonTh
              ? "Use AI search to find matching properties or contact our agent team."
              : "ใช้ AI ค้นหาทรัพย์ที่ตรงใจ หรือติดต่อทีมเอเจนต์เพื่อนัดชมจริง"}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              href={lp("/ai-search")}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white"
            >
              {t("aiSearch", locale)}
            </Link>
            <Link
              href={lp("/contact")}
              className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
            >
              {t("contact", locale)}
            </Link>
          </div>
        </div>
      </article>

      <BlogSuggestedListings locale={locale} properties={suggestedListings} />
    </>
  );
}
