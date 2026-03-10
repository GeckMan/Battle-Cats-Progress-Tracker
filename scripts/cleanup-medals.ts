import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

async function main() {
  // Delete user progress rows that reference non-canonical medals first
  const extraMedals = await prisma.meowMedal.findMany({
    where: {
      OR: [
        { sortOrder: { lt: 0 } },
        { sortOrder: { gt: 124 } },
        { sortOrder: null },
      ],
    },
    select: { id: true, name: true, sortOrder: true },
  });

  console.log(`Extra medals found: ${extraMedals.length}`);
  if (extraMedals.length > 0) {
    console.log("Examples:", extraMedals.slice(0, 10));
  }

  const extraIds = extraMedals.map((m) => m.id);
  if (extraIds.length === 0) {
    console.log("No extras to delete. DB already clean.");
    return;
  }

  // 1) delete dependent progress rows
  const delProgress = await prisma.userMeowMedal.deleteMany({
    where: { meowMedalId: { in: extraIds } },
  });

  // 2) delete the medals themselves
  const delMedals = await prisma.meowMedal.deleteMany({
    where: { id: { in: extraIds } },
  });

  console.log(`Deleted progress rows: ${delProgress.count}`);
  console.log(`Deleted medal rows: ${delMedals.count}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
