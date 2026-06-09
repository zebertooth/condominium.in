import Link from "next/link";
import { getAdminStats } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const cards = [
    { label: "ผู้ใช้ทั้งหมด", value: stats.users, href: "/admin/users" },
    { label: "ประกาศเผยแพร่", value: stats.properties, href: "/admin/properties?status=published" },
    { label: "รออนุมัติ", value: stats.pendingProperties, href: "/admin/properties?status=pending", highlight: true },
    { label: "ลีดใหม่", value: stats.newLeads, href: "/admin/leads", highlight: stats.newLeads > 0 },
    { label: "วิเคราะห์ข้อมูล", value: "→", href: "/admin/analytics" },
    { label: "รอตรวจชำระเงิน", value: stats.pendingPayments, href: "/admin/payments", highlight: stats.pendingPayments > 0 },
    { label: "รอยืนยันบัตร", value: stats.pendingVerifications, href: "/admin/users" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">ภาพรวมระบบ</h1>
      <p className="mt-1 text-slate-600">จัดการผู้ใช้ ประกาศ และการยืนยันตัวตน</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className={`rounded-2xl border p-6 transition hover:shadow-md ${
              card.highlight ? "border-amber-300 bg-amber-50" : "border-slate-200 bg-white"
            }`}
          >
            <p className="text-sm text-slate-600">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
