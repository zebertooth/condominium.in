"use client";

import { useState } from "react";
import {
  AGENT_CATEGORIES,
  agentCategoryHint,
  agentCategoryLabel,
  type AgentCategory,
} from "@/lib/agent-application";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { TurnstileField, useCaptchaGate } from "@/components/security/TurnstileField";

export function AgentInterestForm({ compact = false }: { compact?: boolean }) {
  const t = useT();
  const locale = useLocale();
  const [agentType, setAgentType] = useState<AgentCategory>("freelance");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done">("idle");
  const [error, setError] = useState("");
  const captcha = useCaptchaGate();

  const inputClass = compact
    ? "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-teal-500 focus:ring-2"
    : "mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-teal-500 focus:ring-2";

  async function handleSubmit(e: React.FormEvent) {
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
        source: "agent_interest",
        agentType,
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
    setName("");
    setPhone("");
    setEmail("");
  }

  if (status === "done") {
    return (
      <div className={`rounded-xl bg-teal-50 p-6 text-center ${compact ? "" : "border border-teal-100"}`}>
        <p className="font-semibold text-teal-900">{t("agentsJoinSuccessTitle")}</p>
        <p className="mt-2 text-sm text-teal-800">{t("agentsJoinSuccessDesc")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "space-y-3" : "space-y-4"}>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <fieldset>
        <legend className="block text-sm font-medium text-slate-700">{t("agentCategoryLabel")}</legend>
        <div className={`mt-2 grid gap-2 ${compact ? "grid-cols-1" : "sm:grid-cols-3"}`}>
          {AGENT_CATEGORIES.map((type) => {
            const selected = agentType === type;
            return (
              <label
                key={type}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  selected
                    ? "border-teal-500 bg-teal-50 ring-2 ring-teal-500/30"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <input
                  type="radio"
                  name="agentType"
                  value={type}
                  checked={selected}
                  onChange={() => setAgentType(type)}
                  className="sr-only"
                />
                <span className="block text-sm font-semibold text-slate-900">
                  {agentCategoryLabel(type, locale)}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-slate-600">
                  {agentCategoryHint(type, locale)}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className={compact ? "" : "grid gap-4 sm:grid-cols-2"}>
        <div className={compact ? "" : "sm:col-span-2"}>
          <label className="block text-sm font-medium text-slate-700">{t("feedbackName")}</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("feedbackPhone")}</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">{t("feedbackEmail")}</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">{t("feedbackMessage")}</label>
        <textarea
          required
          rows={compact ? 3 : 4}
          minLength={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t("feedbackAgentPlaceholder")}
          className={inputClass}
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
        className={
          compact
            ? "w-full rounded-xl bg-teal-600 py-2.5 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            : "w-full rounded-xl bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-50 sm:w-auto"
        }
      >
        {status === "submitting" ? t("feedbackSubmitting") : t("agentsJoinSubmit")}
      </button>
    </form>
  );
}
