import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">แดชบอร์ด</h1>
          <p className="text-sm text-slate-600">
            สวัสดี {user.fullName} ({user.phone})
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/dashboard" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            ภาพรวม
          </Link>
          <Link href="/dashboard/post" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            ลงประกาศ
          </Link>
          <Link href="/dashboard/verify" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            ยืนยันตัวตน
          </Link>
          {(user.role === "agent" || user.role === "admin") && (
            <Link
              href="/dashboard/agent"
              className="rounded-lg bg-teal-50 px-3 py-1.5 text-teal-700 hover:bg-teal-100 font-medium"
            >
              งานของฉัน (CRM)
            </Link>
          )}
          <LogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
