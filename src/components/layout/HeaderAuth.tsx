import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { getCurrentUser } from "@/lib/auth";
import { t, type Locale } from "@/lib/i18n";

type HeaderUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

interface HeaderAuthProps {
  user: HeaderUser | null;
  locale: Locale;
}

export function HeaderAuth({ user, locale }: HeaderAuthProps) {
  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="hidden rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100 sm:inline-flex"
          >
            Admin
          </Link>
        )}
        <span className="hidden max-w-[8rem] truncate text-sm text-slate-600 md:inline">
          {user.fullName}
        </span>
        <LogoutButton className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        {t("login", locale)}
      </Link>
      <Link
        href="/register"
        className="hidden rounded-lg bg-teal-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-teal-700 sm:inline-flex"
      >
        {t("register", locale)}
      </Link>
    </div>
  );
}
