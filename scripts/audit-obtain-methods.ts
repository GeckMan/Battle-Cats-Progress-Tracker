/**
 * One-time (manually-triggered) audit: cross-references every unit's
 * current Unit.isCollab/source/setName against the Battle Cats Wiki's
 * "Cat Release Order" page, which lists a per-unit "Obtaining method"
 * (e.g. "Rare Cat Capsule - Ancient Heroes ULTRA SOULS", "Stamp Reward -
 * Rurouni Kenshin Collaboration", "Drop - The Great Diablo").
 *
 * Why this exists: every collab/set detection layer in sync-bcdata.ts
 * (detectCollabUnitIds(), detectEventFamilies(), bcu-assets cross-checks,
 * syncCollabFlagsFromCuratedNames()) only ever scans GatyaDataSetR1/E1/
 * N1.csv -- the gacha CAPSULE tables. A unit obtained by any other means
 * (stage drop, login stamp, special sale, external app tie-in) never
 * appears in those files at all and is structurally invisible to the
 * whole pipeline, however many backstops are layered on top of it. This
 * was discovered 2026-07-12 via Kaoru Cat (#753) -- a Rurouni Kenshin
 * collab unit obtained via login stamps, fixed by hand after the user
 * spotted it, then confirmed by this exact wiki page to be exactly
 *"Stamp Reward - Rurouni Kenshin Collaboration". The wiki's "ID" column
 * was independently verified to be numerically identical to this
 * project's Unit.unitNumber -- cross-checked against Brainwashed Cat
 * (#629), Brainwashed Tank Cat (#636), and Kaoru Cat (#753) itself, all
 * exact matches -- so rows can be joined by unitNumber directly, no name
 * fuzzy-matching required.
 *
 * This is a fan wiki (community-edited), not a versioned game-data
 * export like BCData, so -- same evidence-hierarchy rule as everywhere
 * else in this project -- it's treated as read-only supplementary
 * evidence, never as something that silently overwrites an existing
 * curated classification. This script makes NO database writes. It
 * reports:
 *   1. Units currently isCollab=false whose wiki-listed obtaining method
 *      text matches /collab/i -- the Kaoru Cat pattern, likely the
 *      biggest win here.
 *   2. Units with source IS NULL and setName IS NULL (the "N unit(s) have
 *      no source, set, or collab classification" bucket
 *      checkUnitClassificationCoverage() has been logging all session)
 *      that the wiki has a single, unambiguous obtaining method for --
 *      proposed source + setName fill.
 *   3. (Added 2026-07-13) The REVERSE of #1: units currently isCollab=true
 *      whose wiki-listed obtaining method has NO /collab/i text anywhere.
 *      Confirmed this session that this exact pattern is real, not
 *      theoretical -- 6 units (Blue Shinobi #82, Squish Ball Cat #140, God
 *      #141, Masked Cat #29, Maiko Cat #45, Toy Machine Cat #62) were found
 *      to have isCollab=true from this project's original hardcoded list
 *      despite their own wiki pages showing no franchise tie-in at all
 *      (fixed in migration 20260712000012). This bucket is a LEAD, not a
 *      verdict -- same caution as bucket #1's sibling-match suggestions --
 *      because a real collab can still be phrased on the wiki without the
 *      literal word "collab" (e.g. "Rurouni Kenshin Gacha"), so each hit
 *      here needs its own unit page checked before flipping isCollab, same
 *      process used for the original 6.
 * A human reviews the report and decides which entries (if any) warrant
 * a real migration, same process used for every other fix this session.
 *
 * Run manually via: npx tsx ./scripts/audit-obtain-methods.ts
 * (needs DATABASE_URL/DIRECT_DATABASE_URL + real internet access to reach
 * battlecats.miraheze.org -- i.e. the "Audit Obtain Methods" GitHub Action,
 * not this sandbox, which cannot make outbound requests to arbitrary
 * hosts at all.)
 */
import "dotenv/config";
import { load } from "cheerio";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const WIKI_BASE = "https://battlecats.miraheze.org";
const API_URL = `${WIKI_BASE}/w/api.php`;
const PAGE = "Cat_Release_Order";

const COLLAB_PATTERN = /collab/i;

// Longest-prefix-first so "Event Cat Capsule" isn't mis-split by a looser
// "Event Capsule" match, etc. Maps the wiki's literal obtaining-method
// prefix text to this project's existing Unit.source vocabulary (see
// SOURCE_LABELS in src/app/(app)/units/UnitsClient.tsx and
// FriendUnitsClient.tsx -- every one of these keys already has a defined
// human-readable label in the UI, just never populated by the backend).
const METHOD_PREFIX_MAP: Array<[string, string]> = [
  ["Rare Cat Capsules", "RARE_CAPSULE"],
  ["Rare Cat Capsule", "RARE_CAPSULE"],
  ["Event Cat Capsules", "EVENT_CAPSULE"],
  ["Event Cat Capsule", "EVENT_CAPSULE"],
  ["Event Capsules", "EVENT_CAPSULE"],
  ["Event Capsule", "EVENT_CAPSULE"],
  ["Stamp Reward", "STAMP_REWARD"],
  ["Daily Login", "DAILY_LOGIN"],
  ["Special Sale", "SPECIAL_SALE"],
  ["External App", "EXTERNAL_APP"],
  ["Campaign", "SEASONAL_EVENT"],
  ["Drop", "STAGE_DROP"],
];

