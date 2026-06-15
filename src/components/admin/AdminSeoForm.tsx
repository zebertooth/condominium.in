"use client";

import { useEffect, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";
import { AD_SLOT_CATALOG, EMPTY_AD_SLOTS } from "@/lib/adsense";
import type { AdSlots } from "@/lib/adsense";

interface SeoFormState {
  homeTitle: string;
  homeDescription: string;
  homeTitleEn: string;
  homeDescriptionEn: string;
  keywords: string;
  titleSuffix: string;
  adSlots: AdSlots;
}

export function AdminSeoForm() {
  const t = useT();
  const [form, setForm] = useState<SeoFormState>({
    homeTitle: "",
    homeDescription: "",
    homeTitleEn: "",
    homeDescriptionEn: "",
    keywords: "",
    titleSuffix: "",
    adSlots: { ...EMPTY_AD_SLOTS },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/site-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setForm({
          homeTitle: data.homeTitle ?? "",
          homeDescription: data.homeDescription ?? "",
          homeTitleEn: data.homeTitleEn ?? "",
          homeDescriptionEn: data.homeDescriptionEn ?? "",
          keywords: data.keywords ?? "",
          titleSuffix: data.titleSuffix ?? "",
          adSlots: { ...EMPTY_AD_SLOTS, ...(data.adSlots ?? {}) },
        });
      })
      .catch(() => setError(t("adminSeoLoadError")))
      .finally(() => setLoading(false));
    // Load settings once on mount — do not refetch when locale/t changes or typed text resets.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    const res = await fetch("/api/admin/site-settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error ?? t("adminSeoSaveError"));
      return;
    }

    setMessage(data.message ?? t("adminSeoSaved"));
  }

  if (loading) {
    return <p className="text-sm text-slate-500">{t("loading")}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6 rounded-2xl border border-slate-200 bg-white p-6">
      {message && <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</div>}
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{t("adminSeoHomeTh")}</h2>
        <Field
          id="homeTitle"
          label={t("adminSeoHomeTitle")}
          value={form.homeTitle}
          onChange={(value) => setForm((prev) => ({ ...prev, homeTitle: value }))}
        />
        <TextArea
          id="homeDescription"
          label={t("adminSeoHomeDescription")}
          value={form.homeDescription}
          onChange={(value) => setForm((prev) => ({ ...prev, homeDescription: value }))}
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">{t("adminSeoHomeEn")}</h2>
        <Field
          id="homeTitleEn"
          label={t("adminSeoHomeTitle")}
          value={form.homeTitleEn}
          onChange={(value) => setForm((prev) => ({ ...prev, homeTitleEn: value }))}
        />
        <TextArea
          id="homeDescriptionEn"
          label={t("adminSeoHomeDescription")}
          value={form.homeDescriptionEn}
          onChange={(value) => setForm((prev) => ({ ...prev, homeDescriptionEn: value }))}
        />
      </section>

      <section className="space-y-4">
        <Field
          id="titleSuffix"
          label={t("adminSeoTitleSuffix")}
          hint={t("adminSeoTitleSuffixHint")}
          value={form.titleSuffix}
          onChange={(value) => setForm((prev) => ({ ...prev, titleSuffix: value }))}
        />
        <TextArea
          id="keywords"
          label={t("adminSeoKeywords")}
          hint={t("adminSeoKeywordsHint")}
          value={form.keywords}
          onChange={(value) => setForm((prev) => ({ ...prev, keywords: value }))}
        />
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{t("adminAdsenseTitle")}</h2>
          <p className="mt-1 text-sm text-slate-600">{t("adminAdsenseDesc")}</p>
          <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
            {t("adminAdsenseClientHint")}:{" "}
            <code className="font-mono">NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-xxxxxxxx</code>
          </p>
        </div>

        <div className="space-y-4">
          {AD_SLOT_CATALOG.map((slot) => (
            <div key={slot.key} className="rounded-xl border border-slate-200 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{slot.adminLabel}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t("adminAdsPlacement")}: {slot.placement}
                  </p>
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-medium text-teal-800">
                  {slot.adsenseFormat}
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-400">{slot.sizeHint}</p>
              <input
                id={`ad-${slot.key}`}
                value={form.adSlots[slot.key]}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    adSlots: { ...prev.adSlots, [slot.key]: e.target.value },
                  }))
                }
                placeholder={t("adminAdsSlotPlaceholder")}
                className="mt-3 w-full rounded-xl border border-slate-300 px-4 py-2.5 font-mono text-sm outline-none ring-teal-500 focus:ring-2"
              />
            </div>
          ))}
        </div>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="rounded-xl bg-teal-600 px-5 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {saving ? t("adminSeoSaving") : t("adminSeoSave")}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
      />
    </div>
  );
}

function TextArea({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
      <textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
      />
    </div>
  );
}
