import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserQuota } from "@/lib/quota";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  try {
    const quota = await getUserQuota(user.id);

    return NextResponse.json({
      user: {
        ...user,
        contactVerified: user.phoneVerified || user.emailVerified,
      },
      quota,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
