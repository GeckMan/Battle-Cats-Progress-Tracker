import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";


const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

export const seedPrisma = new PrismaClient({
  adapter: new PrismaPg(pool),
  log: ["warn", "error"],
});

export async function seedDisconnect() {
  await seedPrisma.$disconnect();
  await pool.end();
}
