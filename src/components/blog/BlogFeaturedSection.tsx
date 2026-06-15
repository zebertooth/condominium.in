import Image from "next/image";
import Link from "next/link";
import { BLOG_COVER_FALLBACK } from "@/lib/blog-suggestions";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  blogCategory,
  blogExcerpt,
  blogTitle,
} from "@/lib/locale-content";
import { localePath } from "@/lib/locale-routing";
import type { BlogPost } from "@/types/property";

interface BlogFeaturedSectionProps {
  featured: BlogPost;
  popular: BlogPost[];
  locale: Locale;
}

function PopularItem({ post, locale }: { post: BlogPost; locale: Locale }) {
  const title = blogTitle(post, locale);
  const category = blogCategory(post, locale);
  const href = localePath(`/blog/${post.slug}`, locale);
  const thumb = post.imageUrl || BLOG_COVER_FALLBACK;

  return (
    <Link
      href={href}
      className="flex gap-3 rounded-lg p-2 transition hover:bg-slate-50"
    >
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
        <Image src={thumb} alt="" fill className="object-cover" sizes="96px" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
          {category}
        </p>
        <p className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {title}
        </p>
      </div>
    </Link>
  );
}

export function BlogFeaturedSection({ featured, popular, locale }: BlogFeaturedSectionProps) {
  const title = blogTitle(featured, locale);
  const excerpt = blogExcerpt(featured, locale);
  const category = blogCategory(featured, locale);
  const href = localePath(`/blog/${featured.slug}`, locale);
  const cover = featured.imageUrl || BLOG_COVER_FALLBACK;

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <Link
        href={href}
        className="group relative min-h-[320px] overflow-hidden rounded-2xl bg-slate-900 lg:col-span-2 lg:min-h-[380px]"
      >
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover opacity-90 transition duration-500 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span className="rounded bg-white/20 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
            {category}
          </span>
          <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2 line-clamp-2 max-w-2xl text-sm text-white/85 sm:text-base">
            {excerpt}
          </p>
          {featured.authorName && (
            <p className="mt-3 text-sm text-white/70">
              {t("blogAuthor", locale)}: {featured.authorName}
            </p>
          )}
        </div>
      </Link>

      <aside className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="border-b border-slate-100 pb-3 text-lg font-bold text-slate-900">
          {t("blogMostPopular", locale)}
        </h2>
        <div className="mt-2 divide-y divide-slate-100">
          {popular.length === 0 ? (
            <p className="py-4 text-sm text-slate-500">{t("blogReviewsEmpty", locale)}</p>
          ) : (
            popular.map((post) => (
              <PopularItem key={post.slug} post={post} locale={locale} />
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
