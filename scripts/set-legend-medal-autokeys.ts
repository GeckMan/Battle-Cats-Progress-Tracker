import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

function norm(s: string) {
  return (s ?? "").toLowerCase().replace(/['’]/g, "").replace(/\s+/g, " ").trim();
}

function scoreMatch(medalText: string, subName: string) {
  const a = norm(medalText);
  const b = norm(subName);

  if (a.includes(b)) return 100;
  if (b.includes(a)) return 80;

  // token overlap
  const ta = new Set(a.split(" ").filter((t) => t.length >= 3));
  const tb = new Set(b.split(" ").filter((t) => t.length >= 3));
  let overlap = 0;
  for (const t of ta) if (tb.has(t)) overlap++;
  return overlap * 10;
}

async function main() {
  const subs = await prisma.legendSubchapter.findMany({
    select: { id: true, displayName: true, saga: { select: { displayName: true } } },
  });

  const medals = await prisma.meowMedal.findMany({
    where: { autoKey: null }, // don’t overwrite existing story/zombie keys
    select: { id: true, name: true, description: true, requirementText: true, category: true, autoKey: true },
  });

  const candidates = medals
    .map((m) => {
      const text = `${m.name}\n${m.description ?? ""}\n${m.requirementText ?? ""}`;
      // Heuristic: only look at ones that smell like legend completion
      const t = norm(text);
      const legendish = t.includes("legend") || t.includes("stories of legend") || t.includes("uncanny") || t.includes("zero legend") || t.includes("clear");
      return legendish ? { m, text } : null;
    })
    .filter(Boolean) as Array<{ m: any; text: string }>;

  let assigned = 0;
  const unmatched: string[] = [];
  const ambiguous: string[] = [];

  for (const { m, text } of candidates) {
    // try best subchapter match
    const scored = subs
      .map((s) => ({ s, score: scoreMatch(text, s.displayName) }))
      .sort((a, b) => b.score - a.score);

    const best = scored[0];
    const second = scored[1];

    // require strong confidence and separation from second-best
    if (!best || best.score < 60 || (second && best.score - second.score < 20)) {
      unmatched.push(`${m.name}  |  best=${best?.s.displayName ?? "none"} (${best?.score ?? 0})`);
      continue;
    }

    const autoKey = `legend.subchapter.${best.s.id}.clear`;
    await prisma.meowMedal.update({
      where: { id: m.id },
      data: { autoKey },
    });
    assigned++;
  }

  console.log(`Legend clear autoKeys assigned: ${assigned}`);
  if (unmatched.length) {
    console.log("\nUnmatched (sample):");
    for (const u of unmatched.slice(0, 40)) console.log(" -", u);
    console.log(`... total unmatched: ${unmatched.length}`);
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
