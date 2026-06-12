export { blogPosts } from "./blog-static";
export {
  getAllBlogPosts,
  getBlogPostBySlug,
  getAllBlogArticlesAdmin,
  getBlogArticleById,
  uniqueBlogSlug,
  dbArticleToPost,
} from "./blog-articles";

import { blogPosts } from "./blog-static";

/** Sync fallback for legacy callers — prefer getBlogPostBySlug */
export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
