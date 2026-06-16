"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT, useTf } from "@/components/i18n/LocaleProvider";
import {
  PENDING_PAYMENT_STORAGE,
  SPONSOR_PACKAGES,
  type SponsorPackage,
} from "@/lib/packages";

export type SponsorPaymentStep = 1 | 2 | 3 | 4;

export interface SponsorPaymentSession {
  propertyId: string;
  propertyTitle: string;
  subscriptionId: string;
  transactionRef: string;
  amount: number;
  qrDataUrl: string | null;
  packageName: string;
  step: SponsorPaymentStep;
  status?: "pending_review" | "confirmed";
}

export function readSponsorPaymentSession(): SponsorPaymentSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(PENDING_PAYMENT_STORAGE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SponsorPaymentSession;
  } catch {
    sessionStorage.removeItem(PENDING_PAYMENT_STORAGE);
    return null;
  }
}

function writeSponsorPaymentSession(session: SponsorPaymentSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    sessionStorage.setItem(PENDING_PAYMENT_STORAGE, JSON.stringify(session));
  } else {
    sessionStorage.removeItem(PENDING_PAYMENT_STORAGE);
  }
}

const STEP_KEYS = [
  "sponsorFlowStep1",
  "sponsorFlowStep2",
  "sponsorFlowStep3",
  "sponsorFlowStep4",
] as const;

interface SponsorPaymentWizardProps {
  propertyId: string;
  propertyTitle: string;
  onClose: () => void;
  /** Restore an in-progress checkout (e.g. after page refresh). */
  initialSession?: SponsorPaymentSession | null;
}

