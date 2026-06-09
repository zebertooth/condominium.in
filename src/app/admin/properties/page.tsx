import { AdminPropertyTable } from "@/components/admin/AdminPropertyTable";
import { prisma } from "@/lib/db";
import { dbPropertyToListing } from "@/lib/user-properties";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminPropertiesPage({ searchParams }: PageProps) {
  const { status } = await searchParams;
  const filterStatus = status && ["pending", "published", "rejected"].includes(status) ? status : undefined;

  const rows = await prisma.userProperty.findMany({
    where: filterStatus ? { status: filterStatus } : { status: { not: "deleted" } },
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, fullName: true, phone: true, email: true, role: true } },
    },
  });

  const properties = rows.map((p) => ({
    ...dbPropertyToListing(p),
    ownerName: p.user.fullName,
    ownerPhone: p.user.phone,
    ownerEmail: p.user.email,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">จัดการประกาศ</h1>
      <div className="mt-4 flex gap-2 text-sm">
        {[
          { label: "ทั้งหมด", value: undefined },
          { label: "รออนุมัติ", value: "pending" },
          { label: "เผยแพร่", value: "published" },
          { label: "ปฏิเสธ", value: "rejected" },
        ].map((tab) => (
          <a
            key={tab.label}
            href={tab.value ? `/admin/properties?status=${tab.value}` : "/admin/properties"}
            className={`rounded-full px-3 py-1 ${
              filterStatus === tab.value || (!filterStatus && !tab.value)
                ? "bg-slate-900 text-white"
                : "bg-white text-slate-700 border border-slate-200"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>
      <div className="mt-6">
        <AdminPropertyTable properties={properties} />
      </div>
    </div>
  );
}
