import { prisma } from "@/lib/db";
import { sendSms } from "@/lib/notifications";
import { normalizePhone } from "@/lib/validation";

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendPhoneOtp(phone: string): Promise<{ devCode?: string }> {
  const normalized = normalizePhone(phone);
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.phoneOtp.create({
    data: { phone: normalized, code, expiresAt },
  });

  await sendSms(
    normalized,
    `Condominium.in.th: รหัสยืนยันของคุณคือ ${code} (หมดอายุใน ${OTP_EXPIRY_MINUTES} นาที)`,
  );

  // Expose the code only in development so testers can verify without a real SMS provider.
  if (process.env.NODE_ENV === "development") {
    return { devCode: code };
  }

  return {};
}

export async function verifyPhoneOtp(phone: string, code: string): Promise<boolean> {
  const normalized = normalizePhone(phone);
  const otp = await prisma.phoneOtp.findFirst({
    where: {
      phone: normalized,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return false;

  await prisma.phoneOtp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}
