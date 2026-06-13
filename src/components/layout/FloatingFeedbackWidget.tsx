"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AgentInterestForm } from "@/components/agents/AgentInterestForm";
import { useT } from "@/components/i18n/LocaleProvider";
import { TurnstileField, useCaptchaGate } from "@/components/security/TurnstileField";

type FeedbackTab = "feedback" | "agent";

export function FloatingFeedbackWidget() {
  const t = useT();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<FeedbackTab>("feedback");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");
  const captcha = useCaptchaGate();

  if (pathname.startsWith("/admin")) return null;

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!captcha.ready) {
      setError(t("captchaRequired"));
      return;
    }

    setError("");
    setStatus("submitting");

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        phone: phone || undefined,
        email: email || undefined,
        message,
        source: "feedback",
        captchaToken: captcha.token || undefined,
      }),
    });

    const data = (await res.json()) as { error?: string };
    if (!res.ok) {
      setError(data.error ?? t("genericError"));
      setStatus("idle");
      captcha.reset();
      return;
    }

    setStatus("done");
    setMessage("");
  }

  function switchTab(next: FeedbackTab) {
    setTab(next);
    setError("");
    setStatus("idle");
    captcha.reset();
  }

  function closePanel() {
    setOpen(false);
    setError("");
    captcha.reset();
    if (status === "done") {
      setStatus("idle");
      setName("");
      setPhone("");
      setEmail("");
    }
  }

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label={t("feedbackClose")}
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
          onClick={closePanel}
        />
      )}

      <div className="fixed bottom-6 end-6 z-50 flex flex-col items-end gap-3">
        {open && (
          <div
            role="dialog"
            aria-labelledby="feedback-widget-title"
            className="w-[min(calc(100vw-2rem),22rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
              <p id="feedback-widget-title" className="font-semibold text-slate-900">
                {t("feedbackWidgetTitle")}
              </p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => switchTab("feedback")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    tab === "feedback"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t("feedbackTabFeedback")}
                </button>
                <button
                  type="button"
                  onClick={() => switchTab("agent")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                    tab === "agent"
                      ? "bg-teal-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {t("feedbackTabAgent")}
                </button>
              </div>
            </div>

            <div className="max-h-[min(60vh,28rem)] overflow-y-auto p-4">
              {tab === "agent" ? (
                <>
                  <p className="text-sm leading-relaxed text-slate-600">{t("feedbackTabAgentDesc")}</p>
                  <Link
                    href="/agents#join-agent"
                    className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline"
                  >
                    {t("agentsJoinTitle")} →
                  </Link>
                  <div className="mt-4">
                    <AgentInterestForm compact />
                  </div>
                </>
              ) : status === "done" ? (
                <div className="py-4 text-center">
                  <p className="font-medium text-teal-800">{t("feedbackSuccessTitle")}</p>
                  <p className="mt-2 text-sm text-slate-600">{t("feedbackSuccessDesc")}</p>
                  <button
                    type="button"
                    onClick={closePanel}
                    className="mt-4 rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
                  >
                    {t("closeBtn")}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-sm leading-relaxed text-slate-600">{t("feedbackTabFeedbackDesc")}</p>
                  <form onSubmit={handleFeedbackSubmit} className="mt-4 space-y-3">
                    {error && (
                      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
                    )}
                    <div>
                      <label className="block text-xs font-medium text-slate-700">{t("feedbackName")}</label>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">{t("feedbackPhone")}</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">{t("feedbackEmail")}</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700">{t("feedbackMessage")}</label>
                      <textarea
                        required
                        rows={4}
                        minLength={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("feedbackMessagePlaceholder")}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
                      />
                    </div>
                    <p className="text-xs text-slate-500">{t("feedbackContactHint")}</p>
                    <TurnstileField
                      siteKey={captcha.siteKey}
                      loading={captcha.loading}
                      resetKey={captcha.resetKey}
                      onVerify={captcha.setToken}
                      onExpire={() => captcha.setToken("")}
                      onError={() => captcha.setToken("")}
                    />
                    <button
                      type="submit"
                      disabled={status === "submitting" || (captcha.enabled && !captcha.ready)}
                      className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                    >
                      {status === "submitting" ? t("feedbackSubmitting") : t("feedbackSubmit")}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => (open ? closePanel() : setOpen(true))}
          aria-expanded={open}
          aria-label={t("feedbackWidgetTitle")}
          className="flex items-center gap-2 rounded-full bg-teal-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-teal-700 hover:shadow-xl"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <span className="hidden sm:inline">{t("feedbackFabLabel")}</span>
            </>
          )}
        </button>
      </div>
    </>
  );
}
