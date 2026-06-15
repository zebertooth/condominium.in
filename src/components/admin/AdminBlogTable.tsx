"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

interface BlogRow {
  id: string;
  slug: string;
  title: string;
  category: string;
  articleType: string;
  imageUrl: string;
  publishedAt: string;
  status: string;
}

export function AdminBlogTable() {
  const t = useT();
  const [articles, setArticles] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setArticles(data.articles ?? []);
      })
      .catch(() => setError(t("adminBlogLoadError")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    if (!confirm(t("adminBlogDeleteConfirm"))) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? t("adminBlogDeleteError"));
      return;
    }
    load();
  }

  if (loading) return <p className="text-sm text-slate-500">{t("loading")}</p>;

  return (
    <div>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">{t("adminBlogDesc")}</p>
        <Link
          href="/admin/blog/new"
          className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500"
        >
          {t("adminBlogAdd")}
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-slate-500">{t("adminBlogEmpty")}</p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">{t("adminBlogCover")}</th>
                <th className="px-4 py-3">{t("adminBlogColTitle")}</th>
                <th className="px-4 py-3">{t("adminBlogCategory")}</th>
                <th className="px-4 py-3">{t("adminBlogArticleType")}</th>
                <th className="px-4 py-3">{t("adminBlogDate")}</th>
                <th className="px-4 py-3">{t("adminColStatus")}</th>
                <th className="px-4 py-3">{t("adminColActions")}</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id} className="border-b border-slate-100">
                  <td className="px-4 py-3">
                    {article.imageUrl ? (
                      <div className="relative h-12 w-20 overflow-hidden rounded-lg">
                        <Image src={article.imageUrl} alt="" fill className="object-cover" sizes="80px" />
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{article.title}</p>
                    <p className="text-xs text-slate-400">/blog/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3">{article.category}</td>
                  <td className="px-4 py-3 text-xs">
                    {t(`adminBlogType_${article.articleType || "guide"}` as "adminBlogType_guide")}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(article.publishedAt).toLocaleDateString("th-TH")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        article.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {article.status === "published" ? t("adminBlogPublished") : t("adminBlogDraft")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/blog/${article.id}/edit`} className="text-teal-700 hover:underline">
                        {t("adminEdit")}
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="text-red-600 hover:underline"
                      >
                        {t("adminDelete")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
