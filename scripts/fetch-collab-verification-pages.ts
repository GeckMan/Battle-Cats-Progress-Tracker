/**
 * Automates exactly what the user has been doing by hand all session:
 * opening a unit's own Battle Cats Wiki page and reading its intro
 * paragraph to check whether it's a real-world franchise collaboration.
 * This fetches that text directly from the live wiki via the same
 * MediaWiki API pattern already proven in audit-obtain-methods.ts (custom
 * User-Agent, since Miraheze blocks default clients) — no PDF export, no
 * screenshot, no manual upload needed. As a bonus this reads the EN wiki
 * page directly rather than a browser print-to-PDF snapshot, sidestepping
 * the issue from earlier this session where some PDFs happened to capture
 * the JP-language tab instead of the English one.
 *
 * WHICH units get checked: every unit currently isCollab=true whose
 * setName doesn't already name a specific, confirmed-real franchise (see
 * CONFIRMED_REAL_COLLAB_FRANCHISES/BCU_KNOWN_COLLAB_CATEGORIES below).
 *
 * FIXED 2026-07-13: this used to skip any setName matching the bare word
 * /collab/i, mirroring sync-bcdata.ts's isBcuCollabName(). That accidentally
 * excluded exactly the units whose real-world status is most uncertain —
 * "Shakurel Planet Collaboration Event", "Princess Punt Sweets
 * Collaboration", and "Betakkuma Collaboration" all contain the word
 * "Collaboration" in OUR OWN internal setName label, but that label isn't
 * external evidence of anything; it's this project's own (possibly stale)
 * text. An in-house Battle Cats event can be labeled "Collaboration"
 * internally as a crossover between two of Ponos's own storylines without
 * ever licensing outside IP — matching the bare word treats our own
 * uncertain label as if it were a verdict, which is circular. Matching a
 * SPECIFIC franchise name instead (Fate, Evangelion, Street Fighter, etc.)
 * is real, external signal; the bare word is not. This is intentionally
 * broader than checkExistingCollabFlagsAgainstEvidence()'s "strong lead"
 * bucket in sync-bcdata.ts (no BCData clone or bcu-assets fetch needed at
 * all here) — it also covers units with NO gacha banner history (stamp/
 * login/drop/serial-code units bcu-assets can never have an opinion on),
 * which is exactly the gap this wiki-based check exists to close.
 *
 * Read-only: makes NO database writes, only prints each unit's fetched
 * intro paragraph(s) to the log for a human (or the next Claude session)
 * to read and judge — same "flag it, don't guess it" pattern as every
 * other audit script this project uses. Deliberately does NOT attempt to
 * auto-classify collab-vs-not from the text; recognizing "this describes
 * a real licensed franchise" is exactly the kind of judgment call this
 * project has repeatedly found needs a human/AI reading the actual prose,
 * not a keyword regex (a unit's own intro rarely says the word "collab"
 * even when it obviously is one, e.g. it just names the anime/game/YouTuber
 * directly).
 *
 * Run manually via: npx tsx ./scripts/fetch-collab-verification-pages.ts
 * (needs DATABASE_URL/DIRECT_DATABASE_URL + real internet access to reach
 * battlecats.miraheze.org — i.e. the "Fetch Collab Verification Pages"
 * GitHub Action, not the sandbox, which cannot reach arbitrary hosts.)
 *
 * NAMING: wiki page titles are built from a unit's name + category
 * (matching UnitsClient.tsx's wikiUrl() exactly), but Unit.name isn't
 * always the wiki's real English name — e.g. unit #673 sits in our DB as
 * literal untranslated Japanese ("ネコチーター") because BCData's own EN
 * Unit_Explanation file had no entry for it (unobtainable content added in
 * Version 11.7, per the user's own screenshot 2026-07-13 of its wiki page,
 * titled "Cheetah_Cat_(Uber_Rare_Cat)"). Guessing a slug from that name
 * 404s. Fixed the same way the user suggested: cross-reference the wiki's
 * own "Cat Release Order" table (same page audit-obtain-methods.ts already
 * parses) for each unit's real name before falling back to Unit.name.
 */
import "dotenv/config";
import { load } from "cheerio";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const WIKI_BASE = "https://battlecats.miraheze.org";
const API_URL = `${WIKI_BASE}/w/api.php`;

