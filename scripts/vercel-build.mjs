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
      url.searchParams.set("connect_timeout", "30");
    }
    if (!url.searchParams.has("pool_timeout")) {
      url.searchParams.set("pool_timeout", "30");
    }
    return url.toString();
  } catch {
    return raw;
  }
}

/** Neon pooler URLs break migrate locks — prefer direct URL or strip `-pooler` from host. */
function resolveMigrateUrl() {
  const explicitDirect = process.env.DIRECT_DATABASE_URL?.trim();
  if (explicitDirect) {
    console.log("[vercel-build] using DIRECT_DATABASE_URL for migrate");
    return withTimeoutParams(explicitDirect);
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return null;

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
    // fall through to pooled URL below
  }

  return withTimeoutParams(databaseUrl);
}

async function migrateWithRetry(databaseUrl) {
  const migrateEnv = {
    DATABASE_URL: databaseUrl,
    PRISMA_MIGRATE_ADVISORY_LOCK_TIMEOUT: "120000",
  };
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      run("npx prisma migrate deploy", migrateEnv);
      console.log("[vercel-build] migrations applied");
      return;
    } catch (error) {
      if (attempt >= maxAttempts) throw error;
      const waitSec = 15 * attempt;
      console.warn(
        `[vercel-build] migrate attempt ${attempt}/${maxAttempts} failed (P1002/advisory lock or cold start), retrying in ${waitSec}s...`,
      );
      await setTimeout(waitSec * 1000);
    }
  }
}

async function main() {
  run("npx prisma generate");

  const vercelEnv = process.env.VERCEL_ENV ?? "development";
  const migrateUrl = resolveMigrateUrl();

  // Only production deploys run migrations — preview builds share the same DB and
  // concurrent migrate deploy calls cause pg_advisory_lock timeouts.
  if (migrateUrl && vercelEnv === "production") {
    await migrateWithRetry(migrateUrl);
  } else {
    console.warn(
      `[vercel-build] skipping migrate (VERCEL_ENV=${vercelEnv}, hasDb=${Boolean(migrateUrl)}). ` +
        "Preview builds use schema from last production migrate.",
    );
  }

  run("npx next build");
}

main().catch((error) => {
  console.error("[vercel-build] failed:", error);
  process.exit(1);
});
