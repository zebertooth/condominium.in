import { NextResponse } from "next/server";
import { readCronSecret } from "@/lib/cron-auth";
import { runSearchAlertDigests } from "@/lib/search-alert-digest";

function authorizeCron(request: Request): boolean {
  const secret = readCronSecret();
  if (!secret) return process.env.NODE_ENV === "development";

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const { searchParams } = new URL(request.url);
  return searchParams.get("secret") === secret;
}

export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runSearchAlertDigests();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron/search-alerts]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Cron failed" },
      { status: 500 },
    );
  }
}
