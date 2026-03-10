import "dotenv/config";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

type ArcDef = {
  arc: "EoC" | "ItF" | "CotC";
  phrases: string[]; // how it appears in text
};

const ARCS: ArcDef[] = [
  { arc: "EoC", phrases: ["Empire of Cats"] },
  { arc: "ItF", phrases: ["Into the Future"] },
  { arc: "CotC", phrases: ["Cats of the Cosmos"] },
];

function norm(s: string) {
  return (s ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

function hasAny(hay: string, needles: string[]) {
  const h = norm(hay);
  return needles.some((n) => h.includes(norm(n)));
}

function chRegex(ch: number) {
  // matches "Ch. 1", "Ch 1", "Chapter 1"
  return new RegExp(`\\b(ch\\.?\\s*${ch}|chapter\\s*${ch})\\b`, "i");
}

function classify(m: { name: string; description: string | null; requirementText: string | null }) {
  const text = `${m.name}\n${m.description ?? ""}\n${m.requirementText ?? ""}`;
  const t = norm(text);

  const isTreasure =
    t.includes("gold treasure") ||
    (t.includes("treasure") && !t.includes("zombie"));

  const isZombie =
    t.includes("zombie outbreak") ||
    (t.includes("zombie") && !t.includes("treasure"));

  return { text, isTreasure, isZombie };
}

async function main() {
  // pull all medals with enough fields to match
  const medals = await prisma.meowMedal.findMany({
    select: { id: true, name: true, description: true, requirementText: true, autoKey: true },
    orderBy: [{ sortOrder: "asc" }],
  });

  // We'll attempt to set 18 autoKeys:
  // story.treasures.<ARC>.<CH> and story.zombies.<ARC>.<CH> for ARC in EoC/ItF/CotC, CH in 1..3
  const targets: Array<{ kind: "treasures" | "zombies"; arc: ArcDef["arc"]; ch: 1 | 2 | 3 }> = [];
  for (const arc of ARCS) {
    for (const ch of [1, 2, 3] as const) {
      targets.push({ kind: "treasures", arc: arc.arc, ch });
      targets.push({ kind: "zombies", arc: arc.arc, ch });
    }
  }

  const alreadyUsed = new Set(
    medals.map((m) => m.autoKey).filter((x): x is string => Boolean(x))
  );

  const matches: Array<{ target: string; medalName: string; medalId: string }> = [];
  const missing: string[] = [];
  const ambiguous: Array<{ target: string; candidates: string[] }> = [];

  for (const target of targets) {
    const targetKey = `story.${target.kind}.${target.arc}.${target.ch}`;

    // If this key is already assigned somewhere, skip (prevents unique conflicts)
    if (alreadyUsed.has(targetKey)) {
      continue;
    }

    const arcDef = ARCS.find((a) => a.arc === target.arc)!;
    const candidates = medals.filter((m) => {
      // don't overwrite existing keys; we want deterministic control
      if (m.autoKey) return false;

      const { text, isTreasure, isZombie } = classify(m);

      // must match correct type
      if (target.kind === "treasures" && !isTreasure) return false;
      if (target.kind === "zombies" && !isZombie) return false;

      // must contain arc phrase
      if (!hasAny(text, arcDef.phrases)) return false;

      // must contain chapter reference
      if (!chRegex(target.ch).test(text)) return false;

      return true;
    });

    if (candidates.length === 0) {
      missing.push(targetKey);
      continue;
    }

    if (candidates.length > 1) {
      // Prefer candidate whose NAME looks most specific (contains arc or chapter)
      const scored = candidates
        .map((c) => {
          const name = norm(c.name);
          let score = 0;
          if (hasAny(c.name, arcDef.phrases)) score += 2;
          if (chRegex(target.ch).test(c.name)) score += 2;
          if (name.includes("builder of empires")) score += 1;
          if (name.includes("undead slayer")) score += 1;
          return { c, score };
        })
        .sort((a, b) => b.score - a.score);

      const top = scored[0];
      const topTies = scored.filter((x) => x.score === top.score);

      if (topTies.length > 1) {
        ambiguous.push({
          target: targetKey,
          candidates: topTies.slice(0, 8).map((x) => x.c.name),
        });
        continue;
      }

      // accept top unique
      await prisma.meowMedal.update({
        where: { id: top.c.id },
        data: { autoKey: targetKey },
      });
      alreadyUsed.add(targetKey);
      matches.push({ target: targetKey, medalName: top.c.name, medalId: top.c.id });
      continue;
    }

    // single match
    const only = candidates[0];
    await prisma.meowMedal.update({
      where: { id: only.id },
      data: { autoKey: targetKey },
    });
    alreadyUsed.add(targetKey);
    matches.push({ target: targetKey, medalName: only.name, medalId: only.id });
  }

  console.log(`Assigned autoKeys: ${matches.length}`);
  for (const m of matches) {
    console.log(`  ${m.target}  ->  ${m.medalName}`);
  }

  if (missing.length) {
    console.log(`\nMissing (no match found): ${missing.length}`);
    for (const k of missing) console.log(`  ${k}`);
  }

  if (ambiguous.length) {
    console.log(`\nAmbiguous (multiple equally-good matches): ${ambiguous.length}`);
    for (const a of ambiguous) {
      console.log(`  ${a.target}`);
      for (const c of a.candidates) console.log(`    - ${c}`);
    }
  }

  console.log("\nDone.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await seedDisconnect();
  });
