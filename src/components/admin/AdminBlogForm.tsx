"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useT, useTf } from "@/components/i18n/LocaleProvider";
import { SingleImageInput } from "@/components/admin/SingleImageInput";
import { MarkdownEditor } from "@/components/admin/MarkdownEditor";
import type { BlogArticleType, BlogFactSheet, BlogSection } from "@/types/property";
import { BLOG_ARTICLE_TYPES } from "@/types/property";
import { areaGuides } from "@/lib/areas";
import { NEARBY_STATIONS } from "@/lib/transit-stations";

interface ProjectOption {
  id: string;
  name: string;
  nameEn: string;
}

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
  articleType: BlogArticleType;
  areaSlug: string;
  projectId: string;
  authorName: string;
  authorTitle: string;
  reviewNumber: string;
  facts: BlogFactSheet;
  sections: BlogSection[];
  galleryUrlsText: string;
  videoUrl: string;
  relatedSlugsText: string;
  sourceName: string;
  sourceUrl: string;
  sourceTitle: string;
}

const emptyFacts: BlogFactSheet = {};

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
  articleType: "guide",
  areaSlug: "",
  projectId: "",
  authorName: "",
  authorTitle: "",
  reviewNumber: "",
  facts: emptyFacts,
  sections: [],
  galleryUrlsText: "",
  videoUrl: "",
  relatedSlugsText: "",
  sourceName: "",
  sourceUrl: "",
  sourceTitle: "",
};

