import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { importListingsCsv } from "@/lib/inventory-import";
import { getUserQuota } from "@/lib/quota";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "กรุณาเข้าสู่ระบบ" }, { status: 401 });
    }

    if (user.role === "admin") {
      return NextResponse.json(
        { error: "ใช้ /admin/import สำหรับบัญชีแอดมิน" },
        { status: 400 },
      );
    }

    const quota = await getUserQuota(user.id);
    if (quota.postingBlocked) {
      return NextResponse.json({ error: "บัญชีนี้ยังไม่สามารถลงประกาศได้" }, { status: 403 });
    }
    if (quota.requiresVerification) {
      return NextResponse.json(
        { error: "กรุณายืนยันตัวตนก่อนนำเข้าประกาศ" },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const content = await file.text();
    const result = await importListingsCsv(content, user.id, {
      status: "pending",
      agentManaged: user.role === "agent",
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("User CSV import error:", err);
    return NextResponse.json(
      { error: "Import failed", details: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 },
    );
  }
}
