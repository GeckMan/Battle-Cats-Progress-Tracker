import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

function norm(s: string) {
  return (s ?? "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function containsWhole(haystack: string, needle: string) {
  const h = ` ${norm(haystack)} `;
  const n = ` ${norm(needle)} `;
  return h.includes(n);
}

async function main() {
  const subs = await prisma.legendSubchapter.findMany({
    select: { id: true, displayName: true },
  });

  const medals = await prisma.meowMedal.findMany({
    // don't overwrite your story/zombie keys
    where: { autoKey: null },
    select: { id: true, name: true, description: true, requirementText: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  let assigned = 0;
  const ambiguous: Array<{ medal: string; matches: string[] }> = [];

  for (const m of medals) {
    const text = `${m.name}\n${m.description ?? ""}\n${m.requirementText ?? ""}`;

    // only consider medals that look legend-related
    const t = norm(text);
    const legendish =
      t.includes("stories of legend") ||
      t.includes("uncanny legends") ||
      t.includes("zero legends") ||
      t.includes("legend");

    if (!legendish) continue;

    const hits = subs.filter((s) => containsWhole(text, s.displayName));

    if (hits.length === 0) continue;

    if (hits.length > 1) {
      ambiguous.push({ medal: m.name, matches: hits.map((h) => h.displayName) });
      continue;
    }

    const sub = hits[0];
    const autoKey = `legend.subchapter.${sub.id}.clear`;

    await prisma.meowMedal.update({
      where: { id: m.id },
      data: { autoKey },
    });

    assigned++;
  }

  console.log(`Legend CLEAR autoKeys assigned: ${assigned}`);

  if (ambiguous.length) {
    console.log(`Ambiguous matches: ${ambiguous.length}`);
    for (const a of ambiguous.slice(0, 30)) {
      console.log(`- Medal: ${a.medal}`);
      for (const s of a.matches) console.log(`  - ${s}`);
    }
    if (ambiguous.length > 30) console.log("... (truncated)");
  }

  // show how many legend-ish medals remain without autoKey
  const remaining = await prisma.meowMedal.findMany({
    where: { autoKey: null },
    select: { name: true, description: true, requirementText: true },
  });

  let remainingLegendish = 0;
  for (const r of remaining) {
    const txt = `${r.name}\n${r.description ?? ""}\n${r.requirementText ?? ""}`;
    const tt = norm(txt);
    const legendish2 =
      tt.includes("stories of legend") ||
      tt.includes("uncanny legends") ||
      tt.includes("zero legends") ||
      tt.includes("legend");
    if (legendish2) remainingLegendish++;
  }

  console.log(`Legend-ish medals still without autoKey: ${remainingLegendish}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
