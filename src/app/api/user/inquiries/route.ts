import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const leads = await prisma.lead.findMany({
    where: {
      ownerUserId: user.id,
      contactMode: "owner_direct",
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json({
    inquiries: leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      message: lead.message,
      propertySlug: lead.propertySlug,
      propertyTitle: lead.propertyTitle,
      btsStation: lead.btsStation,
      viewingDate: lead.viewingDate,
      viewingTime: lead.viewingTime,
      status: lead.status,
      createdAt: lead.createdAt.toISOString(),
    })),
  });
}
