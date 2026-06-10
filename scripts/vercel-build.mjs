import { execSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

function run(command, env = {}) {
  execSync(command, {
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
}

async function migrateWithRetry(databaseUrl) {
  const migrateEnv = { DATABASE_URL: databaseUrl };
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      run("npx prisma migrate deploy", migrateEnv);
      console.log("[vercel-build] migrations applied");
      return;
    } catch (error) {
      if (attempt >= maxAttempts) throw error;
      console.warn(
        `[vercel-build] migrate attempt ${attempt} failed (advisory lock or DB busy), retrying in 15s...`,
      );
      await setTimeout(15_000);
    }
  }
}

async function main() {
  run("npx prisma generate");

  const vercelEnv = process.env.VERCEL_ENV ?? "development";
  // Neon: use direct (non-pooler) URL for migrations — pooler breaks advisory locks
  const migrateUrl =
    process.env.DIRECT_DATABASE_URL?.trim() || process.env.DATABASE_URL?.trim();

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
