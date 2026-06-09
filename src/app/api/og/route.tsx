import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title")?.slice(0, 90) ?? "Bangkok Condos & Houses";
  const subtitle =
    searchParams.get("subtitle")?.slice(0, 120) ?? "Buy / Rent near BTS · AI property search";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0f766e 0%, #4f46e5 100%)",
          padding: "70px",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
          Condominium.in.th
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, maxWidth: 1000 }}>
            {title}
          </div>
          <div style={{ marginTop: 24, fontSize: 32, opacity: 0.9, maxWidth: 1000 }}>
            {subtitle}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, opacity: 0.85 }}>
          condominium.in.th · Bangkok real estate marketplace
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
