"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { SingleImageInput } from "@/components/admin/SingleImageInput";

interface BlogFormState {
  title: string;
  titleEn: string;
  excerpt: string;
  excerptEn: string;
  content: string;
  contentEn: string;
  category: string;
  categoryEn: string;
  imageUrl: string;
  publishedAt: string;
  readTime: number;
  seoTitle: string;
  seoTitleEn: string;
  seoDescription: string;
  seoDescriptionEn: string;
  status: "draft" | "published";
}

const emptyForm: BlogFormState = {
  title: "",
  titleEn: "",
  excerpt: "",
  excerptEn: "",
  content: "",
  contentEn: "",
  category: "",
  categoryEn: "",
  imageUrl: "",
  publishedAt: new Date().toISOString().slice(0, 10),
  readTime: 5,
  seoTitle: "",
  seoTitleEn: "",
  seoDescription: "",
  seoDescriptionEn: "",
  status: "published",
};

export function AdminBlogForm({ articleId }: { articleId?: string }) {
  const t = useT();
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!articleId) return;
    fetch(`/api/admin/blog/${articleId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        const a = data.article;
        setForm({
          title: a.title ?? "",
          titleEn: a.titleEn ?? "",
          excerpt: a.excerpt ?? "",
          excerptEn: a.excerptEn ?? "",
          content: a.content ?? "",
          contentEn: a.contentEn ?? "",
          category: a.category ?? "",
          categoryEn: a.categoryEn ?? "",
          imageUrl: a.imageUrl ?? "",
          publishedAt: a.publishedAt ? new Date(a.publishedAt).toISOString().slice(0, 10) : "",
          readTime: a.readTime ?? 5,
          seoTitle: a.seoTitle ?? "",
          seoTitleEn: a.seoTitleEn ?? "",
          seoDescription: a.seoDescription ?? "",
          seoDescriptionEn: a.seoDescriptionEn ?? "",
          status: a.status === "draft" ? "draft" : "published",
        });
      })
      .catch(() => setError(t("adminBlogLoadError")))
      .finally(() => setLoading(false));
  }, [articleId, t]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const url = articleId ? `/api/admin/blog/${articleId}` : "/api/admin/blog";
    const method = articleId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? t("adminBlogSaveError"));
      return;
    }

    setMessage(data.message ?? t("adminBlogSaved"));
    if (!articleId && data.article?.id) {
      window.location.href = `/admin/blog/${data.article.id}/edit`;
    }
  }

  if (loading) return <p className="text-sm text-slate-500">{t("loading")}</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <SingleImageInput
        imageUrl={form.imageUrl}
        onChange={(url) => setForm({ ...form, imageUrl: url })}
        label={t("adminBlogCover")}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogTitle")} (TH)</span>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogTitle")} (EN)</span>
          <input
            value={form.titleEn}
            onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogExcerpt")} (TH)</span>
          <textarea
            required
            rows={2}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogExcerpt")} (EN)</span>
          <textarea
            rows={2}
            value={form.excerptEn}
            onChange={(e) => setForm({ ...form, excerptEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogContent")} (TH)</span>
          <textarea
            required
            rows={8}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogContent")} (EN)</span>
          <textarea
            rows={8}
            value={form.contentEn}
            onChange={(e) => setForm({ ...form, contentEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogCategory")} (TH)</span>
          <input
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogCategory")} (EN)</span>
          <input
            value={form.categoryEn}
            onChange={(e) => setForm({ ...form, categoryEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogDate")}</span>
          <input
            required
            type="date"
            value={form.publishedAt}
            onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("readTime")}</span>
          <input
            type="number"
            min={1}
            max={120}
            value={form.readTime}
            onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Title (TH)</span>
          <input
            required
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Title (EN)</span>
          <input
            value={form.seoTitleEn}
            onChange={(e) => setForm({ ...form, seoTitleEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Description (TH)</span>
          <textarea
            required
            rows={2}
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">SEO Description (EN)</span>
          <textarea
            rows={2}
            value={form.seoDescriptionEn}
            onChange={(e) => setForm({ ...form, seoDescriptionEn: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">{t("adminColStatus")}</span>
          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as "draft" | "published" })
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          >
            <option value="published">{t("adminBlogPublished")}</option>
            <option value="draft">{t("adminBlogDraft")}</option>
          </select>
        </label>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? t("adminSeoSaving") : t("adminSeoSave")}
        </button>
        <Link href="/admin/blog" className="rounded-xl border border-slate-300 px-6 py-2 text-sm text-slate-700">
          {t("adminBack")}
        </Link>
      </div>
    </form>
  );
}
