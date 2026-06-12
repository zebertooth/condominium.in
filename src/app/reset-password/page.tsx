import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "ตั้งรหัสผ่านใหม่",
  description: "ตั้งรหัสผ่านใหม่สำหรับบัญชี Condominium.in.th",
  path: "/reset-password",
  });
}

export default async function ResetPasswordPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-900">{t("resetPassword", locale)}</h1>
      <div className="mt-8">
        <Suspense fallback={<div className="text-sm text-slate-500">{t("loading", locale)}</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
