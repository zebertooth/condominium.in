import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
  if (prismaInstance) return prismaInstance;

  if (globalForPrisma.prisma) {
    prismaInstance = globalForPrisma.prisma;
    return prismaInstance;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL is not set. Creating placeholder Prisma client.");
    // Instantiate a placeholder client during build time if DATABASE_URL is missing
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const client = new PrismaClient({} as any);
    prismaInstance = client;
    return client;
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({ adapter });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  prismaInstance = client;
  return client;
}

// Export a proxy that redirects property accesses to the lazy-loaded Prisma instance
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop, receiver) {
    const instance = getPrismaInstance();
    const value = Reflect.get(instance, prop, receiver);
    if (typeof value === "function") {
      return value.bind(instance);
    }
    return value;
  },
});

