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
 * Set names are deliberately NOT synced from here: checked against live data on
 * 2026-11-17, the Release Order has typos ("Gaals of Summer"), generic labels
 * ("Seasonal Gacha Banners"), and a Gals of Summer Sunshine/Blue Ocean mix-up
 * that bvg_tbc disproved against the live rerun. Differences are logged only.
 */
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { norm } from "./wiki-unit-sync.ts";

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
