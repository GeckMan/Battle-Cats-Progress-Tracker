/**
 * Promote a user to ADMIN role.
 * Usage: npx tsx scripts/set-admin.ts <username>
 */
import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is missing. Make sure .env is configured.");
  process.exit(1);
}

const pool = new Pool({ connectionString, max: 2 });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const username = process.argv[2];
  if (!username) {
    console.error("Usage: npx tsx scripts/set-admin.ts <username>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { username },
    data: { role: "ADMIN" },
  });

  console.log(`✅ ${user.username} (${user.displayName ?? "no display name"}) is now ADMIN`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
