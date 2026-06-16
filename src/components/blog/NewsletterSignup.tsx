"use client";

import { useState } from "react";
import { t, type Locale } from "@/lib/i18n";

interface NewsletterSignupProps {
  locale: Locale;
}

export function NewsletterSignup({ locale }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), locale }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error || t("newsletterError", locale));
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError(t("newsletterError", locale));
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-2xl border border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 sm:p-8">
      <h2 className="text-xl font-bold text-slate-900">{t("newsletterTitle", locale)}</h2>
      <p className="mt-2 text-sm text-slate-600 sm:text-base">{t("newsletterDesc", locale)}</p>

      {success ? (
        <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          {t("newsletterSuccess", locale)}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("newsletterEmailPlaceholder", locale)}
            className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-slate-900 outline-none ring-teal-500 focus:ring-2"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-teal-700 disabled:opacity-50"
          >
            {loading ? t("newsletterSubmitting", locale) : t("newsletterSubmit", locale)}
          </button>
        </form>
      )}

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}
