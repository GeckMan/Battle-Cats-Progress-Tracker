/**
 * Promote a user to ADMIN role.
 * Usage: npx tsx scripts/set-admin.ts <username>
 */
import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

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
  .finally(() => prisma.$disconnect());
