import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/seo";

const subscribeSchema = z.object({
  email: z.string().email().max(200),
  locale: z.enum(["th", "en", "zh", "ja", "ar"]).optional(),
});

function buildWelcomeEmail(locale: string, email: string): { subject: string; text: string } {
  if (locale === "en") {
    return {
      subject: `[${siteConfig.name}] Newsletter subscribed`,
      text: [
        "Hello,",
        "",
        `Thanks for subscribing to ${siteConfig.name} newsletter (${email}).`,
        "We'll email you when we publish new project reviews, area guides, and market tips.",
        "",
        `Browse articles: ${siteConfig.url}/blog`,
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
    };
  }

  return {
    subject: `[${siteConfig.name}] สมัครรับจดหมายข่าวแล้ว`,
    text: [
      "สวัสดีครับ/ค่ะ",
      "",
      `ขอบคุณที่สมัครรับจดหมายข่าว ${siteConfig.name} (${email})`,
      "เราจะส่งอีเมลเมื่อมีรีวิวโครงการ บทความย่าน BTS และเคล็ดลับตลาดอสังหาริมทรัพย์ใหม่",
      "",
      `อ่านบทความ: ${siteConfig.url}/blog`,
      "",
      `— ${siteConfig.name}`,
    ].join("\n"),
  };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = rateLimit(`newsletter:${ip}`, 5, 60_000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
      );
    }

    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();
    const locale = parsed.data.locale ?? "th";

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.active) {
      return NextResponse.json({ success: true, alreadySubscribed: true });
    }

    if (existing && !existing.active) {
      await prisma.newsletterSubscriber.update({
        where: { email },
        data: { active: true, locale },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: { email, locale },
      });
    }

    const { subject, text } = buildWelcomeEmail(locale, email);
    void sendEmail(email, subject, text).catch((err) => {
      console.error("[newsletter] welcome email failed", err);
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter/subscribe]", err);
    return NextResponse.json({ error: "Subscription failed" }, { status: 500 });
  }
}
