import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import { t, tf } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, locale] = await Promise.all([getCurrentUser(), getLocale()]);
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t("dashboard", locale)}</h1>
          <p className="text-sm text-slate-600">
            {tf("dashHello", locale, { name: user.fullName, phone: user.phone })}
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link href="/dashboard" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashOverview", locale)}
          </Link>
          <Link href="/dashboard/post" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashPost", locale)}
          </Link>
          <Link href="/dashboard/verify" className="rounded-lg bg-slate-100 px-3 py-1.5 hover:bg-slate-200">
            {t("dashVerify", locale)}
          </Link>
          <LogoutButton />
        </nav>
      </div>
      {children}
    </div>
  );
}
