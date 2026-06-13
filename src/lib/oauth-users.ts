import { randomBytes } from "crypto";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/db";

export type OAuthProvider = "google" | "facebook";

interface OAuthProfile {
  provider: OAuthProvider;
  providerId: string;
  email?: string | null;
  fullName: string;
}

function providerIdField(provider: OAuthProvider): "googleId" | "facebookId" {
  return provider === "google" ? "googleId" : "facebookId";
}

export async function loginOrRegisterOAuth(profile: OAuthProfile): Promise<{
  userId: string;
  isNew: boolean;
  loginId: string;
}> {
  const idField = providerIdField(profile.provider);
  const email = profile.email?.trim().toLowerCase() || null;

  const byProvider = await prisma.user.findFirst({
    where: { [idField]: profile.providerId },
  });
  if (byProvider) {
    const loginId = byProvider.email ?? byProvider.phone ?? byProvider.id;
    return { userId: byProvider.id, isNew: false, loginId };
  }

  if (email) {
    const byEmail = await prisma.user.findUnique({ where: { email } });
    if (byEmail) {
      await prisma.user.update({
        where: { id: byEmail.id },
        data: {
          [idField]: profile.providerId,
          emailVerified: byEmail.emailVerified || Boolean(email),
        },
      });
      const loginId = byEmail.email ?? byEmail.phone ?? byEmail.id;
      return { userId: byEmail.id, isNew: false, loginId };
    }
  }

  const passwordHash = await hashPassword(randomBytes(32).toString("hex"));
  const user = await prisma.user.create({
    data: {
      email,
      fullName: profile.fullName || "User",
      passwordHash,
      role: "user",
      isThai: true,
      emailVerified: Boolean(email),
      [idField]: profile.providerId,
    },
  });

  return { userId: user.id, isNew: true, loginId: email ?? user.id };
}

export async function establishOAuthSession(userId: string, loginId: string): Promise<void> {
  const token = await createSession(userId, loginId);
  await setSessionCookie(token);
}
