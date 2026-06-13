import { execSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

function run(command, env = {}) {
  execSync(command, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

function withTimeoutParams(raw) {
  try {
    const url = new URL(raw);
    if (!url.searchParams.has("connect_timeout")) {
      url.searchParams.set("connect_timeout", "60");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "60");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

function logMigrateHost(raw) {
  try {
    const url = new URL(raw);
    const pooler = url.hostname.includes("-pooler") ? " (pooler — avoid for migrate)" : "";
    console.log(`[vercel-build] migrate target host: ${url.hostname}${pooler}`);
  } catch {
    console.log("[vercel-build] migrate target: (could not parse URL)");
  }
}

/** Neon pooler URLs break migrate locks — prefer direct URL or strip `-pooler` from host. */
function resolveMigrateUrl() {
  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

  const explicitDirect = process.env.DIRECT_DATABASE_URL?.trim();
  if (explicitDirect) {
    console.log("[vercel-build] using DIRECT_DATABASE_URL for migrate");
    return withTimeoutParams(explicitDirect);
  }

  try {
    const url = new URL(databaseUrl);
    if (url.hostname.includes("-pooler")) {
      url.hostname = url.hostname.replace("-pooler", "");
      console.log(
        "[vercel-build] derived direct migrate URL from DATABASE_URL (removed -pooler suffix)",
      );
      return withTimeoutParams(url.toString());
    }
  } catch {
    // fall through
  }

  console.warn(
    "[vercel-build] DATABASE_URL may be pooled — set DIRECT_DATABASE_URL on Vercel if migrate fails",
  );
  return withTimeoutParams(databaseUrl);
}

function isRetryableMigrateError(error) {
  const text = String(error?.message ?? error ?? "");
  return (
    text.includes("P1002") ||
    text.includes("advisory lock") ||
    text.includes("Timed out trying to acquire") ||
    text.includes("ECONNRESET") ||
    text.includes("ETIMEDOUT")
  );
}

async function migrateWithRetry(migrateUrl) {
  // Prisma 7 ignores PRISMA_MIGRATE_ADVISORY_LOCK_TIMEOUT; Neon + pooler often hits 10s lock timeout.
  // Production Vercel builds run migrate sequentially — safe to disable advisory lock here.
  const migrateEnv = {
    DATABASE_URL: migrateUrl,
    DIRECT_DATABASE_URL: migrateUrl,
    PRISMA_SCHEMA_DISABLE_ADVISORY_LOCK: "1",
  };
  const maxAttempts = 8;

  logMigrateHost(migrateUrl);
  console.log("[vercel-build] waiting 8s for Neon cold start before migrate...");
  await setTimeout(8000);

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      run("npx prisma migrate deploy", migrateEnv);
      console.log("[vercel-build] migrations applied");
      return;
    } catch (error) {
      if (attempt >= maxAttempts || !isRetryableMigrateError(error)) throw error;
      const waitSec = 20 * attempt;
      console.warn(
        `[vercel-build] migrate attempt ${attempt}/${maxAttempts} failed, retrying in ${waitSec}s...`,
      );
      await setTimeout(waitSec * 1000);
    }
  }
}

async function main() {
  run("npx prisma generate");

  const vercelEnv = process.env.VERCEL_ENV ?? "development";
  const migrateUrl = resolveMigrateUrl();

  // Preview and production share the same Neon DB — both must run migrate deploy or
  // Prisma queries fail (e.g. sitemap / listings missing new columns). Advisory lock
  // is disabled in migrateWithRetry to avoid Neon pooler P1002 timeouts.
  if (migrateUrl && (vercelEnv === "production" || vercelEnv === "preview")) {
    console.log(`[vercel-build] running migrate deploy (VERCEL_ENV=${vercelEnv})`);
    await migrateWithRetry(migrateUrl);
  } else {
    console.warn(
      `[vercel-build] skipping migrate (VERCEL_ENV=${vercelEnv}, hasDb=${Boolean(migrateUrl)}).`,
    );
  }

  run("npx next build");
}

main().catch((error) => {
  console.error("[vercel-build] failed:", error);
  process.exit(1);
});
