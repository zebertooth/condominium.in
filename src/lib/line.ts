/**
 * LINE Login (OAuth2) helper.
 *
 * Activates real LINE verification when the channel env vars are set:
 *   LINE_LOGIN_CHANNEL_ID, LINE_LOGIN_CHANNEL_SECRET, LINE_LOGIN_CALLBACK_URL
 *
 * When not configured, the app falls back to a development-only manual verify
 * (see /api/auth/line/dev-verify) so the flow is testable without a LINE channel.
 */

const AUTH_URL = "https://access.line.me/oauth2/v2.1/authorize";
const TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const PROFILE_URL = "https://api.line.me/v2/profile";

export function lineConfigured(): boolean {
  return Boolean(
    process.env.LINE_LOGIN_CHANNEL_ID &&
      process.env.LINE_LOGIN_CHANNEL_SECRET &&
      process.env.LINE_LOGIN_CALLBACK_URL,
  );
}

export function getLineAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINE_LOGIN_CHANNEL_ID as string,
    redirect_uri: process.env.LINE_LOGIN_CALLBACK_URL as string,
    state,
    scope: "profile openid",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface LineProfile {
  userId: string;
  displayName: string;
}

export async function exchangeLineCode(code: string): Promise<LineProfile | null> {
  try {
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINE_LOGIN_CALLBACK_URL as string,
        client_id: process.env.LINE_LOGIN_CHANNEL_ID as string,
        client_secret: process.env.LINE_LOGIN_CHANNEL_SECRET as string,
      }).toString(),
    });

    if (!tokenRes.ok) {
      console.error(`[line] token exchange failed ${tokenRes.status}`);
      return null;
    }

    const token = (await tokenRes.json()) as { access_token?: string };
    if (!token.access_token) return null;

    const profileRes = await fetch(PROFILE_URL, {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });
    if (!profileRes.ok) {
      console.error(`[line] profile fetch failed ${profileRes.status}`);
      return null;
    }

    const profile = (await profileRes.json()) as LineProfile;
    return profile.userId ? profile : null;
  } catch (err) {
    console.error("[line] error", err);
    return null;
  }
}
