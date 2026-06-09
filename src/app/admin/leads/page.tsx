import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { AdminLeadTable, type AgentOption, type LeadView } from "@/components/admin/AdminLeadTable";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  await getAdminUser();

  const [leads, agents] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { assignedTo: { select: { id: true, fullName: true } } },
    }),
    prisma.user.findMany({
      where: { role: { in: ["admin", "agent"] } },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  const leadViews: LeadView[] = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    email: lead.email,
    message: lead.message,
    source: lead.source,
    contactMode: lead.contactMode,
    propertySlug: lead.propertySlug,
    propertyTitle: lead.propertyTitle,
    btsStation: lead.btsStation,
    status: lead.status,
    assignedToId: lead.assignedToId,
    assignedToName: lead.assignedTo?.fullName ?? null,
    agentNote: lead.agentNote,
    createdAt: lead.createdAt.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const agentOptions: AgentOption[] = agents.map((a) => ({ id: a.id, name: a.fullName }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">ลีด / ลูกค้าที่สนใจ</h1>
      <p className="mt-1 text-slate-600">
        จัดการคำขอติดต่อจากฟอร์มและหน้าประกาศ มอบหมายเอเจนต์ และติดตามสถานะ
      </p>

      <div className="mt-8">
        <AdminLeadTable leads={leadViews} agents={agentOptions} />
      </div>
    </div>
  );
}
