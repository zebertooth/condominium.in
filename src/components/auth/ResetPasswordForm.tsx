"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

export function ResetPasswordForm() {
  const t = useT();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!token) {
      setError(t("resetLinkInvalid"));
      return;
    }

    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    const confirm = String(form.get("confirmPassword"));

    if (password !== confirm) {
      setLoading(false);
      setError(t("passwordMismatch"));
      return;
    }

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? t("resetPasswordError"));
      return;
    }

    router.push("/login?reset=1");
    router.refresh();
  }

  if (!token) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-red-700">{t("resetLinkInvalid")}</p>
        <p className="mt-4 text-center text-sm">
          <Link href="/forgot-password" className="font-medium text-teal-700 hover:underline">
            {t("forgotPassword")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <p className="text-sm text-slate-600">{t("resetPasswordDesc")}</p>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          {t("newPassword")}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700">
          {t("confirmPassword")}
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? t("resettingPassword") : t("resetPassword")}
      </button>
    </form>
  );
}
