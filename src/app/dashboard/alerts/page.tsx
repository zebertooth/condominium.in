import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertsList } from "@/components/dashboard/AlertsList";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { t } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { localePath } from "@/lib/locale-routing";
import { createMetadata } from "@/lib/seo";
import { touchSearchAlertEngagement } from "@/lib/search-alert-digest";

export async function generateMetadata() {
  return createMetadata({
    title: "การแจ้งเตือน | Dashboard",
    description: "Manage search alerts for new matching listings.",
    path: "/dashboard/alerts",
  });
}

export default async function AlertsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const locale = await getLocale();
  const lp = (path: string) => localePath(path, locale);

  await touchSearchAlertEngagement(user.id);

  const alerts = await prisma.searchAlert.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  const alertsData = alerts.map((a) => ({
    id: a.id,
    name: a.name,
    listingType: a.listingType,
    filters: JSON.parse(a.filters) as Record<string, unknown>,
    frequency: a.frequency,
    active: a.active,
    lastSentAt: a.lastSentAt?.toISOString() || null,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {t("alertsPageTitle", locale)}
          </h1>
          <p className="mt-1 text-slate-600">
            {t("alertsPageDesc", locale)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href={lp("/buy")}
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
          >
            {t("alertsBrowseCreate", locale)}
          </Link>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-slate-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <p className="mt-4 text-slate-600">
            {t("alertsEmpty", locale)}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {t("alertsEmptyHint", locale)}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={lp("/buy")}
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700"
            >
              {t("buyPageTitle", locale)}
            </Link>
            <Link
              href={lp("/rent")}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              {t("rentPageTitle", locale)}
            </Link>
          </div>
        </div>
      ) : (
        <AlertsList alerts={alertsData} locale={locale} />
      )}
    </div>
  );
}
