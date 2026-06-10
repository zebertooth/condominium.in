import { prisma } from "@/lib/db";
import { sendSms, type SendResult } from "@/lib/notifications";
import { normalizePhone } from "@/lib/validation";

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export interface OtpSendResult {
  devCode?: string;
  delivered: boolean;
  provider?: string;
  deliveryError?: string;
}

export async function sendPhoneOtp(phone: string): Promise<OtpSendResult> {
  const normalized = normalizePhone(phone);
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.phoneOtp.create({
    data: { phone: normalized, code, expiresAt },
  });

  const delivery: SendResult = await sendSms(
    normalized,
    `Condominium.in.th: รหัสยืนยันของคุณคือ ${code} (หมดอายุใน ${OTP_EXPIRY_MINUTES} นาที)`,
  );

  if (delivery.delivered) {
    return { delivered: true, provider: delivery.provider };
  }

  return {
    delivered: false,
    provider: delivery.provider,
    deliveryError: delivery.error,
    devCode: code,
  };
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
