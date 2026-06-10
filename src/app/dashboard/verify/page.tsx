import { redirect } from "next/navigation";
import { VerifyForm } from "@/components/dashboard/VerifyForm";
import { getCurrentUser } from "@/lib/auth";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { lineConfigured } from "@/lib/line";

export default async function VerifyPage() {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  return (
    <div>
      <h2 className="mb-6 text-xl font-bold text-slate-900">{t("verifyPageTitle", locale)}</h2>
      <p className="mb-8 text-slate-600">
        {user.isThai ? t("verifyThaiDesc", locale) : t("verifyNonThaiDesc", locale)}
      </p>
      <VerifyForm
        email={user.email}
        emailVerified={user.emailVerified}
        lineVerified={user.lineVerified}
        isThai={user.isThai}
        lineConfigured={lineConfigured()}
        phone={user.phone}
        phoneVerified={user.phoneVerified}
      />
    </div>
  );
}
