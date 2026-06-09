import { NextResponse } from "next/server";
import { runAISearch } from "@/lib/ai-search";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import type { AISearchRequest } from "@/types/property";

const AI_LIMIT = 20;
const AI_WINDOW_MS = 60_000; // 20 requests / minute / IP

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`ai-search:${ip}`, AI_LIMIT, AI_WINDOW_MS);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "ค้นหาบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่" },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = (await request.json()) as AISearchRequest;

    if (!body.query?.trim()) {
      return NextResponse.json(
        { error: "กรุณาระบุคำค้นหา" },
        { status: 400 },
      );
    }

    const result = await runAISearch(body);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาด กรุณาลองใหม่" },
      { status: 500 },
    );
  }
}
