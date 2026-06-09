/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require("child_process");

function runCommand(command) {
  console.log(`Running: ${command}`);
  try {
    execSync(command, { stdio: "inherit" });
  } catch {
    console.error(`Failed executing: ${command}`);
    process.exit(1);
  }
}

console.log("Starting vercel-build script...");

// 1. Generate Prisma client
runCommand("npx prisma generate");

// 2. Check for database URL to apply migrations
if (process.env.DATABASE_URL) {
  console.log("DATABASE_URL detected. Running database migrations...");
  runCommand("npx prisma migrate deploy");
} else {
  console.log("DATABASE_URL is not set. Skipping migrations.");
}

// 3. Build the Next.js project
runCommand("npx next build");
