"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { SingleImageInput } from "@/components/admin/SingleImageInput";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import type { ProjectView } from "@/lib/projects";

const emptyForm = {
  name: "",
  nameEn: "",
  developer: "",
  location: "",
  district: "",
  btsStation: "",
  amenitiesText: "",
  totalUnits: "",
  completionDate: "",
  imageUrl: "",
  description: "",
  descriptionEn: "",
  published: true,
};

export function AdminProjectsPanel() {
  const t = useT();
  const locale = useLocale();
  const nonTh = locale !== "th";
  const [projects, setProjects] = useState<ProjectView[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const loadProjects = useCallback(() => {
    setLoading(true);
    fetch("/api/admin/projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setProjects(data.projects ?? []);
      })
      .catch(() => setError(nonTh ? "Failed to load projects" : "โหลดโครงการไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [nonTh]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  function resetForm() {
    setEditId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  }

  function startEdit(project: ProjectView) {
    setEditId(project.id);
    setForm({
      name: project.name,
      nameEn: project.nameEn,
      developer: project.developer,
      location: project.location,
      district: project.district,
      btsStation: project.btsStation ?? "",
      amenitiesText: project.amenities.join(", "),
      totalUnits: project.totalUnits ? String(project.totalUnits) : "",
      completionDate: project.completionDate ?? "",
      imageUrl: project.imageUrl,
      description: project.description,
      descriptionEn: project.descriptionEn,
      published: project.published,
    });
    setMessage("");
    setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      name: form.name,
      nameEn: form.nameEn,
      developer: form.developer,
      location: form.location,
      district: form.district,
      btsStation: form.btsStation || undefined,
      amenities: form.amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      totalUnits: form.totalUnits ? Number(form.totalUnits) : undefined,
      completionDate: form.completionDate || undefined,
      imageUrl: form.imageUrl,
      description: form.description,
      descriptionEn: form.descriptionEn,
      published: form.published,
    };

    const url = editId ? `/api/admin/projects/${editId}` : "/api/admin/projects";
    const method = editId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? (nonTh ? "Save failed" : "บันทึกไม่สำเร็จ"));
      return;
    }

    setMessage(data.message ?? (nonTh ? "Saved" : "บันทึกแล้ว"));
    resetForm();
    loadProjects();
  }

  async function handleDelete(id: string) {
    if (!confirm(nonTh ? "Delete this project?" : "ลบโครงการนี้?")) return;
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? (nonTh ? "Delete failed" : "ลบไม่สำเร็จ"));
      return;
    }
    loadProjects();
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500";

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">
          {editId
            ? nonTh
              ? "Edit project"
              : "แก้ไขโครงการ"
            : nonTh
              ? "Add project"
              : "เพิ่มโครงการ"}
        </h2>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{nonTh ? "Name (TH)" : "ชื่อโครงการ (TH)"}</span>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{nonTh ? "Name (EN)" : "ชื่อโครงการ (EN)"}</span>
            <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t("projectDeveloper")}</span>
            <input required value={form.developer} onChange={(e) => setForm({ ...form, developer: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{nonTh ? "Location" : "ที่ตั้ง"}</span>
            <input required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{nonTh ? "District" : "เขต/อำเภอ"}</span>
            <input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">BTS / MRT</span>
            <input value={form.btsStation} onChange={(e) => setForm({ ...form, btsStation: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t("projectUnits")}</span>
            <input type="number" min={1} value={form.totalUnits} onChange={(e) => setForm({ ...form, totalUnits: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm">
            <span className="font-medium text-slate-700">{t("projectCompletion")}</span>
            <input type="date" value={form.completionDate} onChange={(e) => setForm({ ...form, completionDate: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">{t("projectAmenities")}</span>
            <input
              value={form.amenitiesText}
              onChange={(e) => setForm({ ...form, amenitiesText: e.target.value })}
              placeholder={nonTh ? "Pool, Gym, Parking" : "สระว่ายน้ำ, ฟิตเนส, ที่จอดรถ"}
              className={inputClass}
            />
          </label>
          <div className="sm:col-span-2">
            <SingleImageInput
              label={nonTh ? "Cover image" : "รูปปกโครงการ"}
              imageUrl={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />
          </div>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">{nonTh ? "Description (TH)" : "รายละเอียด (TH)"}</span>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
          </label>
          <label className="block text-sm sm:col-span-2">
            <span className="font-medium text-slate-700">{nonTh ? "Description (EN)" : "รายละเอียด (EN)"}</span>
            <textarea rows={3} value={form.descriptionEn} onChange={(e) => setForm({ ...form, descriptionEn: e.target.value })} className={inputClass} />
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
            <span>{nonTh ? "Published on website" : "เผยแพร่บนเว็บไซต์"}</span>
          </label>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {message && <p className="mt-4 text-sm text-teal-700">{message}</p>}

        <div className="mt-6 flex gap-3">
          <button type="submit" disabled={saving} className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50">
            {saving ? t("loading") : t("adminEdit")}
          </button>
          {editId && (
            <button type="button" onClick={resetForm} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
              {t("adminCancel")}
            </button>
          )}
        </div>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">{nonTh ? "All projects" : "โครงการทั้งหมด"}</h2>
        {loading ? (
          <p className="mt-4 text-sm text-slate-500">{t("loading")}</p>
        ) : projects.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">{t("projectsEmpty")}</p>
        ) : (
          <div className="mt-4 space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex flex-wrap items-start justify-between gap-4 rounded-xl border border-slate-100 p-4">
                <div className="flex gap-4">
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {project.imageUrl ? (
                      <Image src={project.imageUrl} alt={project.name} fill className="object-cover" sizes="112px" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No image</div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <p className="text-sm text-slate-600">
                      {project.developer} · {project.district || project.location}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {project.listingCount ?? 0} {nonTh ? "listings" : "ประกาศ"} · /projects/{project.slug}
                    </p>
                    {!project.published && (
                      <span className="mt-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800">
                        {nonTh ? "Hidden" : "ซ่อน"}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href={`/projects/${project.slug}`} className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50">
                    {nonTh ? "View" : "ดูหน้าเว็บ"}
                  </Link>
                  <button type="button" onClick={() => startEdit(project)} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm hover:bg-slate-200">
                    {t("adminEdit")}
                  </button>
                  <button type="button" onClick={() => handleDelete(project.id)} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-700 hover:bg-red-100">
                    {t("adminDelete")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
