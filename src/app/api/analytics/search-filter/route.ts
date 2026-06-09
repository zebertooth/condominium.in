import { NextResponse } from "next/server";
import { logSearchEvent } from "@/lib/analytics";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      listingType?: string;
      district?: string;
      btsStation?: string;
      minPrice?: number;
      maxPrice?: number;
      bedrooms?: number;
      resultCount?: number;
    };

    const queryParts: string[] = [];
    if (body.listingType) queryParts.push(body.listingType);
    if (body.district) queryParts.push(body.district);
    if (body.btsStation) queryParts.push(`BTS:${body.btsStation}`);
    if (body.bedrooms) queryParts.push(`${body.bedrooms}BR`);
    if (body.minPrice) queryParts.push(`min:${body.minPrice}`);
    if (body.maxPrice) queryParts.push(`max:${body.maxPrice}`);
    const query = queryParts.join(" ") || "browse";

    await logSearchEvent({
      query,
      listingType: body.listingType,
      btsStation: body.btsStation,
      district: body.district,
      filters: {
        minPrice: body.minPrice,
        maxPrice: body.maxPrice,
        bedrooms: body.bedrooms,
      },
      resultCount: body.resultCount ?? 0,
      source: "browse-filter",
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Never fail a page load over analytics
    return NextResponse.json({ ok: false });
  }
}
