import { prisma } from "@/lib/db";
import { sendEmail, type SendResult } from "@/lib/notifications";

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

export async function sendEmailOtp(email: string): Promise<OtpSendResult> {
  const normalized = email.toLowerCase().trim();
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailOtp.create({
    data: { email: normalized, code, expiresAt },
  });

  const delivery: SendResult = await sendEmail(
    normalized,
    "รหัสยืนยันอีเมล - Condominium.in.th",
    `รหัสยืนยันของคุณคือ ${code}\n\nรหัสนี้จะหมดอายุใน ${OTP_EXPIRY_MINUTES} นาที\n\nหากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้`,
  );

  if (delivery.delivered) {
    return { delivered: true, provider: delivery.provider };
  }

  // Provider failed — expose code to logged-in user so verify flow can continue
  return {
    delivered: false,
    provider: delivery.provider,
    deliveryError: delivery.error,
    devCode: code,
  };
}

export async function verifyEmailOtp(email: string, code: string): Promise<boolean> {
  const normalized = email.toLowerCase().trim();
  const otp = await prisma.emailOtp.findFirst({
    where: {
      email: normalized,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otp) return false;

  await prisma.emailOtp.update({
    where: { id: otp.id },
    data: { used: true },
  });

  return true;
}
