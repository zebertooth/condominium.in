"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

interface VerifyFormProps {
  email: string | null;
  emailVerified: boolean;
  lineVerified: boolean;
  isThai: boolean;
  lineConfigured: boolean;
  phone: string | null;
  phoneVerified: boolean;
}

export function VerifyForm({
  email,
  emailVerified,
  lineVerified,
  isThai,
  lineConfigured,
  phone,
  phoneVerified,
}: VerifyFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lineStatus = searchParams.get("line");
  const t = useT();

  const lineStatusMessage = useMemo(
    () => ({
      success: t("lineStatusSuccess"),
      error: t("lineStatusError"),
      duplicate: t("lineStatusDuplicate"),
      unconfigured: t("lineStatusUnconfigured"),
    }),
    [t],
  );

  const [emailOtp, setEmailOtp] = useState("");
  const [devEmailCode, setDevEmailCode] = useState<string | null>(null);
  const [phoneOtp, setPhoneOtp] = useState("");
  const [devPhoneCode, setDevPhoneCode] = useState<string | null>(null);
  const [message, setMessage] = useState(lineStatus ? lineStatusMessage[lineStatus as keyof typeof lineStatusMessage] ?? "" : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendPhoneOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(data.message || t("phoneOtpSent"));
    if (data.devCode) setDevPhoneCode(data.devCode);
  }

  async function verifyPhone(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: phoneOtp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(t("phoneVerifiedMsg"));
    router.refresh();
  }

  async function sendEmailOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/send-email-otp", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(data.message || t("emailOtpSent"));
    if (data.devCode) setDevEmailCode(data.devCode);
  }

  async function verifyEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: emailOtp }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(t("emailVerifiedMsg"));
    router.refresh();
  }

  async function devVerifyLine() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/line/dev-verify", { method: "POST" });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setMessage(data.message);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {error && <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
      {message && <div className="rounded-lg bg-teal-50 px-4 py-3 text-sm text-teal-800">{message}</div>}

      {!isThai && (
        <div className="rounded-2xl border border-sky-200 bg-sky-50 p-6">
          <h2 className="font-bold text-sky-900">{t("nonThaiAccountTitle")}</h2>
          <p className="mt-2 text-sm text-sky-800">{t("nonThaiAccountDesc")}</p>
          <p className="mt-1 text-xs text-sky-700">{t("nonThaiAccountDescEn")}</p>
        </div>
      )}

      {isThai && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">{t("lineVerifyTitle")}</h2>
              <p className="text-sm text-slate-600">{t("lineVerifyDesc")}</p>
            </div>
            {lineVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">{t("verifiedBadge")}</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{t("pendingBadge")}</span>
            )}
          </div>
          {!lineVerified && (
            <div className="mt-4">
              {lineConfigured ? (
                <a
                  href="/api/auth/line/start"
                  className="inline-block rounded-lg bg-[#06C755] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                >
                  {t("lineConnectBtn")}
                </a>
              ) : (
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={devVerifyLine}
                    disabled={loading}
                    className="rounded-lg bg-[#06C755] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    {t("lineDevBtn")}
                  </button>
                  <p className="text-xs text-amber-700">{t("lineDevHint")}</p>
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {email ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">{t("emailVerifyTitle")}</h2>
              <p className="text-sm text-slate-600">{email}</p>
            </div>
            {emailVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">{t("verifiedBadge")}</span>
            ) : (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800">{t("pendingBadge")}</span>
            )}
          </div>
          {!emailVerified && (
            <div className="mt-4 space-y-3">
              <button type="button" onClick={sendEmailOtp} disabled={loading} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">{t("sendEmailOtpBtn")}</button>
              {devEmailCode && <p className="text-sm text-amber-700">{t("devOtpLabel")} <strong>{devEmailCode}</strong></p>}
              <form onSubmit={verifyEmail} className="flex gap-2">
                <input value={emailOtp} onChange={(e) => setEmailOtp(e.target.value)} placeholder={t("otpPlaceholder")} maxLength={6} className="flex-1 rounded-xl border px-4 py-2" />
                <button type="submit" disabled={loading || emailOtp.length !== 6} className="rounded-xl bg-teal-600 px-4 py-2 text-white">{t("verifyBtn")}</button>
              </form>
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          {t("noEmailWarning")}
        </div>
      )}

      {isThai && phone && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-slate-900">
                {t("phoneVerifyTitle")} <span className="text-sm font-normal text-slate-400">{t("phoneOptional")}</span>
              </h2>
              <p className="text-sm text-slate-600">{phone}</p>
            </div>
            {phoneVerified ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">{t("verifiedBadge")}</span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">{t("notVerifiedBadge")}</span>
            )}
          </div>
          {!phoneVerified && (
            <div className="mt-4 space-y-3">
              <button type="button" onClick={sendPhoneOtp} disabled={loading} className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white">{t("sendSmsOtpBtn")}</button>
              {devPhoneCode && <p className="text-sm text-amber-700">{t("devOtpLabel")} <strong>{devPhoneCode}</strong></p>}
              <form onSubmit={verifyPhone} className="flex gap-2">
                <input value={phoneOtp} onChange={(e) => setPhoneOtp(e.target.value)} placeholder={t("otpPlaceholder")} maxLength={6} className="flex-1 rounded-xl border px-4 py-2" />
                <button type="submit" disabled={loading || phoneOtp.length !== 6} className="rounded-xl bg-teal-600 px-4 py-2 text-white">{t("verifyBtn")}</button>
              </form>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
