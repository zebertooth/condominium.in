"use client";

import { useState } from "react";
import { AdminCsvImport } from "@/components/admin/AdminCsvImport";
import { AdminProjectCsvImport } from "@/components/admin/AdminProjectCsvImport";
import { AdminStarterImport } from "@/components/admin/AdminStarterImport";

interface AdminImportTabsProps {
  locale: string;
}

export function AdminImportTabs({ locale }: AdminImportTabsProps) {
  const [tab, setTab] = useState<"listings" | "projects">("listings");
  const nonTh = locale !== "th";

  return (
    <div className="space-y-6">
      <AdminStarterImport />

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
        <p className="font-medium text-slate-900">
          {nonTh ? "Or upload CSV manually" : "หรืออัปโหลด CSV เอง"}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <a
            href="/inventory/starter-projects.csv"
            download
            className="rounded-lg bg-white px-3 py-2 font-medium text-teal-800 shadow-sm ring-1 ring-teal-200 hover:bg-teal-100"
          >
            starter-projects.csv
          </a>
          <a
            href="/inventory/starter-listings.csv"
            download
            className="rounded-lg bg-white px-3 py-2 font-medium text-teal-800 shadow-sm ring-1 ring-teal-200 hover:bg-teal-100"
          >
            starter-listings.csv
          </a>
        </div>
      </div>

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
