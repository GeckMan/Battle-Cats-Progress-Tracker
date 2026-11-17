/**
 * wiki-banner-sync.ts — keeps gacha banner membership in step with the mirrored
 * wiki (the `wiki-data` branch), additively.
 *
 * Each wiki gacha page ("X (Gacha Event)", "... Capsules ...", "<Event>/Event Gacha")
 * lists the units EXCLUSIVE to that banner in {{GachaDescription|A|B|...}} and the
 * shared base filler pool in {{GachaList|...}}. Only the exclusive list is used here,
 * matching the rule that base Rare/Super Rare units are not tagged into special gachas.
 *
 * The wiki's banner NAMES don't match our banner labels one-to-one (e.g. the River City
 * Ransom event is "Kunio-kun Collaboration" here), so instead of a hand-kept name map the
 * label is learned from our own data: if at least half (min 3) of a page's resolved units
 * already carry a banner label L (and L isn't the base "Rare Cat Capsule"), then L is that
 * page's label, and any listed unit missing L is given it.
 *
 * Deliberately ADDITIVE ONLY: the wiki shows a banner's CURRENT lineup (RoyalFest lesson,
 * 2026-10-20), so a unit absent from the page may simply have rotated out — those are
 * logged, never removed. Base-pool Rare/Super Rare units are skipped (the sync's own
 * pruneBasePoolFromSpecialGachas would just undo them). Capped per run.
 */
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { norm } from "./wiki-unit-sync.ts";

const MAX_ADDS = 80;
const BASE_POOL = "Rare Cat Capsule";

function exclusiveNames(text: string): string[] {
  const out: string[] = [];
  for (const m of text.matchAll(/\{\{GachaDescription\|([^}]*)\}\}/g)) {
    for (const part of m[1].split("|")) {
      const n = part.trim();
      if (n && !n.includes("=")) out.push(n);
    }
  }
  return out;
}

export async function syncGachaBannersFromWikiMirror(prisma: any, mirrorDir: string | undefined): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  if (!mirrorDir || !existsSync(pagesDir)) {
    console.log("  ℹ No wiki mirror available — skipping wiki-driven banner membership");
    return 0;
  }
  const units: any[] = await prisma.unit.findMany({
    select: { unitNumber: true, name: true, category: true, setName: true, banners: true, excludeFromCollection: true },
  });
  const byName = new Map<string, any[]>();
  for (const u of units) byName.set(norm(u.name), [...(byName.get(norm(u.name)) ?? []), u]);

  const gachaPages = readdirSync(pagesDir).filter(
    (f) => f.endsWith(".wikitext") && !f.endsWith("_Gallery.wikitext") && (/\(Gacha_Event\)(_.*)?\.wikitext$/.test(f) || /Capsules/.test(f) || /Event_Gacha\.wikitext$/.test(f))
  );
  const pending = new Map<number, Set<string>>(); // unitNumber -> labels to add
  const detail: string[] = [];
  let pagesUsed = 0;

  for (const f of gachaPages) {
    const text = readFileSync(join(pagesDir, f), "utf8");
    const names = exclusiveNames(text);
    const members: any[] = [];
    for (const n of names) {
      const cand = byName.get(norm(n));
      if (cand?.length === 1) members.push(cand[0]); // skip unresolved / ambiguous names
    }
    if (members.length < 3) continue;

    const votes = new Map<string, number>();
    for (const u of members) {
      for (const b of new Set<string>([...(u.banners ?? []), ...(u.setName ? [u.setName] : [])])) {
        if (b !== BASE_POOL) votes.set(b, (votes.get(b) ?? 0) + 1);
      }
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length) continue;
    const [label, count] = ranked[0];
    if (count < Math.max(3, Math.ceil(members.length / 2))) continue;
    if (ranked[1] && ranked[1][1] === count) continue; // tie: ambiguous label, skip
    pagesUsed++;

    for (const u of members) {
      if (u.excludeFromCollection) continue;
      if ((u.category === "RARE" || u.category === "SUPER_RARE") && u.setName === BASE_POOL) continue;
      if ((u.banners ?? []).includes(label)) continue;
      if (!pending.has(u.unitNumber)) pending.set(u.unitNumber, new Set());
      pending.get(u.unitNumber)!.add(label);
      detail.push(`#${u.unitNumber} ${u.name} + "${label}" (${f.replace(/\.wikitext$/, "")})`);
    }
  }

  if (pending.size > MAX_ADDS) {
    console.log(`  ⚠ ${pending.size} wiki-driven banner additions (> ${MAX_ADDS}) — applying none; inspect the wiki mirror/parser`);
    return 0;
  }
  const byNum = new Map<number, any>(units.map((u) => [u.unitNumber, u]));
  for (const [num, labels] of pending) {
    const u = byNum.get(num);
    await prisma.unit.update({
      where: { unitNumber: num },
      data: { banners: [...new Set([...(u.banners ?? []), ...labels])], ...(u.setName ? {} : { setName: [...labels][0] }) },
    });
  }
  for (const d of detail.slice(0, 60)) console.log(`  ✓ Banner added from wiki roster: ${d}`);
  console.log(`  Wiki-driven banner membership: ${pending.size} unit(s) updated using ${pagesUsed} gacha page(s)`);
  return pending.size;
}