interface WikiRow {
  unitNumber: number;
  name: string;
  methodLines: string[]; // one entry per line in the Obtaining method cell
}

async function fetchParsedHtml(page: string): Promise<string> {
  const url = `${API_URL}?action=parse&format=json&prop=text&redirects=1&page=` + encodeURIComponent(page);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "battlecats-progress/1.0", // Miraheze can be picky without a UA
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from parse API: ${url}`);
  const json = (await res.json()) as any;
  const html = json?.parse?.text?.["*"] as string | undefined;
  if (!html) throw new Error(`parse API returned no HTML. Keys: ${Object.keys(json ?? {}).join(", ")}`);
  return html;
}

function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseReleaseOrderHtml(html: string): WikiRow[] {
  const $ = load(html);
  const rows: WikiRow[] = [];

  $("table tr").each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find("td");
    if (tds.length < 5) return; // header rows use <th>, and every real row has 5 columns

    const idText = normalizeSpaces($(tds.get(0)).text());
    const unitNumber = Number(idText);
    if (!Number.isInteger(unitNumber)) return; // not a data row (could be a stray/merged row)

    const name = normalizeSpaces($(tds.get(2)).text());

    // Preserve line breaks inside the Obtaining method cell (some units
    // have multiple lines, e.g. one method per region) before flattening
    // to text, otherwise multi-line cells collapse into one unparsable
    // run-on string.
    const methodCell = $(tds.get(4)).clone();
    methodCell.find("br").replaceWith("\n");
    const methodText = methodCell.text();
    const methodLines = methodText
      .split("\n")
      .map((l) => normalizeSpaces(l))
      .filter((l) => l.length > 0);

    if (!name || methodLines.length === 0) return;

    rows.push({ unitNumber, name, methodLines });
  });

  return rows;
}

function classifyMethodLine(line: string): { source: string | null; detail: string; isCollab: boolean } {
  for (const [prefix, source] of METHOD_PREFIX_MAP) {
    if (line.startsWith(prefix)) {
      const rest = line.slice(prefix.length).replace(/^\s*-\s*/, "").trim();
      return { source, detail: rest, isCollab: COLLAB_PATTERN.test(rest) };
    }
  }
  return { source: null, detail: line, isCollab: COLLAB_PATTERN.test(line) };
}

const STOPWORDS = new Set(["the", "of", "and", "event", "collaboration", "collab", "1/2"]);

// The wiki's own phrasing for a collab (e.g. "Baki Hanma Collaboration
// Event") often doesn't match this project's own established setName for
// that collab's real gacha-capsule roster (e.g. "Baki Hanma Capsules",
// set via BCU_KNOWN_COLLAB_CATEGORIES elsewhere in this codebase) --
// assigning the wiki's text directly would create a second, differently-
// labeled entry for the same real-world collab, actively working against
// unified collab filtering. This looks for an ALREADY-EXISTING setName in
// this database that shares a significant word with the wiki's collab
// text, so a human can confirm "yes, group with that" instead of
// inventing a new label from wiki phrasing alone.
function findSiblingSetNameMatches(collabDetail: string, allSetNames: string[]): string[] {
  const words = collabDetail
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));

  const matches = new Set<string>();
  for (const setName of allSetNames) {
    const lower = setName.toLowerCase();
    if (words.some((w) => lower.includes(w))) matches.add(setName);
  }
  return [...matches];
}

async function main() {
  const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL or DIRECT_DATABASE_URL must be set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

  try {
    console.log("── Fetching Cat Release Order from battlecats.miraheze.org ──");
    const html = await fetchParsedHtml(PAGE);
    const wikiRows = parseReleaseOrderHtml(html);
    console.log(`  Parsed ${wikiRows.length} row(s) from the wiki table`);
    if (wikiRows.length === 0) {
      console.error("  ✗ Parsed 0 rows -- the table markup may have changed, aborting audit (nothing to compare against)");
      process.exit(1);
    }
    const byUnitNumber = new Map(wikiRows.map((r) => [r.unitNumber, r]));

    console.log("\n── Loading units from the database ──");
    const units = await (prisma as any).unit.findMany({
      select: { unitNumber: true, name: true, isCollab: true, source: true, setName: true },
      orderBy: { unitNumber: "asc" },
    });
    console.log(`  ${units.length} unit(s) total`);

    const allSetNames = [...new Set(units.map((u: any) => u.setName).filter((s: any): s is string => !!s))] as string[];

    // 1. Units not flagged isCollab but the wiki's obtaining method says
    // otherwise -- the Kaoru Cat pattern.
    const collabMismatches: string[] = [];
    // 2. Units with no source/setName at all where the wiki has exactly
    // one, unambiguous method line to propose.
    const proposedFills: string[] = [];
    // Rows where the wiki has multiple, differently-categorized method
    // lines (e.g. region-split units) -- surfaced but not auto-proposed,
    // needs a human to pick.
    const ambiguous: string[] = [];
    // 3. Units already flagged isCollab=true (whether by this script's own
    // earlier run, or any other detection layer) but with no setName yet --
    // once isCollab is fixed these stop showing up as "mismatches" above,
    // so without this separate pass their naming gap would go invisible.
    const unnamedCollabs: string[] = [];
    // 4. Reverse of #1 -- units currently isCollab=true whose wiki row has
    // NO collab-matching text at all. A lead, not a verdict (see big
    // comment above) -- always cross-check the unit's own wiki page.
    const possibleFalseCollabs: string[] = [];
    let noWikiRow = 0;

    for (const u of units) {
      const row = byUnitNumber.get(u.unitNumber);
      if (!row) {
        noWikiRow++;
        continue;
      }

      const classified = row.methodLines.map(classifyMethodLine);
      const anyCollab = classified.some((c) => c.isCollab);

      if (!u.isCollab && anyCollab) {
        const collabDetail = classified.filter((c) => c.isCollab).map((c) => c.detail).join(" / ");
        const siblingMatches = findSiblingSetNameMatches(collabDetail, allSetNames);
        const siblingNote =
          siblingMatches.length > 0
            ? ` — possible existing setName match: ${siblingMatches.map((s) => `"${s}"`).join(", ")}`
            : " — no existing setName in this DB shares a word with this collab, may be a genuinely new one";
        collabMismatches.push(
          `${u.name} (#${u.unitNumber}): wiki says "${row.methodLines.join(" | ")}" (collab: ${collabDetail}) but isCollab=false${siblingNote}`
        );
      }

      if (u.isCollab && !u.setName) {
        const collabDetail = classified.filter((c) => c.isCollab).map((c) => c.detail).join(" / ") || classified.map((c) => c.detail).join(" / ");
        const siblingMatches = findSiblingSetNameMatches(collabDetail, allSetNames);
        const siblingNote =
          siblingMatches.length > 0
            ? `possible existing setName match: ${siblingMatches.map((s) => `"${s}"`).join(", ")}`
            : "no existing setName in this DB shares a word with this collab -- wiki's own phrasing may be the only option";
        unnamedCollabs.push(`${u.name} (#${u.unitNumber}): wiki says "${row.methodLines.join(" | ")}" — ${siblingNote}`);
      }

      if (u.isCollab && !anyCollab) {
        possibleFalseCollabs.push(
          `${u.name} (#${u.unitNumber}): isCollab=true but wiki's obtaining method has no collab text: "${row.methodLines.join(" | ")}" (current source=${u.source ?? "null"}, setName=${u.setName ?? "null"}) -- verify against the unit's own wiki page before correcting`
        );
      }

      if (u.source === null && u.setName === null) {
        const distinctSources = new Set(classified.map((c) => c.source));
        if (classified.length === 1 && classified[0].source) {
          const c = classified[0];
          proposedFills.push(
            `${u.name} (#${u.unitNumber}): propose source=${c.source}${c.detail ? `, setName="${c.detail}"` : ""} (wiki: "${row.methodLines[0]}")`
          );
        } else if (distinctSources.size > 1 || classified.some((c) => !c.source)) {
          ambiguous.push(`${u.name} (#${u.unitNumber}): wiki lists multiple/unrecognized method(s): "${row.methodLines.join(" | ")}"`);
        }
      }
    }

    console.log(`\n── Audit results ──`);
    console.log(`  ${noWikiRow} unit(s) have no matching row on the wiki page (ID not found in the table)`);

    console.log(`\n  ⚠ ${collabMismatches.length} unit(s) look like missed collab flags (isCollab=false but wiki text says otherwise):`);
    for (const m of collabMismatches) console.log(`    - ${m}`);

    console.log(`\n  ⚑ ${unnamedCollabs.length} unit(s) are isCollab=true but still have no setName:`);
    for (const n of unnamedCollabs) console.log(`    - ${n}`);

    console.log(`\n  ○ ${proposedFills.length} unit(s) with no source/setName have a single unambiguous wiki method to propose:`);
    for (const p of proposedFills) console.log(`    - ${p}`);

    console.log(`\n  ? ${ambiguous.length} unit(s) with no source/setName have multiple or unrecognized wiki method(s), needs a human look:`);
    for (const a of ambiguous) console.log(`    - ${a}`);

    console.log(
      `\n  ⚠ ${possibleFalseCollabs.length} unit(s) are isCollab=true but the wiki shows no collab text at all (LEAD, not a verdict -- check each unit's own wiki page, same as the 6 confirmed false positives fixed 2026-07-12):`
    );
    for (const f of possibleFalseCollabs) console.log(`    - ${f}`);

    console.log("\n✓ Audit complete (read-only -- no database writes were made)");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
