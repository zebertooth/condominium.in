import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/types/property";
import type { Locale } from "@/lib/i18n";
import { t } from "@/lib/i18n";
import {
  blogCategory,
  blogExcerpt,
  blogTitle,
  dateLocale,
} from "@/lib/locale-content";
import { localePath } from "@/lib/locale-routing";

interface BlogPostCardProps {
  post: BlogPost;
  locale: Locale;
}

export function BlogPostCard({ post, locale }: BlogPostCardProps) {
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const category = blogCategory(post, locale);
  const href = localePath(`/blog/${post.slug}`, locale);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-md">
      <div className="flex flex-col sm:flex-row">
        {post.imageUrl && (
          <Link href={href} className="relative block aspect-[16/9] shrink-0 sm:w-72">
            <Image
              src={post.imageUrl}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 288px"
            />
          </Link>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-800">
              {category}
            </span>
            {post.reviewNumber && (
              <span className="text-xs text-slate-500">
                {t("blogReviewNumber", locale)} {post.reviewNumber}
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
          <h2 className="mt-3 text-xl font-bold text-slate-900">
            <Link href={href} className="hover:text-teal-700">
              {title}
            </Link>
          </h2>
          <p className="mt-2 text-slate-600">{excerpt}</p>
          {post.projectName && (
            <p className="mt-2 text-sm text-teal-700">
              {t("navProjects", locale)}: {post.projectName}
            </p>
          )}
          <Link href={href} className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline">
            {t("readMore", locale)} →
          </Link>
        </div>
      </div>
    </article>
  );
}
