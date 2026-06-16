"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { useT, useTf } from "@/components/i18n/LocaleProvider";
import { PENDING_PAYMENT_STORAGE, SPONSOR_PACKAGES } from "@/lib/packages";

interface PendingPayment {
  subscriptionId: string;
  transactionRef: string;
  amount: number;
  qrDataUrl: string | null;
  packageName: string;
}

const TIER_KEYS: Record<string, { name: string; desc: string }> = {
  sponsor_1d: { name: "sponsorTier1dName", desc: "sponsorTier1dDesc" },
  sponsor_3d: { name: "sponsorTier3dName", desc: "sponsorTier3dDesc" },
  sponsor_7d: { name: "sponsorTier7dName", desc: "sponsorTier7dDesc" },
};

export function PackageShop() {
  const router = useRouter();
  const t = useT();
  const tf = useTf();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem(PENDING_PAYMENT_STORAGE);
    if (!raw) return null;
    try {
      const payment = JSON.parse(raw) as PendingPayment;
      sessionStorage.removeItem(PENDING_PAYMENT_STORAGE);
      return payment;
    } catch {
      sessionStorage.removeItem(PENDING_PAYMENT_STORAGE);
      return null;
    }
  });
  const [slipUploading, setSlipUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = useCallback((msg: string, type: "success" | "error" | "info") => {
    setMessage(msg);
    setMessageType(type);
  }, []);

  async function uploadSlip() {
    if (!fileInputRef.current?.files?.length || !pendingPayment) return;

    setSlipUploading(true);
    const file = fileInputRef.current.files[0];

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        showMessage(t("slipUploadFailed"), "error");
        setSlipUploading(false);
        return;
      }

      const uploadData = await uploadRes.json();
      const slipUrl = uploadData.url;

      const confirmRes = await fetch("/api/packages/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscriptionId: pendingPayment.subscriptionId,
          slipUrl,
        }),
      });

      const confirmData = await confirmRes.json();
      setSlipUploading(false);

      if (confirmData.status === "confirmed") {
        showMessage(confirmData.message, "success");
        setPaymentStatus("confirmed");
        setPendingPayment(null);
        router.refresh();
      } else if (confirmData.status === "pending_review") {
        showMessage(confirmData.message, "info");
        setPaymentStatus("pending_review");
      } else if (confirmData.status === "amount_mismatch") {
        showMessage(confirmData.message, "error");
      } else {
        showMessage(confirmData.error ?? t("genericError"), "error");
      }
    } catch {
      setSlipUploading(false);
      showMessage(t("slipUploadRetry"), "error");
    }
  }

  function cancelPayment() {
    setPendingPayment(null);
    setPaymentStatus(null);
    setMessage("");
  }

  const msgBg =
    messageType === "success"
      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
      : messageType === "error"
        ? "bg-red-50 text-red-800 border-red-200"
        : "bg-sky-50 text-sky-800 border-sky-200";

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="font-bold text-slate-900">{t("sponsorShopTitle")}</h2>
      <p className="mt-1 text-sm text-slate-600">{t("sponsorShopDesc")}</p>

      {message && (
        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${msgBg}`}>{message}</div>
      )}

      {pendingPayment && !paymentStatus && (
        <div className="mt-6 rounded-xl border-2 border-violet-300 bg-violet-50 p-6">
          <h3 className="text-center text-lg font-bold text-violet-900">
            {t("payPromptPayTitle")}
          </h3>
          <p className="mt-1 text-center text-sm text-violet-700">
            {pendingPayment.packageName} — ฿{pendingPayment.amount}
          </p>
          <p className="mt-1 text-center text-xs text-violet-600">
            Ref: {pendingPayment.transactionRef}
          </p>

          {pendingPayment.qrDataUrl ? (
            <div className="mt-4 flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={pendingPayment.qrDataUrl}
                alt="PromptPay QR Code"
                className="h-64 w-64 rounded-lg border border-violet-200 bg-white p-2"
              />
            </div>
          ) : (
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-sm text-amber-800">
              {t("promptPayNotConfigured")}
            </div>
          )}

          <div className="mt-4 text-center text-sm text-violet-700">
            <p className="font-medium">{t("payStepsTitle")}</p>
            <ol className="mt-1 list-inside list-decimal text-left text-xs text-violet-600">
              <li>{t("payStep1")}</li>
              <li>{tf("payStep2", { amount: pendingPayment.amount })}</li>
              <li>{t("payStep3")}</li>
            </ol>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-violet-800">
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
              className="mt-3 w-full rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {slipUploading ? t("creatingOrder") : t("confirmPaymentBtn")}
            </button>
            <button
              type="button"
              onClick={cancelPayment}
              className="mt-2 w-full text-sm text-violet-600 underline hover:text-violet-800"
            >
              {t("closeBtn")}
            </button>
          </div>
        </div>
      )}

      {paymentStatus === "pending_review" && (
        <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 text-center">
          <div className="text-3xl">⏳</div>
          <h3 className="mt-2 font-bold text-amber-900">{t("pendingReviewTitle")}</h3>
          <p className="mt-1 text-sm text-amber-700">{t("pendingReviewDesc")}</p>
          <button
            type="button"
            onClick={() => {
              setPaymentStatus(null);
              setPendingPayment(null);
              setMessage("");
            }}
            className="mt-3 text-sm text-amber-600 underline hover:text-amber-800"
          >
            {t("closeBtn")}
          </button>
        </div>
      )}

      {paymentStatus === "confirmed" && (
        <div className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center">
          <div className="text-3xl">✅</div>
          <h3 className="mt-2 font-bold text-emerald-900">{t("paymentSuccessTitle")}</h3>
          <p className="mt-1 text-sm text-emerald-700">{t("paymentSuccessDesc")}</p>
        </div>
      )}

      {!pendingPayment && !paymentStatus && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SPONSOR_PACKAGES.map((pkg) => {
            const keys = TIER_KEYS[pkg.id];
            return (
              <div
                key={pkg.id}
                className="relative rounded-xl border border-amber-200 bg-amber-50 p-5"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-3 rounded-full bg-amber-600 px-2 py-0.5 text-xs text-white">
                    {pkg.badge}
                  </span>
                )}
                <h3 className="font-bold text-amber-900">
                  {keys ? t(keys.name as Parameters<typeof t>[0]) : pkg.name}
                </h3>
                <p className="mt-1 text-sm text-amber-800">
                  {keys ? t(keys.desc as Parameters<typeof t>[0]) : pkg.description}
                </p>
                <p className="mt-3 text-2xl font-bold text-amber-900">฿{pkg.priceBaht}</p>
                <p className="mt-1 text-xs text-amber-700">
                  {pkg.durationDays} {t("sponsorDaysUnit")}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {!pendingPayment && !paymentStatus && (
        <p className="mt-4 text-sm text-slate-600">{t("sponsorPackageHint")}</p>
      )}
    </div>
  );
}
