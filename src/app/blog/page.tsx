import { BlogHubLayout } from "@/components/blog/BlogHubLayout";
import { getAllBlogPosts, getBlogPostsByTypes, getGuidePosts } from "@/lib/blog";
import { getBlogSuggestedListings } from "@/lib/blog-suggestions";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();

  const titles: Record<string, string> = {
    th: "บทความคอนโดและ BTS",
    en: "Real Estate Articles",
    zh: "曼谷房地产文章",
    ja: "不動産記事",
    ar: "مقالات العقارات",
  };

  const descriptions: Record<string, string> = {
    th: "รีวิวโครงการ คู่มือเช่า-ซื้อคอนโด ย่านใกล้ BTS และประกาศจริง",
    en: "Project reviews, Bangkok condo guides, BTS areas, and live listings.",
    zh: "曼谷公寓项目评测、BTS 区域指南与真实房源。",
    ja: "プロジェクトレビュー、BTSエリアガイド、掲載物件。",
    ar: "مراجعات المشاريع وأدلة BTS والإعلانات الحية.",
  };

  return createMetadata({
    title: titles[locale],
    description: descriptions[locale],
    path: "/blog",
    keywords: ["บทความคอนโด", "รีวิวโครงการ", "BTS", "Bangkok condo guides"],
    locale,
  });
}

export default async function BlogPage() {
  const [locale, allPosts, reviewPosts, guidePosts, suggestedListings] = await Promise.all([
    getLocale(),
    getAllBlogPosts(),
    getBlogPostsByTypes(["project_review", "project_preview"]),
    getGuidePosts(),
    getBlogSuggestedListings(),
  ]);

  const gridPosts = reviewPosts.length > 0 ? reviewPosts : allPosts;

  return (
    <BlogHubLayout
      locale={locale}
      activeTab="all"
      posts={gridPosts}
      reviewPosts={reviewPosts}
      guidePosts={guidePosts}
      suggestedListings={suggestedListings}
      gridTitleKey={reviewPosts.length > 0 ? "blogLatestReviews" : "blogLatestArticles"}
    />
  );
}