export function SponsorPaymentWizard({
  propertyId,
  propertyTitle,
  onClose,
  initialSession,
}: SponsorPaymentWizardProps) {
  const router = useRouter();
  const t = useT();
  const tf = useTf();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<SponsorPaymentStep>(initialSession?.step ?? 1);
  const [loading, setLoading] = useState(false);
  const [slipUploading, setSlipUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [session, setSession] = useState<SponsorPaymentSession | null>(
    initialSession ?? null,
  );
  const [finalStatus, setFinalStatus] = useState<"pending_review" | "confirmed" | null>(
    initialSession?.status ?? null,
  );

  const persistSession = useCallback(
    (next: SponsorPaymentSession | null) => {
      setSession(next);
      writeSponsorPaymentSession(next);
    },
    [],
  );

  useEffect(() => {
    if (initialSession) {
      setStep(initialSession.step);
      setSession(initialSession);
      setFinalStatus(initialSession.status ?? null);
    }
  }, [initialSession]);

  async function selectTier(tier: SponsorPackage) {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/packages/sponsor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, sponsorTierId: tier.id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? t("genericError"));
        setMessageType("error");
        return;
      }

      const next: SponsorPaymentSession = {
        propertyId,
        propertyTitle,
        subscriptionId: data.subscriptionId,
        transactionRef: data.transactionRef,
        amount: data.amount,
        qrDataUrl: data.qrDataUrl,
        packageName: `${t("sponsorPkgName")} ${tier.durationDays} ${t("sponsorDaysUnit")}`,
        step: 2,
      };
      persistSession(next);
      setStep(2);
    } catch {
      setMessage(t("genericError"));
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }

  function goToUploadStep() {
    if (!session) return;
    const next = { ...session, step: 3 as const };
    persistSession(next);
    setStep(3);
  }

  async function uploadSlip() {
    if (!fileInputRef.current?.files?.length || !session) return;

    setSlipUploading(true);
    setMessage("");
    const file = fileInputRef.current.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {
        setMessage(t("slipUploadFailed"));
        setMessageType("error");
        return;
      }

      const uploadData = await uploadRes.json();
      const confirmRes = await fetch("/api/packages/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: session.subscriptionId,
          slipUrl: uploadData.url,
        }),
      });

      const confirmData = await confirmRes.json();

      if (confirmData.status === "confirmed") {
        setFinalStatus("confirmed");
        setStep(4);
        persistSession({ ...session, step: 4, status: "confirmed" });
        router.refresh();
      } else if (confirmData.status === "pending_review") {
        setFinalStatus("pending_review");
        setStep(4);
        persistSession({ ...session, step: 4, status: "pending_review" });
      } else if (confirmData.status === "amount_mismatch") {
        setMessage(confirmData.message ?? t("genericError"));
        setMessageType("error");
      } else {
        setMessage(confirmData.error ?? t("genericError"));
        setMessageType("error");
      }
    } catch {
      setMessage(t("slipUploadRetry"));
      setMessageType("error");
    } finally {
      setSlipUploading(false);
    }
  }

  function closeWizard() {
    if (step === 4 && finalStatus === "confirmed") {
      persistSession(null);
    }
    onClose();
  }

  const msgBg =
    messageType === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : messageType === "error"
        ? "bg-red-50 text-red-800 border-red-200"
        : "bg-sky-50 text-sky-800 border-sky-200";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sponsor-wizard-title"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
        <h3 id="sponsor-wizard-title" className="text-lg font-bold text-slate-900">
          {t("sponsorFlowTitle")}
        </h3>
        <p className="mt-1 text-sm text-slate-600">
          {tf("sponsorFlowProperty", { title: propertyTitle })}
        </p>

        <ol className="mt-5 flex gap-1 sm:gap-2" aria-label={t("sponsorFlowStepsAria")}>
          {STEP_KEYS.map((key, index) => {
            const n = (index + 1) as SponsorPaymentStep;
            const active = step === n;
            const done = step > n;
            return (
              <li
                key={key}
                className={`flex flex-1 flex-col items-center rounded-lg border px-1 py-2 text-center text-[10px] sm:text-xs ${
                  active
                    ? "border-violet-400 bg-violet-50 font-semibold text-violet-900"
                    : done
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                }`}
              >
                <span
                  className={`mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                    active
                      ? "bg-violet-600 text-white"
                      : done
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-300 text-white"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
                {t(key)}
              </li>
            );
          })}
        </ol>

        {message && (
          <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${msgBg}`}>{message}</div>
        )}

        {step === 1 && (
          <div className="mt-6">
            <p className="text-sm font-medium text-slate-800">{t("sponsorChooseTier")}</p>
            <p className="mt-1 text-xs text-slate-600">{t("sponsorPkgDesc")}</p>
            <div className="mt-4 space-y-2">
              {SPONSOR_PACKAGES.map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => selectTier(tier)}
                  disabled={loading}
                  className="flex w-full items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left hover:bg-amber-100 disabled:opacity-50"
                >
                  <span className="font-medium text-amber-900">
                    {tier.durationDays} {t("sponsorDaysUnit")}
                    {tier.badge ? ` · ${tier.badge}` : ""}
                  </span>
                  <span className="font-bold text-amber-900">฿{tier.priceBaht}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && session && (
          <div className="mt-6 rounded-xl border-2 border-violet-200 bg-violet-50 p-5">
            <p className="text-center text-sm font-medium text-violet-900">
              {session.packageName} — ฿{session.amount}
            </p>
            <p className="mt-1 text-center text-xs text-violet-600">
              Ref: {session.transactionRef}
            </p>

            {session.qrDataUrl ? (
              <div className="mt-4 flex justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.qrDataUrl}
                  alt="PromptPay QR Code"
                  className="h-56 w-56 rounded-lg border border-violet-200 bg-white p-2 sm:h-64 sm:w-64"
                />
              </div>
            ) : (
              <div className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">
                {t("promptPayNotConfigured")}
              </div>
            )}

            <div className="mt-4 text-sm text-violet-800">
              <p className="font-medium">{t("payStepsTitle")}</p>
              <ol className="mt-2 list-inside list-decimal space-y-1 text-xs text-violet-700">
                <li>{t("payStep1")}</li>
                <li>{tf("payStep2", { amount: session.amount })}</li>
                <li>{t("sponsorFlowStep2Hint")}</li>
              </ol>
            </div>

            <button
              type="button"
              onClick={goToUploadStep}
              className="mt-5 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
            >
              {t("sponsorFlowPaidBtn")}
            </button>
          </div>
        )}

        {step === 3 && session && (
          <div className="mt-6 rounded-xl border-2 border-violet-200 bg-violet-50 p-5">
            <p className="text-sm font-medium text-violet-900">{t("sponsorFlowStep3Title")}</p>
            <p className="mt-1 text-xs text-violet-700">{t("payStep3")}</p>
            <p className="mt-2 text-xs text-violet-600">
              {session.packageName} — ฿{session.amount}
            </p>

            <label className="mt-4 block text-sm font-medium text-violet-800">
              {t("uploadSlipLabel")}
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="mt-2 block w-full text-sm text-violet-700 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-violet-800"
            />
            <button
              type="button"
              onClick={uploadSlip}
              disabled={slipUploading}
              className="mt-4 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {slipUploading ? t("creatingOrder") : t("confirmPaymentBtn")}
            </button>
            <button
              type="button"
              onClick={() => {
                if (session) {
                  persistSession({ ...session, step: 2 });
                  setStep(2);
                }
              }}
              className="mt-2 w-full text-sm text-violet-600 underline hover:text-violet-800"
            >
              {t("sponsorFlowBackToQr")}
            </button>
          </div>
        )}

        {step === 4 && finalStatus === "pending_review" && (
          <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-6 text-center">
            <div className="text-4xl">⏳</div>
            <h4 className="mt-3 font-bold text-amber-900">{t("pendingReviewTitle")}</h4>
            <p className="mt-2 text-sm text-amber-800">{t("pendingReviewDesc")}</p>
            <p className="mt-2 text-xs text-amber-700">{t("sponsorFlowStep4Hint")}</p>
          </div>
        )}

        {step === 4 && finalStatus === "confirmed" && (
          <div className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-6 text-center">
            <div className="text-4xl">✅</div>
            <h4 className="mt-3 font-bold text-emerald-900">{t("paymentSuccessTitle")}</h4>
            <p className="mt-2 text-sm text-emerald-800">{t("paymentSuccessDescSponsor")}</p>
          </div>
        )}

        <button
          type="button"
          onClick={closeWizard}
          className="mt-5 w-full text-sm text-slate-600 hover:text-slate-900"
        >
          {step === 4 ? t("closeBtn") : t("sponsorFlowCancel")}
        </button>
      </div>
    </div>
  );
}
