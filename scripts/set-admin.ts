/**
 * Promote a user to ADMIN role.
 * Usage: npx tsx scripts/set-admin.ts <username>
 *
 * If no username provided, lists all users so you can find yours.
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
    // List all users so the person can find the right username
    const users = await prisma.user.findMany({
      select: { id: true, username: true, displayName: true, role: true },
      orderBy: { createdAt: "asc" },
    });
    console.log("\nAll users:");
    for (const u of users) {
      console.log(`  @${u.username}  ${u.displayName ?? "(no display name)"}  [${u.role}]`);
    }
    console.log(`\nUsage: npx tsx scripts/set-admin.ts <username>`);
    process.exit(0);
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) {
    console.error(`❌ No user found with username "${username}"`);
    console.log("\nTip: run without arguments to list all users:");
    console.log("  npx tsx scripts/set-admin.ts");
    process.exit(1);
  }

  await prisma.user.update({
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
