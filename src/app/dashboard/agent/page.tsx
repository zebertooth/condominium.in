import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { AgentLeadTable, type LeadView } from "@/components/dashboard/AgentLeadTable";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "agent" && user.role !== "admin")) {
    redirect("/dashboard");
  }

  // Admins see all leads in CRM; agents only see leads assigned to themselves
  const isAgent = user.role === "agent";
  const leadsQuery = isAgent
    ? { assignedToId: user.id }
    : {}; // Admin sees all leads

  const leads = await prisma.lead.findMany({
    where: leadsQuery,
    orderBy: { createdAt: "desc" },
    include: { assignedTo: { select: { fullName: true } } },
  });

  // Calculate statistics
  const totalLeads = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === "new").length;
  const contactedLeadsCount = leads.filter((l) => l.status === "contacted").length;
  const viewingLeadsCount = leads.filter((l) => l.status === "viewing").length;
  const closedLeadsCount = leads.filter((l) => l.status === "closed").length;

  // Filter scheduled viewings
  const scheduledViewings = leads
    .filter((l) => l.viewingDate !== null)
    .sort((a, b) => {
      const dateA = a.viewingDate || "";
      const dateB = b.viewingDate || "";
      return dateA.localeCompare(dateB);
    });

  // Map to LeadView format
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
    agentNote: lead.agentNote,
    viewingDate: lead.viewingDate,
    viewingTime: lead.viewingTime,
    createdAt: lead.createdAt.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  return (
    <div className="space-y-8">
      {/* Overview stats cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">ลีดทั้งหมด</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalLeads}</p>
        </div>
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">ใหม่</p>
          <p className="mt-2 text-2xl font-bold text-blue-900">{newLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">ติดต่อแล้ว</p>
          <p className="mt-2 text-2xl font-bold text-amber-900">{contactedLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-violet-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-violet-600 uppercase tracking-wider">นัดชม</p>
          <p className="mt-2 text-2xl font-bold text-violet-900">{viewingLeadsCount}</p>
        </div>
        <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 text-center shadow-sm">
          <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">สำเร็จ</p>
          <p className="mt-2 text-2xl font-bold text-green-900">{closedLeadsCount}</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Lead list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {isAgent ? "งาน / ลีดที่ฉันดูแล" : "ลีดทั้งหมดในระบบ (แอดมิน)"}
            </h2>
            <span className="text-sm text-slate-500">
              แสดง {leadViews.length} รายการ
            </span>
          </div>
          <AgentLeadTable leads={leadViews} />
        </div>

        {/* Viewing Schedule / Agenda sidebar */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">📅 ตารางนัดเข้าชมทรัพย์</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
            {scheduledViewings.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-4">ยังไม่มีนัดชมทรัพย์ที่กำหนดเวลา</p>
            ) : (
              <div className="space-y-3">
                {scheduledViewings.map((v) => (
                  <div key={v.id} className="relative pl-4 border-l-2 border-violet-500 py-1 space-y-1">
                    <p className="text-xs font-semibold text-violet-700">
                      {v.viewingDate} · {v.viewingTime ?? "ไม่ระบุเวลา"} น.
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      คุณ {v.name}
                    </p>
                    {v.propertyTitle && (
                      <p className="text-xs text-slate-500 truncate">
                        ทรัพย์: {v.propertyTitle}
                      </p>
                    )}
                    <span className="inline-block rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 font-medium">
                      สถานะ: {v.status === "new" ? "ลีดใหม่" : v.status === "contacted" ? "ติดต่อแล้ว" : v.status === "viewing" ? "นัดชมทรัพย์" : v.status === "closed" ? "สำเร็จ" : "ยกเลิก"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
