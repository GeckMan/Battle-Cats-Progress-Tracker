import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

async function main() {
  const updates: Array<{ name: string; autoKey: string }> = [
    // Stories of Legend (SoL)
    { name: "I Am Legend", autoKey: "legend.saga.SOL.crown.1" },
    { name: "I Am Legend 2", autoKey: "legend.saga.SOL.crown.2" },
    { name: "I Am Legend 3", autoKey: "legend.saga.SOL.crown.3" },
    { name: "I Am Legend 4", autoKey: "legend.saga.SOL.crown.4" },

    // Uncanny Legends (UL)
    { name: "I Am Uncanny Legend 1", autoKey: "legend.saga.UL.crown.1" },
    { name: "I Am Uncanny Legend 2", autoKey: "legend.saga.UL.crown.2" },
    { name: "I Am Uncanny Legend 3", autoKey: "legend.saga.UL.crown.3" },
    { name: "I Am Uncanny Legend 4", autoKey: "legend.saga.UL.crown.4" },
  ];

  let ok = 0;
  let missing: string[] = [];

  for (const u of updates) {
    const medal = await prisma.meowMedal.findFirst({
      where: { name: u.name },
      select: { id: true, name: true, autoKey: true },
    });

    if (!medal) {
      missing.push(u.name);
      continue;
    }

    await prisma.meowMedal.update({
      where: { id: medal.id },
      data: { autoKey: u.autoKey },
    });

    ok++;
  }

  console.log(`Assigned saga autoKeys: ${ok}/${updates.length}`);
  if (missing.length) {
    console.log("Missing medals by name:");
    for (const m of missing) console.log(" -", m);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
