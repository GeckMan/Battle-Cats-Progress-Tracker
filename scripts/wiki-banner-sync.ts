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
 * label is learned from our own data: if at least two-thirds (min 3) of a page's resolved units
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
import { norm, readUnitPages } from "./wiki-unit-sync.ts";

const MAX_ADDS = 80;
const BASE_POOL = "Rare Cat Capsule";
// Cross-cutting seasonal/compilation banners with their OWN dedicated, allowlist-based rules in
// sync-bcdata.ts. They must never be learned as a page's label: units already carrying one of
// these tags made "Super Fest" win the vote for Best of the Best / Good Riddance / BusterFest
// pages and the first run tagged 38 units wrongly (2026-11-17).
const DEDICATED_BANNERS = new Set([BASE_POOL, "Super Fest", "Uber Fest", "Epic Fest", "RoyalFest", "NEO Best of the Best", "Best of the Best", "Superfest"]);

/**
 * A gacha page describing a CURRENT banner lineup. Excludes the wiki's sub-pages:
 * "..._3DS_Version" (the old 3DS game's lineups), "(Removed_Gacha_Event)" and
 * dated/anniversary variants like "..._10_Year_Special" (historical lineups). The
 * 3DS pages list Nekoluga in The Dynamites, Sengoku Wargods, Ultra Souls, Dragon
 * Emperors and Galaxy Gals, and the first version of this step tagged him into all
 * five (reported by shroomp, 2026-11-23).
 */
export function isCurrentGachaPage(f: string): boolean {
  if (!f.endsWith(".wikitext") || f.endsWith("_Gallery.wikitext")) return false;
  if (/3DS|Removed_Gacha_Event/i.test(f)) return false;
  if (/\((Gacha_Event|Event_Gacha)\)\.wikitext$/.test(f)) return true; // "X (Gacha Event)" / "X (Event Gacha)"
  if (/_Event_Gacha\.wikitext$/.test(f)) return true; // "<Collab> Collaboration Event/Event Gacha"
  return /Capsules/.test(f) && !/\)_/.test(f); // "... Capsules" pages, but not "(...)_<variant>" sub-pages
}

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

  const gachaPages = readdirSync(pagesDir).filter(isCurrentGachaPage);
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

    // Vote on each unit's HOME set (setName) only, never on banners[] — banners[] is full of
    // cross-cutting tags that say nothing about which event this page is.
    const votes = new Map<string, number>();
    for (const u of members) {
      if (u.setName && !DEDICATED_BANNERS.has(u.setName)) votes.set(u.setName, (votes.get(u.setName) ?? 0) + 1);
    }
    const ranked = [...votes.entries()].sort((a, b) => b[1] - a[1]);
    if (!ranked.length) continue;
    const [label, count] = ranked[0];
    // Two-thirds, not half: compilation pages (e.g. "Capsule Clearance", 3/5 "Xmas Gals")
    // would otherwise lend one set's label to unrelated units on the same page.
    if (count < Math.max(3, Math.ceil((members.length * 2) / 3))) continue;
    if (ranked[1] && ranked[1][1] === count) continue; // tie: ambiguous label, skip
    pagesUsed++;
    console.log(`  · ${f.replace(/\.wikitext$/, "")} → label "${label}" (${count}/${members.length} units' home set)`);

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

/* ── Pass 2: a unit's own page and a gacha's roster agree ──────────────────────────────
 * Ryan's rule (2026-11-17): follow the wiki where it agrees with itself in 2+ places. If a
 * unit's page links a gacha ("[[X (Event Gacha)]]", "[[X (Gacha Event)]]", "...Capsules")
 * AND that gacha's page lists the unit in its exclusive roster, the unit gets that banner
 * tag. Catches small banners pass 1 can't learn a label for (e.g. Nyanko Rangers: 1 tagged
 * unit, while Coin Cat and Mr. Ninja's own pages both say they drop from it).
 * Label: our existing label with the same core name, else a wiki-name alias, else the wiki
 * event name. Additive only; dedicated-rule banners and base-pool units skipped; capped.
 */
const WIKI_LABEL_ALIASES: Record<string, string> = {
  "The Almighties The Majestic Zeus": "The Almighties",
  "Dynasty Fest": "RoyalFest",
};
const coreLabel = (x: string) =>
  norm(x.replace(/\((Event Gacha|Gacha Event|Removed Gacha Event)\)/gi, "").replace(/\b(Capsules?|Gacha|Event|The)\b/gi, ""));

export async function syncBannersFromPageRosterAgreement(prisma: any, mirrorDir: string | undefined): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  if (!mirrorDir || !existsSync(pagesDir)) return 0;
  const units: any[] = await prisma.unit.findMany({
    select: { unitNumber: true, name: true, category: true, setName: true, banners: true, excludeFromCollection: true },
  });
  const labels = new Set<string>(units.flatMap((u) => u.banners ?? []));
  const labelByCore = new Map<string, string>([...labels].map((l) => [coreLabel(l), l]));
  const roster = new Map<string, Set<string>>();
  for (const f of readdirSync(pagesDir)) {
    if (!isCurrentGachaPage(f)) continue;
    roster.set(f.replace(/\.wikitext$/, "").replace(/_/g, " "), new Set(exclusiveNames(readFileSync(join(pagesDir, f), "utf8")).map(norm)));
  }
  const byNum = new Map<number, any>(units.map((u) => [u.unitNumber, u]));
  const pending = new Map<number, Set<string>>();
  const log: string[] = [];
  for (const p of readUnitPages(pagesDir)) {
    if (p.regional) continue;
    const u = byNum.get(p.id);
    if (!u || u.excludeFromCollection || norm(u.name) !== norm(p.names[0])) continue;
    if ((u.category === "RARE" || u.category === "SUPER_RARE") && u.setName === BASE_POOL) continue;
    const links = [...p.head.matchAll(/\[\[([^\]|#]+?)(?:\|[^\]]*)?\]\]/g)].map((m) => m[1].trim()).filter((l) => /\((Event Gacha|Gacha Event)\)|Capsules/i.test(l));
    for (const l of links) {
      if (!roster.get(l)?.has(norm(u.name))) continue;
      const wikiName = l.replace(/\s*\((Event Gacha|Gacha Event)\)\s*$/i, "");
      const label = WIKI_LABEL_ALIASES[wikiName] ?? labelByCore.get(coreLabel(l)) ?? wikiName;
      if (DEDICATED_BANNERS.has(label) || (u.banners ?? []).includes(label)) continue;
      if (!pending.has(u.unitNumber)) pending.set(u.unitNumber, new Set());
      pending.get(u.unitNumber)!.add(label);
      log.push(`#${u.unitNumber} ${u.name} + "${label}" (its page links [[${l}]], which lists it)`);
    }
  }
  if (pending.size > MAX_ADDS) {
    console.log(`  ⚠ ${pending.size} page+roster banner additions (> ${MAX_ADDS}) — applying none`);
    return 0;
  }
  for (const [n, add] of pending) {
    const u = byNum.get(n);
    await prisma.unit.update({ where: { unitNumber: n }, data: { banners: [...new Set([...(u.banners ?? []), ...add])] } });
  }
  for (const l of log) console.log(`  ✓ Banner added (page + roster agree): ${l}`);
  console.log(`  Page+roster banner agreement: ${pending.size} unit(s) updated`);
  return pending.size;
}
