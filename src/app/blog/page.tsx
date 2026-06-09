import Link from "next/link";
import { cookies } from "next/headers";
import { blogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";
import { getLocale, LOCALE_COOKIE } from "@/lib/locale";
import { t } from "@/lib/i18n";

export async function generateMetadata() {
  const cookieStore = await cookies();
  const locale = cookieStore.get(LOCALE_COOKIE)?.value === "en" ? "en" : "th";

  return createMetadata({
    title: locale === "en" ? "Real Estate Articles | Condominium.in.th" : "บทความคอนโดและ BTS | Condominium.in.th",
    description: locale === "en"
      ? "SEO-optimized articles regarding buying and renting condos in Bangkok, BTS area guides, and AI matching."
      : "บทความ SEO เรื่องเช่า-ซื้อคอนโด ย่านใกล้ BTS และการใช้ AI ค้นหาทรัพย์ในกรุงเทพฯ",
    path: "/blog",
    keywords: ["บทความคอนโด", "คู่มือเช่าคอนโด", "BTS", "Bangkok condo guides"],
  });
}

export default async function BlogPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("blogPageTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {t("blogPageDesc", locale)}
      </p>

      <div className="mt-10 space-y-6">
        {blogPosts.map((post) => {
          const title = locale === "en" && post.titleEn ? post.titleEn : post.title;
          const excerpt = locale === "en" && post.excerptEn ? post.excerptEn : post.excerpt;
          const category = locale === "en" && post.categoryEn ? post.categoryEn : post.category;

          return (
            <article
              key={post.slug}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
            >
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-800">
                  {category}
                </span>
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString(locale === "en" ? "en-US" : "th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
                <span>
                  {post.readTime} {t("readTime", locale)}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-bold text-slate-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-teal-700">
                  {title}
                </Link>
              </h2>
              <p className="mt-2 text-slate-600">{excerpt}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
              >
                {locale === "en" ? "Read more →" : "อ่านต่อ →"}
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
