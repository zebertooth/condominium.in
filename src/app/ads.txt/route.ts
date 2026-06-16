import { adsensePublisherId } from "@/lib/adsense";

export function GET() {
  const pub = adsensePublisherId();
  if (!pub) {
    return new Response("AdSense not configured", { status: 404 });
  }

  const body = `google.com, ${pub}, DIRECT, f087472428947b36\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
