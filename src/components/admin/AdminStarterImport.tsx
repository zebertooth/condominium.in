"use client";

import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

interface StarterImportResponse {
  ok?: boolean;
  message?: string;
  error?: string;
  publishedBefore?: number;
  publishedAfter?: number;
  sponsored?: number;
  skipped?: { projects?: string; listings?: string };
  projects?: { imported: number; errors: { row: number; message: string }[] };
  listings?: { imported: number; errors: { row: number; message: string }[] };
}

export function AdminStarterImport({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StarterImportResponse | null>(null);
  const [error, setError] = useState("");

  async function runImport(force: boolean) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/import/starter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force, sponsor: 3 }),
      });
      const data = (await res.json()) as StarterImportResponse;
      if (!res.ok) {
        setError(data.error ?? t("adminStarterImportError"));
        return;
      }
      setResult(data);
    } catch {
      setError(t("adminStarterImportError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className={
        compact
          ? "rounded-2xl border border-teal-200 bg-teal-50/60 p-4"
          : "rounded-xl border border-teal-200 bg-teal-50 p-4"
      }
    >
      <p className="font-medium text-teal-900">{t("adminStarterImportTitle")}</p>
      <p className="mt-1 text-sm text-teal-800">{t("adminStarterImportDesc")}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={loading}
          onClick={() => runImport(false)}
          className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
        >
          {loading ? t("adminStarterImportRunning") : t("adminStarterImportRun")}
        </button>
        <button
          type="button"
          disabled={loading}
          onClick={() => runImport(true)}
          className="rounded-lg border border-teal-300 bg-white px-4 py-2 text-sm font-medium text-teal-800 hover:bg-teal-100 disabled:opacity-50"
        >
          {t("adminStarterImportForce")}
        </button>
      </div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      {result?.message && (
        <p className="mt-3 text-sm font-medium text-emerald-800">{result.message}</p>
      )}
      {result && (
        <ul className="mt-2 space-y-1 text-xs text-teal-900">
          {result.projects != null && (
            <li>
              {t("adminStarterImportProjects")}: {result.projects.imported}
              {result.projects.errors.length > 0
                ? ` (${result.projects.errors.length} ${t("adminStarterImportErrors")})`
                : ""}
            </li>
          )}
          {result.listings != null && (
            <li>
              {t("adminStarterImportListings")}: {result.listings.imported}
              {result.listings.errors.length > 0
                ? ` (${result.listings.errors.length} ${t("adminStarterImportErrors")})`
                : ""}
            </li>
          )}
          {result.skipped?.projects && (
            <li className="text-amber-800">{result.skipped.projects}</li>
          )}
          {result.skipped?.listings && (
            <li className="text-amber-800">{result.skipped.listings}</li>
          )}
          {(result.sponsored ?? 0) > 0 && (
            <li>
              {t("adminStarterImportSponsored")}: {result.sponsored}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
