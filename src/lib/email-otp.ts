import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/notifications";

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export async function sendEmailOtp(email: string): Promise<{ devCode?: string }> {
  const normalized = email.toLowerCase().trim();
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.emailOtp.create({
    data: { email: normalized, code, expiresAt },
  });

  await sendEmail(
    normalized,
    "รหัสยืนยันอีเมล - Condominium.in.th",
    `รหัสยืนยันของคุณคือ ${code}\n\nรหัสนี้จะหมดอายุใน ${OTP_EXPIRY_MINUTES} นาที\n\nหากคุณไม่ได้ร้องขอ กรุณาเพิกเฉยต่ออีเมลนี้`,
  );

  // Expose the code only in development so testers can verify without a real email provider.
  if (process.env.NODE_ENV === "development") {
    return { devCode: code };
  }

  return {};
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
