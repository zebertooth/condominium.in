import { LegalDocument } from "@/components/legal/LegalDocument";
import {
  legalUpdatedDate,
  legalUpdatedLabel,
  privacySections,
} from "@/lib/content/legal";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "นโยบายความเป็นส่วนตัว",
  description: "นโยบายความเป็นส่วนตัวและคุกกี้ของ Condominium.in.th",
  path: "/privacy",
  });
}

export default async function PrivacyPage() {
  const locale = await getLocale();
  const sections = privacySections(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("privacyPolicy", locale)}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {legalUpdatedLabel(locale)}: {legalUpdatedDate}
      </p>
      <div className="mt-10">
        <LegalDocument sections={sections} />
      </div>
    </div>
  );
}
