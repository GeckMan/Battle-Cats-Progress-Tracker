import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

function norm(s: string) {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

async function main() {
  const rows = await prisma.meowMedal.findMany({
    where: { autoKey: null },
    select: { id: true, name: true, description: true, requirementText: true, sortOrder: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  const legendish = rows.filter((r) => {
    const text = `${r.name}\n${r.description ?? ""}\n${r.requirementText ?? ""}`;
    const t = norm(text);
    return (
      t.includes("stories of legend") ||
      t.includes("uncanny legends") ||
      t.includes("zero legends") ||
      t.includes("legend")
    );
  });

  console.log("Legend-ish medals without autoKey:", legendish.length);
  for (const m of legendish) {
    console.log("----");
    console.log("id:", m.id);
    console.log("sortOrder:", m.sortOrder);
    console.log("name:", m.name);
    console.log("description:", m.description ?? "");
    console.log("requirementText:", m.requirementText ?? "");
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
