import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";


const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function getAdapter() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is missing");

  // Append connect_timeout for Neon cold starts if not already present
  const url = connectionString.includes("connect_timeout")
    ? connectionString
    : `${connectionString}&connect_timeout=10`;

  const pool =
    globalForPrisma.pgPool ??
    new Pool({
      connectionString: url,
      max: 5,
      // Keep connections alive longer to survive Neon cold starts between requests
      idleTimeoutMillis: 120_000, // keep idle connections for 2 minutes (default 10s)
      connectionTimeoutMillis: 10_000, // wait up to 10s for a connection (covers cold starts)
    });

  if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pool;

  return new PrismaPg(pool);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: getAdapter(),
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
