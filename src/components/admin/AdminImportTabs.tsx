"use client";

import { useState } from "react";
import { AdminCsvImport } from "@/components/admin/AdminCsvImport";
import { AdminProjectCsvImport } from "@/components/admin/AdminProjectCsvImport";

interface AdminImportTabsProps {
  locale: string;
}

export function AdminImportTabs({ locale }: AdminImportTabsProps) {
  const [tab, setTab] = useState<"listings" | "projects">("listings");
  const nonTh = locale !== "th";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-1">
        <button
          type="button"
          onClick={() => setTab("listings")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "listings" ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          {nonTh ? "Listings CSV" : "นำเข้าประกาศ"}
        </button>
        <button
          type="button"
          onClick={() => setTab("projects")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            tab === "projects" ? "bg-teal-600 text-white" : "text-slate-700 hover:bg-slate-50"
          }`}
        >
          {nonTh ? "Projects CSV" : "นำเข้าโครงการ"}
        </button>
      </div>

      {tab === "listings" ? <AdminCsvImport locale={locale} /> : <AdminProjectCsvImport locale={locale} />}
    </div>
  );
}
