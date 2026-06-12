import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { areaGuides } from "@/lib/areas";
import { blogPosts } from "@/lib/blog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { areaName, numberLocale } from "@/lib/locale-content";
import { getFeaturedListings } from "@/lib/listings";

export default async function HomePage() {
  const [featured, locale] = await Promise.all([getFeaturedListings(), getLocale()]);

  return (
    <>
      <Hero locale={locale} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t("featuredListings", locale)}</h2>
            <p className="mt-1 text-slate-600">{t("featuredDesc", locale)}</p>
          </div>
          <Link href="/rent" className="text-sm font-medium text-teal-700 hover:underline">
            {t("viewAll", locale)} →
          </Link>
        </div>
        <PropertyGrid properties={featured} locale={locale} />
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">{t("nearBts", locale)}</h2>
          <p className="mt-1 text-slate-600">{t("nearBtsDesc", locale)}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {areaGuides.map((area) => (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
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
              href="/ai-search"
              className="mt-6 inline-block rounded-xl bg-white px-5 py-3 font-medium text-indigo-700 transition hover:bg-violet-50"
            >
              {t("heroAiCta", locale)}
            </Link>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8">
            <h2 className="text-2xl font-bold text-slate-900">{t("ownerTitle", locale)}</h2>
            <p className="mt-3 text-slate-600">{t("ownerDesc", locale)}</p>
            <Link
              href="/list-property"
              className="mt-6 inline-block rounded-xl bg-teal-600 px-5 py-3 font-medium text-white transition hover:bg-teal-700"
            >
              {t("heroListCta", locale)}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold text-slate-900">{t("blogSection", locale)}</h2>
          <p className="mt-1 text-slate-600">{t("blogSectionDesc", locale)}</p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <span className="text-xs font-medium text-teal-700">{post.category}</span>
                <h3 className="mt-2 font-bold text-slate-900">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
