/**
 * wiki-factcheck.ts — READ-ONLY cross-check of our Unit table against the
 * mirrored Battle Cats wiki (the `wiki-data` branch, produced by
 * pull-wiki-local.ts). Writes nothing to the database. Produces a markdown
 * report of disagreements for a human/AI to review — the wiki is
 * community-edited and can itself be wrong or lag, so a mismatch is a lead,
 * not a verdict (same confirm-before-trust bar as every other heuristic here).
 *
 * Checks, per unit page that has a {{Cat Info}} block (ID / rarity / name1):
 *   1. rarity   wiki code (N/EX/RR/SR/UR/LR) vs our `category`
 *   2. name     wiki name1 vs our `name` (normalized)
 *   3. missing  wiki has a unit page our DB lacks, and vice versa
 *   4. JP-only  page listed in Category:Japanese Exclusive Content but our
 *               source isn't UNOBTAINABLE
 * The wiki "ID" may be offset from our unitNumber; the script tries offsets
 * -1/0/+1 and uses whichever matches the most names, and says so.
 *
 * Usage: WIKI_MIRROR_DIR=wiki-branch/wiki-mirror REPORT_PATH=out.md npx tsx ./scripts/wiki-factcheck.ts
 * Needs DATABASE_URL. Always exits 0 (a report, not a gate).
 */
import { readdirSync, readFileSync, existsSync, writeFileSync, appendFileSync } from "fs";
import { join } from "path";
import { seedPrisma as prisma, seedDisconnect } from "../prisma/seed-client.ts";

const DIR = process.env.WIKI_MIRROR_DIR ?? "wiki-branch/wiki-mirror";
const RARITY: Record<string, string> = { N: "NORMAL", EX: "SPECIAL", RR: "RARE", SR: "SUPER_RARE", UR: "UBER_RARE", LR: "LEGEND_RARE" };

type WikiUnit = { id: number; rarity: string; name: string; page: string; intro: string; regional: string | null };

const norm = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9぀-ヿ一-鿿]+/g, "");

function field(block: string, key: string): string | null {
  const m = block.match(new RegExp(`\\|\\s*${key}\\s*=\\s*([^\\n|}]*)`, "i"));
  return m ? m[1].trim() : null;
}

