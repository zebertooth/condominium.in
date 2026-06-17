import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { getOwnerUnreadInquiryCount } from "@/lib/owner-inquiries";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  const unreadInquiries =
    user.role === "user" ? await getOwnerUnreadInquiryCount(user.id) : 0;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("dashboard", locale)}</h1>
          <p className="text-sm text-slate-600">
            {tf("dashHello", locale, {
              name: user.fullName,
              phone: user.phone ?? user.email ?? "—",
            })}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/dashboard" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashOverview", locale)}
          </Link>
          <Link href="/dashboard/post" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashPost", locale)}
          </Link>
          {user.role !== "admin" && (
            <Link
              href="/dashboard/import"
              prefetch={false}
              className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200"
            >
              {t("dashImport", locale)}
            </Link>
          )}
          <Link href="/dashboard/verify" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashVerify", locale)}
          </Link>
          <Link href="/dashboard/saved" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashSaved", locale)}
          </Link>
          <Link href="/dashboard/alerts" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashAlerts", locale)}
          </Link>
          {user.role === "user" && (
            <Link
              href="/dashboard/inquiries"
              className="relative rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200"
            >
              {t("dashInquiries", locale)}
              {unreadInquiries > 0 && (
                <span
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white"
                  aria-label={tf("inquiryUnreadBadge", locale, { count: unreadInquiries })}
                >
                  {unreadInquiries > 9 ? "9+" : unreadInquiries}
                </span>
              )}
            </Link>
          )}
          {(user.role === "agent" || user.role === "admin") && (
            <Link
              href="/dashboard/agent"
              className="rounded-lg bg-teal-50 px-3 py-1.5 text-teal-700 hover:bg-teal-100 font-medium"
            >
              งานของฉัน (CRM)
            </Link>
          )}
          <LogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
