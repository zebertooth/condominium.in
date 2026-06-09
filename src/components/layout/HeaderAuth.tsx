import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

export async function HeaderAuth() {
  const user = await getCurrentUser();

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {user.role === "admin" && (
          <Link
            href="/admin"
            className="rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm font-medium text-violet-800 transition hover:bg-violet-100"
          >
            Admin
          </Link>
        )}
        <Link
          href="/dashboard"
          className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm font-medium text-teal-800 transition hover:bg-teal-100"
        >
          แดชบอร์ด
        </Link>
      </div>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
    >
      เข้าสู่ระบบ
    </Link>
  );
}
