"use client";

import { useState } from "react";
import { generateSampleCsv } from "@/lib/csv-import-sample";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

interface CsvImportPanelProps {
  locale: string;
  uploadPath: string;
  pendingReviewNote?: boolean;
}

export function CsvImportPanel({ locale, uploadPath, pendingReviewNote }: CsvImportPanelProps) {
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

      const res = await fetch(uploadPath, {
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
    const csv = generateSampleCsv();
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sample-properties.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6">
      {pendingReviewNote && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {nonTh
            ? "Imported listings go to pending review — an admin must approve before they appear on the site."
            : "ประกาศที่นำเข้าจะอยู่สถานะรอตรวจ — แอดมินต้องอนุมัติก่อนแสดงบนเว็บ"}
        </p>
      )}

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
          <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
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
            ? "Import Listings"
            : "นำเข้าประกาศ"}
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
                ? `Successfully imported ${result.imported} listings`
                : `นำเข้าสำเร็จ ${result.imported} รายการ`}
              {result.errors.length > 0 &&
                (nonTh
                  ? ` with ${result.errors.length} errors`
                  : ` พบข้อผิดพลาด ${result.errors.length} รายการ`)}
            </p>
          </div>

          {result.errors.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="font-medium text-red-800">{nonTh ? "Errors" : "ข้อผิดพลาด"}</p>
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

      <div className="mt-8 rounded-lg bg-slate-50 p-4">
        <h3 className="font-medium text-slate-900">{nonTh ? "CSV Format Guide" : "รูปแบบ CSV"}</h3>
        <div className="mt-2 text-sm text-slate-600">
          <p className="font-medium">{nonTh ? "Required columns:" : "คอลัมน์ที่จำเป็น:"}</p>
          <ul className="mt-1 ml-4 list-disc">
            <li>title, description, listingType, propertyType, price, bedrooms, bathrooms, areaSqm, district</li>
          </ul>
          <p className="mt-3 font-medium">{nonTh ? "Optional:" : "เพิ่มเติม:"}</p>
          <ul className="mt-1 ml-4 list-disc">
            <li>titleEn, btsStation, images, projectSlug, furnishing, features, …</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
