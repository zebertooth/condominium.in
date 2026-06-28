"use client";

import Link from "next/link";
import { useT, useTf } from "@/components/i18n/LocaleProvider";
import type { AnalyticsSummary } from "@/lib/analytics";

function BarChart({
  title,
  items,
  labelKey,
  countKey,
  emptyLabel,
}: {
  title: string;
  items: Record<string, string | number>[];
  labelKey: string;
  countKey: string;
  emptyLabel: string;
}) {
  const max = Math.max(...items.map((i) => Number(i[countKey])), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">{emptyLabel}</p>
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

export function AdminAnalyticsDashboard({
  summary,
  days = 30,
}: {
  summary: AnalyticsSummary;
  days?: number;
}) {
  const t = useT();
  const tf = useTf();

  const periodLinks = [
    { days: 7, label: t("adminAnalyticsDays7") },
    { days: 30, label: t("adminAnalyticsDays30") },
    { days: 90, label: t("adminAnalyticsDays90") },
  ];

  const exportTypes = [
    { type: "searches", label: t("adminExportSearches") },
    { type: "views", label: t("adminExportViews") },
    { type: "matching", label: t("adminExportMatching") },
    { type: "leads", label: t("adminExportLeads") },
  ];

  const statCards = [
    { label: t("adminSearchTotal"), value: summary.searchTotal },
    { label: t("adminViewTotal"), value: summary.viewTotal },
    { label: t("adminMatchingTotal"), value: summary.matchingTotal },
    { label: t("adminOwnerLeadsTotal"), value: summary.ownerDirectLeads },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("adminAnalytics")}</h1>
          <p className="mt-1 text-slate-600">{t("adminAnalyticsDesc")}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
            <span className="px-2 text-xs font-medium text-slate-500">{t("adminAnalyticsDays")}</span>
            {periodLinks.map((p) => (
              <Link
                key={p.days}
                href={`/admin/analytics?days=${p.days}`}
                className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                  days === p.days
                    ? "bg-teal-600 text-white"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>
          {exportTypes.map((e) => (
            <a
              key={e.type}
              href={`/api/admin/analytics/export?type=${e.type}&days=${days}`}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {tf("adminExportCsv", { label: e.label })}
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
          title={t("adminChartTopSearches")}
          items={summary.topSearchQueries.map((r) => ({ query: r.query, count: r.count }))}
          labelKey="query"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
        <BarChart
          title={t("adminChartTopTypes")}
          items={summary.topPropertyTypes.map((r) => ({ propertyType: r.propertyType, count: r.count }))}
          labelKey="propertyType"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
        <BarChart
          title={t("adminChartTopDistricts")}
          items={summary.topDistricts.map((r) => ({ district: r.district, count: r.count }))}
          labelKey="district"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
        <BarChart
          title={t("adminChartTopBts")}
          items={summary.topBtsStations.map((r) => ({ btsStation: r.btsStation, count: r.count }))}
          labelKey="btsStation"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
        <BarChart
          title={t("adminChartTopProperties")}
          items={summary.topViewedProperties.map((r) => ({ propertySlug: r.propertySlug, count: r.count }))}
          labelKey="propertySlug"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
        <BarChart
          title={t("adminChartMatching")}
          items={summary.matchingByType.map((r) => ({ eventType: r.eventType, count: r.count }))}
          labelKey="eventType"
          countKey="count"
          emptyLabel={t("adminNoData")}
        />
      </div>

      <p className="mt-8 text-sm text-slate-500">
        <Link href="/admin/leads" className="text-teal-700 hover:underline">
          {t("adminViewAllLeads")}
        </Link>
      </p>
    </div>
  );
}
