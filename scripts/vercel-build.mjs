import { execSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

function run(command, env = {}) {
  execSync(command, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

/** Neon pooler URLs break migrate locks; direct URL + longer connect timeout helps P1002. */
function resolveMigrateUrl() {
  const direct = process.env.DIRECT_DATABASE_URL?.trim();
  const pooled = process.env.DATABASE_URL?.trim();
  const raw = direct || pooled;
  if (!raw) return null;

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
  const hasDirect = Boolean(process.env.DIRECT_DATABASE_URL?.trim());

  if (migrateUrl && vercelEnv === "production" && !hasDirect) {
    console.warn(
      "[vercel-build] WARNING: DIRECT_DATABASE_URL is not set. " +
        "Using DATABASE_URL for migrate — Neon pooler often causes P1002 timeouts. " +
        "Add the direct (non-pooler) Neon URL as DIRECT_DATABASE_URL on Vercel Production.",
    );
  }

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
