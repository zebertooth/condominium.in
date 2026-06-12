import { createHash } from "crypto";
import { readFileSync, statSync } from "fs";
import { join } from "path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { normalizeDatabaseUrl } from "@/lib/database-url";
import pg from "pg";

type PrismaGlobal = {
  prisma?: PrismaClient;
  prismaFingerprint?: string;
};

const globalForPrisma = globalThis as unknown as PrismaGlobal;

function prismaClientFingerprint(): string {
  try {
    const schemaPath = join(process.cwd(), "prisma/schema.prisma");
    const clientPath = join(process.cwd(), "src/generated/prisma/internal/class.ts");
    const schema = readFileSync(schemaPath, "utf8");
    const clientMtime = statSync(clientPath).mtimeMs;
    return createHash("md5").update(schema).update(String(clientMtime)).digest("hex");
  } catch {
    return "default";
  }
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new pg.Pool({ connectionString: normalizeDatabaseUrl(connectionString) });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

function getPrismaClient(): PrismaClient {
  const fingerprint = prismaClientFingerprint();

  if (globalForPrisma.prisma && globalForPrisma.prismaFingerprint === fingerprint) {
    return globalForPrisma.prisma;
  }

  if (globalForPrisma.prisma) {
    void globalForPrisma.prisma.$disconnect();
  }

  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaFingerprint = fingerprint;
  return client;
}

export const prisma = getPrismaClient();
