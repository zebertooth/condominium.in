/**
 * PromptPay QR code generation + SlipOK verification.
 *
 * QR generation uses `promptpay-qr` (EMVCo payload) + `qrcode` (image).
 * Slip verification uses SlipOK API (free 100/month) with manual admin fallback.
 *
 * Env:
 *   PROMPTPAY_ID        — phone or citizen ID registered with PromptPay
 *   SLIPOK_API_KEY       — from SlipOK dashboard (optional — admin manual fallback)
 *   SLIPOK_BRANCH_ID     — from SlipOK dashboard (optional)
 */

import generatePayload from "promptpay-qr";
import QRCode from "qrcode";
import { randomUUID } from "crypto";

const PROMPTPAY_ID = process.env.PROMPTPAY_ID ?? "";

/** Returns true if a PromptPay ID is configured (QR generation will work). */
export function promptPayConfigured(): boolean {
  return PROMPTPAY_ID.length > 0;
}

/** Returns true if SlipOK API keys are configured for automated verification. */
export function slipOkConfigured(): boolean {
  return Boolean(process.env.SLIPOK_API_KEY && process.env.SLIPOK_BRANCH_ID);
}

/**
 * Generate a unique transaction reference for dedup.
 * Format: CONDO-<timestamp>-<short uuid>
 */
export function generateTransactionRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const uid = randomUUID().slice(0, 8).toUpperCase();
  return `CONDO-${ts}-${uid}`;
}

/**
 * Generate a PromptPay QR code data URL for the given amount.
 * Returns a base64 PNG data URL suitable for <img src="...">.
 */
export async function generatePromptPayQR(amountBaht: number): Promise<string> {
  if (!promptPayConfigured()) {
    throw new Error("PROMPTPAY_NOT_CONFIGURED");
  }

  const payload = generatePayload(PROMPTPAY_ID, { amount: amountBaht });
  const dataUrl = await QRCode.toDataURL(payload, {
    width: 400,
    margin: 2,
    color: { dark: "#000000", light: "#ffffff" },
    errorCorrectionLevel: "M",
  });
  return dataUrl;
}

/**
 * Slip verification result from SlipOK or manual check.
 */
export interface SlipVerifyResult {
  verified: boolean;
  amount?: number;
  sender?: string;
  receiver?: string;
  transactionId?: string;
  error?: string;
}

/**
 * Verify a payment slip image via SlipOK API.
 * Falls back to returning unverified if SlipOK is not configured (admin manual flow).
 *
 * @param slipUrl - URL of the uploaded slip image (Cloudinary or local)
 */
export async function verifySlip(slipUrl: string): Promise<SlipVerifyResult> {
  if (!slipOkConfigured()) {
    // No automated verification — flag for admin manual review
    console.log("[promptpay] SlipOK not configured — slip requires manual admin review");
    return { verified: false, error: "MANUAL_REVIEW_REQUIRED" };
  }

  const apiKey = process.env.SLIPOK_API_KEY!;
  const branchId = process.env.SLIPOK_BRANCH_ID!;

  try {
    const res = await fetch("https://api.slipok.com/api/line/apikey/18", {
      method: "POST",
      headers: {
        "x-authorization": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: slipUrl,
        log: true,
        branch_id: branchId,
      }),
    });

    if (!res.ok) {
      console.error(`[promptpay:slipok] API error: ${res.status}`);
      return { verified: false, error: "SLIPOK_API_ERROR" };
    }

    const data = (await res.json()) as {
      success?: boolean;
      data?: {
        amount?: number;
        sender?: { name?: string };
        receiver?: { name?: string };
        transactionId?: string;
      };
    };

    if (!data.success || !data.data) {
      return { verified: false, error: "SLIP_INVALID" };
    }

    return {
      verified: true,
      amount: data.data.amount,
      sender: data.data.sender?.name,
      receiver: data.data.receiver?.name,
      transactionId: data.data.transactionId,
    };
  } catch (err) {
    console.error("[promptpay:slipok] verification failed:", err);
    return { verified: false, error: "VERIFICATION_FAILED" };
  }
}
