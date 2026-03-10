import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

async function main() {
  const total = await prisma.meowMedal.count();
  const inRange = await prisma.meowMedal.count({
    where: { sortOrder: { gte: 0, lte: 124 } },
  });

  console.log(`meowMedal total rows: ${total}`);
  console.log(`meowMedal rows with sortOrder 0..124: ${inRange}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
