import Link from "next/link";
import type { AnalyticsSummary } from "@/lib/analytics";

function BarChart({
  title,
  items,
  labelKey,
  countKey,
}: {
  title: string;
  items: Record<string, string | number>[];
  labelKey: string;
  countKey: string;
}) {
  const max = Math.max(...items.map((i) => Number(i[countKey])), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">ยังไม่มีข้อมูล</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {items.map((item) => {
            const label = String(item[labelKey]);
            const count = Number(item[countKey]);
            const pct = Math.round((count / max) * 100);
            return (
              <li key={label}>
                <div className="flex justify-between text-sm">
                  <span className="truncate text-slate-700">{label}</span>
                  <span className="font-medium text-slate-900">{count}</span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-teal-500" style={{ width: `${pct}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function AdminAnalyticsDashboard({ summary }: { summary: AnalyticsSummary }) {
  const exportTypes = [
    { type: "searches", label: "คำค้นหา" },
    { type: "views", label: "การดูประกาศ" },
    { type: "matching", label: "Matching events" },
    { type: "leads", label: "ลีดทั้งหมด" },
  ];

  const statCards = [
    { label: "คำค้นหา (30 วัน)", value: summary.searchTotal },
    { label: "การดูประกาศ", value: summary.viewTotal },
    { label: "Matching events", value: summary.matchingTotal },
    { label: "ลีดเจ้าของโดยตรง", value: summary.ownerDirectLeads },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">วิเคราะห์ข้อมูล</h1>
          <p className="mt-1 text-slate-600">คำค้นหา ยอดนิยม และการติดต่อเจ้าของ (30 วันล่าสุด)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {exportTypes.map((e) => (
            <a
              key={e.type}
              href={`/api/admin/analytics/export?type=${e.type}&days=30`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Export {e.label} (CSV)
            </a>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-6">
            <p className="text-sm text-slate-600">{card.label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <BarChart
          title="คำค้นหายอดนิยม"
          items={summary.topSearchQueries.map((r) => ({ query: r.query, count: r.count }))}
          labelKey="query"
          countKey="count"
        />
        <BarChart
          title="ประเภททรัพย์ที่ถูกดูมาก"
          items={summary.topPropertyTypes.map((r) => ({ propertyType: r.propertyType, count: r.count }))}
          labelKey="propertyType"
          countKey="count"
        />
        <BarChart
          title="ย่าน/เขตยอดนิยม"
          items={summary.topDistricts.map((r) => ({ district: r.district, count: r.count }))}
          labelKey="district"
          countKey="count"
        />
        <BarChart
          title="สถานี BTS ยอดนิยม"
          items={summary.topBtsStations.map((r) => ({ btsStation: r.btsStation, count: r.count }))}
          labelKey="btsStation"
          countKey="count"
        />
        <BarChart
          title="ประกาศที่ถูกดูมาก"
          items={summary.topViewedProperties.map((r) => ({ propertySlug: r.propertySlug, count: r.count }))}
          labelKey="propertySlug"
          countKey="count"
        />
        <BarChart
          title="Matching events ตามประเภท"
          items={summary.matchingByType.map((r) => ({ eventType: r.eventType, count: r.count }))}
          labelKey="eventType"
          countKey="count"
        />
      </div>

      <p className="mt-8 text-sm text-slate-500">
        <Link href="/admin/leads" className="text-teal-700 hover:underline">
          ดูลีดทั้งหมด →
        </Link>
      </p>
    </div>
  );
}
