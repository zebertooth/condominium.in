import { AdminProjectsPanel } from "@/components/admin/AdminProjectsPanel";
import { getAdminUser } from "@/lib/admin";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
    title: "Projects | Admin",
    description: "Manage condo and housing development projects.",
    path: "/admin/projects",
  });
}

export default async function AdminProjectsPage() {
  await getAdminUser();
  const locale = await getLocale();
  const nonTh = locale !== "th";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          {nonTh ? "Manage projects" : "จัดการโครงการ"}
        </h1>
        <p className="mt-1 text-slate-600">
          {nonTh
            ? "Create development pages and link listings to projects."
            : "สร้างหน้าโครงการและเชื่อมประกาศทรัพย์กับโครงการ"}
        </p>
      </div>
      <AdminProjectsPanel />
    </div>
  );
}
