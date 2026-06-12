import crypto from "crypto";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";
import { siteConfig } from "@/lib/seo";

const RESET_EXPIRY_HOURS = 1;

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export interface PasswordResetRequestResult {
  sent: boolean;
  error?: string;
}

export async function requestPasswordReset(email: string): Promise<PasswordResetRequestResult> {
  const normalized = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: normalized } });

  if (!user?.email) {
    return { sent: true };
  }

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.updateMany({
    where: { userId: user.id, used: false },
    data: { used: true },
  });

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const resetUrl = `${siteConfig.url}/reset-password?token=${encodeURIComponent(rawToken)}`;
  const delivery = await sendEmail(
    normalized,
    "รีเซ็ตรหัสผ่าน - Condominium.in.th",
    `สวัสดี ${user.fullName},\n\nคลิกลิงก์ด้านล่างเพื่อตั้งรหัสผ่านใหม่ (หมดอายุใน ${RESET_EXPIRY_HOURS} ชั่วโมง):\n\n${resetUrl}\n\nหากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้`,
  );

  if (!delivery.delivered) {
    return { sent: false, error: delivery.error ?? "Email delivery failed" };
  }

  return { sent: true };
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
): Promise<{ ok: boolean; error?: string }> {
  const tokenHash = hashToken(token.trim());
  const record = await prisma.passwordResetToken.findFirst({
    where: {
      tokenHash,
      used: false,
      expiresAt: { gt: new Date() },
    },
  });

  if (!record) {
    return { ok: false, error: "ลิงก์หมดอายุหรือไม่ถูกต้อง" };
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { used: true },
    }),
    prisma.passwordResetToken.updateMany({
      where: { userId: record.userId, used: false },
      data: { used: true },
    }),
  ]);

  return { ok: true };
}
