"use client";

import dynamic from "next/dynamic";

const CsvImportPanelLazy = dynamic(
  () => import("@/components/dashboard/CsvImportPanel").then((m) => m.CsvImportPanel),
  { ssr: false },
);

interface AdminCsvImportProps {
  locale: string;
}

export function AdminCsvImport({ locale }: AdminCsvImportProps) {
  const nonTh = locale !== "th";

  return (
    <div>
      <h2 className="text-lg font-bold text-slate-900">
        {nonTh ? "CSV Import" : "นำเข้า CSV"}
      </h2>
      <p className="mt-1 text-sm text-slate-600">
        {nonTh
          ? "Upload a CSV file to bulk import property listings (published immediately)"
          : "อัปโหลด CSV — ประกาศจะเผยแพร่ทันที (แอดมิน)"}
      </p>
      <CsvImportPanelLazy locale={locale} uploadPath="/api/admin/import" />
    </div>
  );
}
