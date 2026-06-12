import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "ลืมรหัสผ่าน",
  description: "รีเซ็ตรหัสผ่านผ่านอีเมล — Condominium.in.th",
  path: "/forgot-password",
  });
}

export default async function ForgotPasswordPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("forgotPassword", locale)}</h1>
      <div className="mt-8">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
