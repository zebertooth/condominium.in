import { LegalDocument } from "@/components/legal/LegalDocument";
import {
  legalUpdatedDate,
  legalUpdatedLabel,
  termsSections,
} from "@/lib/content/legal";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  return createMetadata({
  title: "ข้อกำหนดการให้บริการ",
  description: "ข้อกำหนดการให้บริการ Condominium.in.th",
  path: "/terms",
  });
}

export default async function TermsPage() {
  const locale = await getLocale();
  const sections = termsSections(locale);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("termsOfService", locale)}</h1>
      <p className="mt-2 text-sm text-slate-500">
        {legalUpdatedLabel(locale)}: {legalUpdatedDate}
      </p>
      <div className="mt-10">
        <LegalDocument sections={sections} />
      </div>
    </div>
  );
}
