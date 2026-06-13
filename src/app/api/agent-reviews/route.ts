import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reviewSchema = z.object({
  teamAgentId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
  leadId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ถูกต้อง" },
        { status: 400 },
      );
    }

    const agent = await prisma.teamAgent.findUnique({
      where: { id: parsed.data.teamAgentId },
      select: { id: true, published: true },
    });
    if (!agent || !agent.published) {
      return NextResponse.json({ error: "ไม่พบเอเจนต์" }, { status: 404 });
    }

    const review = await prisma.agentReview.upsert({
      where: {
        userId_teamAgentId: {
          userId: user.id,
          teamAgentId: parsed.data.teamAgentId,
        },
      },
      create: {
        userId: user.id,
        teamAgentId: parsed.data.teamAgentId,
        rating: parsed.data.rating,
        comment: parsed.data.comment?.trim() ?? "",
        leadId: parsed.data.leadId,
        status: "pending",
      },
      update: {
        rating: parsed.data.rating,
        comment: parsed.data.comment?.trim() ?? "",
        status: "pending",
      },
    });

    return NextResponse.json({
      review,
      message: "ส่งรีวิวแล้ว รอแอดมินอนุมัติ",
    });
  } catch (err) {
    console.error("Agent review error:", err);
    return NextResponse.json({ error: "ส่งรีวิวไม่สำเร็จ" }, { status: 500 });
  }
}
