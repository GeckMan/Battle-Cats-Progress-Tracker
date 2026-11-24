/**
 * wiki-release-order-sync.ts — keeps every unit's `source` ("How to Obtain")
 * matched to the wiki's Cat Release Order "Obtaining method", read from the
 * mirrored wikitext (wiki-data branch). Ryan's rule (2026-11-17): follow the wiki.
 *
 * Unlike syncSourceFromReleaseOrder() in sync-bcdata.ts (fills NULL sources only,
 * from the live HTML), this OVERWRITES a differing source — but only when the
 * Release Order line is unambiguous:
 *   • exactly one obtaining-method line, no region markers like "(JP)"/"(TW)"
 *   • the line starts with a known method prefix (same vocabulary as the site)
 *   • the unit's name matches exactly one of our units
 * and never for PROTECTED units or any UNOBTAINABLE unit (those encode decisions
 * the Release Order line doesn't capture: JP-exclusive, regional, hand-confirmed).
 *
 * Set names: the Release Order alone isn't trusted for them (typos like "Gaals of
 * Summer", generic "Seasonal Gacha Banners", a Gals of Summer mix-up bvg_tbc disproved
 * live), so syncSetNamesFromWikiMirror() below only moves a set when a SECOND wiki
 * source agrees, with an explicit exception list. The ℹ list here shows the rest.
 */
import { existsSync, readFileSync, readdirSync } from "fs";
import { join } from "path";
import { norm, readUnitPages } from "./wiki-unit-sync.ts";
import { isCurrentGachaPage } from "./wiki-banner-sync.ts";

const PREFIX: Array<[string, string]> = [
  ["Rare Cat Capsules", "RARE_CAPSULE"], ["Rare Cat Capsule", "RARE_CAPSULE"],
  ["Event Cat Capsules", "EVENT_CAPSULE"], ["Event Cat Capsule", "EVENT_CAPSULE"],
  ["Event Capsules", "EVENT_CAPSULE"], ["Event Capsule", "EVENT_CAPSULE"],
  ["Stamp Reward", "STAMP_REWARD"], ["Daily Login", "DAILY_LOGIN"], ["Special Sale", "SPECIAL_SALE"],
  ["External App", "EXTERNAL_APP"], ["Campaign", "SEASONAL_EVENT"], ["Drop", "STAGE_DROP"],
  ["Catnip Challenges", "CATNIP_CHALLENGES"], ["Gamatoto Expedition", "GAMATOTO_EXPEDITION"],
  ["Cat Guide", "CAT_GUIDE_UNLOCK"], ["Event Poster", "EVENT_POSTER"], ["Empire of Cats", "EMPIRE_OF_CATS"],
];
// Hand-decided sources the Release Order line contradicts on purpose:
//   #504 Burgle Boss Cat (Retired): obtainable via the Download Celebration gacha (Ryan, 2026-10-15)
//   #77 Droid Cat: JP-exclusive (wiki banner), stays UNOBTAINABLE
//   #202 Baozi Cat: regional (TW drop / JP capsule)
//   #673 Cheetah Cat: UNOBTAINABLE
export const PROTECTED_SOURCE = new Set<number>([504, 77, 202, 673]);
const MAX_CHANGES = 40;
// Release Order set wording reviewed 2026-11-17 and deliberately NOT followed (so they
// don't re-log every week): generic/typo/combined labels, RoyalFest ("Dynasty Fest"),
// The Almighties, and the Gals of Summer Sunshine/Blue Ocean split verified live by bvg_tbc.
const IGNORED_SET_WORDING = /Seasonal Gacha Banners|Gaals of|\/|Dynasty Fest|gacha event|The Majestic Zeus|NEO Best of the Best/i;
const GALS_OF_SUMMER_VERIFIED = new Set<number>([563, 564, 666, 714]);

