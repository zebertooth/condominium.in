import { MortgageCalculator } from "@/components/property/MortgageCalculator";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";
import Link from "next/link";

export async function generateMetadata() {
  const locale = await getLocale();
  return createMetadata({
    title: locale === "th" ? "คำนวณสินเชื่อบ้าน" : "Mortgage Calculator",
    description:
      locale === "th"
        ? "คำนวณยอดผ่อนสินเชื่อบ้าน/คอนโด ดูดอกเบี้ย ยอดผ่อนต่อเดือน และค่าใช้จ่ายทั้งหมด"
        : "Calculate your home loan. See interest rates, monthly payments, and total costs.",
    path: "/tools/mortgage-calculator",
  });
}

export default async function MortgageCalculatorPage() {
  const locale = await getLocale();
  const nonTh = locale !== "th";

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          {nonTh ? "Mortgage Calculator" : "คำนวณสินเชื่อบ้าน"}
        </h1>
        <p className="mt-2 text-slate-600">
          {nonTh
            ? "Estimate your monthly mortgage payment for properties in Bangkok"
            : "ประมาณการผ่อนชำระรายเดือนสำหรับอสังหาริมทรัพย์ในกรุงเทพฯ"}
        </p>
      </div>

      <MortgageCalculator locale={locale} />

      <div className="mt-12 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-bold text-slate-900">
          {nonTh ? "Thai Home Loan Tips" : "เคล็ดลับสินเชื่อบ้าน"}
        </h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-600">
          <li className="flex gap-3">
            <span className="text-teal-600">•</span>
            <span>
              {nonTh
                ? "Most Thai banks offer up to 80-90% loan-to-value for condos, 80-85% for houses"
                : "ธนาคารส่วนใหญ่ให้วงเงินกู้ 80-90% สำหรับคอนโด และ 80-85% สำหรับบ้าน"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-teal-600">•</span>
            <span>
              {nonTh
                ? "Interest rates vary by bank: fixed for first 2-3 years (4-6%), then floating (5.5-7%)"
                : "อัตราดอกเบี้ยต่างกันตามธนาคาร: คงที่ 2-3 ปีแรก (4-6%) จากนั้นลอยตัว (5.5-7%)"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-teal-600">•</span>
            <span>
              {nonTh
                ? "Monthly payment should not exceed 30-40% of your gross income"
                : "ยอดผ่อนต่อเดือนไม่ควรเกิน 30-40% ของรายได้รวม"}
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-teal-600">•</span>
            <span>
              {nonTh
                ? "Budget for additional costs: transfer fee (2%), stamp duty (0.5%), mortgage registration (1%)"
                : "เตรียมค่าใช้จ่ายเพิ่มเติม: ค่าโอน (2%), อากร (0.5%), จดจำนอง (1%)"}
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-8 text-center">
        <Link
          href={localePath("/buy", locale)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition hover:bg-teal-700"
        >
          {t("buyPageTitle", locale)}
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
