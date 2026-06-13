const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Cloudflare Turnstile always-pass test keys (development only). */
const DEV_SITE_KEY = "1x00000000000000000000AA";
const DEV_SECRET_KEY = "1x0000000000000000000000000000000AA";

export function getTurnstileSiteKey(): string | null {
  const configured = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return DEV_SITE_KEY;
  return null;
}

function getTurnstileSecret(): string | null {
  const configured = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "development") return DEV_SECRET_KEY;
  return null;
}

export function isCaptchaEnabled(): boolean {
  return Boolean(getTurnstileSiteKey() && getTurnstileSecret());
}

export function turnstileConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);
}

interface TurnstileVerifyResponse {
  success: boolean;
  "error-codes"?: string[];
}

export async function verifyCaptchaToken(
  token: string,
  remoteIp?: string | null,
): Promise<boolean> {
  const secret = getTurnstileSecret();
  if (!secret) return true;

  const trimmed = token.trim();
  if (!trimmed) return false;

  const body = new URLSearchParams({
    secret,
    response: trimmed,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    if (!res.ok) return false;
    const data = (await res.json()) as TurnstileVerifyResponse;
    return data.success === true;
  } catch {
    return false;
  }
}

export async function requireCaptcha(
  token: unknown,
  remoteIp?: string | null,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  if (!isCaptchaEnabled()) return { ok: true };

  if (typeof token !== "string" || !token.trim()) {
    return { ok: false, error: "กรุณายืนยันว่าไม่ใช่บอท (CAPTCHA)", status: 400 };
  }

  const valid = await verifyCaptchaToken(token, remoteIp);
  if (!valid) {
    return { ok: false, error: "ยืนยัน CAPTCHA ไม่สำเร็จ กรุณาลองใหม่", status: 400 };
  }

  return { ok: true };
}
