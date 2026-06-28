import { Suspense } from "react";
import { AISearchClient } from "@/components/ai/AISearchClient";
import { JsonLd } from "@/components/seo/JsonLd";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { createMetadata } from "@/lib/seo";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title: locale === "th" ? "ค้นหาคอนโดด้วย AI" : "AI Condo Search",
    description:
      locale === "th"
        ? "บอกความต้องการเป็นภาษาพูด AI วิเคราะห์ประกาศทั้งหมดและแนะนำคอนโดใกล้ BTS ที่ตรงใจในกรุงเทพฯ"
        : "Describe what you want in plain language — AI matches all Bangkok listings near BTS, MRT, and BRT.",
    path: "/ai-search",
    keywords: ["AI ค้นหาคอนโด", "คอนโดใกล้ BTS", "แนะนำคอนโด", "AI property search Bangkok"],
    locale,
  });
}

export default async function AISearchPage() {
  const locale = await getLocale();

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: t("aiSearchFaq1Q", locale), acceptedAnswer: { "@type": "Answer", text: t("aiSearchFaq1A", locale) } },
      { "@type": "Question", name: t("aiSearchFaq2Q", locale), acceptedAnswer: { "@type": "Answer", text: t("aiSearchFaq2A", locale) } },
      { "@type": "Question", name: t("aiSearchFaq3Q", locale), acceptedAnswer: { "@type": "Answer", text: t("aiSearchFaq3A", locale) } },
    ],
  };

  const faqs = [
    { q: t("aiSearchFaq1Q", locale), a: t("aiSearchFaq1A", locale) },
    { q: t("aiSearchFaq2Q", locale), a: t("aiSearchFaq2A", locale) },
    { q: t("aiSearchFaq3Q", locale), a: t("aiSearchFaq3A", locale) },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <JsonLd data={faqJsonLd} />

      <h1 className="text-3xl font-bold text-slate-900">{t("aiSearch", locale)}</h1>
      <p className="mt-2 text-slate-600">
        {locale === "th"
          ? "บอกความต้องการเป็นภาษาพูด เช่น ย่าน BTS จำนวนห้องนอน และงบประมาณ AI จะวิเคราะห์ข้อมูลทุกประกาศบนเว็บไซต์และแนะนำทรัพย์ที่เหมาะสม"
          : "Describe area, bedrooms, and budget in plain language. We match every live listing and suggest the best fits."}
      </p>

      <Suspense fallback={<div className="mt-8 text-slate-500">…</div>}>
        <div className="mt-8">
          <AISearchClient />
        </div>
      </Suspense>

      <section className="mt-12 rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <h2 className="text-lg font-bold text-slate-900">{t("aiSearchFaqTitle", locale)}</h2>
        <dl className="mt-4 space-y-4">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <dt className="font-medium text-slate-900">{faq.q}</dt>
              <dd className="mt-1 text-sm text-slate-600">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
