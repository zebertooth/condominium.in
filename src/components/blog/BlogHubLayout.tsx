import Link from "next/link";
import { BlogAreaStrip } from "@/components/blog/BlogAreaStrip";
import { BlogCategoryBrowse } from "@/components/blog/BlogCategoryBrowse";
import { BlogFeaturedSection } from "@/components/blog/BlogFeaturedSection";
import { BlogGridCard } from "@/components/blog/BlogGridCard";
import { BlogHubNav } from "@/components/blog/BlogHubNav";
import { BlogSuggestedListings } from "@/components/blog/BlogSuggestedListings";
import { NewsletterSignup } from "@/components/blog/NewsletterSignup";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import { localePath } from "@/lib/locale-routing";
import type { BlogPost, Property } from "@/types/property";

interface BlogHubLayoutProps {
  locale: Locale;
  activeTab: "all" | "reviews" | "guides";
  posts: BlogPost[];
  reviewPosts: BlogPost[];
  guidePosts: BlogPost[];
  suggestedListings: Property[];
  heroTitleKey?: "blogHubHeroTitle" | "blogReviewsTitle" | "blogGuidesTitle";
  heroDescKey?: "blogHubHeroDesc" | "blogReviewsDesc" | "blogGuidesDesc";
  gridTitleKey?: "blogLatestReviews" | "blogLatestGuides" | "blogLatestArticles";
  gridViewAllHref?: string;
  showFeatured?: boolean;
  showCategoryBrowse?: boolean;
  showAreaStrip?: boolean;
}

export function BlogHubLayout({
  locale,
  activeTab,
  posts,
  reviewPosts,
  guidePosts,
  suggestedListings,
  heroTitleKey = "blogHubHeroTitle",
  heroDescKey = "blogHubHeroDesc",
  gridTitleKey = "blogLatestArticles",
  gridViewAllHref,
  showFeatured = true,
  showCategoryBrowse = true,
  showAreaStrip = true,
}: BlogHubLayoutProps) {
  const lp = (path: string) => localePath(path, locale);

  const featuredPool =
    activeTab === "reviews"
      ? reviewPosts
      : activeTab === "guides"
        ? guidePosts
        : reviewPosts.length > 0
          ? reviewPosts
          : posts;

  const featured = featuredPool[0];
  const popular = featuredPool.slice(1, 4);
  const gridPosts = posts.slice(showFeatured && featured ? 1 : 0);

  const viewAllHref =
    gridViewAllHref ??
    (activeTab === "reviews"
      ? lp("/blog/reviews")
      : activeTab === "guides"
        ? lp("/blog/guides")
        : lp("/blog/reviews"));

  return (
    <>
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
          <nav className="text-sm text-slate-500">
            <Link href={lp("/")} className="hover:text-teal-700">
              {t("home", locale)}
            </Link>
            {" / "}
            <span className="text-slate-800">{t("blog", locale)}</span>
          </nav>
        </div>
      </div>

      <div className="bg-white pb-4 pt-10">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t(heroTitleKey, locale)}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600 sm:text-lg">
            {t(heroDescKey, locale)}
          </p>
          <div className="flex justify-center">
            <BlogHubNav locale={locale} active={activeTab} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6">
        {showFeatured && featured && (
          <BlogFeaturedSection featured={featured} popular={popular} locale={locale} />
        )}

        {showCategoryBrowse && activeTab === "all" && (
          <BlogCategoryBrowse locale={locale} />
        )}

        <section>
          <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {t(gridTitleKey, locale)}
            </h2>
            {activeTab === "all" && reviewPosts.length > 0 && (
              <Link
                href={viewAllHref}
                className="shrink-0 text-sm font-medium text-teal-700 hover:underline"
              >
                {t("blogViewAll", locale)} →
              </Link>
            )}
          </div>

          {gridPosts.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-600">
              {t("blogReviewsEmpty", locale)}
            </p>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post) => (
                <BlogGridCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </section>

        {showAreaStrip && activeTab === "all" && <BlogAreaStrip locale={locale} />}

        <NewsletterSignup locale={locale} />
      </div>

      <BlogSuggestedListings locale={locale} properties={suggestedListings} />
    </>
  );
}