function linesToArray(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function isReviewType(type: BlogArticleType): boolean {
  return type === "project_review" || type === "project_preview";
}

export function AdminBlogForm({ articleId }: { articleId?: string }) {
  const t = useT();
  const tf = useTf();
  const [form, setForm] = useState<BlogFormState>(emptyForm);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [loading, setLoading] = useState(!!articleId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestStation, setSuggestStation] = useState("");

  useEffect(() => {
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => setProjects(data.projects ?? []))
      .catch(() => {});
  }, []);

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
          articleType: a.articleType ?? "guide",
          areaSlug: a.areaSlug ?? "",
          projectId: a.projectId ?? "",
          authorName: a.authorName ?? "",
          authorTitle: a.authorTitle ?? "",
          reviewNumber: a.reviewNumber ? String(a.reviewNumber) : "",
          facts: a.facts ?? emptyFacts,
          sections: a.sections ?? [],
          galleryUrlsText: (a.galleryUrls ?? []).join("\n"),
          videoUrl: a.videoUrl ?? "",
          relatedSlugsText: (a.relatedSlugs ?? []).join("\n"),
          sourceName: a.sourceName ?? "",
          sourceUrl: a.sourceUrl ?? "",
          sourceTitle: a.sourceTitle ?? "",
        });
      })
      .catch(() => setError(t("adminBlogLoadError")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [articleId]);

  function addSection() {
    const id = `section-${form.sections.length + 1}`;
    setForm({
      ...form,
      sections: [...form.sections, { id, title: "" }],
    });
  }

  async function suggestListingsForStation() {
    if (!suggestStation) return;
    try {
      const res = await fetch("/api/admin/properties?status=published");
      const data = await res.json();
      const station = NEARBY_STATIONS.find((s) => s.id === suggestStation);
      if (!station) return;
      const matches = (data.properties ?? [])
        .filter(
          (p: { btsStation?: string; slug: string }) =>
            p.btsStation &&
            (p.btsStation === station.name ||
              p.btsStation.includes(station.name) ||
              station.name.includes(p.btsStation)),
        )
        .map((p: { slug: string }) => p.slug)
        .slice(0, 6);
      if (matches.length === 0) {
        setMessage(t("adminBlogNoStationListings"));
        return;
      }
      const merged = [...new Set([...linesToArray(form.relatedSlugsText), ...matches])];
      setForm({ ...form, relatedSlugsText: merged.join("\n") });
      setMessage(tf("adminBlogSuggestedListings", { count: String(matches.length) }));
    } catch {
      setError(t("adminBlogLoadError"));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      title: form.title,
      titleEn: form.titleEn,
      excerpt: form.excerpt,
      excerptEn: form.excerptEn,
      content: form.content,
      contentEn: form.contentEn,
      category: form.category,
      categoryEn: form.categoryEn,
      imageUrl: form.imageUrl,
      publishedAt: form.publishedAt,
      readTime: form.readTime,
      seoTitle: form.seoTitle,
      seoTitleEn: form.seoTitleEn,
      seoDescription: form.seoDescription,
      seoDescriptionEn: form.seoDescriptionEn,
      status: form.status,
      articleType: form.articleType,
      areaSlug: form.areaSlug || undefined,
      projectId: form.projectId || null,
      authorName: form.authorName,
      authorTitle: form.authorTitle,
      reviewNumber: form.reviewNumber ? Number(form.reviewNumber) : null,
      facts: form.facts,
      sections: form.sections.filter((s) => s.title.trim()),
      galleryUrls: linesToArray(form.galleryUrlsText),
      videoUrl: form.videoUrl,
      relatedSlugs: linesToArray(form.relatedSlugsText),
      sourceName: form.sourceName || undefined,
      sourceUrl: form.sourceUrl || undefined,
      sourceTitle: form.sourceTitle || undefined,
    };

    const url = articleId ? `/api/admin/blog/${articleId}` : "/api/admin/blog";
    const method = articleId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

  const showReviewFields = isReviewType(form.articleType);
  const showAreaFields = form.articleType === "area_review";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-sm font-medium text-slate-700">{t("adminBlogArticleType")}</span>
          <select
            value={form.articleType}
            onChange={(e) =>
              setForm({ ...form, articleType: e.target.value as BlogArticleType })
            }
            className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
          >
            {BLOG_ARTICLE_TYPES.map((type) => (
              <option key={type} value={type}>
                {t(`adminBlogType_${type}` as "adminBlogType_guide")}
              </option>
            ))}
          </select>
        </label>
      </div>

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
        <MarkdownEditor
          label={`${t("adminBlogContent")} (TH)`}
          value={form.content}
          onChange={(content) => setForm({ ...form, content })}
          required
          hint={t("adminBlogContentHint")}
        />
        <MarkdownEditor
          label={`${t("adminBlogContent")} (EN)`}
          value={form.contentEn}
          onChange={(contentEn) => setForm({ ...form, contentEn })}
        />
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
      </div>

      {showAreaFields && (
        <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5">
          <h3 className="font-semibold text-indigo-900">{t("adminBlogAreaSection")}</h3>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t("adminBlogAreaSlug")}</span>
            <p className="mt-0.5 text-xs text-slate-500">{t("adminBlogAreaSlugHint")}</p>
            <select
              value={form.areaSlug}
              onChange={(e) => setForm({ ...form, areaSlug: e.target.value })}
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
            >
              <option value="">—</option>
              {areaGuides.map((area) => (
                <option key={area.slug} value={area.slug}>
                  {area.name} ({area.slug})
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {showReviewFields && (
        <div className="space-y-4 rounded-2xl border border-teal-200 bg-teal-50/40 p-5">
          <h3 className="font-semibold text-teal-900">{t("adminBlogReviewSection")}</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="text-sm font-medium text-slate-700">{t("adminBlogProject")}</span>
              <select
                value={form.projectId}
                onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              >
                <option value="">—</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("blogAuthor")}</span>
              <input
                value={form.authorName}
                onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminBlogAuthorTitle")}</span>
              <input
                value={form.authorTitle}
                onChange={(e) => setForm({ ...form, authorTitle: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("blogReviewNumber")}</span>
              <input
                type="number"
                min={1}
                value={form.reviewNumber}
                onChange={(e) => setForm({ ...form, reviewNumber: e.target.value })}
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">{t("adminBlogVideoUrl")}</span>
              <input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2"
              />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700">{t("blogFactAt")}</p>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["developer", "blogFactDeveloper"],
                  ["totalUnits", "blogFactUnits"],
                  ["pricePerSqm", "blogFactPriceSqm"],
                  ["btsDistance", "blogFactBts"],
                  ["completion", "blogFactCompletion"],
                  ["parking", "blogFactParking"],
                  ["facilities", "blogFactFacilities"],
                  ["suitableFor", "blogSuitableFor"],
                ] as const
              ).map(([key, labelKey]) => (
                <label key={key} className="block">
                  <span className="text-xs text-slate-600">{t(labelKey)}</span>
                  <input
                    value={form.facts[key] ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        facts: { ...form.facts, [key]: e.target.value },
                      })
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
                  />
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-700">{t("blogToc")}</p>
              <button
                type="button"
                onClick={addSection}
                className="text-sm text-teal-700 hover:underline"
              >
                + {t("adminBlogAddSection")}
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {form.sections.map((section, index) => (
                <div key={section.id} className="flex gap-2">
                  <input
                    value={section.id}
                    onChange={(e) => {
                      const sections = [...form.sections];
                      sections[index] = { ...section, id: e.target.value };
                      setForm({ ...form, sections });
                    }}
                    placeholder="id"
                    className="w-32 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <input
                    value={section.title}
                    onChange={(e) => {
                      const sections = [...form.sections];
                      sections[index] = { ...section, title: e.target.value };
                      setForm({ ...form, sections });
                    }}
                    placeholder={t("adminBlogSectionTitle")}
                    className="flex-1 rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        sections: form.sections.filter((_, i) => i !== index),
                      })
                    }
                    className="text-sm text-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t("blogGallery")}</span>
            <textarea
              rows={3}
              value={form.galleryUrlsText}
              onChange={(e) => setForm({ ...form, galleryUrlsText: e.target.value })}
              placeholder="https://..."
              className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">{t("adminBlogOnePerLine")}</p>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">{t("adminBlogRelatedSlugs")}</span>
            <div className="mt-1 flex flex-wrap gap-2">
              <select
                value={suggestStation}
                onChange={(e) => setSuggestStation(e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="">{t("adminBlogPickStation")}</option>
                {NEARBY_STATIONS.filter((s) => s.category === "bts")
                  .slice(0, 40)
                  .map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={suggestListingsForStation}
                className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800"
              >
                {t("adminBlogSuggestListings")}
              </button>
            </div>
            <textarea
              rows={3}
              value={form.relatedSlugsText}
              onChange={(e) => setForm({ ...form, relatedSlugsText: e.target.value })}
              placeholder="listing-slug-1"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-2 font-mono text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">{t("adminBlogRelatedSlugsHint")}</p>
          </label>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
        <p className="text-sm font-medium text-slate-800">{t("adminBlogSourceCredit")}</p>
        <p className="mt-1 text-xs text-slate-500">{t("adminBlogSourceCreditHint")}</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs text-slate-600">{t("adminBlogSourceName")}</span>
            <input
              value={form.sourceName}
              onChange={(e) => setForm({ ...form, sourceName: e.target.value })}
              placeholder="art4d"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs text-slate-600">{t("adminBlogSourceTitle")}</span>
            <input
              value={form.sourceTitle}
              onChange={(e) => setForm({ ...form, sourceTitle: e.target.value })}
              placeholder="Original article title on art4d"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs text-slate-600">{t("adminBlogSourceUrl")}</span>
            <input
              value={form.sourceUrl}
              onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })}
              placeholder="https://art4d.com/..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-sm"
            />
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