// Deliberately duplicated from sync-bcdata.ts (small, stable, same bar as
// audit-obtain-methods.ts's own independent METHOD_PREFIX_MAP) — this
// script has no reason to clone BCData or fetch bcu-assets data itself,
// so importing sync-bcdata.ts isn't safe anyway (it unconditionally runs
// main() at module load, cloning BCData as a side effect of import).
//
// A curated list of real, licensed franchise names this session has
// directly confirmed via bcu-assets' own explicit "Collab" category block
// (IDs -2000 through at least -2033, see the big comment on
// BCU_KNOWN_COLLAB_CATEGORIES in sync-bcdata.ts) and/or live in-app
// dropdown verification. Matching one of these specific proper nouns is a
// real external signal that a setName is a genuine collab — unlike the
// bare word "collab"/"Collaboration", which can appear in an internal,
// unverified setName label for an in-house crossover event that never
// licensed any outside IP (exactly the bug this list replaces, see the
// file-level doc comment above).
const CONFIRMED_REAL_COLLAB_FRANCHISES = [
  "fate", "evangelion", "madoka magica", "bikkuriman", "street fighter",
  "hatsune miku", "ranma", "kunio-kun", "metal slug", "tower of saviors",
  "rurouni kenshin", "baki", "sonic the hedgehog", "demon slayer",
  // Added 2026-07-13 after the second real run of this script surfaced
  // them (all still using the generic "X Collaboration" internal setName
  // pattern) -- each independently confirmed real via its own wiki page
  // and/or an official Ponos social media announcement (web search):
  // Princess Punt Sweets (a real toy/character brand, see Kerihime #26
  // etc.), MattShea (a real YouTuber), Merc Storia (a real DeNA mobile
  // game), Shoumetsu Toshi (a real mobile game, explicitly named as a
  // Battle Cats collab partner on Yuki Cat #181's own wiki page), Neo
  // Mushroom Garden (a real LINE mobile game), Pikotaro (a real musician/
  // YouTuber, PPAP), Crash Fever (a real Sega Networks mobile game), Power
  // Pro Baseball (a real, long-running Konami baseball game franchise),
  // World Trigger (a real, famous anime/manga series), Betakkuma and
  // Mentori (both real LINE Sticker character brands, each with an
  // official Ponos collab announcement on X), and Shakurel Planet (a real
  // toy brand, official Ponos collab announcement on X/Facebook, Sept
  // 2019). This also resolves the three previously-ambiguous units from
  // task #54 (Shakurel Cat/Lion/Tiger/Panda #497-500, Nekokkuma #433) --
  // all confirmed real, isCollab=true was already correct, no DB change
  // needed.
  "princess punt", "mattshea", "merc storia", "shoumetsu toshi",
  "mushroom garden", "pikotaro", "crash fever", "power pro baseball",
  "world trigger", "betakkuma", "mentori", "shakurel",
];
const BCU_KNOWN_COLLAB_CATEGORIES = new Set<string>([
  "Rurouni Kenshin Gacha",
  "Baki Hanma Capsules",
  "Bikkuriman Chocolate Capsules",
]);
function isRecognizedCollabName(name: string): boolean {
  const lower = name.toLowerCase();
  return CONFIRMED_REAL_COLLAB_FRANCHISES.some((f) => lower.includes(f)) || BCU_KNOWN_COLLAB_CATEGORIES.has(name);
}

