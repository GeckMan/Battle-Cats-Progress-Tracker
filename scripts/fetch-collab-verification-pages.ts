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
 * setName isn't already a recognized real-collab name (same
 * isBcuCollabName()/BCU_KNOWN_COLLAB_CATEGORIES check used in
 * sync-bcdata.ts's checkExistingCollabFlagsAgainstEvidence(), duplicated
 * here in the small, deliberately-copied form audit-obtain-methods.ts
 * already uses for its own independent classification constants — keep
 * BCU_KNOWN_COLLAB_CATEGORIES in sync with sync-bcdata.ts by hand if either
 * changes). This is intentionally broader than that function's "strong
 * lead" bucket (no BCData clone or bcu-assets fetch needed at all here) —
 * it also covers units with NO gacha banner history (stamp/login/drop/
 * serial-code units bcu-assets can never have an opinion on), which is
 * exactly the gap this wiki-based check exists to close.
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
const COLLAB_NAME_PATTERN = /collab/i;
const BCU_KNOWN_COLLAB_CATEGORIES = new Set<string>([
  "Rurouni Kenshin Gacha",
  "Baki Hanma Capsules",
  "Bikkuriman Chocolate Capsules",
]);
function isRecognizedCollabName(name: string): boolean {
  return COLLAB_NAME_PATTERN.test(name) || BCU_KNOWN_COLLAB_CATEGORIES.has(name);
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
  const slug = unitName.replace(/\s+/g, "_").replace(/[#?&]/g, "");
  const suffix = WIKI_SUFFIX[category] ?? "Cat";
  return `${slug}_(${suffix})`;
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
  const paragraphs: string[] = [];
  $("p").each((_, el) => {
    if (paragraphs.length >= max) return;
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length >= 15) paragraphs.push(text);
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
      const title = wikiPageTitle(u.name, u.category);
      console.log(`── ${u.name} (#${u.unitNumber}) — setName: ${u.setName ?? "null"} — ${WIKI_BASE}/wiki/${title} ──`);
      try {
        const html = await fetchParsedHtml(title);
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
