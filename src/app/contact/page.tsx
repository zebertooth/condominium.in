import { LeadForm } from "@/components/lead/LeadForm";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "ติดต่อเรา | Condominium.in.th",
  description:
    "ติดต่อ Condominium.in.th สอบถามเรื่องเช่า-ซื้อคอนโด นัดชมทรัพย์ หรือลงประกาศกับเรา",
  path: "/contact",
});

export default async function ContactPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("contact", locale)}</h1>
      <p className="mt-2 text-slate-600">{t("contactPageDesc", locale)}</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-teal-50 p-6">
          <h2 className="font-semibold text-teal-900">{t("contactLineLabel", locale)}</h2>
          <p className="mt-2 text-teal-800">@condominium.in.th</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-6">
          <h2 className="font-semibold text-slate-900">{t("contactEmailLabel", locale)}</h2>
          <p className="mt-2 text-slate-700">hello@condominium.in.th</p>
        </div>
      </div>

      <div className="mt-10">
        <LeadForm source="contact" />
      </div>
    </div>
  );
}
