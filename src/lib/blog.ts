export { blogPosts } from "./blog-static";
export {
  getAllBlogPosts,
  getBlogPostBySlug,
  getBlogPostsByTypes,
  getBlogPostsByProjectSlug,
  getLatestReviewPosts,
  getGuidePosts,
  getAllBlogArticlesAdmin,
  getBlogArticleById,
  uniqueBlogSlug,
  dbArticleToPost,
  isReviewArticle,
  BLOG_ARTICLE_TYPES,
} from "./blog-articles";

import { blogPosts } from "./blog-static";

/** Sync fallback for legacy callers — prefer getBlogPostBySlug */
export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
