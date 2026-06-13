import "dotenv/config";
import { defineConfig } from "prisma/config";

function resolveDirectUrl(): string | undefined {
  const explicit = process.env.DIRECT_DATABASE_URL?.trim();
  if (explicit) return explicit;

  const databaseUrl = process.env.DATABASE_URL?.trim();
  if (!databaseUrl) return undefined;

  try {
    const url = new URL(databaseUrl);
    if (url.hostname.includes("-pooler")) {
      url.hostname = url.hostname.replace("-pooler", "");
      return url.toString();
    }
  } catch {
    // fall through
  }

  return databaseUrl;
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveDirectUrl(),
  },
});
