import Link from "next/link";
import { AdSlot } from "@/components/ads/AdSlot";
import { Hero } from "@/components/home/Hero";
import { HomeListingsSection } from "@/components/home/HomeListingsSection";
import { areaGuides } from "@/lib/areas";
import { getGuidePosts, getLatestReviewPosts } from "@/lib/blog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { areaName, blogExcerpt, blogTitle, numberLocale } from "@/lib/locale-content";
import {
  getLatestListings,
  getPopularListings,
  getRecommendedListings,
} from "@/lib/listings";
import { createHomeMetadata } from "@/lib/seo";
import { getSiteSettings } from "@/lib/site-settings";

export async function generateMetadata() {
  return createHomeMetadata();
}

export default async function HomePage() {
  const [recommended, latest, popular, locale, settings, reviewPosts, guidePosts] =
    await Promise.all([
      getRecommendedListings(),
      getLatestListings(),
      getPopularListings(),
      getLocale(),
      getSiteSettings(),
      getLatestReviewPosts(3),
      getGuidePosts(),
    ]);
  const lp = (path: string) => localePath(path, locale);

  return (
    <>
      <Hero locale={locale} />

      <div className="mx-auto max-w-7xl px-4 pt-2 sm:px-6">
        <AdSlot position="homeLeaderboard" format="auto" />
      </div>

      <HomeListingsSection
        titleKey="featuredListings"
        descKey="featuredDesc"
        properties={recommended}
        locale={locale}
        viewAllHref={lp("/buy")}
        infeedSlotId={settings.adSlots.listingInfeed}
      />

      <HomeListingsSection
        titleKey="latestListings"
        descKey="latestListingsDesc"
        properties={latest}
        locale={locale}
        viewAllHref={lp("/buy")}
        className="border-t border-slate-200 bg-white"
      />

      <HomeListingsSection
        titleKey="popularListings"
        descKey="popularListingsDesc"
        properties={popular}
        locale={locale}
        viewAllHref={lp("/rent")}
        className="border-t border-slate-200"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot position="homeMid" format="auto" />
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">{t("nearBts", locale)}</h2>
          <p className="mt-1 text-slate-600">{t("nearBtsDesc", locale)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areaGuides.map((area) => (
              <Link
                key={area.slug}
                href={lp(`/areas/${area.slug}`)}
                className="rounded-2xl border border-slate-200 p-5 transition hover:border-teal-300 hover:shadow-md"
              >
                <p className="text-sm font-medium text-teal-700">BTS {area.btsStation}</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  {areaName(area, locale)}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{area.description}</p>
                <p className="mt-3 text-sm text-slate-500">
                  {t("rentAvgPrefix", locale)} ฿{area.avgRentPrice.toLocaleString(numberLocale(locale))}{t("rentAvgSuffix", locale)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-8 text-white">
            <h2 className="text-2xl font-bold">{t("aiTitle", locale)}</h2>
            <p className="mt-3 text-violet-100">{t("aiDesc", locale)}</p>
            <Link
              href={lp("/ai-search")}
              className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-violet-50"
            >
              {t("heroAiCta", locale)}
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">{t("ownerTitle", locale)}</h2>
            <p className="mt-3 text-slate-600">{t("ownerDesc", locale)}</p>
            <Link
              href={lp("/list-property")}
              className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700"
            >
              {t("heroListCta", locale)}
            </Link>
          </div>
        </div>
      </section>

      {reviewPosts.length > 0 && (
        <section className="border-t border-slate-200 bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t("blogReviewSection", locale)}</h2>
                <p className="mt-1 text-slate-600">{t("blogReviewSectionDesc", locale)}</p>
              </div>
              <Link
                href={lp("/blog/reviews")}
                className="text-sm font-medium text-teal-700 hover:underline"
              >
                {t("blogHubReviews", locale)} →
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {reviewPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={lp(`/blog/${post.slug}`)}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-teal-300 hover:shadow-md"
                >
                  <span className="text-xs font-medium text-teal-700">{post.category}</span>
                  <h3 className="mt-2 font-bold text-slate-900">{blogTitle(post, locale)}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blogExcerpt(post, locale)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t("blogSection", locale)}</h2>
              <p className="mt-1 text-slate-600">{t("blogSectionDesc", locale)}</p>
            </div>
            <Link href={lp("/blog/guides")} className="text-sm font-medium text-teal-700 hover:underline">
              {t("blogHubGuides", locale)} →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {guidePosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={lp(`/blog/${post.slug}`)}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="text-xs font-medium text-teal-700">{post.category}</span>
                <h3 className="mt-2 font-bold text-slate-900">{blogTitle(post, locale)}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{blogExcerpt(post, locale)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
