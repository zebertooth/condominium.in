import { BlogHubLayout } from "@/components/blog/BlogHubLayout";
import { getBlogPostsByTypes, getGuidePosts } from "@/lib/blog";
import { getBlogSuggestedListings } from "@/lib/blog-suggestions";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();

  return createMetadata({
    title: locale === "th" ? "รีวิวโครงการคอนโด" : "Condo Project Reviews",
    description:
      locale === "th"
        ? "รีวิวโครงการคอนโดใกล้ BTS พร้อม Fact @ และลิงก์ไปยังประกาศจริง"
        : "Bangkok BTS condo project reviews with specs and links to live listings.",
    path: "/blog/reviews",
    keywords: ["รีวิวคอนโด", "รีวิวโครงการ", "BTS condo review"],
    locale,
  });
}

export default async function BlogReviewsPage() {
  const [locale, posts, guidePosts, suggestedListings] = await Promise.all([
    getLocale(),
    getBlogPostsByTypes(["project_review", "project_preview"]),
    getGuidePosts(),
    getBlogSuggestedListings(),
  ]);

  return (
    <BlogHubLayout
      locale={locale}
      activeTab="reviews"
      posts={posts}
      reviewPosts={posts}
      guidePosts={guidePosts}
      suggestedListings={suggestedListings}
      heroTitleKey="blogReviewsTitle"
      heroDescKey="blogReviewsDesc"
      gridTitleKey="blogLatestReviews"
      showCategoryBrowse={false}
      showAreaStrip={false}
    />
  );
}
