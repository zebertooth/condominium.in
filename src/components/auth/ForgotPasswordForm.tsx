"use client";

import Link from "next/link";
import { useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

export function ForgotPasswordForm() {
  const t = useT();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? t("forgotPasswordError"));
      return;
    }

    setMessage(data.message ?? t("forgotPasswordSent"));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && (
        <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</div>
      )}

      <p className="text-sm text-slate-600">{t("forgotPasswordDesc")}</p>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          {t("emailLabel")}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@email.com"
          className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-teal-600 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
      >
        {loading ? t("sendingResetLink") : t("sendResetLink")}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/login" className="font-medium text-teal-700 hover:underline">
          {t("backToLogin")}
        </Link>
      </p>
    </form>
  );
}
