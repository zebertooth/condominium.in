import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { BlogSuggestedListings } from "@/components/blog/BlogSuggestedListings";
import { ArticleToc } from "@/components/blog/ArticleToc";
import { FactSheet } from "@/components/blog/FactSheet";
import { JsonLd } from "@/components/seo/JsonLd";
import { PropertyListingCarousel } from "@/components/property/PropertyListingCarousel";
import { SourceCredit } from "@/components/blog/SourceCredit";
import { MarketTrendsBanner } from "@/components/market/MarketTrendsBanner";
import { getAreaBySlug } from "@/lib/areas";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { BlogVideoEmbed } from "@/components/blog/BlogVideoEmbed";
import { renderBlogContent } from "@/lib/blog-render";
import {
  blogCategory,
  blogContent,
  blogExcerpt,
  blogTitle,
  dateLocale,
  isNonThaiLocale,
} from "@/lib/locale-content";
import { localePath } from "@/lib/locale-routing";
import { siteConfig } from "@/lib/seo";
import type { BlogPost, Property } from "@/types/property";

interface ReviewArticleLayoutProps {
  post: BlogPost;
  locale: Locale;
  relatedListings: Property[];
  suggestedListings: Property[];
}

export function ReviewArticleLayout({
  post,
  locale,
  relatedListings,
  suggestedListings,
}: ReviewArticleLayoutProps) {
  const lp = (path: string) => localePath(path, locale);
  const nonTh = isNonThaiLocale(locale);
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const content = blogContent(post, locale);
  const category = blogCategory(post, locale);
  const areaGuide = post.areaSlug ? getAreaBySlug(post.areaSlug) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    datePublished: post.publishedAt,
    author: post.authorName
      ? { "@type": "Person", name: post.authorName, jobTitle: post.authorTitle }
      : { "@type": "Organization", name: siteConfig.name },
    publisher: { "@type": "Organization", name: siteConfig.name },
  };

  return (
    <>
      <article className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
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
        <Link href={lp("/blog/reviews")} className="hover:text-teal-700">
          {t("blogHubReviews", locale)}
        </Link>
        {" / "}
        <span className="text-slate-900">{title}</span>
      </nav>

      <AdSlot position="blogTop" format="auto" className="mb-6" />

      {post.imageUrl && (
        <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={post.imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 1152px"
            priority
          />
        </div>
      )}

      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-800">
            {category}
          </span>
          {post.reviewNumber && (
            <span className="text-slate-500">
              {t("blogReviewNumber", locale)} {post.reviewNumber}
            </span>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-lg text-slate-600">{excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
          {post.authorName && (
            <span>
              {t("blogAuthor", locale)}:{" "}
              <span className="font-medium text-slate-800">{post.authorName}</span>
              {post.authorTitle ? ` · ${post.authorTitle}` : ""}
            </span>
          )}
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString(dateLocale(locale), {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span>
            {post.readTime} {t("readTime", locale)}
          </span>
        </div>
        {post.projectSlug && (
          <Link
            href={lp(`/projects/${post.projectSlug}`)}
            className="mt-4 inline-flex items-center text-sm font-medium text-teal-700 hover:underline"
          >
            {t("blogViewProject", locale)} →
          </Link>
        )}
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_280px]">
        <div className="min-w-0 space-y-8">
          {post.sections && post.sections.length > 0 && (
            <div className="lg:hidden">
              <ArticleToc sections={post.sections} locale={locale} />
            </div>
          )}

          <div className="prose max-w-none">{renderBlogContent(content)}</div>

          {post.facts?.suitableFor && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <h2 className="font-bold text-amber-900">{t("blogSuitableFor", locale)}</h2>
              <p className="mt-2 text-amber-950">{post.facts.suitableFor}</p>
            </div>
          )}

          {post.videoUrl && (
            <BlogVideoEmbed url={post.videoUrl} title={title} className="my-2" />
          )}

          {post.galleryUrls && post.galleryUrls.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t("blogGallery", locale)}</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {post.galleryUrls.map((url) => (
                  <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                    <Image src={url} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, 400px" />
                  </div>
                ))}
              </div>
            </div>
          )}

          <MarketTrendsBanner locale={locale} />

          {relatedListings.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t("blogRelatedListings", locale)}</h2>
              <p className="mt-1 text-sm text-slate-600">{t("blogRelatedListingsDesc", locale)}</p>
              <div className="-mx-4 mt-6 px-4 sm:mx-0 sm:px-1">
                <PropertyListingCarousel properties={relatedListings.slice(0, 6)} locale={locale} />
              </div>
            </div>
          )}

          <AdSlot position="blogInarticle" format="rectangle" className="my-4" />
        </div>

        <aside className="space-y-6">
          {post.facts && Object.keys(post.facts).length > 0 && (
            <FactSheet facts={post.facts} locale={locale} />
          )}
          {post.sections && post.sections.length > 0 && (
            <div className="hidden lg:block">
              <ArticleToc sections={post.sections} locale={locale} />
            </div>
          )}
        </aside>
      </div>

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
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={lp("/ai-search")}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white"
          >
            {t("aiSearch", locale)}
          </Link>
          {post.projectSlug && (
            <Link
              href={lp(`/projects/${post.projectSlug}`)}
              className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
            >
              {t("blogViewProject", locale)}
            </Link>
          )}
          {post.areaSlug && (
            <Link
              href={lp(`/areas/${post.areaSlug}`)}
              className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
            >
              {t("blogViewArea", locale)}
            </Link>
          )}
          {areaGuide && (
            <Link
              href={lp(`/map?bts=${encodeURIComponent(areaGuide.btsStation)}&type=rent`)}
              className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
            >
              {nonTh ? "Map" : "แผนที่"}
            </Link>
          )}
          <Link
            href={lp("/districts")}
            className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
          >
            {nonTh ? "Districts" : "ค้นหาตามเขต"}
          </Link>
          <Link
            href={lp("/stations")}
            className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800"
          >
            {nonTh ? "Stations" : "สถานีรถไฟฟ้า"}
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
