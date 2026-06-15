import { AdminImportTabs } from "@/components/admin/AdminImportTabs";
import { getAdminUser } from "@/lib/admin";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";
import { t } from "@/lib/i18n";
import Link from "next/link";

export async function generateMetadata() {
  return createMetadata({
    title: "CSV Import | Admin",
    description: "Bulk import property listings from CSV file.",
    path: "/admin/import",
  });
}

export default async function AdminImportPage() {
  await getAdminUser();
  const locale = await getLocale();
  const nonTh = locale !== "th";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {nonTh ? "Import Listings" : "นำเข้าประกาศ"}
        </h1>
        <p className="mt-1 text-slate-600">
          {nonTh
            ? "Bulk import property listings from CSV files"
            : "นำเข้าประกาศทรัพย์จำนวนมากจากไฟล์ CSV"}
        </p>
      </div>

      <AdminImportTabs locale={locale} />

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          {nonTh ? "After Import" : "หลังนำเข้า"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {nonTh
            ? "Imported listings are automatically published. You can review and edit them in the properties section."
            : "ประกาศที่นำเข้าจะเผยแพร่โดยอัตโนมัติ คุณสามารถตรวจสอบและแก้ไขได้ในส่วนประกาศทรัพย์"}
        </p>
        <div className="mt-4">
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {nonTh ? "Manage projects" : "จัดการโครงการ"}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/admin/properties"
            className="ml-3 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200"
          >
            {t("adminPropertiesTitle", locale)}
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
