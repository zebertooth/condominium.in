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

interface BlogGridCardProps {
  post: BlogPost;
  locale: Locale;
}

export function BlogGridCard({ post, locale }: BlogGridCardProps) {
  const title = blogTitle(post, locale);
  const excerpt = blogExcerpt(post, locale);
  const category = blogCategory(post, locale);
  const href = localePath(`/blog/${post.slug}`, locale);
  const cover = post.imageUrl || BLOG_COVER_FALLBACK;

  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={cover}
          alt={title}
          fill
          className="object-cover transition duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, 33vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {category}
        </span>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-slate-900 group-hover:text-teal-700">
          {title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-600">
          {excerpt}
        </p>
        {post.authorName ? (
          <p className="mt-3 text-xs text-slate-500">
            {t("blogAuthor", locale)}: {post.authorName}
          </p>
        ) : (
          <p className="mt-3 text-xs text-slate-400">
            {post.readTime} {t("readTime", locale)}
          </p>
        )}
      </div>
    </Link>
  );
}
