"use client";

import { useState } from "react";
import { generateSampleProjectCsv } from "@/lib/project-csv-import";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

interface AdminProjectCsvImportProps {
  locale: string;
}

export function AdminProjectCsvImport({ locale }: AdminProjectCsvImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const nonTh = locale !== "th";

  async function handleImport() {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/import/projects", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Import failed");
        return;
      }

      setResult(data as ImportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setLoading(false);
    }
  }

  function downloadSample() {
    const csv = generateSampleProjectCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-projects.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      <h2 className="text-lg font-bold text-slate-900">
        {nonTh ? "Project CSV Import" : "นำเข้าโครงการ CSV"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {nonTh
          ? "Bulk create condo/housing projects. Import projects first, then link listings with projectSlug."
          : "สร้างโครงการจำนวนมาก นำเข้าโครงการก่อน แล้วใส่ projectSlug ใน CSV ประกาศ"}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={downloadSample}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          {nonTh ? "Download Sample CSV" : "ดาวน์โหลด CSV ตัวอย่าง"}
        </button>
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-slate-700">
          {nonTh ? "Select CSV File" : "เลือกไฟล์ CSV"}
        </label>
        <input
          type="file"
          accept=".csv,text/csv"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
            setError(null);
          }}
          className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:rounded-lg file:border-0 file:bg-teal-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-teal-700 hover:file:bg-teal-100"
        />
      </div>

      {file && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-700">
            <span className="font-medium">{nonTh ? "Selected:" : "เลือกแล้ว:"}</span> {file.name}
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleImport}
        disabled={!file || loading}
        className="mt-6 rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading
          ? nonTh
            ? "Importing..."
            : "กำลังนำเข้า..."
          : nonTh
            ? "Import Projects"
            : "นำเข้าโครงการ"}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">{error}</div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div className={`rounded-lg p-4 ${result.success ? "bg-green-50" : "bg-amber-50"}`}>
            <p className={`font-medium ${result.success ? "text-green-800" : "text-amber-800"}`}>
              {nonTh ? "Import Complete" : "นำเข้าเสร็จสิ้น"}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {nonTh
                ? `Successfully imported ${result.imported} projects`
                : `นำเข้าสำเร็จ ${result.imported} โครงการ`}
            </p>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <ul className="mt-2 max-h-60 space-y-1 overflow-auto text-sm text-red-700">
                {result.errors.map((err, i) => (
                  <li key={i}>
                    <span className="font-medium">
                      {nonTh ? `Row ${err.row}:` : `แถว ${err.row}:`}
                    </span>{" "}
                    {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="mt-8 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">
        <p className="font-medium text-slate-900">{nonTh ? "Required columns" : "คอลัมน์ที่จำเป็น"}</p>
        <ul className="mt-1 ml-4 list-disc">
          <li>name, developer, location</li>
        </ul>
        <p className="mt-3 font-medium text-slate-900">{nonTh ? "Optional columns" : "คอลัมน์เพิ่มเติม"}</p>
        <ul className="mt-1 ml-4 list-disc">
          <li>slug — {nonTh ? "URL slug (auto-generated if empty)" : "slug URL (ว่าง = สร้างอัตโนมัติ)"}</li>
          <li>nameEn, description, descriptionEn, district, btsStation</li>
          <li>imageUrl, amenities (comma-separated), totalUnits, completionDate (YYYY-MM-DD)</li>
          <li>published — true/false (default true)</li>
        </ul>
      </div>
    </div>
  );
}
