"use client";

import { useState } from "react";
import { generateSampleCsv } from "@/lib/csv-import";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: { row: number; message: string }[];
}

interface AdminCsvImportProps {
  locale: string;
}

export function AdminCsvImport({ locale }: AdminCsvImportProps) {
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

      const res = await fetch("/api/admin/import", {
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
      <h2 className="text-lg font-bold text-slate-900">
        {nonTh ? "CSV Import" : "นำเข้า CSV"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {nonTh
          ? "Upload a CSV file to bulk import property listings"
          : "อัปโหลดไฟล์ CSV เพื่อนำเข้าประกาศทรัพย์จำนวนมาก"}
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
          <p className="text-xs text-slate-500">
            {(file.size / 1024).toFixed(1)} KB
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
            ? "Import Listings"
            : "นำเข้าประกาศ"}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <div
            className={`rounded-lg p-4 ${
              result.success ? "bg-green-50" : "bg-amber-50"
            }`}
          >
            <p
              className={`font-medium ${
                result.success ? "text-green-800" : "text-amber-800"
              }`}
            >
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
              <p className="font-medium text-red-800">
                {nonTh ? "Errors" : "ข้อผิดพลาด"}
              </p>
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
        <h3 className="font-medium text-slate-900">
          {nonTh ? "CSV Format Guide" : "รูปแบบ CSV"}
        </h3>
        <div className="mt-2 text-sm text-slate-600">
          <p className="font-medium">{nonTh ? "Required columns:" : "คอลัมน์ที่จำเป็น:"}</p>
          <ul className="mt-1 ml-4 list-disc">
            <li>title - {nonTh ? "Property title (Thai)" : "ชื่อประกาศ"}</li>
            <li>description - {nonTh ? "Full description" : "รายละเอียด"}</li>
            <li>listingType - sale {nonTh ? "or" : "หรือ"} rent</li>
            <li>propertyType - condo, apartment, house, townhouse, land, commercial, npa</li>
            <li>price - {nonTh ? "Price in THB" : "ราคาเป็นบาท"}</li>
            <li>bedrooms - {nonTh ? "Number of bedrooms" : "จำนวนห้องนอน"}</li>
            <li>bathrooms - {nonTh ? "Number of bathrooms" : "จำนวนห้องน้ำ"}</li>
            <li>areaSqm - {nonTh ? "Area in sq.m." : "พื้นที่ ตร.ม."}</li>
            <li>district - {nonTh ? "District name (Thai)" : "เขต/อำเภอ"}</li>
          </ul>
          <p className="mt-3 font-medium">{nonTh ? "Optional columns:" : "คอลัมน์เพิ่มเติม:"}</p>
          <ul className="mt-1 ml-4 list-disc">
            <li>titleEn, districtEn - {nonTh ? "English versions" : "ภาษาอังกฤษ"}</li>
            <li>highlights - {nonTh ? "Nearby places for AI search" : "สถานที่ใกล้เคียง"}</li>
            <li>btsStation, btsLine - {nonTh ? "BTS info" : "ข้อมูล BTS"}</li>
            <li>floor, landSqWah - {nonTh ? "Floor/land size" : "ชั้น/พื้นที่ดิน"}</li>
            <li>latitude, longitude - {nonTh ? "Coordinates" : "พิกัด"}</li>
            <li>features - {nonTh ? "Comma-separated features" : "คุณสมบัติ คั่นด้วยเครื่องหมายจุลภาค"}</li>
            <li>images - {nonTh ? "Comma-separated image URLs" : "URL รูปภาพ คั่นด้วยเครื่องหมายจุลภาค"}</li>
            <li>npaBank, npaReferenceUrl - {nonTh ? "For NPA listings" : "สำหรับทรัพย์ NPA"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
