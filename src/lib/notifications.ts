/**
 * Provider-agnostic notification senders.
 *
 * Email:  Resend       -> RESEND_API_KEY, EMAIL_FROM
 * SMS:    ThaiBulkSMS  -> THAIBULKSMS_* (preferred for TH)
 *         Twilio       -> TWILIO_* (fallback)
 */

export interface SendResult {
  delivered: boolean;
  provider: string;
  error?: string;
}

export function emailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.EMAIL_FROM?.trim());
}

export const THAIBULKSMS_DEFAULT_SENDER = "CDMNINTH";

export function getThaiBulkSmsSender(): string {
  return process.env.THAIBULKSMS_SENDER?.trim() || THAIBULKSMS_DEFAULT_SENDER;
}

export function thaiBulkSmsConfigured(): boolean {
  return Boolean(
    process.env.THAIBULKSMS_API_KEY?.trim() &&
      process.env.THAIBULKSMS_API_SECRET?.trim(),
  );
}

function thaiBulkSmsAuthHeader(): string {
  const key = process.env.THAIBULKSMS_API_KEY as string;
  const secret = process.env.THAIBULKSMS_API_SECRET as string;
  return `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`;
}

export function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID?.trim() &&
      process.env.TWILIO_AUTH_TOKEN?.trim() &&
      process.env.TWILIO_FROM?.trim(),
  );
}

export function smsProviderConfigured(): boolean {
  return thaiBulkSmsConfigured() || twilioConfigured();
}

function toThaiLocalNumber(phone: string): string {
  if (phone.startsWith("+66")) return `0${phone.slice(3)}`;
  if (phone.startsWith("66")) return `0${phone.slice(2)}`;
  return phone;
}

async function readErrorBody(res: Response): Promise<string> {
  try {
    const text = await res.text();
    return text.slice(0, 500);
  } catch {
    return "";
  }
}

interface ThaiBulkSmsPhoneResult {
  status?: string;
  message?: string;
}

interface ThaiBulkSmsSendResponse {
  phone_number_list?: ThaiBulkSmsPhoneResult[];
}

export interface ThaiBulkSmsCreditResult {
  ok: boolean;
  credit?: number;
  sender: string;
  error?: string;
}

export async function checkThaiBulkSmsCredit(): Promise<ThaiBulkSmsCreditResult> {
  const sender = getThaiBulkSmsSender();
  if (!thaiBulkSmsConfigured()) {
    return { ok: false, sender, error: "THAIBULKSMS_API_KEY/SECRET not set" };
  }

  try {
    const res = await fetch("https://api-v2.thaibulksms.com/credit", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: thaiBulkSmsAuthHeader(),
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const detail = await readErrorBody(res);
      console.error(`[sms:thaibulksms] credit check failed ${res.status}`, detail);
      return { ok: false, sender, error: detail || `HTTP ${res.status}` };
    }

    const data = (await res.json()) as { remaining_credit?: number };
    return { ok: true, sender, credit: data.remaining_credit };
  } catch (err) {
    console.error("[sms:thaibulksms] credit check error", err);
    return { ok: false, sender, error: String(err) };
  }
}

async function sendViaThaiBulkSms(to: string, body: string): Promise<SendResult> {
  try {
    const sender = getThaiBulkSmsSender();

    const res = await fetch("https://api-v2.thaibulksms.com/sms", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: thaiBulkSmsAuthHeader(),
      },
      body: new URLSearchParams({
        msisdn: toThaiLocalNumber(to),
        message: body,
        sender,
      }).toString(),
    });

    const raw = await readErrorBody(res);
    if (!res.ok) {
      console.error(`[sms:thaibulksms] failed ${res.status}`, raw);
      return {
        delivered: false,
        provider: "thaibulksms",
        error: raw || `HTTP ${res.status}`,
      };
    }

    try {
      const data = JSON.parse(raw) as ThaiBulkSmsSendResponse;
      const phoneResult = data.phone_number_list?.[0];
      if (phoneResult?.status && phoneResult.status !== "success") {
        const detail = phoneResult.message || phoneResult.status;
        console.error("[sms:thaibulksms] rejected", detail);
        return { delivered: false, provider: "thaibulksms", error: detail };
      }
    } catch {
      // Non-JSON success body — treat HTTP 2xx as delivered.
    }

    return { delivered: true, provider: "thaibulksms" };
  } catch (err) {
    console.error("[sms:thaibulksms] error", err);
    return { delivered: false, provider: "thaibulksms", error: String(err) };
  }
}

export interface EmailAttachment {
  filename: string;
  content: string;
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  attachments?: EmailAttachment[],
): Promise<SendResult> {
  if (!emailProviderConfigured()) {
    const missing = !process.env.RESEND_API_KEY?.trim()
      ? "RESEND_API_KEY"
      : "EMAIL_FROM";
    if (process.env.NODE_ENV === "development") {
      console.log(`[email:console] to=${to} subject="${subject}"\n${text}`);
    }
    return { delivered: false, provider: "console", error: `${missing} not set` };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        text,
        ...(attachments?.length
          ? {
              attachments: attachments.map((a) => ({
                filename: a.filename,
                content: Buffer.from(a.content, "utf8").toString("base64"),
              })),
            }
          : {}),
      }),
    });
    if (!res.ok) {
      const detail = await readErrorBody(res);
      console.error(`[email:resend] failed ${res.status}`, detail);
      return {
        delivered: false,
        provider: "resend",
        error: detail || `HTTP ${res.status}`,
      };
    }
    return { delivered: true, provider: "resend" };
  } catch (err) {
    console.error("[email:resend] error", err);
    return { delivered: false, provider: "resend", error: String(err) };
  }
}

export async function sendSms(to: string, body: string): Promise<SendResult> {
  if (thaiBulkSmsConfigured()) {
    return sendViaThaiBulkSms(to, body);
  }

  if (!twilioConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[sms:console] to=${to}\n${body}`);
    }
    return { delivered: false, provider: "console", error: "SMS provider not configured" };
  }

  try {
    const sid = process.env.TWILIO_ACCOUNT_SID as string;
    const auth = process.env.TWILIO_AUTH_TOKEN as string;
    const from = process.env.TWILIO_FROM as string;

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${sid}:${auth}`).toString("base64")}`,
        },
        body: new URLSearchParams({ To: to, From: from, Body: body }).toString(),
      },
    );
    if (!res.ok) {
      const detail = await readErrorBody(res);
      console.error(`[sms:twilio] failed ${res.status}`, detail);
      return { delivered: false, provider: "twilio", error: detail || `HTTP ${res.status}` };
    }
    return { delivered: true, provider: "twilio" };
  } catch (err) {
    console.error("[sms:twilio] error", err);
    return { delivered: false, provider: "twilio", error: String(err) };
  }
}
