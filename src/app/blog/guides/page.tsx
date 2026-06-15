import { BlogHubLayout } from "@/components/blog/BlogHubLayout";
import { getBlogPostsByTypes, getGuidePosts } from "@/lib/blog";
import { getBlogSuggestedListings } from "@/lib/blog-suggestions";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();

  return createMetadata({
    title: locale === "th" ? "บทความเกี่ยวกับบ้าน" : "Home & living articles",
    description:
      locale === "th"
        ? "บทความเกี่ยวกับบ้าน เช่า-ซื้อคอนโด ย่านใกล้ BTS และเคล็ดลับค้นหาทรัพย์"
        : "Home articles for renting and buying Bangkok condos near BTS stations.",
    path: "/blog/guides",
    keywords: ["คู่มือเช่าคอนโด", "BTS guide", "Bangkok condo tips"],
    locale,
  });
}

export default async function BlogGuidesPage() {
  const [locale, posts, reviewPosts, suggestedListings] = await Promise.all([
    getLocale(),
    getGuidePosts(),
    getBlogPostsByTypes(["project_review", "project_preview"]),
    getBlogSuggestedListings(),
  ]);

  return (
    <BlogHubLayout
      locale={locale}
      activeTab="guides"
      posts={posts}
      reviewPosts={reviewPosts}
      guidePosts={posts}
      suggestedListings={suggestedListings}
      heroTitleKey="blogGuidesTitle"
      heroDescKey="blogGuidesDesc"
      gridTitleKey="blogLatestGuides"
      gridViewAllHref={undefined}
      showCategoryBrowse={false}
      showAreaStrip={false}
    />
  );
}
