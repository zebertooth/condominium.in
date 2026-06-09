import { NextResponse } from "next/server";
import { createLead } from "@/lib/leads";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { leadSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`lead:${ip}`, 5, 60_000); // 5 inquiries / minute / IP
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "ส่งคำขอบ่อยเกินไป กรุณารอสักครู่" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await request.json();
    const parsed = leadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "ข้อมูลไม่ครบ" },
        { status: 400 },
      );
    }

    await createLead(parsed.data);

    return NextResponse.json({
      message: "ส่งข้อความเรียบร้อย ทีมงานจะติดต่อกลับโดยเร็ว",
    });
  } catch {
    return NextResponse.json({ error: "ส่งข้อความไม่สำเร็จ" }, { status: 500 });
  }
}
