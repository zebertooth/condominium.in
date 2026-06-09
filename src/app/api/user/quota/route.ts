import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserQuota } from "@/lib/quota";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
  }

  const quota = await getUserQuota(user.id);
  return NextResponse.json(quota);
}
