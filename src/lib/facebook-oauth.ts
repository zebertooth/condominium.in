const GRAPH_VERSION = "v18.0";
const AUTH_URL = `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth`;
const TOKEN_URL = `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`;

export function facebookConfigured(): boolean {
  return Boolean(
    process.env.FACEBOOK_APP_ID?.trim() &&
      process.env.FACEBOOK_APP_SECRET?.trim() &&
      process.env.FACEBOOK_CALLBACK_URL?.trim(),
  );
}

export function getFacebookAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.FACEBOOK_APP_ID as string,
    redirect_uri: process.env.FACEBOOK_CALLBACK_URL as string,
    state,
    scope: "email,public_profile",
    response_type: "code",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export interface FacebookProfile {
  id: string;
  email?: string;
  name?: string;
}

export async function exchangeFacebookCode(code: string): Promise<FacebookProfile | null> {
  try {
    const tokenParams = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID as string,
      client_secret: process.env.FACEBOOK_APP_SECRET as string,
      redirect_uri: process.env.FACEBOOK_CALLBACK_URL as string,
      code,
    });

    const tokenRes = await fetch(`${TOKEN_URL}?${tokenParams.toString()}`);
    if (!tokenRes.ok) {
      console.error(`[facebook] token exchange failed ${tokenRes.status}`);
      return null;
    }

    const token = (await tokenRes.json()) as { access_token?: string };
    if (!token.access_token) return null;

    const profileParams = new URLSearchParams({
      fields: "id,name,email",
      access_token: token.access_token,
    });
    const profileRes = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/me?${profileParams.toString()}`,
    );
    if (!profileRes.ok) {
      console.error(`[facebook] profile fetch failed ${profileRes.status}`);
      return null;
    }

    const profile = (await profileRes.json()) as FacebookProfile;
    return profile.id ? profile : null;
  } catch (err) {
    console.error("[facebook] error", err);
    return null;
  }
}
