import { AdminUserTable } from "@/components/admin/AdminUserTable";
import { prisma } from "@/lib/db";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      phone: true,
      email: true,
      phoneVerified: true,
      emailVerified: true,
      idVerified: true,
      role: true,
      listingLimitOverride: true,
      createdAt: true,
      _count: { select: { properties: true } },
    },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">จัดการผู้ใช้</h1>
      <p className="mt-1 text-slate-600">
        ยืนยันบัตรประชาชน ตั้งบทบาท (ผู้ใช้/เอเจนต์/แอดมิน) และกำหนดโควตาประกาศรายคน
      </p>
      <div className="mt-6">
        <AdminUserTable users={serialized} />
      </div>
    </div>
  );
}
