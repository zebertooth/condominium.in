"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { LISTING_PACKAGES, SPONSOR_PACKAGE } from "@/lib/packages";

interface PendingPayment {
  subscriptionId: string;
  transactionRef: string;
  amount: number;
  qrDataUrl: string | null;
  packageName: string;
}

export function PackageShop() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(null);
  const [slipUploading, setSlipUploading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = useCallback((msg: string, type: "success" | "error" | "info") => {
    setMessage(msg);
    setMessageType(type);
  }, []);

  async function buyPackage(packageId: string) {
    setLoading(packageId);
    setMessage("");
    setPendingPayment(null);
    setPaymentStatus(null);

    try {
      const res = await fetch("/api/packages/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId }),
      });
      const data = await res.json();
      setLoading(null);

      if (!res.ok) {
        showMessage(data.error, "error");
        return;
      }

      const pkg = LISTING_PACKAGES.find((p) => p.id === packageId);
      setPendingPayment({
        subscriptionId: data.subscriptionId,
        transactionRef: data.transactionRef,
        amount: data.amount,
        qrDataUrl: data.qrDataUrl,
        packageName: pkg?.name ?? packageId,
      });
      showMessage(data.message, "info");
    } catch {
      setLoading(null);
      showMessage("เกิดข้อผิดพลาด กรุณาลองใหม่", "error");
    }
  }

  async function uploadSlip() {
    if (!fileInputRef.current?.files?.length || !pendingPayment) return;

    setSlipUploading(true);
    const file = fileInputRef.current.files[0];

    try {
      // Upload slip image via existing /api/upload endpoint
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        showMessage("อัปโหลดสลิปไม่สำเร็จ", "error");
        setSlipUploading(false);
        return;
      }

      const uploadData = await uploadRes.json();
      const slipUrl = uploadData.url;

      // Confirm payment with uploaded slip
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
        showMessage(confirmData.error ?? "เกิดข้อผิดพลาด", "error");
      }
    } catch {
      setSlipUploading(false);
      showMessage("อัปโหลดสลิปไม่สำเร็จ กรุณาลองใหม่", "error");
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
      <h2 className="font-bold text-slate-900">ซื้อแพ็กเพิ่มประกาศ</h2>
      <p className="mt-1 text-sm text-slate-600">
        ลงประกาศเกิน 2 รายการได้ด้วยแพ็กรายเดือน — ชำระผ่าน PromptPay
      </p>

      {message && (
        <div className={`mt-4 rounded-lg border px-4 py-3 text-sm ${msgBg}`}>
          {message}
        </div>
      )}

      {/* PromptPay QR Modal */}
      {pendingPayment && !paymentStatus && (
        <div className="mt-6 rounded-xl border-2 border-violet-300 bg-violet-50 p-6">
          <h3 className="text-center text-lg font-bold text-violet-900">
            ชำระเงินผ่าน PromptPay
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
              PromptPay ยังไม่ได้ตั้งค่า กรุณาโอนเงินและอัปโหลดสลิป
            </div>
          )}

          <div className="mt-4 text-center text-sm text-violet-700">
            <p className="font-medium">ขั้นตอน:</p>
            <ol className="mt-1 list-inside list-decimal text-left text-xs text-violet-600">
              <li>สแกน QR ด้วยแอปธนาคาร</li>
              <li>ชำระเงิน ฿{pendingPayment.amount}</li>
              <li>บันทึกหน้าจอ (สลิป) แล้วอัปโหลดด้านล่าง</li>
            </ol>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-violet-800">
              อัปโหลดสลิปการโอน
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="mt-1 block w-full text-sm text-violet-700 file:mr-3 file:rounded-lg file:border-0 file:bg-violet-600 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-violet-700"
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={uploadSlip}
              disabled={slipUploading}
              className="flex-1 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {slipUploading ? "กำลังตรวจสอบ..." : "ยืนยันการชำระเงิน"}
            </button>
            <button
              type="button"
              onClick={cancelPayment}
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Pending review status */}
      {paymentStatus === "pending_review" && (
        <div className="mt-6 rounded-xl border-2 border-amber-300 bg-amber-50 p-5 text-center">
          <div className="text-3xl">⏳</div>
          <h3 className="mt-2 font-bold text-amber-900">รอตรวจสอบสลิป</h3>
          <p className="mt-1 text-sm text-amber-700">
            แอดมินจะตรวจสอบสลิปของคุณ ปกติไม่เกิน 30 นาที
          </p>
          <button
            type="button"
            onClick={() => {
              setPaymentStatus(null);
              setPendingPayment(null);
              setMessage("");
            }}
            className="mt-3 text-sm text-amber-600 underline hover:text-amber-800"
          >
            ปิด
          </button>
        </div>
      )}

      {/* Payment confirmed */}
      {paymentStatus === "confirmed" && (
        <div className="mt-6 rounded-xl border-2 border-emerald-300 bg-emerald-50 p-5 text-center">
          <div className="text-3xl">✅</div>
          <h3 className="mt-2 font-bold text-emerald-900">ชำระเงินสำเร็จ!</h3>
          <p className="mt-1 text-sm text-emerald-700">
            แพ็กเกจเปิดใช้งานแล้ว คุณสามารถลงประกาศเพิ่มได้ทันที
          </p>
        </div>
      )}

      {/* Package cards — hide when payment is in progress */}
      {!pendingPayment && !paymentStatus && (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {LISTING_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className="relative rounded-xl border border-violet-200 bg-violet-50 p-5"
              >
                {pkg.badge && (
                  <span className="absolute -top-2 right-3 rounded-full bg-violet-600 px-2 py-0.5 text-xs text-white">
                    {pkg.badge}
                  </span>
                )}
                <h3 className="font-bold text-violet-900">{pkg.name}</h3>
                <p className="mt-1 text-sm text-violet-800">{pkg.description}</p>
                <p className="mt-3 text-2xl font-bold text-violet-900">฿{pkg.priceBaht}</p>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-violet-600">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ชำระผ่าน PromptPay
                </div>
                <button
                  type="button"
                  onClick={() => buyPackage(pkg.id)}
                  disabled={loading === pkg.id}
                  className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  {loading === pkg.id ? "กำลังสร้างคำสั่งซื้อ..." : "ซื้อแพ็ก"}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <h3 className="font-semibold text-amber-900">{SPONSOR_PACKAGE.name}</h3>
            <p className="text-sm text-amber-800">{SPONSOR_PACKAGE.description}</p>
            <p className="mt-2 font-bold text-amber-900">฿{SPONSOR_PACKAGE.priceBaht}</p>
            <p className="mt-1 text-xs text-amber-700">
              กดปุ่ม &quot;ทำประกาศเด่น&quot; ที่รายการประกาศของคุณในหน้าแดชบอร์ด
            </p>
          </div>
        </>
      )}
    </div>
  );
}
