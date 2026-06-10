import { execSync } from "node:child_process";

function run(command) {
  execSync(command, { stdio: "inherit", env: process.env });
}

run("npx prisma generate");

if (process.env.DATABASE_URL?.trim()) {
  run("npx prisma migrate deploy");
} else {
  console.warn(
    "[vercel-build] DATABASE_URL not set — skipping prisma migrate deploy. " +
      "Add DATABASE_URL to Vercel Preview env for PR deployments with DB.",
  );
}

run("npx next build");