const linkText = (s: string) => s.replace(/\[\[(?:[^\]|]*\|)?([^\]]*)\]\]/g, "$1");
const plain = (s: string) => linkText(s).replace(/<[^>]+>|'''?/g, "").replace(/\s+/g, " ").trim();

export function readReleaseOrderPairs(pagesDir: string): Array<{ name: string; lines: string[] }> {
  const f = join(pagesDir, "Cat_Release_Order.wikitext");
  if (!existsSync(f)) return [];
  const t = readFileSync(f, "utf8");
  const i = t.indexOf("{{#invoke:CRO|main");
  if (i < 0) return [];
  const block = t.slice(i, t.indexOf("\n}}", i));
  const args = block.split("\n|").slice(1).map((a) => a.trim());
  const out: Array<{ name: string; lines: string[] }> = [];
  for (let k = 0; k + 1 < args.length; k += 2) {
    out.push({ name: plain(args[k]), lines: args[k + 1].split("\n").map(plain).filter(Boolean) });
  }
  return out;
}

export function classify(line: string): string | null {
  for (const [p, v] of PREFIX) if (line.startsWith(p)) return v;
  return null;
}

export async function syncSourcesFromReleaseOrderMirror(prisma: any, mirrorDir: string | undefined): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  const pairs = pagesDir ? readReleaseOrderPairs(pagesDir) : [];
  if (!pairs.length) {
    console.log("  ℹ No Cat Release Order in the wiki mirror — skipping source sync");
    return 0;
  }
  const units: any[] = await prisma.unit.findMany({ select: { unitNumber: true, name: true, source: true, setName: true, isCollab: true } });
  const byName = new Map<string, any[]>();
  for (const u of units) byName.set(norm(u.name), [...(byName.get(norm(u.name)) ?? []), u]);

  const changes: Array<{ u: any; to: string; line: string }> = [];
  const setDiffs: string[] = [];
  let agree = 0;
  for (const { name, lines } of pairs) {
    const c = byName.get(norm(name));
    if (c?.length !== 1) continue;
    const u = c[0];
    if (lines.length !== 1 || /\((JP|TW|KR|EN)\)/.test(lines[0])) continue;
    const to = classify(lines[0]);
    if (!to) continue;
    const ev = lines[0].match(/^[^-–]+?\s[-–]\s(.+)$/)?.[1].replace(/\s*\(Removed\)\s*$/i, "").trim();
    // Collab set names are curated separately (Collabs dropdown); ignore wording-only
    // differences like a trailing "Event"/"Collaboration"/"Capsules".
    const core = (x: string) => norm(x.replace(/\b(Collaboration|Event|Capsules?|Gacha)\b/gi, ""));
    if (ev && u.setName && !u.isCollab && !IGNORED_SET_WORDING.test(ev) && !GALS_OF_SUMMER_VERIFIED.has(u.unitNumber) && core(ev) !== core(u.setName) && (to === "EVENT_CAPSULE" || to === "RARE_CAPSULE")) setDiffs.push(`#${u.unitNumber} ${u.name}: set "${u.setName}" vs Release Order "${ev}"`);
    if (u.source === to) { agree++; continue; }
    if (PROTECTED_SOURCE.has(u.unitNumber) || u.source === "UNOBTAINABLE") continue;
    changes.push({ u, to, line: lines[0] });
  }
  if (changes.length > MAX_CHANGES) {
    console.log(`  ⚠ ${changes.length} source changes from the Release Order (> ${MAX_CHANGES}) — applying none; the wiki page or parser may have changed`);
    return 0;
  }
  for (const { u, to, line } of changes) {
    await prisma.unit.update({ where: { unitNumber: u.unitNumber }, data: { source: to } });
    console.log(`  ✓ Source #${u.unitNumber} ${u.name}: ${u.source ?? "null"} → ${to} (Release Order: "${line.slice(0, 100)}")`);
  }
  console.log(`  Release Order sources: ${agree} already match, ${changes.length} updated`);
  if (setDiffs.length) {
    console.log(`  ℹ ${setDiffs.length} set name(s) differ from the Release Order wording (not auto-synced — see wiki-release-order-sync.ts header):`);
    for (const d of setDiffs.slice(0, 40)) console.log(`    - ${d}`);
  }
  return changes.length;
}

/* ───────────────────────── Set names: "the wiki agrees with itself" ─────────────────────────
 * Ryan (2026-11-17): follow the wiki whenever it agrees in more than one place, and keep an
 * explicit exception list for what we choose to keep. A unit's home set (setName) is moved to
 * the Release Order's event name T when a SECOND independent wiki source names the same event:
 *   • the unit's own page links "[[T (Event Gacha)]]" / "[[T (Gacha Event)]]" / a "...Capsules" page, or
 *   • T's gacha page lists the unit in its exclusive roster ({{GachaDescription}}).
 * Wording differences ("Capsules", "Gacha", "Event") don't count as disagreement.
 * When every unit that moves out of a set goes to the same T, the set's remaining members
 * (no evidence either way) follow, so a set is never left split in two. Banner tags are renamed
 * along with it. Collab sets are skipped (curated for the Collabs dropdown), as are the
 * exceptions below. Capped per run; every change is logged.
 */

// Kept on purpose even where the wiki agrees with itself:
//  - Brainwashed Cats: home set = their seasonal gacha, plus a "Brainwashed Cats" banner tag and
//    their other seasonal banners (the Release Order lumps them under "Seasonal Gacha Banners").
//  - Gals of Summer Sunshine/Blue Ocean units verified against the live rerun by bvg_tbc.
//  - Set names other rules key on: RoyalFest (wiki: "Dynasty Fest"), The Almighties, the
//    Superfest allowlist sets, Uber/Epic Fest, base Rare Cat Capsule.
export const SET_NAME_EXCEPTION_UNITS = new Set<number>([629, 636, 645, 654, 662, 667, 684, 688, 694, 563, 564, 666, 714]);
export const SET_NAME_EXCEPTION_SETS = new Set<string>([
  "RoyalFest", "The Almighties", "Rare Cat Capsule", "Uber Fest", "Epic Fest", "Super Fest", "NEO Best of the Best",
  "Brainwashed Cats", "Tales of the Nekoluga", "The Dynamites", "Sengoku Wargods Vajiras", "Cyber Academy Galaxy Gals",
  "Lords of Destruction Dragon Emperors", "Ancient Heroes Ultra Souls", "Justice Strikes Back! Dark Heroes",
  "Frontline Assault Iron Legion", "Nature's Guardians Elemental Pixies",
]);
const MAX_SET_MOVES = 60;
const coreName = (x: string) => norm(x.replace(/\((Event Gacha|Gacha Event|Removed Gacha Event)\)/gi, "").replace(/\b(Capsules?|Gacha|Event)\b/gi, ""));

export async function syncSetNamesFromWikiMirror(prisma: any, mirrorDir: string | undefined): Promise<number> {
  const pagesDir = mirrorDir ? join(mirrorDir, "pages") : "";
  const pairs = pagesDir ? readReleaseOrderPairs(pagesDir) : [];
  if (!pairs.length) return 0;
  const units: any[] = await prisma.unit.findMany({ select: { unitNumber: true, name: true, setName: true, banners: true, isCollab: true } });
  const byName = new Map<string, any[]>();
  for (const u of units) byName.set(norm(u.name), [...(byName.get(norm(u.name)) ?? []), u]);

  // Source 2a: each unit page's event/capsule links.
  const pageLinks = new Map<number, string[]>();
  for (const p of readUnitPages(pagesDir)) {
    if (p.regional) continue;
    const links = [...p.head.matchAll(/\[\[([^\]|#]+?)(?:\|[^\]]*)?\]\]/g)].map((m) => m[1].trim()).filter((l) => /\((Event Gacha|Gacha Event)\)|Capsules/i.test(l));
    pageLinks.set(p.id, [...(pageLinks.get(p.id) ?? []), ...links]);
  }
  // Source 2b: gacha roster pages (exclusive list) -> unit names.
  const rosterOf = new Map<string, string[]>(); // norm(unit name) -> page titles
  for (const f of readdirSync(pagesDir)) {
    if (!isCurrentGachaPage(f)) continue;
    const t = readFileSync(join(pagesDir, f), "utf8");
    for (const m of t.matchAll(/\{\{GachaDescription\|([^}]*)\}\}/g))
      for (const n of m[1].split("|").map((x) => x.trim()).filter((x) => x && !x.includes("=")))
        rosterOf.set(norm(n), [...(rosterOf.get(norm(n)) ?? []), f.replace(/\.wikitext$/, "").replace(/_/g, " ")]);
  }

  // Per-unit agreed target.
  const target = new Map<number, string>();
  for (const { name, lines } of pairs) {
    const c = byName.get(norm(name));
    if (c?.length !== 1 || lines.length !== 1 || /\((JP|TW|KR|EN)\)/.test(lines[0])) continue;
    const u = c[0];
    if (u.isCollab || SET_NAME_EXCEPTION_UNITS.has(u.unitNumber) || (u.setName && SET_NAME_EXCEPTION_SETS.has(u.setName))) continue;
    const kind = classify(lines[0]);
    if (kind !== "EVENT_CAPSULE" && kind !== "RARE_CAPSULE") continue;
    const ev = lines[0].match(/^[^-–]+?\s[-–]\s(.+)$/)?.[1].replace(/\s*\(Removed\)\s*$/i, "").trim();
    if (!ev || ev.includes("/") || /Seasonal Gacha Banners|gacha event/i.test(ev) || SET_NAME_EXCEPTION_SETS.has(ev)) continue;
    const second = [...(pageLinks.get(u.unitNumber) ?? []), ...(rosterOf.get(norm(u.name)) ?? [])];
    if (!second.some((l) => coreName(l) === coreName(ev))) continue; // only one wiki source names it
    if (u.setName && coreName(u.setName) === coreName(ev)) continue; // same name, only case/punctuation (e.g. wiki's "RED BUSTERS")
    target.set(u.unitNumber, ev);
  }

  // Set-level completion: if everyone leaving set S goes to one T, the rest of S follows.
  const bySet = new Map<string, any[]>();
  for (const u of units) if (u.setName) bySet.set(u.setName, [...(bySet.get(u.setName) ?? []), u]);
  const renamedSets = new Map<string, string>();
  for (const [s, members] of bySet) {
    const ts = new Set(members.filter((m) => target.has(m.unitNumber)).map((m) => target.get(m.unitNumber)!));
    if (ts.size !== 1) continue;
    const t = [...ts][0];
    const blocked = members.some((m) => !target.has(m.unitNumber) && (m.isCollab || SET_NAME_EXCEPTION_UNITS.has(m.unitNumber)));
    if (blocked) continue;
    for (const m of members) target.set(m.unitNumber, t);
    renamedSets.set(s, t);
  }

  if (target.size > MAX_SET_MOVES) {
    console.log(`  ⚠ ${target.size} set-name moves agreed by the wiki (> ${MAX_SET_MOVES}) — applying none; check the mirror/parser`);
    return 0;
  }
  const byNum = new Map<number, any>(units.map((u) => [u.unitNumber, u]));
  for (const [n, t] of target) {
    const u = byNum.get(n);
    const banners = [...new Set((u.banners ?? []).map((b: string) => (b === u.setName ? t : b)).concat(t))];
    await prisma.unit.update({ where: { unitNumber: n }, data: { setName: t, banners } });
    console.log(`  ✓ Set #${n} ${u.name}: "${u.setName ?? "none"}" → "${t}" (Release Order + a second wiki source agree)`);
  }
  // Units that only carry a fully-renamed set as a secondary banner tag.
  for (const u of units) {
    if (target.has(u.unitNumber)) continue;
    const bs: string[] = u.banners ?? [];
    if (!bs.some((b) => renamedSets.has(b))) continue;
    await prisma.unit.update({ where: { unitNumber: u.unitNumber }, data: { banners: [...new Set(bs.map((b) => renamedSets.get(b) ?? b))] } });
  }
  console.log(`  Wiki-agreed set names: ${target.size} unit(s) moved${renamedSets.size ? `; sets renamed: ${[...renamedSets].map(([a, b]) => `"${a}"→"${b}"`).join(", ")}` : ""}`);
  return target.size;
}
