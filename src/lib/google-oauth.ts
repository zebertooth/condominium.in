const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

export function googleConfigured(): boolean {
  return Boolean(
    process.env.GOOGLE_CLIENT_ID?.trim() &&
      process.env.GOOGLE_CLIENT_SECRET?.trim() &&
      process.env.GOOGLE_CALLBACK_URL?.trim(),
  );
}

export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
    state,
    scope: "openid email profile",
    access_type: "online",
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface GoogleProfile {
  id: string;
  email?: string;
  name?: string;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleProfile | null> {
  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL as string,
        client_id: process.env.GOOGLE_CLIENT_ID as string,
        client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
      }).toString(),
    });

    if (!tokenRes.ok) {
      console.error(`[google] token exchange failed ${tokenRes.status}`);
      return null;
    }

    const token = (await tokenRes.json()) as { access_token?: string };
    if (!token.access_token) return null;

    const profileRes = await fetch(USERINFO_URL, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!profileRes.ok) {
      console.error(`[google] profile fetch failed ${profileRes.status}`);
      return null;
    }

    const profile = (await profileRes.json()) as GoogleProfile;
    return profile.id ? profile : null;
  } catch (err) {
    console.error("[google] error", err);
    return null;
  }
}
