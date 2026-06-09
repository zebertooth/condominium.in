import Link from "next/link";
import { areaGuides } from "@/lib/areas";
import { createMetadata } from "@/lib/seo";
import { getLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

export const metadata = createMetadata({
  title: "ย่านใกล้ BTS กรุงเทพ | Condominium.in.th",
  description:
    "คู่มือย่านใกล้ BTS ในกรุงเทพฯ อโศก ทองหล่อ สาทร เอกมัย พญาไท ราคาเช่าและขายคอนโด",
  path: "/areas",
  keywords: ["ย่าน BTS", "คอนโดใกล้ BTS", "ทำเลคอนโด"],
});

export default async function AreasPage() {
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">{t("areasPageTitle", locale)}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">
        {locale === "en"
          ? "BTS area guides to help you choose the right location based on your lifestyle and budget."
          : "คู่มือทำเลคอนโดใกล้รถไฟฟ้า BTS ช่วยเลือกย่านที่เหมาะกับไลฟ์สไตล์และงบประมาณ แต่ละหน้ามีข้อมูล SEO สำหรับดึงทราฟฟิกจาก Google"}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {areaGuides.map((area) => {
          const name = locale === "en" ? area.nameEn : area.name;
          const description = locale === "en" && area.descriptionEn ? area.descriptionEn : area.description;
          const highlights = locale === "en" && area.highlightsEn ? area.highlightsEn : area.highlights;
          const btsLine = locale === "en"
            ? area.btsLine === "สุขุมวิท"
              ? "Sukhumvit Line"
              : area.btsLine === "สีลม"
                ? "Silom Line"
                : "Sukhumvit/Silom Interchange"
            : `สาย${area.btsLine}`;

          return (
            <Link
              key={area.slug}
              href={`/areas/${area.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-teal-300 hover:shadow-md"
            >
              <p className="text-sm font-medium text-teal-700">
                BTS {area.nameEn} · {btsLine}
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-900">{name}</h2>
              <p className="mt-3 text-slate-600">{description}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {highlights.map((h) => (
                  <li key={h} className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
                    {h}
                  </li>
                ))}
              </ul>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
