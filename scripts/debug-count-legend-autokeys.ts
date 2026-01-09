import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

async function main() {
  const count = await prisma.meowMedal.count({
    where: { autoKey: { startsWith: "legend.subchapter." } },
  });

  const sample = await prisma.meowMedal.findMany({
    where: { autoKey: { startsWith: "legend.subchapter." } },
    select: { name: true, autoKey: true },
    take: 10,
    orderBy: { sortOrder: "asc" },
  });

  console.log("legend autoKey count:", count);
  console.log("sample:", sample);
}

main()
  .finally(async () => seedDisconnect())
  .catch((e) => { console.error(e); process.exit(1); });
