import crypto from "crypto";
import { prisma } from "@/lib/db";
import { siteConfig } from "@/lib/seo";

function unsubscribeSecret(): string {
  const secret = process.env.AUTH_SECRET?.trim();
  if (!secret) throw new Error("AUTH_SECRET is required for newsletter unsubscribe links");
  return secret;
}

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export function createNewsletterUnsubscribeToken(email: string): string {
  return crypto
    .createHmac("sha256", unsubscribeSecret())
    .update(`newsletter-unsub:${normalizeEmail(email)}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyNewsletterUnsubscribeToken(email: string, token: string): boolean {
  const expected = createNewsletterUnsubscribeToken(email);
  const provided = token.trim().slice(0, 32);
  if (expected.length !== provided.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(provided));
}

export function newsletterUnsubscribeUrl(email: string): string {
  const normalized = normalizeEmail(email);
  const token = createNewsletterUnsubscribeToken(normalized);
  return `${siteConfig.url}/newsletter/unsubscribe?email=${encodeURIComponent(normalized)}&token=${encodeURIComponent(token)}`;
}

export function newsletterUnsubscribeFooter(locale: string): string {
  if (locale === "en") {
    return "To unsubscribe, use the link at the bottom of any newsletter email.";
  }
  return "ยกเลิกการรับข่าวได้จากลิงก์ท้ายอีเมล";
}

export function appendNewsletterUnsubscribe(text: string, email: string, locale: string): string {
  const url = newsletterUnsubscribeUrl(email);
  if (locale === "en") {
    return `${text}\n\n---\nUnsubscribe: ${url}`;
  }
  return `${text}\n\n---\nยกเลิกการรับข่าว: ${url}`;
}

export async function unsubscribeNewsletterEmail(email: string, token: string): Promise<boolean> {
  const normalized = normalizeEmail(email);
  if (!verifyNewsletterUnsubscribeToken(normalized, token)) return false;

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email: normalized } });
  if (!existing) return false;

  if (existing.active) {
    await prisma.newsletterSubscriber.update({
      where: { email: normalized },
      data: { active: false },
    });
  }

  return true;
}