function readWiki(): WikiUnit[] {
  const pagesDir = join(DIR, "pages");
  const out: WikiUnit[] = [];
  for (const f of readdirSync(pagesDir)) {
    if (!f.endsWith(".wikitext") || f.endsWith("_Gallery.wikitext")) continue;
    const text = readFileSync(join(pagesDir, f), "utf8");
    const i = text.indexOf("{{Cat Info");
    if (i < 0) continue;
    const block = text.slice(i, text.indexOf("}}", i));
    const id = Number(field(block, "ID"));
    const rarity = (field(block, "rarity") ?? "").toUpperCase();
    const name = field(block, "name1") ?? "";
    if (!Number.isInteger(id) || !name) continue;
    const head = text.slice(0, i).trim().replace(/\s+/g, " ");
    const page = f.replace(/\.wikitext$/, "");
    // Regional / non-EN-mainline units: wiki banner templates, or a "(Switch ...)" /
    // "(PC ...)" page (Battle Cats Unite! and PC units reuse or extend the ID space).
    const flag = head.match(/\{\{(JP|TW|KR|PC|Switch)Exclusive\}\}/i)?.[1] ?? (/\((Switch|PC)_/.test(page) ? page.match(/\((Switch|PC)_/)![1] : null);
    out.push({ id, rarity, name, page, intro: head.slice(0, 240), regional: flag });
  }
  return out;
}

async function main() {
  if (!existsSync(join(DIR, "pages"))) throw new Error(`no mirror at ${DIR}`);
  const wiki = readWiki();
  const units: any[] = await (prisma as any).unit.findMany({
    select: { unitNumber: true, name: true, category: true, source: true, excludeFromCollection: true },
  });
  const byNum = new Map<number, any>(units.map((u) => [u.unitNumber, u]));

  // pick the ID offset that lines names up best
  let best = { off: 0, hits: -1 };
  for (const off of [-1, 0, 1]) {
    const hits = wiki.filter((w) => byNum.get(w.id + off) && norm(byNum.get(w.id + off).name) === norm(w.name)).length;
    if (hits > best.hits) best = { off, hits };
  }
  const L: string[] = [];
  L.push(`# Wiki fact-check (${new Date().toISOString().slice(0, 10)})`, "");
  L.push(`Wiki unit pages: ${wiki.length}; DB units: ${units.length}. Best ID offset: wiki ID + ${best.off} = unitNumber (${best.hits} names matched exactly).`, "");

  const rarityBad: string[] = [], nameBad: string[] = [], wikiOnly: string[] = [], regionalOnly: string[] = [];
  const seen = new Set<number>();
  // Several wiki pages can share one ID (e.g. "Cat Bros (Switch Special Cat)" reuses
  // the ID of a mainline unit). Prefer the mainline page: one whose name matches ours,
  // else any page that isn't a Switch/PC variant.
  const byId = new Map<number, WikiUnit[]>();
  for (const w of wiki) byId.set(w.id, [...(byId.get(w.id) ?? []), w]);
  const chosen: WikiUnit[] = [];
  for (const [id, pages] of byId) {
    const u = byNum.get(id + best.off);
    const pick =
      (u && pages.find((w) => norm(w.name) === norm(u.name))) ??
      pages.find((w) => w.regional !== "Switch" && w.regional !== "PC") ??
      pages[0];
    chosen.push(pick);
  }
  const chosenPages = new Set(chosen.map((w) => w.page));
  for (const w of chosen) {
    const num = w.id + best.off;
    const u = byNum.get(num);
    if (!u) {
      if (!RARITY[w.rarity]) continue;
      if (w.regional || /\{\{Unobtainable\}\}/i.test(w.intro)) regionalOnly.push(`${w.name} (#${num}, ${w.regional ?? "unobtainable"})`);
      else wikiOnly.push(`- #${num} **${w.name}** (${w.rarity}) — [[${w.page}]]. ${w.intro}`);
      continue;
    }
    seen.add(num);
    if (RARITY[w.rarity] && RARITY[w.rarity] !== u.category) rarityBad.push(`- #${num} ${u.name}: wiki ${w.rarity} (${RARITY[w.rarity]}) vs DB ${u.category}`);
    if (norm(w.name) !== norm(u.name)) nameBad.push(`- #${num}: wiki "${w.name}" vs DB "${u.name}"`);
  }
  const dbOnly = units.filter((u) => !seen.has(u.unitNumber) && !u.excludeFromCollection && u.unitNumber < 900).map((u) => `- #${u.unitNumber} ${u.name} (${u.category})`);

  // Japanese-exclusive cross-check
  const jpPath = join(DIR, "japanese-exclusive.json");
  const jpBad: string[] = [];
  if (existsSync(jpPath)) {
    const jp = new Set<string>(JSON.parse(readFileSync(jpPath, "utf8")).map((t: string) => t.replace(/ /g, "_").replace(/[\\/:*?"<>|]/g, "_")));
    for (const w of wiki) {
      if (!jp.has(w.page) || !chosenPages.has(w.page)) continue;
      const u = byNum.get(w.id + best.off);
      if (u && u.source !== "UNOBTAINABLE") jpBad.push(`- #${u.unitNumber} ${u.name}: wiki lists it as Japanese Exclusive, DB source is ${u.source ?? "null"}`);
    }
  }

  const section = (title: string, rows: string[]) => L.push(`## ${title} (${rows.length})`, "", ...(rows.length ? rows.slice(0, 150) : ["None."]), rows.length > 150 ? `…and ${rows.length - 150} more` : "", "");
  section("Rarity disagreements", rarityBad);
  section("Name disagreements", nameBad);
  section("Japanese-exclusive on wiki but obtainable in DB", jpBad);
  section("On the wiki, no regional flag, not in our DB (likely real EN units we are missing)", wikiOnly);
  L.push(`Regional/unobtainable wiki-only units, expected to be absent (${regionalOnly.length}): ${regionalOnly.join("; ")}`, "");
  section("In our DB but no wiki page matched", dbOnly);

  const report = L.join("\n");
  console.log(report.slice(0, 4000));
  if (process.env.REPORT_PATH) writeFileSync(process.env.REPORT_PATH, report);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, report + "\n");
}

main()
  .catch((e) => console.log(`wiki-factcheck failed: ${e.message}`))
  .finally(() => seedDisconnect());