// Matches the "View on Wiki" link building in UnitsClient.tsx/
// FriendUnitsClient.tsx exactly, since that's the proven-correct mapping
// from a unit's name+category to its real wiki page title.
const WIKI_SUFFIX: Record<string, string> = {
  NORMAL: "Normal_Cat",
  SPECIAL: "Special_Cat",
  RARE: "Rare_Cat",
  SUPER_RARE: "Super_Rare_Cat",
  UBER_RARE: "Uber_Rare_Cat",
  LEGEND_RARE: "Legend_Rare_Cat",
};
function wikiPageTitle(unitName: string, category: string): string {
  // Don't strip "&" — see UnitsClient.tsx's wikiUrl() for the full
  // explanation. Confirmed 2026-07-13: this run's own 4 failed fetches
  // (Takuya & Yuki #179, Satori Hikami & Cat #384, Kano & Souma #483,
  // Chika Amatori & Cat #679) were all this exact bug, not a real
  // "page doesn't exist" — fetchParsedHtml()'s encodeURIComponent(page)
  // already escapes a literal "&" correctly, so it never needed stripping.
  const slug = unitName.replace(/\s+/g, "_").replace(/[#?]/g, "");
  const suffix = WIKI_SUFFIX[category] ?? "Cat";
  return `${slug}_(${suffix})`;
}

// ── "Cat Release Order" name lookup (fallback for a wrong/untranslated
// Unit.name) ─────────────────────────────────────────────────────────────
// Deliberately duplicated from audit-obtain-methods.ts's own fetch/parse
// (same reasoning as the COLLAB_NAME_PATTERN duplication above — importing
// that script isn't safe, it unconditionally runs main() at module load).
const RELEASE_ORDER_PAGE = "Cat_Release_Order";

function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function parseReleaseOrderNames(html: string): Map<number, string> {
  const $ = load(html);
  const names = new Map<number, string>();
  $("table tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 5) return; // header rows use <th>; every real row has 5 columns
    const unitNumber = Number(normalizeSpaces($(tds.get(0)).text()));
    if (!Number.isInteger(unitNumber)) return;
    const name = normalizeSpaces($(tds.get(2)).text());
    if (name) names.set(unitNumber, name);
  });
  return names;
}

async function fetchParsedHtml(page: string): Promise<string> {
  const url = `${API_URL}?action=parse&format=json&prop=text&redirects=1&page=` + encodeURIComponent(page);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "battlecats-progress/1.0", // Miraheze can be picky without a UA
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from parse API`);
  const json = (await res.json()) as any;
  if (json?.error) throw new Error(`parse API error: ${json.error.info ?? json.error.code}`);
  const html = json?.parse?.text?.["*"] as string | undefined;
  if (!html) throw new Error("parse API returned no HTML");
  return html;
}

/** First few substantive paragraphs of the article body, trimmed. */
function extractIntroParagraphs(html: string, max = 3): string[] {
  const $ = load(html);
  // The wiki's portable-infobox ships a <style> block whose CSS text lands
  // inside a <p> in some page layouts (observed 2026-07-13: every single
  // unit's output included a ~2400-char ".mw-parser-output .portable-infobox
  // ..." blob as if it were a real paragraph). Strip style/script content
  // before selecting paragraphs so their text never leaks into $(el).text().
  $("style, script").remove();
  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    if (paragraphs.length >= max) return;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    // Defense in depth: even with style tags stripped, skip anything that
    // still looks like raw CSS (semicolon-heavy, brace-delimited) rather
    // than prose.
    if (text.length >= 15 && !/\{[^{}]*:[^{}]*;/.test(text)) paragraphs.push(text);
  });
  return paragraphs;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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
    console.log("── Fetching Cat Release Order for wiki-confirmed unit names ──");
    let releaseOrderNames: Map<number, string> = new Map();
    try {
      const releaseOrderHtml = await fetchParsedHtml(RELEASE_ORDER_PAGE);
      releaseOrderNames = parseReleaseOrderNames(releaseOrderHtml);
      console.log(`  Parsed ${releaseOrderNames.size} name(s) from the wiki table\n`);
    } catch (e) {
      console.log(`  ✗ Could not fetch Cat Release Order (${(e as Error).message}) — will rely on Unit.name only\n`);
    }

    console.log("── Finding isCollab=true units without a recognized real-collab setName ──");
    const flaggedCollabs = await (prisma as any).unit.findMany({
      where: { isCollab: true },
      select: { unitNumber: true, name: true, category: true, setName: true },
      orderBy: { unitNumber: "asc" },
    });

    const toCheck = flaggedCollabs.filter((u: any) => !u.setName || !isRecognizedCollabName(u.setName));
    console.log(
      `  ${flaggedCollabs.length} unit(s) total flagged isCollab=true, ${toCheck.length} need a wiki check (setName missing or not already a recognized collab name)\n`
    );

    if (toCheck.length === 0) {
      console.log("✓ Nothing to check — every collab-flagged unit already has a recognized collab setName.");
      return;
    }

    let fetched = 0;
    let failed = 0;
    for (const u of toCheck) {
      const releaseOrderName = releaseOrderNames.get(u.unitNumber);
      const primaryName = u.name;
      const title = wikiPageTitle(primaryName, u.category);
      console.log(`── ${u.name} (#${u.unitNumber}) — setName: ${u.setName ?? "null"} — ${WIKI_BASE}/wiki/${title} ──`);
      try {
        let html: string;
        try {
          html = await fetchParsedHtml(title);
        } catch (primaryErr) {
          // Unit.name can be stale/untranslated (e.g. #673 sat in our DB as
          // literal Japanese text, 404ing every guess built from it) — retry
          // once against the wiki's own Cat Release Order name before giving
          // up, rather than silently failing units whose DB name just
          // happens to be wrong.
          if (releaseOrderName && releaseOrderName !== primaryName) {
            const altTitle = wikiPageTitle(releaseOrderName, u.category);
            console.log(`  (primary name lookup failed, retrying with Cat Release Order name "${releaseOrderName}" → ${WIKI_BASE}/wiki/${altTitle})`);
            html = await fetchParsedHtml(altTitle);
          } else {
            throw primaryErr;
          }
        }
        const paragraphs = extractIntroParagraphs(html);
        if (paragraphs.length === 0) {
          console.log("  (page fetched but no substantive paragraph text found — may need manual review)");
        } else {
          for (const p of paragraphs) console.log(`  ${p}`);
        }
        fetched++;
      } catch (e) {
        console.log(`  ✗ Could not fetch: ${(e as Error).message}`);
        failed++;
      }
      console.log("");
      // Be a polite API citizen — this can be dozens of sequential requests.
      await sleep(400);
    }

    console.log(`✓ Done — fetched ${fetched}/${toCheck.length} page(s), ${failed} failed (read-only, no database writes made)`);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
