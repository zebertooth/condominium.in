import { NextResponse } from "next/server";
import { getAllListings } from "@/lib/listings";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const raw = url.searchParams.get("slugs") ?? "";
  const slugs = raw
    .split(",")
    .map((s) => decodeURIComponent(s.trim()))
    .filter(Boolean)
    .slice(0, 4);

  if (slugs.length === 0) {
    return NextResponse.json({ listings: [] });
  }

  const all = await getAllListings();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const listings = slugs.map((slug) => bySlug.get(slug)).filter(Boolean);

  return NextResponse.json({ listings });
}
