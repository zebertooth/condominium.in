/**
 * Provider-agnostic notification senders.
 *
 * Each sender activates a real provider only when its env vars are set; otherwise
 * it logs to the console (dev fallback) and reports `delivered: false`.
 *
 * Email:  Resend       -> RESEND_API_KEY, EMAIL_FROM
 * SMS:    ThaiBulkSMS  -> THAIBULKSMS_API_KEY, THAIBULKSMS_API_SECRET, THAIBULKSMS_SENDER (preferred for TH)
 *         Twilio       -> TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM (fallback)
 */

export interface SendResult {
  delivered: boolean;
  provider: string;
}

export function emailProviderConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export function thaiBulkSmsConfigured(): boolean {
  return Boolean(
    process.env.THAIBULKSMS_API_KEY &&
      process.env.THAIBULKSMS_API_SECRET &&
      process.env.THAIBULKSMS_SENDER,
  );
}

export function twilioConfigured(): boolean {
  return Boolean(
    process.env.TWILIO_ACCOUNT_SID &&
      process.env.TWILIO_AUTH_TOKEN &&
      process.env.TWILIO_FROM,
  );
}

export function smsProviderConfigured(): boolean {
  return thaiBulkSmsConfigured() || twilioConfigured();
}

/** ThaiBulkSMS expects local format without leading +66 (e.g. 0812345678). */
function toThaiLocalNumber(phone: string): string {
  if (phone.startsWith("+66")) return `0${phone.slice(3)}`;
  if (phone.startsWith("66")) return `0${phone.slice(2)}`;
  return phone;
}

async function sendViaThaiBulkSms(to: string, body: string): Promise<SendResult> {
  try {
    const key = process.env.THAIBULKSMS_API_KEY as string;
    const secret = process.env.THAIBULKSMS_API_SECRET as string;
    const sender = process.env.THAIBULKSMS_SENDER as string;

    const res = await fetch("https://api-v2.thaibulksms.com/sms", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString("base64")}`,
      },
      body: new URLSearchParams({
        msisdn: toThaiLocalNumber(to),
        message: body,
        sender,
      }).toString(),
    });

    if (!res.ok) {
      console.error(`[sms:thaibulksms] failed ${res.status}`);
      return { delivered: false, provider: "thaibulksms" };
    }
    return { delivered: true, provider: "thaibulksms" };
  } catch (err) {
    console.error("[sms:thaibulksms] error", err);
    return { delivered: false, provider: "thaibulksms" };
  }
}

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
): Promise<SendResult> {
  if (!emailProviderConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[email:console] to=${to} subject="${subject}"\n${text}`);
    }
    return { delivered: false, provider: "console" };
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
      }),
    });
    if (!res.ok) {
      console.error(`[email:resend] failed ${res.status}`);
      return { delivered: false, provider: "resend" };
    }
    return { delivered: true, provider: "resend" };
  } catch (err) {
    console.error("[email:resend] error", err);
    return { delivered: false, provider: "resend" };
  }
}

export async function sendSms(to: string, body: string): Promise<SendResult> {
  // Prefer ThaiBulkSMS for Thai numbers; fall back to Twilio, then console.
  if (thaiBulkSmsConfigured()) {
    return sendViaThaiBulkSms(to, body);
  }

  if (!twilioConfigured()) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[sms:console] to=${to}\n${body}`);
    }
    return { delivered: false, provider: "console" };
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
      console.error(`[sms:twilio] failed ${res.status}`);
      return { delivered: false, provider: "twilio" };
    }
    return { delivered: true, provider: "twilio" };
  } catch (err) {
    console.error("[sms:twilio] error", err);
    return { delivered: false, provider: "twilio" };
  }
}
