import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import { getAreaBySlug } from "@/lib/areas";
import { filterListings } from "@/lib/listings";
import { createMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) return {};

  return createMetadata({
    title: area.seoTitle,
    description: area.seoDescription,
    path: `/areas/${slug}`,
    keywords: [area.name, `BTS ${area.btsStation}`, "คอนโด"],
  });
}

export default async function AreaPage({ params }: PageProps) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const properties = await filterListings({ btsStation: area.btsStation });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/areas" className="hover:text-teal-700">ย่านใกล้ BTS</Link>
        {" / "}
        <span className="text-slate-900">BTS {area.btsStation}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">
        คอนโดใกล้ BTS {area.btsStation} ({area.name})
      </h1>
      <p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-700">
        {area.description}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-teal-50 p-4">
          <p className="text-sm text-teal-700">เช่าเฉลี่ย</p>
          <p className="text-xl font-bold text-teal-900">
            ฿{area.avgRentPrice.toLocaleString("th-TH")}/เดือน
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">ราคาขายเฉลี่ย</p>
          <p className="text-xl font-bold text-slate-900">
            ฿{area.avgSalePrice.toLocaleString("th-TH")}/ตร.ม.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">สาย BTS</p>
          <p className="text-xl font-bold text-slate-900">{area.btsLine}</p>
        </div>
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-600">ประกาศในระบบ</p>
          <p className="text-xl font-bold text-slate-900">{properties.length} รายการ</p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white">
        <h2 className="text-xl font-bold">หาคอนโดใกล้ BTS {area.btsStation} ด้วย AI</h2>
        <p className="mt-2 text-violet-100">
          บอกความต้องการ เช่น &quot;2 ห้องนอน ใกล้ BTS {area.btsStation} งบ 30,000&quot; AI จะแนะนำทรัพย์ที่ตรงใจ
        </p>
        <Link
          href={`/ai-search?q=ใกล้+BTS+${area.btsStation}&type=rent`}
          className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 font-medium text-indigo-700"
        >
          ค้นหาด้วย AI →
        </Link>
      </div>

      <div className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">ประกาศใกล้ BTS {area.btsStation}</h2>
        <PropertyGrid properties={properties} />
      </div>
    </div>
  );
}
