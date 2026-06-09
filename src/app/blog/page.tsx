import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "บทความคอนโดและ BTS | Condominium.in.th",
  description:
    "บทความ SEO เรื่องเช่า-ซื้อคอนโด ย่านใกล้ BTS และการใช้ AI ค้นหาทรัพย์ในกรุงเทพฯ",
  path: "/blog",
  keywords: ["บทความคอนโด", "คู่มือเช่าคอนโด", "BTS"],
});

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">บทความ</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        เนื้อหาคุณภาพสำหรับ SEO ช่วยดึงทราฟฟิกจาก Google เรื่องคอนโด เช่า-ซื้อ และย่านใกล้ BTS
      </p>

      <div className="mt-10 space-y-6">
        {blogPosts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:shadow-md"
          >
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full bg-teal-100 px-3 py-1 font-medium text-teal-800">
                {post.category}
              </span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("th-TH")}
              </time>
              <span>{post.readTime} นาทีอ่าน</span>
            </div>
            <h2 className="mt-3 text-xl font-bold text-slate-900">
              <Link href={`/blog/${post.slug}`} className="hover:text-teal-700">
                {post.title}
              </Link>
            </h2>
            <p className="mt-2 text-slate-600">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-4 inline-block text-sm font-medium text-teal-700 hover:underline"
            >
              อ่านต่อ →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
