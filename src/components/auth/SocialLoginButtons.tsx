import Link from "next/link";
import { facebookConfigured } from "@/lib/facebook-oauth";
import { googleConfigured } from "@/lib/google-oauth";

export function SocialLoginButtons() {
  const google = googleConfigured();
  const facebook = facebookConfigured();
  if (!google && !facebook) return null;

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center" aria-hidden>
          <div className="w-full border-t border-slate-200" />
        </div>
        <p className="relative flex justify-center text-xs uppercase tracking-wide text-slate-500">
          <span className="bg-white px-2">หรือ</span>
        </p>
      </div>
      <div className="grid gap-2">
        {google && (
          <Link
            href="/api/auth/google/start"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white py-3 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            <span aria-hidden>G</span>
            เข้าสู่ระบบด้วย Google
          </Link>
        )}
        {facebook && (
          <Link
            href="/api/auth/facebook/start"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 bg-[#1877F2] py-3 text-sm font-medium text-white hover:bg-[#166fe5]"
          >
            <span aria-hidden>f</span>
            เข้าสู่ระบบด้วย Facebook
          </Link>
        )}
      </div>
    </div>
  );
}
