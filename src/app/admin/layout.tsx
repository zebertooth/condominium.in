import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-lg font-bold">Admin Panel</p>
            <p className="text-xs text-slate-400">Condominium.in.th</p>
          </div>
          <nav className="flex gap-2 text-sm">
            <Link href="/admin" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              ภาพรวม
            </Link>
            <Link href="/admin/properties" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              ประกาศ
            </Link>
            <Link href="/admin/users" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              ผู้ใช้
            </Link>
            <Link href="/admin/leads" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              ลีด
            </Link>
            <Link href="/admin/payments" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              การชำระเงิน
            </Link>
            <Link href="/admin/analytics" className="rounded-lg bg-slate-800 px-3 py-1.5 hover:bg-slate-700">
              วิเคราะห์ข้อมูล
            </Link>
            <Link href="/" className="rounded-lg border border-slate-600 px-3 py-1.5 hover:bg-slate-800">
              กลับเว็บไซต์
            </Link>
            <LogoutButton className="rounded-lg border border-red-400/60 px-3 py-1.5 text-red-200 hover:bg-red-950/50" />
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
