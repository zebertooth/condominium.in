import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { t, type Locale } from "@/lib/i18n";
import type { getCurrentUser } from "@/lib/auth";

type HeaderUser = NonNullable<Awaited<ReturnType<typeof getCurrentUser>>>;

interface HeaderAuthProps {
  user: HeaderUser | null;
  locale: Locale;
}

function userInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export function HeaderAuth({ user, locale }: HeaderAuthProps) {
  if (user) {
    return (
      <div className="flex items-center gap-1.5">
        {user.role === "admin" && (
          <Link
            href="/admin"
            title="Admin"
            aria-label="Admin"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-violet-200 bg-gradient-to-b from-violet-50 to-violet-100/80 text-violet-800 shadow-sm transition hover:border-violet-300 hover:from-violet-100"
          >
            <span aria-hidden className="text-base leading-none">
              ⚙
            </span>
          </Link>
        )}
        <Link
          href="/dashboard"
          title={user.fullName}
          aria-label={`${t("dashboard", locale)} — ${user.fullName}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-[11px] font-bold text-white shadow-sm ring-2 ring-white transition hover:from-teal-600 hover:to-teal-800"
        >
          {userInitials(user.fullName)}
        </Link>
        <LogoutButton iconOnly />
      </div>
    );
  }

  const accountLabel = `${t("login", locale)} / ${t("register", locale)}`;

  return (
    <Link
      href="/login"
      title={accountLabel}
      aria-label={accountLabel}
      className="inline-flex h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50/50 sm:px-3.5"
    >
      <UserIcon className="h-4 w-4 shrink-0 text-teal-700" />
      <span className="hidden max-w-[9rem] truncate sm:inline">{accountLabel}</span>
    </Link>
  );
}
