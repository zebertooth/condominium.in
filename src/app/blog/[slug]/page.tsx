import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ads/AdSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { getBlogPost } from "@/lib/blog";
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
import { getLocale } from "@/lib/locale";
import { createMetadata, siteConfig } from "@/lib/seo";
import { t } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
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

function renderContent(content: string) {
  return content.split("\n\n").map((block, i) => {
    if (block.startsWith("**") && block.includes("**")) {
      const title = block.replace(/\*\*/g, "").trim();
      return (
        <h2 key={i} className="mt-6 text-xl font-bold text-slate-900">
          {title}
        </h2>
      );
    }
    const html = block
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br />");
    return (
      <p
        key={i}
        className="mt-3 leading-relaxed text-slate-700"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const locale = await getLocale();
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
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <JsonLd data={jsonLd} />

      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/blog" className="hover:text-teal-700">
          {t("blog", locale)}
        </Link>
        {" / "}
        <span className="text-slate-900">{title}</span>
      </nav>

      <AdSlot position="blogTop" format="auto" className="mb-6" />

      <span className="rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
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

      <div className="prose mt-8 max-w-none">{renderContent(content)}</div>

      <div className="mt-12 rounded-2xl bg-teal-50 p-6">
        <h2 className="font-bold text-teal-900">
          {locale === "zh"
            ? "准备好找公寓了吗？"
            : locale === "ja"
              ? "コンド探しの準備はできましたか？"
              : locale === "ar"
                ? "هل أنت مستعد للعثور على شقتك؟"
                : nonTh
                  ? "Ready to find your condo?"
                  : "พร้อมหาคอนโดแล้ว?"}
        </h2>
        <p className="mt-2 text-teal-800">
          {locale === "zh"
            ? "使用 AI 搜索匹配房源，或联系我们的经纪人团队。"
            : locale === "ja"
              ? "AI検索で物件を見つけるか、エージェントチームにお問い合わせください。"
              : locale === "ar"
                ? "استخدم البحث بالذكاء الاصطناعي أو تواصل مع فريق الوكلاء لدينا."
                : nonTh
                  ? "Use AI search to find matching properties or contact our agent team."
                  : "ใช้ AI ค้นหาทรัพย์ที่ตรงใจ หรือติดต่อทีมเอเจนต์เพื่อนัดชมจริง"}
        </p>
        <div className="mt-4 flex gap-3">
          <Link href="/ai-search" className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white">
            {t("aiSearch", locale)}
          </Link>
          <Link href="/contact" className="rounded-lg border border-teal-300 px-4 py-2 text-sm font-medium text-teal-800">
            {t("contact", locale)}
          </Link>
        </div>
      </div>
    </article>
  );
}
