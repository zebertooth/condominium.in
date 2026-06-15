import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostCard } from "@/components/blog/BlogPostCard";
import { getBlogPostsByProjectSlug } from "@/lib/blog";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { getPublishedProjectBySlug, localizedProjectName } from "@/lib/projects";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) return {};

  const locale = await getLocale();
  const name = localizedProjectName(project, locale);

  return createMetadata({
    title: locale === "th" ? `บทความเกี่ยวกับ ${name}` : `Articles about ${name}`,
    description:
      locale === "th"
        ? `รีวิวและบทความเกี่ยวกับโครงการ ${name}`
        : `Reviews and articles about ${name} condo project.`,
    path: `/blog/project/${slug}`,
    locale,
  });
}

export default async function BlogProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const [locale, project, posts] = await Promise.all([
    getLocale(),
    getPublishedProjectBySlug(slug),
    getBlogPostsByProjectSlug(slug),
  ]);

  if (!project) notFound();

  const name = localizedProjectName(project, locale);
  const lp = (path: string) => localePath(path, locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href={lp("/blog")} className="hover:text-teal-700">
          {t("blog", locale)}
        </Link>
        {" / "}
        <Link href={lp("/blog/reviews")} className="hover:text-teal-700">
          {t("blogHubReviews", locale)}
        </Link>
        {" / "}
        <span className="text-slate-900">{name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">
        {t("blogProjectArticles", locale)}: {name}
      </h1>
      <p className="mt-2 text-slate-600">{t("blogProjectArticlesDesc", locale)}</p>

      <Link
        href={lp(`/projects/${project.slug}`)}
        className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
      >
        {t("blogViewProject", locale)} →
      </Link>

      <div className="mt-10 space-y-6">
        {posts.length === 0 ? (
          <p className="text-slate-600">{t("blogReviewsEmpty", locale)}</p>
        ) : (
          posts.map((post) => <BlogPostCard key={post.slug} post={post} locale={locale} />)
        )}
      </div>
    </div>
  );
}
