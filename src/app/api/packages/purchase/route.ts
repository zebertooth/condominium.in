import { NextResponse } from "next/server";

/** Listing quota packages are disabled — unlimited free listings; sponsor-only paid. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "ไม่เปิดขายแพ็กเพิ่มโควตาแล้ว — ลงประกาศได้ไม่จำกัด ใช้เมนู \"ทำประกาศแนะนำ\" เพื่อโปรโมทประกาศ",
    },
    { status: 403 },
  );
}
