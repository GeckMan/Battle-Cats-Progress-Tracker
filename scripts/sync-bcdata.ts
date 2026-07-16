/**
 * sync-bcdata.ts — Automated data sync from fieryhenry/BCData
 *
 * Clones the BCData repository, finds the latest EN game version,
 * and upserts units + legend stages + the meow medal catalog into the
 * database.
 *
 * Usage:
 *   npx tsx ./scripts/sync-bcdata.ts
 *
 * Environment:
 *   DATABASE_URL or DIRECT_DATABASE_URL — Neon PostgreSQL connection string
 *
 * Data source:
 *   https://git.battlecatsmodding.org/fieryhenry/BCData.git
 *   No fallback — the old GitHub mirror (github.com/fieryhenry/BCData) was
 *   archived/frozen by its owner on 2026-06-18 at EN 14.7.0 and will never
 *   update again, so it's no longer used even as a fallback (see the comment
 *   on BCDATA_REPO_URLS). If the primary host is down, the sync fails loudly
 *   instead of silently regressing the database with stale data.
 *
 * What it syncs:
 *   - Units: name (all forms), rarity/category, form count
 *   - Collab flags: isCollab/source, detected from the "コラボ" marker Ponos
 *     itself uses in DataLocal/GatyaDataSet{E,N,R}1.csv banner labels —
 *     superseding the old one-off hardcoded unit-ID list from migration
 *     20260303000002_add_iscollab, which never updated for new units.
 *   - Gacha set assignment: setName/banners, by clustering units that debut
 *     together in the same historical gacha banner (see syncEventSets) and
 *     extending an already-curated English set name (e.g. "June Bride") to
 *     new units in the same event — additive only, never guesses a brand
 *     new name and never overwrites existing data.
 *   - Legend Stages: saga names + subchapter names
 *   - Meow Medals: name + description catalog (resLocal/medalname.tsv),
 *     superseding the old one-off Miraheze wiki scraper
 *     (import-meow-medals-miraheze.ts) as the source of truth.
 *
 * Safe to run repeatedly — all writes are upserts.
 *
 * Review-worthy findings (unclassified units, isCollab evidence mismatches,
 * untranslated/placeholder-looking names, unrecognized Great Advent stages,
 * etc.) never block a write, but DO make the run end with a nonzero exit
 * code and a GitHub Actions `::warning::` annotation — see the
 * reviewWarningCount handling at the end of main(). This is what turns the
 * weekly cron's plain green checkmark into a visible, notified signal
 * whenever something needs a human/AI to actually look, instead of a
 * finding sitting silently in a log nobody opens.
 */

import "dotenv/config";
import { execSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { load } from "cheerio";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { GACHA_EVENT_NAMES } from "./data/gacha-event-names.js";

// ── Config ───────────────────────────────────────────────────────────────────
// PRIMARY (and ONLY) source: fieryhenry's self-hosted Forgejo instance, which
// is actively maintained (as of writing, on EN 15.4.x — see
// https://git.battlecatsmodding.org/fieryhenry/BCData).
//
// The GitHub mirror (github.com/fieryhenry/BCData) was archived/frozen by
// its owner on 2026-06-18 and is now permanently stuck at EN 14.7.0 — it
// will never receive another update. It used to be listed here as an
// automatic fallback, but that's now actively dangerous: if the primary
// host has a transient outage during the weekly cron, falling back to the
// frozen mirror would silently re-sync 14.7.0-era data over whatever
// current data is already in the database (e.g. reintroducing unit
// rarities/legend stages/medals that have since changed or been added).
// Deliberately NOT including it — see cloneOrPull() below, which now fails
// loudly instead of silently degrading to stale data.
const BCDATA_REPO_URLS = ["https://git.battlecatsmodding.org/fieryhenry/BCData.git"];
export const CLONE_DIR = "/tmp/bcdata-sync";
export const REGION = "en";

// Rarity ranges in unitbuy.csv (row index = unit ID)
// The rarity is NOT a single column — it's determined by unit ID ranges
// that are well-known in the BC community:
//   0–8: Normal, 9–56: Special, rest determined by nyankoPictureBookData
// However, nyankoPictureBookData_Attribute.csv maps units to rarity groups.
// Column format: group0_id, group1_id, group2_id, group3_id, group4_id
// where groups correspond to rarity tiers in the picture book.
//
// Simpler approach: use the "rarity" field from nyankoPictureBookData.csv
// Column 3 (0-indexed) encodes the rarity:
//   0 = Normal, 1 = Special, 2 = Rare, 3 = Super Rare, 4 = Uber Rare, 5 = Legend Rare

const RARITY_MAP: Record<number, string> = {
  0: "NORMAL",
  1: "SPECIAL",
  2: "RARE",
  3: "SUPER_RARE",
  4: "UBER_RARE",
  5: "LEGEND_RARE",
};

// Fallback: known unit ID ranges for rarity (EN version)
const RARITY_RANGES: [number, number, string][] = [
  [0, 8, "NORMAL"],       // Cat through Lizard Cat
  [9, 56, "SPECIAL"],     // Ninja Cat through various special units
  // Everything else defaults to RARE, refined by nyankoPictureBookData
];

const CATEGORY_SORT_BASE: Record<string, number> = {
  NORMAL: 0,
  SPECIAL: 10000,
  RARE: 20000,
  SUPER_RARE: 30000,
  UBER_RARE: 40000,
  LEGEND_RARE: 50000,
};

// Added 2026-07-13: every "flag it, don't guess it" coverage check in this
// file (unit classification coverage, existing-collab-flag evidence check,
// Brainwashed Cats coverage, Great Advent milestone coverage, unit name
// sanity) used to only ever print a warning to the log — with no failure
// signal, no notification, nothing. The weekly cron shows a plain green
// checkmark in the Actions tab whether or not it found something needing a
// human/AI look, so nobody would ever know to go read it. Each coverage
// check now adds its finding count here; main() turns a nonzero total into
// a GitHub Actions annotation AND a nonzero process exit code at the very
// end of the run (after every other step has already completed), which
// makes the job show as failed and triggers GitHub's default
// workflow-failure-notification email — without ever aborting the sync
// itself early or skipping any of its own writes.
let reviewWarningCount = 0;

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL or DIRECT_DATABASE_URL must be set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

  try {
    // Step 1: Clone/pull BCData
    console.log("── Cloning BCData repository ──");
    cloneOrPull();

    // Step 2: Find latest EN version
    const latestVersion = findLatestVersion();
    console.log(`Latest EN version: ${latestVersion}`);

    // Record the synced version so the Units page can show a real,
    // self-updating "current to game version X" note instead of a
    // hardcoded string (bug report, 2026-07-16, bvg_tbc: the old hardcoded
    // note still said "15.1.1" long after newer units had already synced
    // in). Written up front, before any parsing that could fail partway
    // through, since even a partial sync run did pull real, newer data.
    await (prisma as any).appMeta.upsert({
      where: { key: "bcDataVersion" },
      create: { key: "bcDataVersion", value: latestVersion },
      update: { value: latestVersion },
    });

    const dataDir = path.join(CLONE_DIR, "game_data", REGION, latestVersion);
    // Fallback for old repo structure (no game_data folder)
    const altDataDir = path.join(CLONE_DIR, `${latestVersion}${REGION}`);
    const baseDir = existsSync(dataDir) ? dataDir : existsSync(altDataDir) ? altDataDir : null;

    if (!baseDir) {
      console.error(`ERROR: Cannot find data directory. Tried:\n  ${dataDir}\n  ${altDataDir}`);
      process.exit(1);
    }
    console.log(`Using data dir: ${baseDir}`);

    const dataLocal = path.join(baseDir, "DataLocal");
    const resLocal = path.join(baseDir, "resLocal");

    // Step 3: Parse and sync units
    console.log("\n── Syncing Units ──");
    await syncUnits(prisma, dataLocal, resLocal);

    // Fetched once and shared by both collab detection and gacha set
    // assignment below — both need the same rowIndex -> resolved-name map
    // from battlecatsultimate/bcu-assets, no reason to fetch it twice.
    console.log("\n── Loading battlecatsultimate/bcu-assets gacha names ──");
    const bcuNames = await fetchBcuGachaNameMap();
    console.log(
      bcuNames
        ? `  Loaded ${bcuNames.r.size} rare-tier + ${bcuNames.e.size} special-tier row-name(s) from battlecatsultimate/bcu-assets`
        : "  ⚠ Could not load battlecatsultimate/bcu-assets gacha names this run — falling back to コラボ label/dictionary/manual naming only"
    );

    // Step 3b: Detect collab units from real gacha banner history
    console.log("\n── Detecting Collab Units ──");
    await syncCollabFlags(prisma, dataLocal, bcuNames);

    // Step 3c: Tie units to their real gacha set/event using banner debut
    // history, and flag any unit still missing a source/set classification
    console.log("\n── Assigning Gacha Sets ──");
    await syncEventSets(prisma, dataLocal, bcuNames);
    await syncBannerMembership(prisma, dataLocal);

    // Backstop: catches units whose setName/banners already say "Collab"
    // (often via family-propagation from a sibling's row, not their own)
    // but never got isCollab set — see the big comment on the function.
    console.log("\n── Backstopping Collab Flags from Resolved Names ──");
    await syncCollabFlagsFromCuratedNames(prisma);

    // Backfills `source` (the "How to Obtain" field) from the wiki's own
    // Cat Release Order table for any unit that still has it null — run
    // before the coverage checks below so freshly-filled units don't
    // spuriously show up as still-missing in this same run's logs. Never
    // touches isCollab — see the big comment on the function.
    console.log("\n── Backfilling Source from Cat Release Order Wiki Page ──");
    await syncSourceFromReleaseOrder(prisma);

    // Read-only: re-checks every EXISTING isCollab=true unit against the
    // same bcu-assets/コラボ evidence used above to detect new ones — the
    // regular flagging functions are deliberately additive-only and never
    // do this on their own. See the big comment on the function.
    console.log("\n── Checking Existing Collab Flags Against Evidence ──");
    await checkExistingCollabFlagsAgainstEvidence(prisma, dataLocal, bcuNames);

    await checkUnitClassificationCoverage(prisma);
    await checkUnitNameSanity(prisma);
    // Re-detect families here (cheap — just re-reads the already-cloned
    // CSVs) so the coverage check can look up debut-row siblings for any
    // still-unresolved Brainwashed Cat units, without changing
    // syncEventSets()'s own internal signature/behavior.
    const { families: brainwashedFamilies, provenance: brainwashedProvenance } = detectEventFamilies(dataLocal);
    await checkBrainwashedCatsCoverage(prisma, brainwashedFamilies, brainwashedProvenance, bcuNames);

    // Step 4: Parse and sync legend stages
    console.log("\n── Syncing Legend Stages ──");
    await syncLegendStages(prisma, dataLocal, resLocal);

    // Step 5: Parse and sync meow medal catalog
    console.log("\n── Syncing Meow Medals ──");
    await syncMeowMedals(prisma, resLocal);

    console.log("\n✓ Sync complete!");

    // All actual data writes above have already happened by this point —
    // this only decides how loudly to end the run, never whether to make
    // it. A nonzero reviewWarningCount means one or more coverage checks
    // above found something a human/AI needs to look at (unclassified
    // units, evidence-mismatch leads, untranslated/placeholder names, etc.)
    // that used to just sit in the log with no visible signal at all. The
    // GitHub Actions `::warning::` command puts a yellow annotation
    // directly on the run's summary page (visible without opening any
    // step's log), and process.exitCode (not process.exit — this still
    // lets the `finally` block below run first) makes the job itself show
    // as failed, which triggers GitHub's own default
    // workflow-failure-notification email to the repo's watchers. The
    // companion workflow step in sync-bcdata.yml still runs the medal-image
    // sync/commit afterward regardless (continue-on-error on this step),
    // so a review-worthy warning here never blocks anything else from
    // shipping.
    if (reviewWarningCount > 0) {
      const summary = `Sync completed and all writes succeeded, but ${reviewWarningCount} item(s) across this run's coverage checks need a human/AI look (see the ⚠ lines above) — not a crash, just nothing that should silently go unread.`;
      console.log(`\n⚠ ${summary}`);
      console.log(`::warning::${summary}`);
      process.exitCode = 1;
    } else {
      console.log("\n✓ All coverage checks clean — nothing needs manual review this run.");
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// ── Git Operations ───────────────────────────────────────────────────────────

export function cloneOrPull() {
  if (existsSync(path.join(CLONE_DIR, ".git"))) {
    console.log("  Pulling latest changes...");
    try {
      execSync("git pull --ff-only", { cwd: CLONE_DIR, stdio: "pipe", timeout: 60000 });
      return;
    } catch {
      console.log("  Pull failed, re-cloning...");
      execSync(`rm -rf ${CLONE_DIR}`);
    }
  }

  for (const url of BCDATA_REPO_URLS) {
    try {
      console.log(`  Cloning from ${url}...`);
      execSync(`git clone --depth 1 "${url}" "${CLONE_DIR}"`, { stdio: "pipe", timeout: 120000 });
      return;
    } catch (e) {
      console.log(`  Failed to clone from ${url}`);
    }
  }

  // Intentionally NOT falling back to the archived GitHub mirror (see the
  // comment on BCDATA_REPO_URLS above) — failing the sync run leaves the
  // existing database data untouched, which is safe. Silently falling back
  // to a permanently frozen mirror would not be.
  throw new Error(
    "Failed to clone BCData from the primary source (git.battlecatsmodding.org). " +
      "Not falling back to the archived GitHub mirror — it's permanently frozen at " +
      "EN 14.7.0 and would regress the database with stale data. This run will fail " +
      "and existing data is left as-is; re-run once the primary host is back up."
  );
}

export function findLatestVersion(): string {
  // Try game_data/en/ structure first (Forgejo repo)
  const gameDataEnDir = path.join(CLONE_DIR, "game_data", REGION);
  if (existsSync(gameDataEnDir)) {
    const versions = readdirSync(gameDataEnDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+$/.test(d.name))
      .map((d) => d.name)
      .sort(compareVersions);
    if (versions.length > 0) return versions[versions.length - 1];
  }

  // Fallback: old structure with version+region folders at root
  const rootDirs = readdirSync(CLONE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+en$/.test(d.name))
    .map((d) => d.name.replace(/en$/, ""))
    .sort(compareVersions);

  if (rootDirs.length > 0) return rootDirs[rootDirs.length - 1];

  throw new Error("No version directories found in BCData");
}

function compareVersions(a: string, b: string): number {
  const pa = a.split(".").map(Number);
  const pb = b.split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((pa[i] ?? 0) !== (pb[i] ?? 0)) return (pa[i] ?? 0) - (pb[i] ?? 0);
  }
  return 0;
}

// ── Unit Sync ────────────────────────────────────────────────────────────────

// BCData's Unit_Explanation*_en.csv genuinely contains a raw numeric-ID
// placeholder (e.g. "730_1", "771-1") as the literal name field for these
// 21 units, not a parsing bug on this project's side -- confirmed
// 2026-07-12 while investigating why the app's unit search couldn't find
// anything for "spirit" despite these units existing. They're "Spirit of
// X" entries -- BCData's internal representation of a summoned ability a
// specific Uber Rare uses in battle (the unit summons its own "Spirit of
// X" as part of an attack), not an independently obtainable unit of its
// own -- that appear to have never gotten a real localized name from
// Ponos's own source data, so there's no future BCData version where this
// would just fix itself. Names below are the Battle Cats Wiki's Cat
// Release Order page's "Obtaining method" text for each (the only
// human-readable identifier available for any of them), captured via the
// "Audit Obtain Methods" workflow. Applied here (not just as a one-off
// migration) so a future weekly sync's unconditional `name: u.name` upsert
// doesn't silently revert these back to the placeholder the next time
// this runs.
const UNIT_NAME_OVERRIDES: Record<number, string> = {
  729: "Spirit of Master of Mind Soractes",
  732: "Spirit of Daybreaker Izanagi",
  734: "Spirit of Pegasa",
  739: "Spirit of Izanami of Dusk",
  755: "Spirit of Akechi Mitsuhide",
  761: "Spirit of Gunduros",
  764: "Spirit of Dynasaurus Cat",
  770: "Spirit of Hanasaka Cat",
  775: "Spirit of Mech Patrol Axel",
  782: "Spirit of Mamoluga",
  800: "Spirit of Mighty Morta-Loncha",
  802: "Spirit of Master of Logic Newtone",
  812: "Spirit of Victorious Skanda",
  816: "Spirit of Moonshade Kaworu",
  818: "Spirit of Komori",
  821: "Spirit of Seaside Pegasa",
  825: "Spirit of Sorceress Sidmi",
  838: "Spirit of Squire Luno",
  839: "Spirit of Lunos the Luminous",
  855: "Spirit of Master of Selection Darvin",
  860: "Spirit of Lone Moon Lunos",
};

// Name-only overrides for units whose BCData EN Unit_Explanation entry is
// missing/untranslated for a DIFFERENT reason than the "Spirit of X"
// summoned-ability entries above — these are real, listed Uber Rares (not
// summoned-ability placeholders), so they must NOT be treated as
// excludeFromCollection the way UNIT_NAME_OVERRIDES is (see
// `excludeFromCollection = u.unitNumber in UNIT_NAME_OVERRIDES` below — a
// unit landing in that map is exactly the signal used to hide it from the
// collection entirely, which would be
// wrong here). Kept as a separate map for that reason.
//
//   - 673 "Cheetah Cat": an intentionally unobtainable-without-hacking Uber
//     Rare (per the user's own wiki screenshot, 2026-07-13) added in
//     Version 11.7 — BCData's own EN Unit_Explanation file has no real
//     entry for it, so it was falling back to literal untranslated
//     Japanese ("ネコチーター"). It's still a real, intentionally-designed
//     unit that should appear in the collection list (unlike the Arena of
//     Honor tokens, which aren't independently obtainable units at all).
const EXTRA_NAME_OVERRIDES: Record<number, string> = {
  673: "Cheetah Cat",
};

// syncCollabFlags()/syncCollabFlagsFromCuratedNames() are deliberately
// additive-only (never unset isCollab) so a hand-verified TRUE never gets
// clobbered. That protection is asymmetric, though: there was no equivalent
// guard for a hand-verified FALSE, so a unit manually corrected away from a
// legacy false-positive could still get silently re-flagged true on a later
// sync if some signal (a コラボ label, a bcu-assets category name, or the
// unit's own resolved setName/banners text) happens to match again.
//
// Confirmed 2026-07-12: individual wiki pages showed these 6 units had
// isCollab=true set incorrectly from this project's original hardcoded
// list, despite having zero real-world franchise tie-in (a Lunar New Year
// capsule, a stage-clear unlock, a JP anniversary login bonus, and three
// distinct serial-code/gashapon merch promos) — corrected to isCollab=false
// in migration 20260712000012_resolve_9_deferred_collab_units_from_wiki.
// Listed here so any future sync run treats that correction as permanent
// rather than something a matching signal could quietly revert.
//
// #682 (Spectral Goth Vega) added 2026-07-13: a "Girls & Monsters: Angels
// of Terror" unit that a March 2026 migration mistakenly swept into the
// Street Fighter Collaboration list (see migration
// 20260713000002_fix_spectral_goth_vega_wrong_collab_tag for the full
// three-source confirmation this was wrong). Listed here too since this
// exact unit has already been mislabeled by hand once before -- worth the
// extra permanent protection.
//
// 25 more added 2026-07-13 (migration
// 20260713000003_fix_more_legacy_iscollab_false_positives), all traced to
// the SAME root cause: three March 2026 migrations that set isCollab=true
// based on a unit's SOURCE type (Event Capsule/Serial Code/Campaign/
// Unobtainable) rather than on real-world collaboration status. The full
// 21-unit "Li'l Cats" permanent gacha set, plus the 3 Summer Break Cats
// units and the Nyanko Rangers unit already individually confirmed
// non-collab elsewhere this session, all inherited that same wrong flag.
// This is very likely NOT the full extent of the problem -- see the
// "Audit Obtain Methods" workflow for a systematic sweep of the rest.
// 19 more added 2026-07-13 (migration
// 20260713000004_fix_more_iscollab_false_positives_from_sync_evidence),
// surfaced automatically by checkExistingCollabFlagsAgainstEvidence()'s
// first real run rather than manual review: "Lucky Capsule", "9th
// Anniversary Special Capsules", "Summer Break Capsules" (more units from
// the same event as #670/#813/#822 above), and "June Bride of Devil
// Capsules" (thematically identical to the already-confirmed-non-collab
// Halloween/Xmas/Valentine seasonal capsules — no franchise name at all).
const MANUALLY_VERIFIED_NOT_COLLAB = new Set<number>([
  29, 45, 62, 82, 140, 141, 682,
  // Li'l Cats permanent set
  63, 70, 74, 79, 80, 81, 100, 104, 109, 122, 128, 132, 176, 183, 227, 244, 282, 303, 329, 343, 501,
  // Summer Break Cats (base/Castaway/Paradise) + Nyanko Rangers
  670, 813, 822, 831,
  // Lucky Capsule
  209, 210, 211, 245, 246, 247, 311, 312, 313,
  // 9th Anniversary Special Capsules
  184, 342, 375,
  // More Summer Break Capsules
  381, 615, 616,
  // June Bride of Devil Capsules
  248, 713, 757, 863,
  // 2026-07-13: 89 units confirmed non-collab by the first real run of
  // scripts/fetch-collab-verification-pages.ts (each unit's own wiki page
  // fetched and read directly — see migration
  // 20260713000005_fix_89_iscollab_false_positives_from_wiki_verification
  // for the full evidence writeup). Grouped by setName below, matching the
  // migration's own grouping.
  //
  // Plain "Rare Cat Capsule" pool
  30, 31, 32, 33, 35, 36, 37, 38, 39, 40, 41, 46, 47, 48, 49, 50, 51, 52, 55, 56,
  58, 61, 129, 131, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153,
  197, 198, 199, 200, 237, 238, 239, 307, 308, 325, 376, 377, 495, 522, 523,
  // Sengoku Wargods Vajiras
  72, 338, 618,
  // Lords of Destruction Dragon Emperors
  83, 87, 177,
  // Cyber Academy Galaxy Gals
  105, 107, 619,
  // Ancient Heroes Ultra Souls
  136, 137, 203, 525,
  // Tales of the Nekoluga
  170, 625,
  // Justice Strikes Back! Dark Heroes
  194, 212,
  // The Almighties
  257, 271, 316,
  // Nature's Guardians Elemental Pixies
  359, 401,
  // Frontline Assault Iron Legion
  417,
  // Gals of Summer
  438,
  // Girls & Monsters: Angels of Terror
  607,
  // The Dynamites
  617, 668,
  // 10th Anniversary Memorial Capsules
  635, 689,
  // New Moon Capsules
  646,
  // Love Letter Capsules
  650, 651, 652,
  // June Bride of Devil Capsules (missed from the earlier batch above)
  665,
  // Heartbeat Catcademy
  696,
  // Medal King's Palace
  726,
  // Lunar New Year
  730,
  // Summer Break Survival Capsules
  765, 766, 767,
  // Cheetah Cat (#673, setName "Epic Fest") — confirmed via the user's own
  // wiki screenshot 2026-07-13: an unobtainable-without-hacking Uber Rare,
  // "the worst cat in the game", zero franchise mention anywhere on its
  // page. Its wiki page fetch had been failing entirely because our DB
  // name was untranslated Japanese, not because it needed a collab
  // verdict — see EXTRA_NAME_OVERRIDES above for the name fix.
  673,
]);

interface ParsedUnit {
  unitNumber: number;
  name: string;
  evolvedName: string | null;
  trueName: string | null;
  ultraName: string | null;
  category: string;
  rarityFromData: boolean; // true if rarity came from data file, false if guessed
  formCount: number;
  sortOrder: number;
}

async function syncUnits(prisma: PrismaClient, dataLocal: string, resLocal: string) {
  // 1. Parse rarity from data files
  const rarityMap = parseRarityMap(dataLocal, resLocal);
  console.log(`  Parsed rarity for ${rarityMap.size} units`);

  // 2. Build authoritative form count map from nyankoPictureBookData.csv.
  // This file has one row per unit. One of its columns encodes the number of
  // forms available for that unit (1-4). We auto-detect the column.
  const formCountMap = parseFormCountMap(dataLocal);
  console.log(`  Parsed form counts for ${formCountMap.size} units`);

  // 3. Parse unit names from Unit_Explanation files
  const units: ParsedUnit[] = [];
  const explanationFiles = readdirSync(resLocal)
    .filter((f) => /^Unit_Explanation\d+_en\.csv$/.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/\d+/)![0], 10);
      const nb = parseInt(b.match(/\d+/)![0], 10);
      return na - nb;
    });

  for (const file of explanationFiles) {
    const fileNum = parseInt(file.match(/\d+/)![0], 10);
    const unitNumber = fileNum - 1; // Unit_Explanation1 = unit 0

    const content = readFileSync(path.join(resLocal, file), "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length === 0) continue;

    // Each line = one form. First field (pipe-delimited) = name.
    const formNames = lines.map((line) => {
      const name = line.split("|")[0].trim();
      return name && name !== "＠" ? name : null;
    });

    const name = UNIT_NAME_OVERRIDES[unitNumber] ?? EXTRA_NAME_OVERRIDES[unitNumber] ?? formNames[0];
    if (!name) continue; // Skip units with no name

    // Use nyankoPictureBookData form count as the authoritative source.
    // Explanation files often have names for unreleased/datamined forms,
    // but the picture book data reflects what's actually in the game.
    // Fall back to explanation file line count if picture book data is unavailable.
    const pbFormCount = formCountMap.get(unitNumber);
    const nameBasedCount = formNames.filter((n) => n !== null).length;
    const formCount = pbFormCount ?? nameBasedCount;

    // Only keep form names for forms that actually exist (per picture book count).
    // This prevents unreleased/datamined form names from appearing in the app.
    const evolvedName = formCount >= 2 ? (formNames[1] ?? null) : null;
    const trueName = formCount >= 3 ? (formNames[2] ?? null) : null;
    const ultraName = formCount >= 4 ? (formNames[3] ?? null) : null;

    // Determine rarity — prefer data file, fall back to guess
    const dataRarity = rarityMap.get(unitNumber);
    const category = dataRarity ?? guessRarity(unitNumber);
    const rarityFromData = !!dataRarity;

    const sortOrder = (CATEGORY_SORT_BASE[category] ?? 0) + unitNumber;

    units.push({
      unitNumber,
      name,
      evolvedName,
      trueName,
      ultraName,
      category,
      rarityFromData,
      formCount,
      sortOrder,
    });
  }

  console.log(`  Found ${units.length} units in BCData`);

  // 3. Count existing units in DB
  const existingCount = await (prisma as any).unit.count();
  const newUnits = units.length - existingCount;
  if (newUnits > 0) {
    console.log(`  ${newUnits} NEW units to add!`);
  } else {
    console.log(`  No new units (DB has ${existingCount}, BCData has ${units.length})`);
  }

  // 4. Upsert all units
  // If rarity was reliably parsed from data files, update category.
  // If rarity was only guessed, DON'T overwrite existing category (it may have
  // been correctly set by the seed migration or a previous successful sync).
  const hasReliableRarity = rarityMap.size > 0;
  if (!hasReliableRarity) {
    console.warn("  ⚠ Rarity was NOT parsed from data files — will NOT overwrite existing unit categories");
  }

  const batchSize = 50;
  let upserted = 0;
  for (let i = 0; i < units.length; i += batchSize) {
    const batch = units.slice(i, i + batchSize);
    await Promise.all(
      batch.map((u) => {
        // "Spirit of X" summoned-ability entries (the same 21 units in
        // UNIT_NAME_OVERRIDES) aren't real collectible units — set
        // unconditionally on every sync so this can never regress even if a
        // future BCData version stops needing the name override for one of
        // them (e.g. if Ponos ever gives it a real localized name).
        const excludeFromCollection = u.unitNumber in UNIT_NAME_OVERRIDES;

        // For updates: only include category/sortOrder if we have reliable rarity data
        const updateData: Record<string, unknown> = {
          name: u.name,
          evolvedName: u.evolvedName,
          trueName: u.trueName,
          ultraName: u.ultraName,
          formCount: u.formCount,
          excludeFromCollection,
        };
        if (u.rarityFromData) {
          updateData.category = u.category;
          updateData.sortOrder = u.sortOrder;
        }

        return (prisma as any).unit.upsert({
          where: { unitNumber: u.unitNumber },
          create: {
            id: `unit-${u.unitNumber}`,
            unitNumber: u.unitNumber,
            name: u.name,
            evolvedName: u.evolvedName,
            trueName: u.trueName,
            ultraName: u.ultraName,
            category: u.category,
            formCount: u.formCount,
            sortOrder: u.sortOrder,
            excludeFromCollection,
          },
          update: updateData,
        });
      })
    );
    upserted += batch.length;
    process.stdout.write(`\r  Upserted ${upserted}/${units.length} units...`);
  }
  console.log(`\n  ✓ ${upserted} units synced`);
}

// ── Collab Detection from Gacha Banner Data ─────────────────────────────────
//
// `isCollab` used to be a one-time hardcoded list of ~82 unit IDs (see the
// March 2026 migration `20260303000002_add_iscollab`), which meant every
// unit added since then defaulted to isCollab=false / source=null forever —
// the same class of staleness bug the meow medal catalog had before it was
// folded into this sync.
//
// BCData's DataLocal/GatyaDataSet{E,N,R}1.csv files are a full historical
// log of every gacha banner Ponos has ever run (row index = in-game
// GatyaSetID). Each row is a comma-separated list of unit IDs terminated by
// a `-1` sentinel, followed by a `//` comment holding Ponos's own internal
// Japanese banner label. Crucially, those labels literally spell out real
// licensed crossovers using the loanword "コラボ" (korabo = "collab") — e.g.
// "Fateコラボガチャ", "刃牙コラボ" (Baki collab), "ビックリマンコラボ"
// (Bikkuriman collab). That gives a reliable signal for isCollab with no
// keyword list of IP names to maintain — just check for that marker.
//
// (GatyaDataSet{E,N,R}2/3.csv are companion files for banner
// weighting/animation metadata, not additional unit-ID pools — verified by
// inspecting their contents, which are either all -1 or small tier-index
// integers, never real unit IDs. Deliberately not parsed here.)
//
// setName/banner ("gacha set") assignment is handled separately below by
// syncEventSets(), which reuses this same parser.
const GATYA_SET_FILES = ["GatyaDataSetE1.csv", "GatyaDataSetN1.csv", "GatyaDataSetR1.csv"];
const COLLAB_MARKER = "コラボ";

// Diagnostic for when GATYA_SET_FILES yields nothing — rather than just
// logging "may be missing or reformatted" and leaving it at that (which is
// exactly what happened silently for the 15.4.0 BCData snapshot: these
// exact filenames stopped resolving and every downstream feature that
// depends on them — collab detection, gacha set assignment, banner
// membership — quietly no-op'd every run since, with no visibility into
// why). This prints what's ACTUALLY in DataLocal so the real rename/move
// is visible in the next run's log instead of having to guess blind.
function logGatyaFileDiagnostics(dataLocal: string) {
  try {
    const entries = readdirSync(dataLocal);
    const candidates = entries.filter((f) => /gatya/i.test(f));
    if (candidates.length > 0) {
      console.log(`    Files in DataLocal matching /gatya/i (${candidates.length}): ${candidates.slice(0, 20).join(", ")}${candidates.length > 20 ? " …and more" : ""}`);
    } else {
      console.log(`    No files in DataLocal match /gatya/i at all — checked ${entries.length} total entries in ${dataLocal}`);
    }
  } catch (e) {
    console.log(`    Could not list DataLocal for diagnostics: ${(e as Error).message}`);
  }

  // The files themselves may exist (confirmed by the listing above) but
  // still parse to zero rows if the row/comment format inside them
  // changed — which is exactly what happened for BCData EN 15.4.0. Print
  // the raw first few lines of each target file (with \r made visible) so
  // the actual current format is visible in the log instead of guessing.
  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) {
      console.log(`    ${file}: does not exist at ${filePath}`);
      continue;
    }
    try {
      const raw = readFileSync(filePath, "utf-8");
      const lines = raw.split("\n").slice(0, 5);
      console.log(`    ${file} (${raw.length} bytes, ${raw.split("\n").length} lines) — first ${lines.length} raw line(s):`);
      for (const [i, line] of lines.entries()) {
        console.log(`      [${i}] ${JSON.stringify(line)}`);
      }
    } catch (e) {
      console.log(`    ${file}: could not read — ${(e as Error).message}`);
    }
  }
}

function parseGatyaSetFile(content: string): { unitIds: number[]; label: string; rawLineIndex: number }[] {
  return content
    .split("\n")
    .map((line, rawLineIndex) => {
      const commentIdx = line.indexOf("//");
      const dataPart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
      const label = commentIdx >= 0 ? line.slice(commentIdx + 2).trim() : "";
      const unitIds = dataPart
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "" && s !== "-1")
        .map(Number)
        .filter((n) => Number.isFinite(n));
      return { unitIds, label, rawLineIndex };
    })
    // IMPORTANT: this filter must run AFTER rawLineIndex is captured above,
    // not before — rawLineIndex has to reflect this row's true 0-based
    // position in the raw file (matching the numbering used by
    // battlecatsultimate/bcu-assets' lang/bot-GachaName.txt and by
    // PackPack's GachaSet.java, both of which count every line including
    // "-1"-only placeholder rows) — not its position in this already-
    // filtered array, which would silently drift out of sync the moment
    // any blank row appears earlier in the file.
    .filter((row) => row.unitIds.length > 0);
}

// A bcu-assets category name is unambiguously a real-world IP crossover iff
// it literally ends in "Collab Gacha"/"Collab Capsules" — verified against
// the full category list (e.g. "-2031 Baki Collab Gacha", "-2033 Demon
// Slayer Collab Gacha", "-2006 Evangelion Collab Gacha", "-2010 Street
// Fighter Collab Gacha", "-2022 Ranma 1/2 Collab Gacha", "-2030 Rurouni
// Kenshin Gacha" [no "Collab" in this one specific name, see below], "-2032
// Sonic the Hedgehog Collab Gacha"). Genuinely non-collab original in-game
// events (e.g. "-3 Galaxy Gals", "-9 Girls & Monsters") never carry this
// wording. Deliberately a plain substring match, not an ID-range check
// (-2030 Rurouni Kenshin Gacha has no literal "Collab" in its name despite
// being in the same numbered block as its neighbors) — the ID block groups
// collabs together by when they were added to bcu-assets' catalog, but
// isn't itself a promise that every ID in it says "Collab", so name text is
// the more direct signal. Known gap: Rurouni Kenshin (-2030) needs handling
// separately, see BCU_KNOWN_COLLAB_CATEGORIES below.
const COLLAB_NAME_PATTERN = /collab/i;

// A handful of real collabs in bcu-assets' own catalog don't spell "Collab"
// in their display name at all (Ponos's marketing name for the tie-in just
// doesn't use the word) — these are cross-checked by hand against the wiki
// (or, for "Baki Hanma Capsules", directly against BCData's own pre-15.4.0
// Japanese label "刃牙" = "Baki" — see the big comment on
// fetchBcuGachaNameMap()) before being added here, same bar as
// BCU_CATEGORY_ALIAS above. Kunio-kun isn't in this list even though its two
// team-variant categories also don't say "Collab" (-2023/-2027) because it
// wasn't independently verified this session — flagged for a future manual
// check instead of guessed at.
//
// Also reused (2026-07-13) by checkExistingCollabFlagsAgainstEvidence() in
// the OPPOSITE direction — as a set of already-verified-real Unit.setName
// values, not just bcu-assets row names — to stop flagging Bikkuriman and
// Street Fighter units as "strong lead" false positives just because their
// OWN specific gacha row predates or otherwise isn't covered by bcu-assets'
// Collab category block. "Bikkuriman Chocolate Capsules" added for exactly
// this reason: confirmed a real collab this session (live app dropdown
// check, see migration 20260712000012), but every one of its units'
// individual rows came back as a bcu-assets coverage gap, not a collab
// tag — which is the SAME already-documented Sengoku Basara-style gap this
// set exists to paper over, not a new kind of false positive.
const BCU_KNOWN_COLLAB_CATEGORIES = new Set<string>([
  "Rurouni Kenshin Gacha",
  "Baki Hanma Capsules",
  "Bikkuriman Chocolate Capsules",
]);

function isBcuCollabName(name: string): boolean {
  return COLLAB_NAME_PATTERN.test(name) || BCU_KNOWN_COLLAB_CATEGORIES.has(name);
}

function detectCollabUnitIds(dataLocal: string, bcuNames: BcuGachaNames | null): Set<number> {
  const collabIds = new Set<number>();
  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) continue;
    const rows = parseGatyaSetFile(readFileSync(filePath, "utf-8"));
    for (const row of rows) {
      if (row.label.includes(COLLAB_MARKER)) {
        for (const id of row.unitIds) collabIds.add(id);
        continue;
      }
      // bcu-assets cross-check — see the big comment on syncCollabFlags()
      // for why the コラボ label marker alone was never enough. Covers both
      // GatyaDataSetR1.csv (bcuNames.r) and GatyaDataSetE1.csv (bcuNames.e) —
      // same scope restriction as syncEventSets()'s use of this same map
      // (N-tier rows confirmed generic, see fetchBcuGachaNameMap()).
      if (bcuNames) {
        const byRowIndex = file === "GatyaDataSetR1.csv" ? bcuNames.r : file === "GatyaDataSetE1.csv" ? bcuNames.e : null;
        const bcuName = byRowIndex?.get(row.rawLineIndex);
        if (bcuName && isBcuCollabName(bcuName)) {
          for (const id of row.unitIds) collabIds.add(id);
        }
      }
    }
  }
  return collabIds;
}

async function syncCollabFlags(prisma: PrismaClient, dataLocal: string, bcuNames: BcuGachaNames | null) {
  // Known limitation (ORIGINAL, pre-2026-07-12): this only caught banners
  // where Ponos's own internal label literally contains コラボ. Verified
  // against real BCData that this reliably matched recent licensed
  // crossovers at the time (Fate, Bikkuriman, Metal Slug), but plenty of
  // collabs never got labeled that way at all — confirmed directly from a
  // live "Hide Collab" filter screenshot (2026-07-12) still showing Baki,
  // Sonic the Hedgehog, Street Fighter, Ranma 1/2, Rurouni Kenshin, and
  // Demon Slayer units. This wasn't only the BCData 15.4.0 label-stripping
  // (see the note above detectEventFamilies() for that separate issue) —
  // some of these (e.g. Evangelion, which debuted long before 15.4.0) were
  // never reliably コラボ-labeled in the first place, same category of gap
  // as the already-documented Sengoku Basara case below.
  //
  // FIX (2026-07-12): detectCollabUnitIds() now ALSO cross-checks every
  // GatyaDataSetR1.csv row against battlecatsultimate/bcu-assets'
  // lang/bot-GachaName.txt (the same file syncEventSets() already uses for
  // set names). That file has its own explicit, hand-maintained "Collab"
  // category block (IDs -2000 through at least -2033: Princess Punt, Fate,
  // Evangelion, Madoka Magica, Bikkuriman, Street Fighter, Hatsune Miku,
  // Ranma 1/2, Kunio-kun, Metal Slug, Tower of Saviors, Rurouni Kenshin,
  // Baki, Sonic the Hedgehog, Demon Slayer, and more) that doesn't depend on
  // BCData's raw Japanese label at all — this is a real, independent signal
  // rather than a guess, and isn't affected by the label-stripping issue
  // since it's keyed by row position, not label text. Older コラボ-labeled
  // banners (e.g. Sengoku Basara's "戦国武神バサラーズ" label, which never said
  // コラボ) may still not be in bcu-assets' collab block either if bcu-assets
  // itself doesn't classify that one as a "Collab" category — that's a
  // separate, harder case left for checkUnitClassificationCoverage() below
  // and manual review, not solved by this fix.
  const collabIds = detectCollabUnitIds(dataLocal, bcuNames);
  if (collabIds.size === 0) {
    console.log(
      "  ⚠ No コラボ-marked gacha banners found — GatyaDataSet*.csv may be missing or reformatted in this BCData snapshot, skipping"
    );
    logGatyaFileDiagnostics(dataLocal);
  } else {
    console.log(`  Detected ${collabIds.size} unit(s) across all-time コラボ-labeled and/or bcu-assets-tagged collab gacha banners`);

    // Only ever ADD isCollab/source info, never remove it — a unit confirmed
    // as collab (by this detector or the old hardcoded migration) stays
    // collab even if some future BCData snapshot's banner history looks
    // different (e.g. depth-limited history windows).
    const existing = await (prisma as any).unit.findMany({
      where: { unitNumber: { in: [...collabIds] } },
      select: { unitNumber: true, isCollab: true, source: true },
    });

    const overridden = existing.filter((u: any) => MANUALLY_VERIFIED_NOT_COLLAB.has(u.unitNumber));
    if (overridden.length > 0) {
      console.log(
        `  ⚠ Skipping ${overridden.length} unit(s) matched by this run's collab signal but manually verified NOT a real collab: ${overridden.map((u: any) => `#${u.unitNumber}`).join(", ")}`
      );
    }

    const toFlag = existing.filter((u: any) => (!u.isCollab || !u.source) && !MANUALLY_VERIFIED_NOT_COLLAB.has(u.unitNumber));
    if (toFlag.length === 0) {
      console.log("  All detected collab units already flagged — nothing to update");
    } else {
      for (const u of toFlag) {
        await (prisma as any).unit.update({
          where: { unitNumber: u.unitNumber },
          data: {
            isCollab: true,
            source: u.source ?? "EVENT_CAPSULE",
          },
        });
      }
      console.log(
        `  ✓ Flagged ${toFlag.length} newly-detected collab unit(s) as isCollab (source defaulted to EVENT_CAPSULE where unset)`
      );
    }
  }

  // Separate, independent backfill: some units may already be isCollab=true
  // (from the old hardcoded migration or a past manual edit) but never got a
  // `source` set at all, which would still render "How to Obtain: Unknown"
  // in the UI despite being correctly flagged as collab. Safe to fix
  // unconditionally — a unit that's definitely collab but missing a source
  // should always fall back to the generic "Collab" label.
  const missingSource = await (prisma as any).unit.findMany({
    where: { isCollab: true, source: null },
    select: { unitNumber: true },
  });
  if (missingSource.length > 0) {
    await (prisma as any).unit.updateMany({
      where: { isCollab: true, source: null },
      data: { source: "EVENT_CAPSULE" },
    });
    console.log(
      `  ✓ Backfilled source="EVENT_CAPSULE" for ${missingSource.length} previously-flagged collab unit(s) that were missing a source`
    );
  }
}

// ── Event/Gacha Set Assignment from Banner Debut History ───────────────────
//
// Beyond collab detection, units should also get tied to their real gacha
// "set" (e.g. Hanzo the Betrothed → "June Bride", Fuma Kotaro → "Sengoku
// Wargods Vajiras") instead of showing "How to Obtain: Unknown" forever.
// BCData has no clean structured English name for gacha events (checked:
// no series/theme data file, no per-banner title resource — only
// occasional unstructured mentions buried in Mission_Name.csv prose), so
// this can't auto-translate a BRAND NEW event's name out of thin air. But
// it CAN reliably detect which units belong to the SAME real event as each
// other, which is enough to solve the common case: a new unit added to an
// event that already has a curated English name in the database (like
// June Bride) gets that same name automatically, with zero translation.
//
// How: track each unit's first-ever appearance across BCData's full banner
// history (GatyaDataSet{E,N,R}1.csv, in chronological file order). A naive
// "which banners does this unit share with others" approach doesn't work —
// verified against real data that even restricted to Uber/Legend Rare
// tier, how many historical banners a unit appears in is a smooth,
// unbroken continuum from 1 to 373 with no natural cutoff, because units
// get folded into the ever-growing "everyone pull from here" pool the
// longer they've existed. That signal mostly measures unit AGE, not what
// event it belongs to. Looking only at each unit's DEBUT row sidesteps
// this entirely: the other units debuting in that exact same historical
// row are precisely its real event co-members, with none of the
// accumulated-filler noise. Reruns/expansions of the same event are then
// grouped together by their cleaned banner label (stripping version tags,
// row-index prefixes, and variant annotations like "+4 characters").
//
// Strictly additive and conservative:
//   - Only fills a unit's setName/banners if currently null.
//   - Only when at least one OTHER member of its detected event family
//     already has a curated setName in the database — never invents a new
//     English name, never overwrites existing data.
//   - If no member has a curated name, falls back to a static, hand-curated
//     translation table (scripts/data/gacha-event-names.ts, sourced from
//     real wiki data) before giving up. Event families that still have no
//     name after that are logged for one-time manual naming (translate
//     once, it propagates from then on).
//   - If a family's members have DIFFERENT existing setNames, that's left
//     alone and logged as a possible mislabeling for manual review instead
//     of guessed at — this is exactly the shape of bug reported for "The
//     Almighties" vs "Uber Fest" and Vega vs the Street Fighter banner.
//   - Does NOT attempt to fix a family that's already consistently (but
//     possibly wrongly) labeled — e.g. a whole set of units incorrectly
//     but uniformly tagged with a bogus legacy name like "Ototo Corps"
//     wouldn't be touched by this pass, since there's no internal
//     inconsistency to flag. That's a separate, harder audit problem
//     (comparing existing labels against the real derived clusters. rather
//     than just checking for gaps/conflicts) left for a future pass.
//
// IMPORTANT — discovered 2026-07-11: as of BCData EN 15.4.0, the trailing
// "// <japanese label>" developer comment is gone from every single row in
// GatyaDataSet{E,N,R}1.csv, including old historical rows that definitely
// had one before (confirmed by diffing raw file content directly).
// Ponos/fieryhenry stripped these retroactively, not just going forward.
// This breaks two things structurally, not just cosmetically:
//   1. detectCollabUnitIds()'s コラボ-marker check can never match anything
//      again — there's no label left to search. Existing isCollab flags
//      are unaffected (additive-only), but no NEW collab could be
//      auto-detected via this method going forward.
//      UPDATE 2026-07-12: a different signal was found after all —
//      battlecatsultimate/bcu-assets' lang/bot-GachaName.txt (see the big
//      comment on syncCollabFlags()) has its own explicit "Collab" category
//      block, independent of BCData's label text entirely. detectCollabUnitIds()
//      now cross-checks every GatyaDataSetR1.csv row against it in addition
//      to the コラボ marker, closing this gap for real going forward.
//   2. Every row's label cleans down to "", so the static translation
//      table (scripts/data/gacha-event-names.ts) and syncBannerMembership()
//      can never resolve a NEW family name either — there's nothing left
//      to look up in the dictionary.
// What's still salvageable without any label at all: units debuting
// together in the exact same historical row can still inherit an already-
// curated setName from a same-row sibling, since that only requires
// knowing which unit IDs co-occurred, not what the row was called. That's
// why unlabeled rows are still tracked below (via a synthetic per-row key
// instead of being dropped) — this is what would resolve a case like Fuma
// Kotaro if he shares a debut row with an already-named Sengoku Wargods
// Vajiras member. It just can't invent an English name for a brand new,
// never-before-seen event anymore; those get flagged for manual naming
// same as always.
interface DebutEvent {
  newUnitIds: number[];
  cleanedLabel: string; // "" when the source row has no label at all (see note above)
  sourceFile: string;
  rowIndex: number; // 0-based line index within sourceFile
}

// BCU_GACHA_NAME_URL (2026-07-12) — supersedes the earlier Ponos public-HTML
// experiment (removed; it went 0-for-10 against real unresolved families in
// production, confirming it only covers current/very-recent banners, not
// history). This is a fundamentally better source: battlecatsultimate/
// bcu-assets is a plain public GitHub repo (no auth, no submodule needed —
// found by asking the user to fetch battlecatsultimate/BCU_java_util_common
// directly, which revealed the actual asset-download URLs in
// common.io.assets.UpdateCheck) holding a hand-curated, community-maintained,
// ID-keyed English name for every rare-tier gacha row since the file began.
// Format per line (tab-separated): a numeric row ID (0-based, identical
// numbering to GatyaDataSetR1.csv's raw line index — confirmed by
// cross-checking known rows: 992 -> "-7" i.e. category -7, which resolves to
// "The Almighties", exactly matching this session's independent wiki-sourced
// fix; 1043/1044 -> "-2" i.e. "Wargods Vajiras", matching the Fuma Kotaro
// fix; 1065 -> "-115" i.e. "June Bride Gacha", matching the Hanzo the
// Betrothed fix) followed by EITHER a literal English name, or a negative
// integer referencing one of the permanent category rows at the top of the
// file (e.g. -7 = "The Almighties", -2 = "Wargods Vajiras") which itself
// resolves to the real name. A third column (row numbers, or a "//comment")
// is ignored here — not needed for name resolution.
//
// Scope: the plain-integer (rare-tier / GatyaDataSetR1.csv) rows AND the
// "E<n>"-prefixed (special-tier / GatyaDataSetE1.csv) rows are both parsed —
// N<n>-prefixed rows are still skipped (confirmed genuinely generic: every
// single N-tier entry in the file is "Item/Catfruit/Catamin/Cats Eye/Lucky
// Ticket/G Ticket Capsules", nothing unit-specific).
//
// E-tier was ORIGINALLY assumed to be "overwhelmingly generic" too and left
// out entirely — that assumption was wrong. Verified 2026-07-12 two
// independent ways against the frozen pre-15.4.0 GitHub mirror (which still
// has BCData's original Japanese labels, unlike the live Forgejo source —
// see cloneOrPull()'s comment for why that mirror is never used for actual
// syncing, only safe to read here as a one-off manual cross-check):
//   - GatyaDataSetE1.csv row 39 (0-based): "796,797,798,-1, //39:【14.3.0】
//     刃牙（伝説のダンベル）" — 刃牙 is literally "Baki" — matches bcu-assets'
//     "E39\tBaki Hanma Capsules" exactly.
//   - GatyaDataSetE1.csv row 41: "…ねこなつパラダイス編…" ("Cat Summer
//     Vacation, Paradise Edition") — matches bcu-assets' "E41\tSummer Break
//     Capsules Paradise" exactly, and independently confirmed by the Battle
//     Cats Wiki's own "Maneki Cat" page, which names "Summer Break Cats
//     Paradise" as one of Maneki Cat's two real gachas.
// Same numbering scheme as the plain-integer rows: "E<n>" is the 0-based
// raw line index within GatyaDataSetE1.csv specifically, not a separate ID
// space that happens to share the "E" prefix with something else.
const BCU_GACHA_NAME_URL = "https://raw.githubusercontent.com/battlecatsultimate/bcu-assets/master/lang/bot-GachaName.txt";

export interface BcuGachaNames {
  r: Map<number, string>; // GatyaDataSetR1.csv row index -> resolved name
  e: Map<number, string>; // GatyaDataSetE1.csv row index -> resolved name
}

export async function fetchBcuGachaNameMap(): Promise<BcuGachaNames | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    const res = await fetch(BCU_GACHA_NAME_URL, { signal: controller.signal });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const text = await res.text();
    const categoryNames = new Map<number, string>();
    const rowRefsR = new Map<number, { name?: string; ref?: number }>();
    const rowRefsE = new Map<number, { name?: string; ref?: number }>();

    for (const line of text.split("\n")) {
      const cols = line.split("\t").map((c) => c.trim());
      if (cols.length < 2 || cols[0] === "") continue;

      const rawId = cols[0];
      const second = cols[1];
      const ref = Number(second);
      const entry = Number.isFinite(ref) && ref < 0 ? { ref } : second ? { name: second } : null;

      if (rawId.startsWith("E")) {
        const eId = Number(rawId.slice(1));
        if (Number.isFinite(eId) && entry) rowRefsE.set(eId, entry);
        continue;
      }
      if (rawId.startsWith("N")) continue; // confirmed generic, see comment above

      const id = Number(rawId);
      if (!Number.isFinite(id)) continue;

      if (id < 0) {
        // Category header row, e.g. "-7\tThe Almighties\t//Gods" — shared
        // across both R-tier and E-tier row references.
        categoryNames.set(id, second);
      } else if (entry) {
        // Row-instance line, e.g. "643\t-8\t632" (references category -8) or
        // "100\tThe Dynamites" (literal name directly).
        rowRefsR.set(id, entry);
      }
    }

    function resolveAll(rowRefs: Map<number, { name?: string; ref?: number }>): Map<number, string> {
      const resolved = new Map<number, string>();
      for (const [rowId, entry] of rowRefs.entries()) {
        if (entry.name) {
          resolved.set(rowId, entry.name);
        } else if (entry.ref !== undefined && categoryNames.has(entry.ref)) {
          resolved.set(rowId, categoryNames.get(entry.ref)!);
        }
      }
      return resolved;
    }

    return { r: resolveAll(rowRefsR), e: resolveAll(rowRefsE) };
  } catch {
    return null;
  }
}

function cleanBannerLabel(label: string): string {
  return label
    .replace(/^\d+:\s*/, "") // leading row-index prefix "214:"
    .replace(/NG/g, "") // "NG" marker
    .replace(/【[^】]*】/g, "") // version tag 【6.6.0】
    .replace(/『[^』]*』/g, "") // sub-variant bracket 『+4キャラ』
    .replace(/（[^）]*）/g, "") // full-width parenthetical notes
    .replace(/\([^)]*\)/g, "") // half-width parenthetical notes
    .replace(/\+\s*\d+\s*(キャラ|文字|人)/g, "") // unbracketed "+4キャラ" suffix
    .replace(/(統合版|支援隊入り)/g, "") // consolidated/support-unit-added suffixes
    .replace(/\s*第[一二三四五六七八九十]+弾\s*/g, "") // "Part 2/3/5" installment suffix (e.g. Merc Storia reruns)
    .replace(/[★☆✩✪✫✬✭✮✯✰⭐]/g, "") // star glyph variants (e.g. Madoka★Magica vs Madoka☆Magica)
    .trim();
}

export interface FamilyProvenance {
  sourceFile: string;
  rowIndex: number;
}

// GatyaDataSetN1.csv rows are still scanned below (for `seen` tracking
// only — so a unit whose real debut is in N1 never gets misattributed as
// "newly debuting" if it also happens to appear in a later E1/R1 row), but
// deliberately never produce a debutEvent/family of their own. N1 is the
// basic "Normal Cat Capsule," not a themed event, and grouping its debut
// rows into "families that need a setName" is a category error, not a
// missing translation. Confirmed 2026-07-12 directly against the Battle
// Cats Wiki's own "Cat Release Order" page: two units that kept showing up
// as example members of "no label in source data" unresolved families
// (Axe Cat, unit #2; Lizard Cat, unit #7) are both plain Normal-rarity
// units obtained via "Empire of Cats — requires 0/7,000 XP or a Normal Cat
// Capsule to unlock," nothing to do with any real-world or seasonal gacha
// event. Every such unit was going to sit in the "needs manual naming" log
// forever (there's no real English event name to give it — it isn't an
// event), permanently cluttering that warning with false positives instead
// of genuine gaps. The other several units in the same unresolved families
// (Maneki Cat, Baozi Cat, etc.) are the real remaining gap — see the E-tier
// fix on fetchBcuGachaNameMap() for those. detectCollabUnitIds() is
// unaffected by this and still scans all three files from GATYA_SET_FILES —
// no evidence of a similar false-positive there, so left as-is rather than
// speculatively changed.
const NON_EVENT_GATYA_FILES = new Set<string>(["GatyaDataSetN1.csv"]);

export function detectEventFamilies(dataLocal: string): {
  families: Map<string, Set<number>>;
  provenance: Map<string, FamilyProvenance>;
} {
  const seen = new Set<number>();
  const debutEvents: DebutEvent[] = [];

  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) continue;
    const rows = parseGatyaSetFile(readFileSync(filePath, "utf-8"));
    for (const row of rows) {
      // Generic "everything so far" catch-up banners would otherwise mark
      // hundreds of old units as "new" the first time one appears,
      // corrupting every subsequent debut comparison — track their
      // membership as already-seen without treating any of it as a debut.
      if (/ALL/i.test(row.label)) {
        for (const id of row.unitIds) seen.add(id);
        continue;
      }
      const newUnitIds = row.unitIds.filter((id) => !seen.has(id));
      for (const id of row.unitIds) seen.add(id);
      if (newUnitIds.length > 0 && !NON_EVENT_GATYA_FILES.has(file)) {
        // Previously this dropped the debut entirely when cleanedLabel was
        // empty. As of BCData EN 15.4.0 that's every row (see note above),
        // so dropping here would zero out event detection completely. Keep
        // the debut either way — an empty label just means this row can
        // only resolve via an already-curated name on a same-row sibling,
        // never via the static dictionary (nothing to look up).
        debutEvents.push({
          newUnitIds,
          cleanedLabel: cleanBannerLabel(row.label),
          sourceFile: file,
          rowIndex: row.rawLineIndex,
        });
      }
    }
  }

  const families = new Map<string, Set<number>>();
  const provenance = new Map<string, FamilyProvenance>();
  let unlabeledIndex = 0;
  for (const ev of debutEvents) {
    // Rows with no label can't be safely merged with each other just
    // because they share the same "" key — that would incorrectly treat
    // every unlabeled historical debut across all of time as one giant
    // family. Give each its own synthetic key instead, so grouping only
    // ever happens within a single real historical row.
    const key = ev.cleanedLabel || `__unlabeled_${unlabeledIndex++}`;
    if (!families.has(key)) families.set(key, new Set());
    const fam = families.get(key)!;
    for (const id of ev.newUnitIds) fam.add(id);

    // Only unlabeled (synthetic-keyed) families ever map to a single real
    // row 1:1 — labeled families can span many historical rows merged
    // together, so there's no single row index to attribute to them.
    if (key.startsWith("__unlabeled_")) {
      provenance.set(key, { sourceFile: ev.sourceFile, rowIndex: ev.rowIndex });
    }
  }
  return { families, provenance };
}

// High-confidence aliases from BCU's category naming convention to our own
// existing DB naming convention, for the categories directly cross-checked
// against real migration text this session (avoids fragmenting an existing
// set into a second, differently-worded duplicate — e.g. BCU's "Wargods
// Vajiras" for what our DB has always called "Sengoku Wargods Vajiras").
// Deliberately does NOT include lower-confidence guesses (e.g. whether BCU's
// "Halloween Gacha"/"Easter Gacha"/"Summer Gals" are really the same thing as
// our "Halloween Capsules"/"Easter Carnival"/"Gals of Summer" or a distinct
// banner) — unmapped BCU names are used as-is, same as any brand-new name.
export const BCU_CATEGORY_ALIAS: Record<string, string> = {
  "Wargods Vajiras": "Sengoku Wargods Vajiras",
  "Galaxy Gals": "Cyber Academy Galaxy Gals",
  "Dragon Emperors": "Lords of Destruction Dragon Emperors",
  "Ultra Souls": "Ancient Heroes Ultra Souls",
  "Dark Heroes": "Justice Strikes Back! Dark Heroes",
  "Iron Legion": "Frontline Assault Iron Legion",
  "Girls & Monsters": "Girls & Monsters: Angels of Terror",
  "Elemental Pixies": "Nature's Guardians Elemental Pixies",
  "Luga Families": "Tales of the Nekoluga",
  Uberfest: "Uber Fest",
  Epicfest: "Epic Fest",
  "June Bride Gacha": "June Bride",
};

async function syncEventSets(prisma: PrismaClient, dataLocal: string, bcuNames: BcuGachaNames | null) {
  const { families, provenance } = detectEventFamilies(dataLocal);
  if (families.size === 0) {
    console.log("  ⚠ No event families detected — GatyaDataSet*.csv may be missing or reformatted, skipping");
    logGatyaFileDiagnostics(dataLocal);
    return;
  }
  console.log(`  Detected ${families.size} distinct event famil(y/ies) from banner debut history`);

  let filled = 0;
  let filledViaBcu = 0;
  const newFamilies: string[] = [];
  const conflicts: string[] = [];

  for (const [label, memberIds] of families.entries()) {
    if (memberIds.size < 2) continue; // a lone unit isn't a "set" to tie anything to

    const isUnlabeled = label.startsWith("__unlabeled_");
    const displayLabel = isUnlabeled ? "(no label in source data)" : `"${label}"`;

    const members = await (prisma as any).unit.findMany({
      where: { unitNumber: { in: [...memberIds] } },
      select: { unitNumber: true, name: true, setName: true, banners: true },
    });
    if (members.length === 0) continue;

    const namedSetNames = new Set(members.map((m: any) => m.setName).filter(Boolean));
    if (namedSetNames.size > 1) {
      // Previously only logged the two-or-more conflicting NAMES (e.g.
      // "Brainwashed Cats vs June Bride"), with no way to tell which actual
      // units were involved — useless for actually deciding which name is
      // right without a database query. Now groups every member by its
      // current setName so the log alone is enough to investigate (e.g.
      // cross-reference specific unit numbers against a wiki page), the
      // same evidence-first approach used for the Almighties fix.
      const bySetName = new Map<string, string[]>();
      for (const m of members) {
        if (!m.setName) continue;
        const list = bySetName.get(m.setName) ?? [];
        list.push(`${m.name} (#${m.unitNumber})`);
        bySetName.set(m.setName, list);
      }
      const detail = [...bySetName.entries()].map(([name, us]) => `"${name}": ${us.join(", ")}`).join("  |  ");
      conflicts.push(`${displayLabel} — ${detail}`);
      continue;
    }

    // No existing curated name on any member — fall back to the static
    // translation table (see scripts/data/gacha-event-names.ts) before
    // giving up and flagging this as needing manual naming. Synthetic
    // unlabeled keys never match the dictionary (nothing to look up),
    // so they always fall straight through to "needs manual naming".
    let resolvedName = namedSetNames.size === 1 ? ([...namedSetNames][0] as string) : GACHA_EVENT_NAMES[label];
    let viaBcu = false;

    if (!resolvedName && bcuNames) {
      // Only meaningful for a single-row (unlabeled) family whose row came
      // from the rare-tier or special-tier file — the only two numbering
      // schemes bot-GachaName.txt's "<int>" and "E<n>" rows are confirmed to
      // match (see the big comment above fetchBcuGachaNameMap()).
      const prov = provenance.get(label);
      const byRowIndex =
        prov?.sourceFile === "GatyaDataSetR1.csv" ? bcuNames.r : prov?.sourceFile === "GatyaDataSetE1.csv" ? bcuNames.e : null;
      const bcuName = prov ? byRowIndex?.get(prov.rowIndex) : undefined;
      if (bcuName) {
        resolvedName = BCU_CATEGORY_ALIAS[bcuName] ?? bcuName;
        viaBcu = true;
      }
    }

    if (!resolvedName) {
      newFamilies.push(`${displayLabel} (${members.length} units, e.g. ${members[0].name})`);
      continue;
    }
    const toUpdate = members.filter((m: any) => !m.setName);
    for (const m of toUpdate) {
      const banners: string[] = m.banners ?? [];
      await (prisma as any).unit.update({
        where: { unitNumber: m.unitNumber },
        data: {
          setName: resolvedName,
          banners: banners.includes(resolvedName) ? banners : [...banners, resolvedName],
        },
      });
      filled++;
      if (viaBcu) filledViaBcu++;
    }
  }

  if (filled > 0) {
    console.log(
      `  ✓ Assigned an existing set name to ${filled} previously-unclassified unit(s)` +
        (filledViaBcu > 0 ? ` (${filledViaBcu} via battlecatsultimate/bcu-assets)` : "")
    );
  } else {
    console.log("  No units needed a set assignment this run");
  }
  if (newFamilies.length > 0) {
    const preview = newFamilies.slice(0, 10).join("; ");
    const more = newFamilies.length > 10 ? " …and more" : "";
    console.log(`  ⚠ ${newFamilies.length} event famil(y/ies) have no existing curated name yet: ${preview}${more}`);
    console.log(`    → Translate and set Unit.setName manually for one member; it'll propagate to the rest next sync.`);
  }
  if (conflicts.length > 0) {
    console.log(`  ⚠ Possible mislabeling: ${conflicts.length} event famil(y/ies) have members with different existing set names:`);
    for (const c of conflicts) {
      console.log(`    - ${c}`);
    }
    console.log(`    → Worth a manual look — one of these is likely wrong (e.g. a unit filed under the wrong banner).`);
  }
}

/**
 * syncEventSets() above only looks at each unit's very FIRST historical
 * banner appearance (its "debut"), which is exactly right for assigning a
 * unit's home setName. But units are routinely re-offered later in
 * completely different, unrelated banners (evergreen pools like Uber Fest,
 * Best of the Best, and Selection-type events all draw from previously-
 * debuted units) — the `banners` array exists specifically to capture ALL
 * of these, not just the debut one.
 *
 * A Reddit report ("the UBERFEST filter shows Uber Fest AND Almighties
 * together" / "the Almighties filter is very strange") turned out to be
 * real, but not for the reason first assumed. This took FOUR passes to
 * get right (2026-07-11 – 2026-07-12) — recorded here so it isn't
 * re-litigated:
 *
 *   - Pass 1 (20260711000007): guessed that 12 Uber Fest units (257, 258,
 *     259, 271, 272, 316, 439, 493, 534, 642, 723, 811) also belonged under
 *     "The Almighties" and added the tag. Reverted (20260711000008) after
 *     re-reading 20260304000027's own comment ("No additional units needed
 *     since UBERFEST exclusives already get it from setName") as evidence
 *     the overlap didn't exist.
 *   - Pass 2 turned out to be the wrong call. The wiki's dedicated gacha
 *     event page ("The Almighties: The Majestic Zeus") lists exactly those
 *     same 12 units by name (Thunder God Zeus, Anubis the Protector,
 *     Radiant Aphrodite, Shining Amaterasu, Splendid Ganesha, Wrathful
 *     Poseidon, Empress Chronos, Hades the Punisher, Lucifer the Fallen,
 *     Lightmother Aset, Victorious Skanda, Gaia the Creator) — and beyond
 *     doubt, each one's own THIRD evolved form (20260303000022) is literally
 *     named "Almighty Zeus" / "Almighty Anubis" / "Almighty Amaterasu" /
 *     "Almighty Ganesha" / "Almighty Poseidon" / "Almighty Hades" /
 *     "Almighty Lucifer" / "Almighty Aset". These 12 really are Almighties,
 *     restored via setName='The Almighties' in 20260711000009 — which ALSO
 *     kept a 'Uber Fest' banners[] tag on them, on the unverified assumption
 *     they were still currently offered from that evergreen pool too.
 *   - Pass 4 (20260712000001) removed that tag. A live screenshot of the
 *     app's own Uber Fest filter showed all 12 "Almighty X" units mixed in
 *     with genuine Uber Fest exclusives — i.e. the exact original bug,
 *     reintroduced by pass 3's unverified assumption. There's no confirmed
 *     evidence these 12 are currently drawn from Uber Fest at all; "The
 *     Almighties" is their only real home.
 *   - Meanwhile 466, 731, 738, 830, 837 (Black Zeus, Daybreaker Izanagi,
 *     Izanami of Dusk, Raclesa the Lioness, Squire Luno) — a totally
 *     unrelated group that 20260303000026 had separately mislabeled
 *     "The Almighties" in a single erroneous statement — do NOT belong
 *     there at all (none appear on the real Almighties wiki page, and none
 *     of their evolved names contain "Almighty"). Confirmed directly from
 *     each unit's own wiki page for Black Zeus (Bikkuriman Collaboration)
 *     and Raclesa (Cyber Academy Galaxy Gals); restored all 5 to their
 *     last known-good pre-20260303000026 classification in 20260711000009.
 *
 * What this function DOES legitimately resolve: units that are re-offered
 * later in unrelated evergreen banners (Best of the Best, RoyalFest,
 * Busters, etc.) with a currently-resolvable label. It scans EVERY
 * historical banner row (not just debuts) and, for any row whose cleaned
 * label has a resolved English name (via the same static translation
 * table, or reuses an already-curated name it can recognize), adds that
 * name to the `banners` array of every member who's missing it — strictly
 * additive, never touches setName, never removes an existing banners
 * entry.
 */
async function syncBannerMembership(prisma: PrismaClient, dataLocal: string) {
  const additions = new Map<number, Set<string>>();

  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) continue;
    const rows = parseGatyaSetFile(readFileSync(filePath, "utf-8"));
    for (const row of rows) {
      if (/ALL/i.test(row.label)) continue; // generic "everything so far" catch-up banners
      const cleaned = cleanBannerLabel(row.label);
      const resolvedName = GACHA_EVENT_NAMES[cleaned];
      if (!resolvedName) continue;
      for (const id of row.unitIds) {
        if (!additions.has(id)) additions.set(id, new Set());
        additions.get(id)!.add(resolvedName);
      }
    }
  }

  if (additions.size === 0) {
    console.log("  No resolvable banner rows found for full-history membership sync, skipping");
    return;
  }

  const units = await (prisma as any).unit.findMany({
    where: { unitNumber: { in: [...additions.keys()] } },
    select: { unitNumber: true, banners: true },
  });

  let updated = 0;
  for (const u of units) {
    const current: string[] = u.banners ?? [];
    const toAdd = [...(additions.get(u.unitNumber) ?? [])].filter((name) => !current.includes(name));
    if (toAdd.length === 0) continue;
    await (prisma as any).unit.update({
      where: { unitNumber: u.unitNumber },
      data: { banners: [...current, ...toAdd] },
    });
    updated++;
  }

  console.log(
    updated > 0
      ? `  ✓ Added missing banner membership(s) to ${updated} unit(s) from full historical banner data`
      : "  All detected banner memberships already present — nothing to update"
  );
}

// ── Source Backfill from the Cat Release Order Wiki Page ───────────────────
//
// Added 2026-07-13 after a direct user report: Hanzo the Betrothed (#862)
// already has setName "June Bride" (from syncEventSets()'s family-clustering)
// but still showed "How to Obtain: Unknown" in the app, because `source` and
// `setName` are two completely separate fields and nothing in this pipeline
// has ever auto-populated `source` for a unit obtained by anything OTHER
// than a real gacha capsule banner. Every single one of those cases this
// session (Kaoru Cat, Capsule Cat, Blue Shinobi, God, Masked Cat, Maiko Cat,
// Toy Machine Cat...) needed its own one-off manual migration — there was no
// general mechanism at all, just accumulating individual fixes.
//
// The Battle Cats Wiki's "Cat Release Order" page has a literal, structured
// "Obtaining method" column for every unit ID (already treated as ground
// truth read-only evidence by audit-obtain-methods.ts, which this reuses the
// same METHOD_PREFIX_MAP classification from — duplicated rather than
// imported, since audit-obtain-methods.ts also unconditionally runs main()
// at module load). Unlike isCollab, `source` is a mechanical read of a
// structured wiki column describing literally how the game hands you the
// unit — not a real-world-franchise judgment call — so this WRITES it
// automatically when unambiguous, rather than only logging a proposal for a
// human to type into a migration by hand. Deliberately scoped narrow:
//   - Only fills `source` when it's currently NULL — never overwrites.
//   - Only writes when every method line on the wiki resolves to the SAME
//     single source via METHOD_PREFIX_MAP — a multi-region unit with a
//     different method per region is left alone and logged as ambiguous
//     instead of guessed at.
//   - NEVER touches isCollab. A method line whose detail text matches
//     /collab/i is only ever logged as a lead for the existing
//     fetch-collab-verification-pages.ts pipeline to confirm — real-world
//     franchise status always needs a human/AI reading the unit's own wiki
//     page, same bar as everywhere else in this project.
//   - Only fills setName (when it's also null) if the wiki's own detail text
//     shares a significant word with an ALREADY-EXISTING setName in this DB
//     (the same word-overlap heuristic audit-obtain-methods.ts already uses)
//     — adopts that existing name rather than ever inventing a new label
//     from wiki phrasing, which is exactly the kind of fragmentation
//     migration 20260713000007 had to clean up after.
const RELEASE_ORDER_PAGE = "Cat_Release_Order";
const OBTAIN_METHOD_COLLAB_PATTERN = /collab/i;
const OBTAIN_METHOD_PREFIX_MAP: Array<[string, string]> = [
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
  // Added 2026-07-14 after the first live run of this function flagged
  // Helmet Cat (#833) and Giga-Nyan Rex (#836) as "unrecognized" despite
  // their wiki text literally reading "Catnip Challenges - 13th
  // Anniversary" — CATNIP_CHALLENGES is an existing, already-used `source`
  // value (see SOURCE_LABELS in UnitsClient.tsx and the 19-unit list in
  // migration 20260303000004), this prefix was just missing from the map.
  ["Catnip Challenges", "CATNIP_CHALLENGES"],
];

interface ReleaseOrderRow {
  unitNumber: number;
  name: string;
  methodLines: string[];
}

function normalizeWikiText(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

async function fetchWikiPageHtml(page: string): Promise<string> {
  const url =
    "https://battlecats.miraheze.org/w/api.php?action=parse&format=json&prop=text&redirects=1&page=" +
    encodeURIComponent(page);
  const res = await fetch(url, {
    headers: { "User-Agent": "battlecats-progress/1.0", Accept: "application/json" }, // Miraheze can be picky without a UA
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from parse API`);
  const json = (await res.json()) as any;
  if (json?.error) throw new Error(`parse API error: ${json.error.info ?? json.error.code}`);
  const html = json?.parse?.text?.["*"] as string | undefined;
  if (!html) throw new Error("parse API returned no HTML");
  return html;
}

function parseReleaseOrderRows(html: string): ReleaseOrderRow[] {
  const $ = load(html);
  const rows: ReleaseOrderRow[] = [];
  $("table tr").each((_, tr) => {
    const tds = $(tr).find("td");
    if (tds.length < 5) return; // header rows use <th>, every real row has 5 columns
    const unitNumber = Number(normalizeWikiText($(tds.get(0)).text()));
    if (!Number.isInteger(unitNumber)) return;
    const name = normalizeWikiText($(tds.get(2)).text());
    // Preserve line breaks inside the cell (some units have one method line
    // per region) before flattening to text.
    const methodCell = $(tds.get(4)).clone();
    methodCell.find("br").replaceWith("\n");
    const methodLines = methodCell
      .text()
      .split("\n")
      .map(normalizeWikiText)
      .filter((l) => l.length > 0);
    if (!name || methodLines.length === 0) return;
    rows.push({ unitNumber, name, methodLines });
  });
  return rows;
}

// "<Story name> - complete Chapter N: <subchapter>" is a distinct, clearly
// structured obtaining method (unlocked by clearing a specific story
// chapter) — confirmed on Cat God the Great (#437, "Cats of the Cosmos -
// complete Chapter 2: The Passion of Catgod") and Filibuster Cat X (#462,
// "Cats of the Cosmos - complete Chapter 3: ..."). Checked ahead of the
// fixed prefix list below since the varying story name (Cats of the
// Cosmos, The Aku Realms, etc.) can't itself be a static prefix.
const STORY_CHAPTER_CLEAR_RE = /^.+? - complete Chapter \d+/i;

function classifyObtainMethodLine(line: string): { source: string | null; detail: string; isCollabText: boolean } {
  if (STORY_CHAPTER_CLEAR_RE.test(line)) {
    return { source: "STORY_CHAPTER_CLEAR", detail: line, isCollabText: OBTAIN_METHOD_COLLAB_PATTERN.test(line) };
  }
  for (const [prefix, source] of OBTAIN_METHOD_PREFIX_MAP) {
    if (line.startsWith(prefix)) {
      const rest = line.slice(prefix.length).replace(/^\s*-\s*/, "").trim();
      return { source, detail: rest, isCollabText: OBTAIN_METHOD_COLLAB_PATTERN.test(rest) };
    }
  }
  return { source: null, detail: line, isCollabText: OBTAIN_METHOD_COLLAB_PATTERN.test(line) };
}

const SET_NAME_MATCH_STOPWORDS = new Set(["the", "of", "and", "event", "collaboration", "collab", "1/2"]);

function findExistingSetNameMatch(detail: string, allSetNames: string[]): string | null {
  const words = detail
    .toLowerCase()
    .replace(/[^a-z0-9\s/]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4 && !SET_NAME_MATCH_STOPWORDS.has(w));
  for (const setName of allSetNames) {
    const lower = setName.toLowerCase();
    if (words.some((w) => lower.includes(w))) return setName;
  }
  return null;
}

// ── Individual-Page Fallback for Units the Release Order Table Can't
//    Resolve ─────────────────────────────────────────────────────────────
// Added 2026-07-14 after the user compared our output against Superfeline's
// (#643) own wiki page: the Release Order table's Method column is a
// *summary* maintained separately from each unit's dedicated page, and can
// omit real context that page has — Superfeline's row just says "Cat
// Capsule - Cat Capsule+" with no mention that the capsule doesn't even
// become available until Cats of the Cosmos Chapter 3 is cleared, a detail
// only stated on Superfeline's own page. For any unit whose Release Order
// row doesn't resolve to a single known source, this fetches that unit's
// own wiki page (same title-building/paragraph-parsing approach as
// fetch-collab-verification-pages.ts — duplicated rather than imported,
// since that script also unconditionally runs main() at module load) and
// logs its intro paragraph alongside the ambiguous Release Order text, so
// whoever reviews the sync log next has the fuller picture in one place
// instead of needing to look each one up separately by hand. Best-effort
// and strictly read-only for this part — it only enriches the log line,
// it never writes `source` from this free-text page content, since intro
// prose is far less structured/reliable to parse than the Release Order
// table's own Method column.
const WIKI_SUFFIX: Record<string, string> = {
  NORMAL: "Normal_Cat",
  SPECIAL: "Special_Cat",
  RARE: "Rare_Cat",
  SUPER_RARE: "Super_Rare_Cat",
  UBER_RARE: "Uber_Rare_Cat",
  LEGEND_RARE: "Legend_Rare_Cat",
};

function wikiPageTitle(unitName: string, category: string): string {
  // Don't strip "&" — see UnitsClient.tsx's wikiUrl() for why (MediaWiki
  // preserves it, encodeURIComponent already escapes it correctly).
  const slug = unitName.replace(/\s+/g, "_").replace(/[#?]/g, "");
  const suffix = WIKI_SUFFIX[category] ?? "Cat";
  return `${slug}_(${suffix})`;
}

function extractIntroParagraph(html: string): string | null {
  const $ = load(html);
  // Strip the portable-infobox's <style> block first — otherwise its raw
  // CSS text lands inside a <p> in some page layouts and gets mistaken for
  // real prose (same issue documented in fetch-collab-verification-pages.ts).
  $("style, script").remove();
  for (const el of $("p").toArray()) {
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (text.length >= 15 && !/\{[^{}]*:[^{}]*;/.test(text)) return text;
  }
  return null;
}

function sleepMs(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function syncSourceFromReleaseOrder(prisma: PrismaClient) {
  let html: string;
  try {
    html = await fetchWikiPageHtml(RELEASE_ORDER_PAGE);
  } catch (e) {
    console.log(`  ⚠ Could not fetch Cat Release Order (${(e as Error).message}) — skipping source backfill this run`);
    reviewWarningCount += 1;
    return;
  }

  const rows = parseReleaseOrderRows(html);
  if (rows.length === 0) {
    console.log("  ⚠ Parsed 0 row(s) from Cat Release Order — table markup may have changed, skipping source backfill");
    reviewWarningCount += 1;
    return;
  }
  const byUnitNumber = new Map(rows.map((r) => [r.unitNumber, r]));
  console.log(`  Parsed ${rows.length} row(s) from the wiki table`);

  const candidates = await (prisma as any).unit.findMany({
    where: { source: null, excludeFromCollection: false },
    select: { unitNumber: true, name: true, setName: true, category: true },
  });

  const setNameRows = await (prisma as any).unit.findMany({
    where: { setName: { not: null } },
    select: { setName: true },
  });
  const allSetNames = [...new Set(setNameRows.map((u: any) => u.setName as string))] as string[];

  let filled = 0;
  let filledSetNameToo = 0;
  const stillAmbiguous: Array<{ unitNumber: number; name: string; category: string; methodLines: string[] }> = [];
  const collabLeads: string[] = [];

  for (const u of candidates) {
    const row = byUnitNumber.get(u.unitNumber);
    if (!row) continue; // no wiki row at all — left for checkUnitClassificationCoverage() to flag

    const classified = row.methodLines.map(classifyObtainMethodLine);
    const distinctSources = new Set(classified.map((c) => c.source));

    if (distinctSources.size !== 1 || classified[0].source === null) {
      stillAmbiguous.push({ unitNumber: u.unitNumber, name: u.name, category: u.category, methodLines: row.methodLines });
      continue;
    }

    const source = classified[0].source!;
    const updateData: Record<string, unknown> = { source };

    if (!u.setName) {
      const detail = classified.map((c) => c.detail).filter(Boolean).join(" / ");
      const existingMatch = detail ? findExistingSetNameMatch(detail, allSetNames) : null;
      if (existingMatch) {
        updateData.setName = existingMatch;
        updateData.banners = [existingMatch];
        filledSetNameToo++;
      }
    }

    await (prisma as any).unit.update({ where: { unitNumber: u.unitNumber }, data: updateData });
    filled++;

    if (classified.some((c) => c.isCollabText)) {
      collabLeads.push(
        `${u.name} (#${u.unitNumber}): wiki text mentions "collab" ("${row.methodLines.join(" | ")}") — source filled, isCollab left untouched, verify via the unit's own wiki page`
      );
    }
  }

  console.log(
    `  ✓ Filled source for ${filled} unit(s) from the wiki's obtaining method${filledSetNameToo > 0 ? ` (${filledSetNameToo} also matched to an existing setName)` : ""}`
  );

  if (stillAmbiguous.length > 0) {
    console.log(
      `  ⚠ ${stillAmbiguous.length} unit(s) have a wiki row but multiple/unrecognized obtaining method(s), needs a human look:`
    );
    // Best-effort: fetch each ambiguous unit's OWN wiki page and pull its
    // intro paragraph, since the Release Order table's Method column is a
    // summary that can omit context the dedicated page has (Superfeline
    // #643 is the confirmed case: its row just says "Cat Capsule - Cat
    // Capsule+" with no mention that the capsule is gated behind clearing
    // Cats of the Cosmos Chapter 3 — only that unit's own page says so).
    // Never blocks or fails the run on a fetch error — just falls back to
    // the terse Release Order text for that one unit.
    for (const u of stillAmbiguous) {
      const methodText = u.methodLines.join(" | ");
      let extra = "";
      try {
        const pageHtml = await fetchWikiPageHtml(wikiPageTitle(u.name, u.category));
        const intro = extractIntroParagraph(pageHtml);
        if (intro) extra = ` | own wiki page says: "${intro}"`;
      } catch {
        // Page fetch/parse failed (name mismatch, ampersand, page doesn't
        // exist, etc.) — fine, just report the Release Order text alone.
      }
      console.log(`    - ${u.name} (#${u.unitNumber}): "${methodText}"${extra}`);
      await sleepMs(400); // polite delay between individual page fetches, matches fetch-collab-verification-pages.ts
    }
    reviewWarningCount += stillAmbiguous.length;
  }

  if (collabLeads.length > 0) {
    console.log(`  ⚑ ${collabLeads.length} newly-source-filled unit(s) have collab-sounding wiki text:`);
    for (const c of collabLeads) console.log(`    - ${c}`);
    reviewWarningCount += collabLeads.length;
  }
}

/**
 * Backstop for isCollab, run AFTER setName/banners are fully resolved above.
 *
 * detectCollabUnitIds() (used by syncCollabFlags(), which runs much earlier
 * in main()) only ever looks at a unit's OWN raw debut row — the コラボ label
 * on that exact row, or that exact row's bcu-assets entry. But syncEventSets()
 * can give a unit a setName like "Street Fighter Collaboration" through a
 * completely different path: propagating an already-curated name from a
 * SIBLING family member's row, not from anything on the unit's own row at
 * all. Confirmed 2026-07-12 directly from the live app: Zangief Cat (#828)
 * correctly showed "How to Obtain: Street Fighter Collaboration" (from
 * setName) while still appearing in the "Hide Collab" filter, because
 * isCollab itself was never set — its own debut row never matched either
 * signal, only a sibling's did.
 *
 * Rather than chasing more individual raw-row edge cases indefinitely, this
 * closes the gap structurally: any unit whose FINAL, already-resolved
 * setName or banners[] entry says "Collab"/"Collaboration" is unambiguously
 * a real-world collab by definition, regardless of which code path put that
 * text there. Strictly additive (only sets isCollab=true, never unsets it)
 * and runs last so it sees every name resolved above, including ones filled
 * in this very run.
 */
async function syncCollabFlagsFromCuratedNames(prisma: PrismaClient) {
  const units = await (prisma as any).unit.findMany({
    where: { isCollab: false },
    select: { unitNumber: true, setName: true, banners: true, source: true },
  });

  const toFlag = units.filter(
    (u: any) =>
      !MANUALLY_VERIFIED_NOT_COLLAB.has(u.unitNumber) &&
      ((u.setName && COLLAB_NAME_PATTERN.test(u.setName)) || (u.banners ?? []).some((b: string) => COLLAB_NAME_PATTERN.test(b)))
  );

  if (toFlag.length === 0) {
    console.log("  No additional collab units found via setName/banners text — nothing to update");
    return;
  }

  for (const u of toFlag) {
    await (prisma as any).unit.update({
      where: { unitNumber: u.unitNumber },
      data: { isCollab: true, source: u.source ?? "EVENT_CAPSULE" },
    });
  }
  console.log(
    `  ✓ Flagged ${toFlag.length} additional collab unit(s) whose resolved setName/banners already said so (isCollab was never set)`
  );
}

/**
 * Surfaces units that will show "How to Obtain: Unknown" in the UI. That
 * text is driven by `source` ALONE (see UnitsClient.tsx's
 * `SOURCE_LABELS[unit.source ?? ""] ?? unit.source ?? "Unknown"` — setName
 * only renders as a smaller secondary line underneath, it's never a
 * fallback for the main line). This check used to require BOTH source AND
 * setName to be null, which completely missed exactly this case: Hanzo the
 * Betrothed (#862) already had setName "June Bride" from family-clustering,
 * but source was still null, so it silently showed "Unknown" in the app
 * without ever tripping this warning. Fixed 2026-07-13 after the user
 * caught it live. Now checks source alone — syncSourceFromReleaseOrder()
 * above runs first each sync and fills what it unambiguously can from the
 * wiki, so anything still null here after that genuinely needs a look.
 */
async function checkUnitClassificationCoverage(prisma: PrismaClient) {
  const unclassified = await (prisma as any).unit.findMany({
    // excludeFromCollection: false — a unit hidden from the entire app
    // (the "Spirit of X" summoned-ability entries) will never show
    // "How to Obtain: Unknown" to anyone regardless of its source/setName,
    // so it shouldn't clutter this warning. Confirmed 2026-07-13: without
    // this, all 21 Spirit units still showed up here even after being
    // excluded from every user-facing view.
    where: { isCollab: false, source: null, excludeFromCollection: false },
    select: { unitNumber: true, name: true, setName: true },
    orderBy: { unitNumber: "asc" },
  });

  if (unclassified.length === 0) {
    console.log("  Unit source coverage: OK (every non-collab unit has a source set)");
    return;
  }

  const preview = unclassified
    .slice(0, 15)
    .map((u: any) => `${u.name} (#${u.unitNumber})${u.setName ? ` [setName already: "${u.setName}"]` : ""}`)
    .join(", ");
  const more = unclassified.length > 15 ? ` …and ${unclassified.length - 15} more` : "";
  console.log(`  ⚠ ${unclassified.length} unit(s) have no source classification: ${preview}${more}`);
  console.log(
    `    → These will show "How to Obtain: Unknown" in the app regardless of setName. Set Unit.source manually if known.`
  );
  reviewWarningCount += unclassified.length;
}

// A unit name containing an actual Japanese character (hiragana, katakana,
// half-width katakana, or a CJK ideograph) almost certainly means BCData's
// EN Unit_Explanation file had no real translated entry for it and the raw
// JP text fell straight through — exactly what happened to unit #673
// ("ネコチーター" instead of "Cheetah Cat") before the user caught it from
// their own wiki screenshot. A name that's ENTIRELY digits and a single
// separator (e.g. "730_1", "771-1") is BCData's raw numeric-ID placeholder
// format — exactly what the original 21 "Spirit of X" units looked like
// before they were renamed. Both are real, previously-seen failure modes,
// not theoretical.
const NON_ENGLISH_CHAR_RE = /[぀-ヿ㐀-鿿･-ﾟ]/;
const RAW_ID_PLACEHOLDER_RE = /^\d+[-_]\d+$/;

/**
 * Coverage check added 2026-07-13, after fixing exactly two real instances
 * of this bug this session (the 21 Arena-era "Spirit of X" units, and
 * Cheetah Cat #673) with no automated way to have caught either one ahead
 * of a user noticing broken text in the app. Read-only — flags candidates
 * for a human/AI to confirm and add to UNIT_NAME_OVERRIDES/
 * EXTRA_NAME_OVERRIDES (or excludeFromCollection, if it turns out to be
 * another non-collectible summoned-ability entry rather than a real unit),
 * same as every other check in this file. Does not attempt to guess the
 * real English name itself — that always needs the unit's own wiki page.
 */
async function checkUnitNameSanity(prisma: PrismaClient) {
  const units = await (prisma as any).unit.findMany({
    select: { unitNumber: true, name: true },
    orderBy: { unitNumber: "asc" },
  });

  const suspicious = units.filter(
    (u: any) => NON_ENGLISH_CHAR_RE.test(u.name) || RAW_ID_PLACEHOLDER_RE.test(u.name.trim())
  );

  if (suspicious.length === 0) {
    console.log("  Unit name sanity: OK (no untranslated-looking or raw-placeholder names found)");
    return;
  }

  console.log(
    `  ⚠ ${suspicious.length} unit(s) have a name that looks untranslated or like a raw BCData placeholder (same failure mode as Cheetah Cat #673 and the original 21 "Spirit of X" units): ${suspicious
      .map((u: any) => `${u.name} (#${u.unitNumber})`)
      .join(", ")}`
  );
  console.log(
    `    → Confirm the real name on the unit's own wiki page, then add it to UNIT_NAME_OVERRIDES or EXTRA_NAME_OVERRIDES above (or excludeFromCollection, if it turns out to be a non-collectible summoned-ability entry, not a real unit).`
  );
  reviewWarningCount += suspicious.length;
}

/**
 * Reverse-direction check for the isCollab false-positive pattern found
 * 2026-07-13 (Li'l Cats, Summer Break Cats units, Scarf Cat, Spectral Goth
 * Vega, and 6 others before them) — all traced back to three March 2026
 * migrations that set isCollab=true from a unit's SOURCE type rather than
 * verified real-world franchise status. syncCollabFlags()/
 * syncCollabFlagsFromCuratedNames() are deliberately additive-only (never
 * unset isCollab), which correctly protects hand-verified TRUEs but also
 * means the regular sync never re-examines an EXISTING isCollab=true flag
 * against the same bcu-assets/コラボ evidence it uses to detect NEW ones.
 * This closes that gap using data this sync already has loaded, no new
 * data source needed — the two verification sources this project already
 * built (bcu-assets' Collab category block, cross-referenced here; the Cat
 * Release Order wiki page, cross-referenced by the separate
 * audit-obtain-methods.ts script) were always capable of this, they just
 * hadn't been pointed at the EXISTING list before.
 *
 * Read-only — logs findings, makes no writes. Two tiers, because bcu-assets
 * only has data for units obtained via a real gacha capsule banner
 * (GatyaDataSet{E,N,R}1.csv) — a unit obtained via stamp/login/drop/serial
 * code never appears in those files at all, collab or not, so its absence
 * there is NOT evidence either way:
 *   1. STRONG lead: the unit appears in gacha banner history at all, but
 *      none of those rows carry a コラボ label or a bcu-assets "Collab"
 *      category name. Since bcu-assets DOES have an opinion here and it's
 *      not "collab", this is real evidence, not just an absence of proof.
 *   2. WEAK lead: the unit never appears in any gacha banner row at all
 *      (obtained via stamp/login/drop/serial/unobtainable instead) — bcu-
 *      assets has no data on it whatsoever, so this only means "can't
 *      confirm via this source, check the unit's own wiki page instead."
 */
async function checkExistingCollabFlagsAgainstEvidence(
  prisma: PrismaClient,
  dataLocal: string,
  bcuNames: BcuGachaNames | null
) {
  const confirmedCollabIds = detectCollabUnitIds(dataLocal, bcuNames);

  // Every unit ID appearing anywhere in gacha banner history at all,
  // regardless of collab status — used to distinguish "bcu-assets checked
  // this and it's not collab" from "bcu-assets has no data on this unit."
  const idsWithGachaHistory = new Set<number>();
  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) continue;
    for (const row of parseGatyaSetFile(readFileSync(filePath, "utf-8"))) {
      for (const id of row.unitIds) idsWithGachaHistory.add(id);
    }
  }

  const flaggedCollabs = await (prisma as any).unit.findMany({
    where: { isCollab: true },
    select: { unitNumber: true, name: true, setName: true },
    orderBy: { unitNumber: "asc" },
  });

  const strongLeads: string[] = [];
  const weakLeads: string[] = [];
  for (const u of flaggedCollabs) {
    if (confirmedCollabIds.has(u.unitNumber) || MANUALLY_VERIFIED_NOT_COLLAB.has(u.unitNumber)) continue;
    // Already-recognized real-collab setName (ends in "Collaboration", or
    // one of the known-but-differently-worded exceptions like "Baki Hanma
    // Capsules") — its own gacha row not matching bcu-assets' Collab
    // category is a known coverage gap (see BCU_KNOWN_COLLAB_CATEGORIES),
    // not evidence of a false positive. Confirmed 2026-07-13: without this
    // filter, the entire real Street Fighter and Bikkuriman rosters showed
    // up as "strong lead" false alarms purely because their specific rows
    // predate/aren't covered by bcu-assets' own Collab block.
    if (u.setName && isBcuCollabName(u.setName)) continue;
    const entry = `${u.name} (#${u.unitNumber})${u.setName ? ` — setName: "${u.setName}"` : ""}`;
    if (idsWithGachaHistory.has(u.unitNumber)) {
      strongLeads.push(entry);
    } else {
      weakLeads.push(entry);
    }
  }

  console.log(
    `\n  ${strongLeads.length} unit(s) flagged isCollab=true have gacha banner history but NO コラボ/bcu-assets collab signal on any of their rows, AND no already-recognized real-collab setName either (strong lead, likely false positive — verify against the unit's own wiki page before correcting):`
  );
  for (const s of strongLeads) console.log(`    - ${s}`);

  console.log(
    `\n  ${weakLeads.length} unit(s) flagged isCollab=true have NO gacha banner history at all (weak lead — bcu-assets has no opinion either way, check the unit's own wiki page or the Cat Release Order audit instead):`
  );
  for (const w of weakLeads) console.log(`    - ${w}`);

  reviewWarningCount += strongLeads.length + weakLeads.length;
}

/**
 * Dedicated coverage check for Brainwashed Cats, added 2026-07-12 after
 * discovering checkUnitClassificationCoverage() above couldn't see this gap
 * at all — it only flags units with setName === null, but every Brainwashed
 * Cat unit already has a non-null setName (the old generic "Brainwashed
 * Cats" placeholder from a pre-BCData-automation migration), so it silently
 * passed that check even while still being wrong.
 *
 * The Battle Cats Wiki's Category:Brainwashed_Cats page confirms there are
 * exactly 9 Brainwashed lines, one per base Normal Cat (Cat, Tank, Axe,
 * Gross, Cow, Bird, Fish, Lizard, Titan). Only 4 of the 9 (Cow, Bird, Fish,
 * Lizard) have been corrected so far (20260712000002/20260712000003) — those
 * 4 got fixed specifically because they happened to share their real BCData
 * debut row with an already-differently-named sibling, which is what
 * surfaced them as a "possible mislabeling" conflict in the first place. The
 * other 5 apparently never got that lucky co-occurrence, so they've been
 * sitting on the generic "Brainwashed Cats" label indefinitely with no
 * detection path at all until now. This check can't safely assign each of
 * them a specific real seasonal name by itself (that needs the same kind of
 * direct evidence used for the first 4 — a wiki page or a confirmed debut
 * co-occurrence), so it just surfaces which ones still need that treatment.
 *
 * Extended 2026-07-12: for a lone debut (no co-occurring sibling at all —
 * turned out to be all 5 of the remaining units), syncEventSets() itself
 * never even looks up bcu-assets (it skips any row with `memberIds.size < 2`
 * as "not a real set to tie anything to"), so that live, actively-maintained
 * data source was never consulted for exactly the units that most needed it.
 * This check now does that lookup directly and prints whatever category
 * name bcu-assets has for that row as a LEAD (not an auto-applied fix — its
 * category names are still broad recurring buckets like "Halloween Gacha"
 * that may need the same kind of translation to this project's own naming
 * convention that BCU_CATEGORY_ALIAS already does for other categories, and
 * still deserve a wiki cross-check before a migration is written).
 */
async function checkBrainwashedCatsCoverage(
  prisma: PrismaClient,
  families: Map<string, Set<number>>,
  provenance: Map<string, FamilyProvenance>,
  bcuNames: BcuGachaNames | null
) {
  const brainwashed = await (prisma as any).unit.findMany({
    where: { name: { startsWith: "Brainwashed " } },
    select: { unitNumber: true, name: true, setName: true, banners: true },
    orderBy: { unitNumber: "asc" },
  });

  const stillGeneric = brainwashed.filter((u: any) => !u.setName || u.setName === "Brainwashed Cats");

  if (brainwashed.length === 0) {
    console.log("  ⚠ No units named \"Brainwashed ...\" found at all — check if the name prefix changed");
    reviewWarningCount += 1;
    return;
  }

  if (stillGeneric.length === 0) {
    console.log(`  Brainwashed Cats coverage: OK (all ${brainwashed.length} found units have a specific setName)`);
    return;
  }

  console.log(
    `  ⚠ ${stillGeneric.length}/${brainwashed.length} Brainwashed Cat unit(s) still have no specific seasonal setName: ${stillGeneric
      .map((u: any) => `${u.name} (#${u.unitNumber}, setName=${u.setName ? `"${u.setName}"` : "null"})`)
      .join(", ")}`
  );
  console.log(
    `    → Needs the same evidence-based treatment as the other 4 (a wiki page naming its real seasonal event, or a confirmed BCData debut co-occurrence) — not a guess.`
  );
  reviewWarningCount += stillGeneric.length;

  // Diagnostic (2026-07-12): the first 4 Brainwashed Cats were solved by
  // finding the ONE other already-named unit each shared its real BCData
  // debut row with. That evidence never surfaces in the "possible
  // mislabeling" log above unless the shared family has 2+ DIFFERENT
  // existing setNames — if these 5 debuted alongside units that are
  // themselves still unnamed, or alongside each other, nothing gets
  // flagged there at all even though the row itself is exactly the clue
  // needed. So: look up each of these 5 units' own debut family directly
  // (regardless of whether it was flagged as a conflict) and print every
  // sibling + its current setName, so a human can go find that debut
  // row's real event on the wiki the same way as before.
  const stillGenericIds = new Set(stillGeneric.map((u: any) => u.unitNumber));
  const familyByUnitId = new Map<number, string>();
  for (const [label, memberIds] of families.entries()) {
    for (const id of memberIds) {
      if (stillGenericIds.has(id)) familyByUnitId.set(id, label);
    }
  }

  console.log(`  Debut-family lookup for the ${stillGeneric.length} unresolved unit(s):`);
  for (const u of stillGeneric) {
    const label = familyByUnitId.get(u.unitNumber);
    if (!label) {
      console.log(`    - ${u.name} (#${u.unitNumber}): no debut family detected at all (not found in any GATYA_SET_FILES row)`);
      continue;
    }
    const prov = provenance.get(label);

    // A lone debut (no co-occurring sibling) is exactly the case
    // syncEventSets() itself skips (`memberIds.size < 2`) and so never
    // consults bcu-assets for. Do that lookup here instead -- same live
    // bcu-assets fetch already loaded this run, just applied to a row it
    // would otherwise never be checked against. This is a LEAD, not an
    // auto-applied fix: bcu-assets' category names here (e.g. "Halloween
    // Gacha", "Christmas Gacha") are themselves broad recurring buckets,
    // not necessarily this project's exact established setName for that
    // bucket (see BCU_CATEGORY_ALIAS for precedent on needing to translate
    // bcu's raw category name to our own convention) -- still needs a wiki
    // cross-check before writing a migration, same evidence bar as always.
    let bcuLead: string | null = null;
    if (prov && bcuNames) {
      const byRowIndex = prov.sourceFile === "GatyaDataSetR1.csv" ? bcuNames.r : prov.sourceFile === "GatyaDataSetE1.csv" ? bcuNames.e : null;
      const raw = byRowIndex?.get(prov.rowIndex);
      if (raw) bcuLead = BCU_CATEGORY_ALIAS[raw] ?? raw;
    }

    const memberIds = [...(families.get(label) ?? [])].filter((id) => id !== u.unitNumber);
    if (memberIds.length === 0) {
      console.log(
        `    - ${u.name} (#${u.unitNumber}): debut row (${prov?.sourceFile ?? "?"} row ${prov?.rowIndex ?? "?"}) has no other members — debuted alone` +
          (bcuLead ? `; bcu-assets lead: "${bcuLead}" (verify against wiki before using)` : "; no bcu-assets entry for this row either")
      );
      continue;
    }
    const siblings = await (prisma as any).unit.findMany({
      where: { unitNumber: { in: memberIds } },
      select: { unitNumber: true, name: true, setName: true },
    });
    const siblingDetail = siblings
      .map((s: any) => `${s.name} (#${s.unitNumber}, setName=${s.setName ? `"${s.setName}"` : "null"})`)
      .join(", ");
    console.log(
      `    - ${u.name} (#${u.unitNumber}): shares debut row (${prov?.sourceFile ?? "?"} row ${prov?.rowIndex ?? "?"}) with: ${siblingDetail}` +
        (bcuLead ? `; bcu-assets lead: "${bcuLead}" (verify against wiki before using)` : "")
    );
  }
}

/**
 * Column position of the rarity field in unitbuy.csv, verified against
 * bcsfe (fieryhenry/BCSFE-Python — the actively maintained community
 * save editor) whose UnitBuyCatData class parses this exact column
 * using the same 0-indexed, no-header-row layout this script assumes.
 * See UnitBuyCatData.assign() in bcsfe/core/game/catbase/cat.py.
 */
const KNOWN_RARITY_COL = 13;

/**
 * Quick sanity check for the known-good rarity column position, so we
 * don't blindly trust it forever — if a future game update reshuffles
 * unitbuy.csv's columns again, this should catch it and trigger the
 * fallback heuristic scan below instead of silently applying garbage.
 */
function isSaneRarityColumn(values: number[]): boolean {
  if (values.length < 100) return false;
  if (!values.every((v) => v >= 0 && v <= 5)) return false;

  const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;

  // Battle Cats has hundreds of Super Rare and Uber Rare units — their
  // total absence (or near-absence) means this isn't the rarity column.
  if (counts[3] < 5 || counts[4] < 5) return false;

  // Normal cats are always a small, fixed handful (the original 9 cats
  // plus a couple of collab reclassifications) — never hundreds.
  if (counts[0] > 30) return false;

  return true;
}

function parseRarityMap(dataLocal: string, resLocal: string): Map<number, string> {
  const map = new Map<number, string>();

  // ── Strategy 0: Known-good column ───────────────────────────────────────
  // Try the verified column position first. This avoids re-deriving the
  // answer via heuristics on every sync, which is what caused a previous
  // false-negative — the heuristics rejected the correct column based on
  // unverified assumptions. Only fall through to the scanning strategies
  // below if this fails its sanity check (e.g. a future format change).
  const unitbuyPathKnown = path.join(dataLocal, "unitbuy.csv");
  if (existsSync(unitbuyPathKnown)) {
    const content = readFileSync(unitbuyPathKnown, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());
    if (lines.length > 100) {
      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      if (rows[0].length > KNOWN_RARITY_COL) {
        const colVals = rows.map((r) => r[KNOWN_RARITY_COL]);
        if (isSaneRarityColumn(colVals)) {
          for (let i = 0; i < colVals.length; i++) {
            const category = RARITY_MAP[colVals[i]];
            if (category) map.set(i, category);
          }
          console.log(`  ✓ Using known-good unitbuy.csv col ${KNOWN_RARITY_COL} (rarity) — sanity check passed`);
          console.log(`  Rarity distribution: ${summarizeRarity(map)}`);
          return map;
        }
        console.warn(`  ⚠ Known-good unitbuy.csv col ${KNOWN_RARITY_COL} failed sanity check — game format may have changed, falling back to column scan`);
      } else {
        console.warn(`  ⚠ unitbuy.csv only has ${rows[0].length} columns (expected >${KNOWN_RARITY_COL}) — falling back to column scan`);
      }
    }
  }

  // Try both data files and pick the best result
  const candidates: { source: string; col: number; score: number; values: number[] }[] = [];

  // ── Strategy 1: Parse unitbuy.csv ──────────────────────────────────────
  // unitbuy.csv has one row per unit (row index = unit ID).
  // One of its columns contains the rarity value (0-5).
  // The column index varies across game versions, so we auto-detect it.
  const unitbuyPath = path.join(dataLocal, "unitbuy.csv");
  if (existsSync(unitbuyPath)) {
    const content = readFileSync(unitbuyPath, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length > 9) {
      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.map((r) => r.length));
      console.log(`  unitbuy.csv: ${rows.length} rows, ${numCols} columns`);

      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        const allInRange = colVals.every((v) => v >= 0 && v <= 5);
        if (!allInRange) continue;

        // Normal cats (0-8) should have rarity 0 (Normal)
        const normalOk = colVals.slice(0, 9).every((v) => v === 0);
        if (!normalOk) continue;

        // Relaxed special check: at least 80% of units 9-56 should be 1 (Special).
        // PONOS may have reclassified a few units near the boundary.
        const specialSlice = colVals.slice(9, Math.min(57, colVals.length));
        const specialCount = specialSlice.filter((v) => v === 1).length;
        const specialOk = specialSlice.length > 0 && (specialCount / specialSlice.length) >= 0.8;
        if (!specialOk) continue;

        const distinctVals = new Set(colVals);
        // A real rarity column MUST have at least 5 distinct values (0-4 minimum;
        // Legend Rare (5) might be absent in very old versions but SR/UR never are)
        if (distinctVals.size >= 5) {
          const score = scoreRarityColumn(colVals);
          candidates.push({ source: "unitbuy.csv", col, score, values: colVals });
          console.log(`  unitbuy.csv col ${col}: ${distinctVals.size} distinct values, score=${score.toFixed(1)}`);
        } else {
          console.log(`  unitbuy.csv col ${col}: SKIPPED (only ${distinctVals.size} distinct values, need ≥5)`);
        }
      }
    }
  }

  // ── Strategy 2: Parse nyankoPictureBookData.csv ────────────────────────
  const pbPath = path.join(dataLocal, "nyankoPictureBookData.csv");
  if (existsSync(pbPath)) {
    const content = readFileSync(pbPath, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());

    if (lines.length > 9) {
      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.map((r) => r.length));

      console.log(`  nyankoPictureBookData.csv: ${rows.length} rows, ${numCols} columns`);
      let pbChecked = 0;
      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        const allInRange = colVals.every((v) => v >= 0 && v <= 5);
        if (!allInRange) continue;

        const normalOk = colVals.slice(0, 9).every((v) => v === 0);
        if (!normalOk) continue;

        pbChecked++;
        const distinctVals = new Set(colVals);
        // A real rarity column MUST have at least 5 distinct values
        if (distinctVals.size >= 5) {
          const score = scoreRarityColumn(colVals);
          candidates.push({ source: "nyankoPictureBookData.csv", col, score, values: colVals });
          console.log(`  nyankoPictureBookData.csv col ${col}: ${distinctVals.size} distinct values, score=${score.toFixed(1)}`);
        } else {
          console.log(`  nyankoPictureBookData.csv col ${col}: SKIPPED (only ${distinctVals.size} distinct values, need ≥5)`);
        }
      }
      console.log(`  nyankoPictureBookData.csv: checked ${pbChecked} columns with values 0-5 + normalOk`);
    }
  }

  // ── Strategy 3: Broad scan — relax all pre-filters, rely purely on scoring ─
  // If strategies 1 & 2 found nothing, the CSV format may have changed.
  // Scan ALL columns of unitbuy.csv with only the ≥5 distinct values requirement.
  if (candidates.length === 0) {
    console.log("  Strategy 3: Broad scan of unitbuy.csv (no normalOk/specialOk requirement)");
    const unitbuyPath2 = path.join(dataLocal, "unitbuy.csv");
    if (existsSync(unitbuyPath2)) {
      const content = readFileSync(unitbuyPath2, "utf-8");
      const lines = content.trim().split("\n").filter((l) => l.trim());
      if (lines.length > 9) {
        const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
        const numCols = Math.min(...rows.map((r) => r.length));

        for (let col = 0; col < numCols; col++) {
          const colVals = rows.map((r) => r[col]);
          const allInRange = colVals.every((v) => v >= 0 && v <= 5);
          if (!allInRange) continue;

          const distinctVals = new Set(colVals);
          if (distinctVals.size >= 5) {
            const score = scoreRarityColumn(colVals);
            candidates.push({ source: "unitbuy.csv(broad)", col, score, values: colVals });
            console.log(`  unitbuy.csv(broad) col ${col}: ${distinctVals.size} distinct, score=${score.toFixed(1)}`);
          }
        }
      }
    }
    // Also broad scan nyankoPictureBookData.csv
    const pbPath2 = path.join(dataLocal, "nyankoPictureBookData.csv");
    if (existsSync(pbPath2)) {
      const content = readFileSync(pbPath2, "utf-8");
      const lines = content.trim().split("\n").filter((l) => l.trim());
      if (lines.length > 9) {
        const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
        const numCols = Math.min(...rows.map((r) => r.length));

        for (let col = 0; col < numCols; col++) {
          const colVals = rows.map((r) => r[col]);
          const allInRange = colVals.every((v) => v >= 0 && v <= 5);
          if (!allInRange) continue;

          const distinctVals = new Set(colVals);
          if (distinctVals.size >= 5) {
            const score = scoreRarityColumn(colVals);
            candidates.push({ source: "nyankoPictureBookData.csv(broad)", col, score, values: colVals });
            console.log(`  nyankoPictureBookData.csv(broad) col ${col}: ${distinctVals.size} distinct, score=${score.toFixed(1)}`);
          }
        }
      }
    }
    if (candidates.length === 0) {
      console.warn("  Strategy 3 also found no candidates with ≥5 distinct values in range 0-5");
    }
  }

  // Pick the candidate with the highest score (minimum threshold: 100)
  // A score below 100 means the column is missing critical rarity tiers
  // and should not be trusted to overwrite existing data.
  const MIN_RARITY_SCORE = 100;

  if (candidates.length > 0) {
    candidates.sort((a, b) => b.score - a.score);
    const best = candidates[0];

    // Log all candidates for debugging
    for (const c of candidates) {
      const dist: Record<number, number> = {};
      for (const v of c.values) dist[v] = (dist[v] ?? 0) + 1;
      console.log(`  Candidate: ${c.source} col ${c.col} score=${c.score.toFixed(1)} dist=${JSON.stringify(dist)}`);
    }

    if (best.score >= MIN_RARITY_SCORE) {
      console.log(`  → Best rarity column: ${best.source} col ${best.col} (score=${best.score.toFixed(1)})`);

      for (let i = 0; i < best.values.length; i++) {
        const category = RARITY_MAP[best.values[i]];
        if (category) {
          map.set(i, category);
        }
      }
      console.log(`  Rarity distribution: ${summarizeRarity(map)}`);
      return map;
    } else {
      console.warn(`  ⚠ Best candidate score ${best.score.toFixed(1)} is below minimum threshold ${MIN_RARITY_SCORE}`);
      console.warn(`    Rejecting column to protect existing data. Distribution: ${JSON.stringify(
        Object.fromEntries(Object.entries(
          best.values.reduce((acc, v) => { acc[v] = (acc[v] ?? 0) + 1; return acc; }, {} as Record<number, number>)
        ))
      )}`);
    }
  }

  // ── Strategy 5: Fall back to older game versions ─────────────────────────
  // v15.4.0 removed rarity from CSV files. Try older versions in the BCData
  // repo which still had rarity in nyankoPictureBookData.csv.
  console.log("  Strategy 5: Searching older BCData versions for rarity data");
  const gameDataEnDir = path.join(CLONE_DIR, "game_data", REGION);
  if (existsSync(gameDataEnDir)) {
    const allVersions = readdirSync(gameDataEnDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && /^\d+\.\d+\.\d+$/.test(d.name))
      .map((d) => d.name)
      .sort(compareVersions)
      .reverse(); // newest first

    // Extract current version from dataLocal path
    const currentVersion = path.basename(path.dirname(dataLocal));
    console.log(`    Current version: ${currentVersion}, available: ${allVersions.join(", ")}`);

    for (const ver of allVersions) {
      if (ver === currentVersion) continue; // skip current (already failed)
      const oldDataLocal = path.join(gameDataEnDir, ver, "DataLocal");
      const oldPbPath = path.join(oldDataLocal, "nyankoPictureBookData.csv");
      if (!existsSync(oldPbPath)) continue;

      const content = readFileSync(oldPbPath, "utf-8");
      const lines = content.trim().split("\n").filter((l) => l.trim());
      if (lines.length < 100) continue;

      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.map((r) => r.length));

      // Try each column
      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        const allInRange = colVals.every((v) => v >= 0 && v <= 5);
        if (!allInRange) continue;

        const distinctVals = new Set(colVals);
        if (distinctVals.size < 3) continue;

        const score = scoreRarityColumn(colVals);
        if (score >= 100) {
          console.log(`    ✓ Found rarity in v${ver} nyankoPictureBookData.csv col ${col} (score=${score.toFixed(1)})`);
          const dist: Record<number, number> = {};
          for (const v of colVals) dist[v] = (dist[v] ?? 0) + 1;
          console.log(`      Distribution: ${JSON.stringify(dist)}`);
          console.log(`      Applying ${lines.length} rarity values from v${ver} to current units`);

          for (let i = 0; i < colVals.length; i++) {
            const category = RARITY_MAP[colVals[i]];
            if (category) map.set(i, category);
          }
          console.log(`    Rarity from older version: ${summarizeRarity(map)}`);
          return map;
        }
      }

      // Also try unitbuy.csv from older version
      const oldUbPath = path.join(oldDataLocal, "unitbuy.csv");
      if (existsSync(oldUbPath)) {
        const ubContent = readFileSync(oldUbPath, "utf-8");
        const ubLines = ubContent.trim().split("\n").filter((l) => l.trim());
        if (ubLines.length >= 100) {
          const ubRows = ubLines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
          const ubNumCols = Math.min(...ubRows.map((r) => r.length));
          for (let col = 0; col < ubNumCols; col++) {
            const colVals = ubRows.map((r) => r[col]);
            const allInRange = colVals.every((v) => v >= 0 && v <= 5);
            if (!allInRange) continue;
            const distinctVals = new Set(colVals);
            if (distinctVals.size < 5) continue;
            const score = scoreRarityColumn(colVals);
            if (score >= 100) {
              console.log(`    ✓ Found rarity in v${ver} unitbuy.csv col ${col} (score=${score.toFixed(1)})`);
              for (let i = 0; i < colVals.length; i++) {
                const category = RARITY_MAP[colVals[i]];
                if (category) map.set(i, category);
              }
              console.log(`    Rarity from older version: ${summarizeRarity(map)}`);
              return map;
            }
          }
        }
      }
      console.log(`    v${ver}: no rarity data found`);
    }
  }

  console.warn("  WARNING: Could not parse rarity from any version, using fallback guessRarity()");
  return map;
}

/**
 * Score a candidate rarity column by how realistic its distribution looks.
 *
 * A real rarity column should have:
 *   - All 6 rarity tiers present (0-5)
 *   - More Rares (2) than Super Rares (3)
 *   - More Super Rares (3) than Uber Rares (4)
 *   - More Uber Rares (4) than Legend Rares (5)
 *   - Legend Rares should be a small fraction of total
 *   - Units 57+ should have mixed rarities (not all the same)
 *
 * Higher score = more likely to be the real rarity column.
 */
function scoreRarityColumn(values: number[]): number {
  const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const v of values) counts[v] = (counts[v] ?? 0) + 1;

  let score = 0;
  const total = values.length;

  // Reward having all 6 rarity tiers present (strong signal)
  const tiersPresent = Object.values(counts).filter((c) => c > 0).length;
  score += tiersPresent * 15; // max 90 for all 6 tiers

  // HARD REQUIREMENT: Super Rare (3) and Uber Rare (4) MUST be present.
  // Battle Cats has hundreds of SR and UR units — any column missing them
  // is definitely wrong. This was the root cause of the NORMAL=748 bug
  // where a column with only 3 distinct values (0,1,2) was accepted.
  if (counts[3] === 0) score -= 200; // no Super Rare = definitely wrong
  if (counts[4] === 0) score -= 200; // no Uber Rare = definitely wrong

  // Reward Legend Rare being a small minority (it's always the rarest,
  // most exclusive tier, even as the game has grown).
  if (counts[5] > 0 && counts[5] < total * 0.1) score += 15;

  // NOTE: This function intentionally does NOT assume any particular
  // ordering or proportion between Rare/Super Rare/Uber Rare counts
  // (e.g. "Rare > Super Rare", "Uber Rare is 5-20% of total"). Those
  // assumptions don't hold for modern Battle Cats — after a decade of
  // gacha banners, Uber Rare is by far the LARGEST tier (300+ units),
  // easily exceeding both Rare and Super Rare.
  //
  // An earlier version of this function also hard-coded "ground truth"
  // checks assuming specific rarities for a few named units (Cat, Ninja
  // Frog Cat, Salon Cat, Fuma Kotaro). Those assumed values were wrong
  // and caused this scorer to reject the correct column. Verified
  // against bcsfe (fieryhenry/BCSFE-Python on Codeberg — the actively
  // maintained community save editor), whose UnitBuyCatData class
  // confirms unitbuy.csv column 13 is rarity, using the exact same
  // 0-indexed, no-header-row layout this script assumes. Do not
  // re-add per-unit assumptions without verifying against an
  // authoritative source first.

  // Penalize if units 57-200 are all the same value (wrong column)
  const midRange = values.slice(57, Math.min(200, values.length));
  const midDistinct = new Set(midRange).size;
  if (midDistinct <= 1) score -= 50;
  else if (midDistinct <= 2) score -= 20;
  else score += midDistinct * 2; // reward variety

  // Penalize if more than 80% of units after Special are the same rarity
  // (a real rarity column has a broad distribution)
  const postSpecial = values.slice(57);
  if (postSpecial.length > 0) {
    const maxCount = Math.max(...Object.entries(counts)
      .filter(([k]) => parseInt(k) >= 2)
      .map(([, v]) => v));
    if (maxCount / postSpecial.length > 0.8) score -= 40;
  }

  return score;
}

/** Summarize rarity distribution for logging */
function summarizeRarity(map: Map<number, string>): string {
  const counts: Record<string, number> = {};
  for (const v of map.values()) {
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return Object.entries(counts)
    .map(([k, v]) => `${k}=${v}`)
    .join(", ");
}

function guessRarity(unitNumber: number): string {
  // Fallback rarity using well-known unit ID ranges for Battle Cats EN.
  // Normal: 0–8, Special: 9–56, everything else defaults to RARE.
  // This is only used when the data files can't be parsed — the sync
  // will log a warning so it's visible in GitHub Actions.
  if (unitNumber <= 8) return "NORMAL";
  if (unitNumber <= 56) return "SPECIAL";
  return "RARE";
}

// ── Form Count Parsing ───────────────────────────────────────────────────────

function parseFormCountMap(dataLocal: string): Map<number, number> {
  const map = new Map<number, number>();

  // nyankoPictureBookData.csv: one row per unit (row index = unit ID).
  // One column encodes the number of forms shown in the Cat Guide (1-4).
  // We auto-detect this column by checking which one:
  //   1. Has all values in range [1, 4] (or [2, 4] for known multi-form units)
  //   2. Units 0-8 (Normal cats) all have value 3 (Normal/Evolved/True forms)
  //   3. Has reasonable distribution (not all the same value)
  const pbPath = path.join(dataLocal, "nyankoPictureBookData.csv");
  if (!existsSync(pbPath)) {
    console.warn("  WARNING: nyankoPictureBookData.csv not found — form counts unavailable");
    return map;
  }

  const content = readFileSync(pbPath, "utf-8");
  const lines = content.trim().split("\n").filter((l) => l.trim());
  if (lines.length < 10) return map;

  const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
  const numCols = Math.min(...rows.map((r) => r.length));

  let bestCol = -1;
  for (let col = 0; col < numCols; col++) {
    const colVals = rows.map((r) => r[col]);

    // All values must be in range [1, 6] (some units might have 5+ forms eventually)
    if (!colVals.every((v) => v >= 1 && v <= 6)) continue;

    // Units 0-8 (Normal cats: Cat through Titan Cat) all have 3 forms
    const normalOk = colVals.slice(0, 9).every((v) => v === 3);
    if (!normalOk) continue;

    // Should have at least 3 distinct values (1, 2, 3 at minimum)
    const distinct = new Set(colVals);
    if (distinct.size < 3) continue;

    // Should have a reasonable distribution — most units have 2 or 3 forms
    const count2 = colVals.filter((v) => v === 2).length;
    const count3 = colVals.filter((v) => v === 3).length;
    if (count2 + count3 > colVals.length * 0.3) {
      bestCol = col;
      break;
    }
  }

  if (bestCol >= 0) {
    console.log(`  Found form count in nyankoPictureBookData.csv column ${bestCol}`);
    for (let i = 0; i < rows.length; i++) {
      map.set(i, rows[i][bestCol]);
    }
    // Log distribution
    const dist: Record<number, number> = {};
    for (const v of map.values()) dist[v] = (dist[v] ?? 0) + 1;
    console.log(`  Form count distribution: ${Object.entries(dist).map(([k, v]) => `${k}-form=${v}`).join(", ")}`);
  } else {
    console.warn("  WARNING: Could not auto-detect form count column in nyankoPictureBookData.csv");
  }

  return map;
}

// ── Legend Stage Sync ────────────────────────────────────────────────────────
//
// Map_Name.csv has names for ALL map types (1200+ entries): SoL, UL, ZL,
// daily stages, events, collabs, etc.
//
// CRITICAL: UL and ZL entries are INTERLEAVED in Map_Name.csv (they were
// added simultaneously in alternating game updates). We CANNOT use contiguous
// index ranges for UL or ZL.
//
// Strategy:
//   - SoL: indices 0-48 (contiguous, confirmed, fixed at 49)
//   - UL:  all 49 names hardcoded, searched individually by name (fixed forever)
//   - ZL:  hardcoded known names, searched individually by name
//          (grows with game updates — forward scan picks up new ones)

// ── SoL: 49 subchapters, indices 0-48, fixed forever ─────────────────────
const SOL_EXPECTED_FIRST = "The Legend Begins";
const SOL_EXPECTED_LAST = "Laboratory of Relics";
const SOL_COUNT = 49;

// ── UL: 49 subchapters, fixed forever ─────────────────────────────────────
// UL entries are scattered across Map_Name.csv (the first 13 subchapters
// are at early indices, the rest are interleaved with ZL at indices 908+).
// All 49 names are hardcoded and searched individually.
const UL_NAMES: string[] = [
  "A New Legend",
  "Here Be Dragons",
  "The Endless Wood",
  "Primeval Currents",
  "Barking Bay",
  "Abyss Gazers",
  "Neo-Necropolis",
  "Law of the Wildlands",
  "Pararila Peninsula",
  "Coup de Chat",
  "Cherry Isles",
  "Depths of My Heart",
  "Ghost Sea",
  "Exile's Resort",
  "Roads of Torment",
  "Heaven's Back Alley",
  "Battle in the Bath",
  "Ancient Mountains",
  "Marine Ministry",
  "The Devils' Academy",
  "The Gelatin Mines",
  "Drunken Foundry",
  "Unearthed Artifacts",
  "Realm of Whyworry",
  "Pumping Titanium",
  "Morningstar Isle",
  "In the Sleeping Forest",
  "Laboratory Island",
  "Forgotten Graves",
  "Dawn of the Beginning",
  "The Happy Lucky Temple",
  "Theatre of Fear",
  "Diver's City",
  "Nasi-Go-Round",
  "DNA Plantation",
  "Ancient Forest Labyrinth",
  "Castle of the Sentinels",
  "Spacetime Distortion",
  "Imminent Disaster",
  "Bikura, Harbor of Evil",
  "Dead Heat Land",
  "Rose-Colored Road",
  "Behemoth's Peak",
  "Moodist Beach",
  "Cat-Chasing Village",
  "Bazaar of the Pirate King",
  "Between Truth and Lies",
  "Humanity Catified",
  "Sacred Forest",
];

// ── ZL: dynamic, grows with game updates ──────────────────────────────────
// These are in correct sort order. New subchapters are added at the end.
const ZL_KNOWN_NAMES: string[] = [
  "Zero Field",
  "The Edge of Spacetime",
  "Cats Cradle Basin",
  "The Ururuvu Journals",
  "New World Area: Ehen",
  "Cats of a Common Sea",
  "Truth in Extremes",
  "Demon of Deciliter Bay",
  "Garden of Wilted Thoughts",
  "Stratospheric Pathway",
  "Konjac Valley",
  "Candy Paradise",
  "Secluded Cavy Island",
  "Resort De La Cospa",
  "Restricted Area",
  "Cruise Ship Panic",
  "En Garde Shrine",
  "Forest Playground",
  "Newtown Trench",
  "Truth's Devouring Maw",
  "A Journey of Moments",
  "Patisserie Parklands",
  "Reverse Royal Grave",
  "Sleeping Chasm",
  "Forgotten Republic",
  "Booklet Islands",
  "Vainglorious Venture",
  "Phantasmagoria",
  "Muscle Empire",
  "Artisan's Sanctum",
  "Eden of Evolution",
  "New Horizon",
];

// Max ZL subchapters before we stop scanning for new ones
const ZL_MAX = 60;

// ── Crown counts per saga ──────────────────────────────────────────────────
// SoL and UL: all subchapters have 4 crowns (fully released).
// ZL: varies by subchapter and PONOS periodically raises the ceiling for
// older subchapters over time (Map_option.csv has this data but BCData
// doesn't extract it). ZL_TWO_CROWN_NAMES below is a known-good FLOOR from
// the last time this was hand-verified — fetchZlCrownMap() below scrapes the
// wiki's own "Available up to N♛ difficulty" note per subchapter so this
// stops silently drifting out of date the way it did before (bug report,
// 2026-07-16, bvg_tbc: 2-crown difficulty stopped at "New World Area" on the
// site but reaches "Garden of Wilted Thoughts" in the live game — this
// hardcoded set was still the original 5-name list from whenever ZL 2-crown
// difficulty was first introduced, never extended as PONOS kept raising it).
const SOL_MAX_CROWNS = 4;
const UL_MAX_CROWNS = 4;

// ZL subchapters with 2 crowns as of 2026-07-16 (the rest have 1) — used as
// the floor when the wiki scrape below is unavailable or fails to parse,
// and as a safety net getZlMaxCrowns() never regresses below even if the
// scrape returns something unexpected.
const ZL_TWO_CROWN_NAMES = new Set([
  "Zero Field",
  "The Edge of Spacetime",
  "Cats Cradle Basin",
  "The Ururuvu Journals",
  "New World Area: Ehen",
  "Cats of a Common Sea",
  "Truth in Extremes",
  "Demon of Deciliter Bay",
  "Garden of Wilted Thoughts",
]);

// Matches the wiki's own crown-difficulty note, e.g. "Available up to 2♛
// difficulty." — the crown symbol is a distinctive-enough anchor that this
// doesn't need to be scoped any more tightly than "the paragraph following
// a given Sub-chapter heading."
const ZL_CROWN_NOTE_RE = /Available up to (\d)♛/;

/**
 * Scrapes https://battlecats.miraheze.org/wiki/Legend_Stages' "Zero Legends"
 * section for each subchapter's "Available up to N♛ difficulty" note,
 * keyed by 1-based subchapter number (NOT name — ZL subchapter names have
 * known minor wording differences between BCData/our DB and the wiki, e.g.
 * "New World Area: Ehen" vs the wiki's "New World Ehen", but the ordinal
 * position of a given real-world subchapter is the same everywhere, so
 * joining on "Sub-chapter N" sidesteps that fuzzy-matching problem entirely).
 *
 * Best-effort: returns null on any fetch/parse failure so callers fall back
 * to the static ZL_TWO_CROWN_NAMES floor above rather than blocking the
 * whole sync or writing garbage crown counts.
 */
async function fetchZlCrownMap(): Promise<Map<number, number> | null> {
  try {
    const html = await fetchWikiPageHtml("Legend_Stages");
    const $ = load(html);

    // cheerio's .text() doesn't insert line breaks between sibling block
    // elements the way a browser's innerText would, so headings/paragraphs
    // are collected one at a time and joined with explicit newlines —
    // otherwise "Sub-chapter 9: Garden of Wilted Thoughts" would run
    // straight into the description paragraph that follows it with no
    // separator at all, breaking the regex below.
    const lines: string[] = [];
    let inSection = false;
    $("h2, h3, h4, p, li").each((_, el) => {
      const tag = ((el as any).tagName ?? "").toLowerCase();
      const text = normalizeWikiText($(el).text());
      if (!text) return;
      if (!inSection) {
        if ((tag === "h2" || tag === "h3") && text === "Zero Legends") inSection = true;
        return;
      }
      // Any other top-level heading (e.g. "Other Permanent Stages", which
      // directly follows the last ZL subchapter on both the Miraheze and
      // Fandom copies of this page) ends the section. "Sub-chapter N: ..."
      // entries are excluded from this check on purpose in case they turn
      // out to be headings themselves rather than plain paragraph text.
      if ((tag === "h2" || tag === "h3") && text !== "Zero Legends" && !/^Sub-chapter \d+/.test(text)) {
        inSection = false;
        return;
      }
      lines.push(text);
    });

    if (lines.length === 0) {
      console.warn("    Could not find a 'Zero Legends' heading on the wiki page — using static ZL_TWO_CROWN_NAMES fallback");
      return null;
    }

    const sectionText = lines.join("\n");
    const subchapterRe = /Sub-chapter (\d+): [^\n]+\n([\s\S]*?)(?=\nSub-chapter \d+:|$)/g;
    const crownMap = new Map<number, number>();
    let m: RegExpExecArray | null;
    while ((m = subchapterRe.exec(sectionText))) {
      const subchapterNum = Number(m[1]);
      const crownMatch = ZL_CROWN_NOTE_RE.exec(m[2]);
      if (crownMatch) crownMap.set(subchapterNum, Number(crownMatch[1]));
    }

    if (crownMap.size === 0) {
      console.warn("    Found the 'Zero Legends' section but no 'Available up to N♛ difficulty' notes — using static ZL_TWO_CROWN_NAMES fallback");
      return null;
    }
    console.log(`    Scraped crown difficulty for ${crownMap.size} Zero Legends sub-chapters from the wiki`);
    return crownMap;
  } catch (e: any) {
    console.warn(`    Failed to scrape Zero Legends crown data from the wiki (${e.message}) — using static ZL_TWO_CROWN_NAMES fallback`);
    return null;
  }
}

function getZlMaxCrowns(subchapterNum: number, name: string, wikiCrownMap: Map<number, number> | null): number {
  const floor = ZL_TWO_CROWN_NAMES.has(name) ? 2 : 1;
  const scraped = wikiCrownMap?.get(subchapterNum);
  // Never regress below the known-good static floor even if the scrape
  // returns something unexpected (e.g. a mis-scoped section boundary).
  return scraped !== undefined ? Math.max(scraped, floor) : floor;
}

// ── Great Advent milestone coverage check ───────────────────────────────────
// The "Milestone Stages" tab (Great Advent tier of the ADVENT category) is a
// hand-maintained list in src/lib/milestone-catalog.ts, not something this
// script writes to — Map_Name.csv is too noisy (difficulty variants, event
// maps, etc.) to safely auto-populate it. This just flags likely-new Great
// Advent stage names during each sync run so a new boss doesn't silently go
// unnoticed the way "Invasion of Poultrio" did. Keep this Set in sync with
// the "GREAT ADVENT" section of MILESTONE_CATALOG in milestone-catalog.ts.
const KNOWN_GREAT_ADVENT_MILESTONES = new Set([
  "Reign of the Tyrant",
  "Invasion of the Swamplord",
  "Hunt for the Xenobeast",
  "Jumbo Invasion",
  "Invasion of Poultrio",
]);
const GREAT_ADVENT_NAME_PATTERNS = [/^Invasion of /, /^Jumbo Invasion$/, /^Reign of /, /^Hunt for /];

function checkGreatAdventMilestoneCoverage(allNames: string[]) {
  const candidates = new Set(
    allNames.filter((nm) => GREAT_ADVENT_NAME_PATTERNS.some((re) => re.test(nm)))
  );
  const missing = [...candidates].filter((nm) => !KNOWN_GREAT_ADVENT_MILESTONES.has(nm));
  if (missing.length > 0) {
    console.log(
      `  ⚠ Possible new Great Advent stage(s) not in the Milestone Stages tab: ${missing.join(", ")}`
    );
    console.log(`    → Add to the "GREAT ADVENT" section of src/lib/milestone-catalog.ts`);
    reviewWarningCount += missing.length;
  } else {
    console.log(
      `  Great Advent milestone coverage: OK (${KNOWN_GREAT_ADVENT_MILESTONES.size} known, 0 new candidates found)`
    );
  }
}

async function syncLegendStages(prisma: PrismaClient, dataLocal: string, resLocal: string) {
  // Fetched once up front so both the known-name loop and the new-subchapter
  // forward scan below can use it — see fetchZlCrownMap()'s own comment for
  // why this is keyed by subchapter number rather than name.
  const wikiCrownMap = await fetchZlCrownMap();

  // ── Step 1: Parse Map_Name.csv ─────────────────────────────────────────
  const mapNamePath = path.join(resLocal, "Map_Name.csv");
  if (!existsSync(mapNamePath)) {
    console.log("  Map_Name.csv not found — skipping legend stages");
    return;
  }

  const mapContent = readFileSync(mapNamePath, "utf-8");
  const mapLines = mapContent.trim().split("\n").filter((l) => l.trim());

  // Parse names — format is "id|name" (pipe-delimited, numeric ID first)
  const allNames: string[] = [];
  for (const line of mapLines) {
    const p = line.split("|");
    const id = parseInt(p[0].trim(), 10);
    if (!isNaN(id) && p.length > 1) {
      allNames.push(p.slice(1).join("|").trim());
    } else {
      allNames.push(p[0].trim());
    }
  }
  console.log(`  Map_Name.csv: ${allNames.length} names`);

  checkGreatAdventMilestoneCoverage(allNames);

  // Build a lookup: name → index (first occurrence)
  const nameToIdx = new Map<string, number>();
  for (let i = 0; i < allNames.length; i++) {
    if (!nameToIdx.has(allNames[i])) {
      nameToIdx.set(allNames[i], i);
    }
  }

  // ── Step 2: Build subchapter lists per saga ────────────────────────────
  type SubEntry = { sortOrder: number; name: string; sagaName: string; maxCrowns: number };
  const subchapters: SubEntry[] = [];
  const sagaNames: string[] = [];

  // Non-legend stage names that appear interleaved in Map_Name.csv
  const NON_LEGEND_PATTERNS = [
    "Growing", "XP ", "Merciless XP", "Cat Ticket Chance",
    "Facing Danger", "Siege of Hippoe", "Clionel Ascendant",
    "Otherworld Colosseum", "Catclaw Championships",
    "Catamin", "Gauntlet", "Baron Seal",
    // Special/challenge stages that appear in the UL/ZL index range:
    "Crazed", "The Crazed ",
    // Other saga names that appear in Map_Name.csv:
    "Cats of the Cosmos", "Empire of Cats", "Into the Future",
    // Event/special stage keywords:
    "Advent ", "Cyclone ", "Dojo ",
    "Legend Quest", "Heavenly Tower", "Infernal Tower",
    "Aku Realm", "Behemoth Culling",
  ];

  // Exact non-legend names that don't match patterns
  const NON_LEGEND_EXACT = new Set([
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Weekend",
    "Cat Ticket Chance!", "Facing Danger", "Siege of Hippoe!",
  ]);

  function isNonLegendName(nm: string): boolean {
    if (NON_LEGEND_EXACT.has(nm)) return true;
    for (const pat of NON_LEGEND_PATTERNS) {
      if (nm.startsWith(pat) || nm.includes(pat)) return true;
    }
    // Event/collab patterns — anything with difficulty markers in parentheses
    if (/\((Normal|Expert|Deadly|Merciless|Insane|Veteran|Extreme)\)/.test(nm)) return true;
    // Other parenthesized content that indicates event maps (e.g., "Zombie Filibuster")
    // Legend subchapter names generally don't have parentheses
    if (/\(.+\)/.test(nm)) return true;
    if (nm.endsWith("Ranking") || nm.startsWith("Ranking")) return true;
    if (nm.includes(" VS ")) return true;
    // "Rank N" patterns (Catclaw Championships Rank 1-9)
    if (/Rank \d+/.test(nm)) return true;
    // "Ch. N" patterns (e.g., "Cats of the Cosmos Ch. 3")
    if (/Ch\. \d+/.test(nm)) return true;
    return false;
  }

  // Helper: fuzzy search for a name in allNames (tries exact, then substring)
  function fuzzyFindName(target: string, names: string[]): string | null {
    // Exact match first
    if (nameToIdx.has(target)) return target;
    // Try case-insensitive exact match
    const lower = target.toLowerCase();
    for (const nm of names) {
      if (nm.toLowerCase() === lower) return nm;
    }
    // Try substring: look for names containing the last significant word(s)
    // e.g., "New World Ehen" → look for names containing "Ehen"
    const words = target.split(/\s+/);
    const lastWord = words[words.length - 1];
    if (lastWord.length >= 4) {
      const candidates = names.filter((nm) => nm.includes(lastWord));
      if (candidates.length === 1) return candidates[0];
      // If multiple, try with last two words
      if (words.length >= 2) {
        const lastTwo = words.slice(-2).join(" ");
        const narrowed = candidates.filter((nm) => nm.includes(lastTwo));
        if (narrowed.length === 1) return narrowed[0];
      }
    }
    return null;
  }

  // --- Stories of Legend: contiguous block at indices 0..48 ---
  const solFirst = allNames[0];
  const solLast = allNames[SOL_COUNT - 1];
  console.log(`  Stories of Legend: expecting indices 0-${SOL_COUNT - 1}`);
  console.log(`    first: "${solFirst}" (expected "${SOL_EXPECTED_FIRST}") ${solFirst === SOL_EXPECTED_FIRST ? "✓" : "⚠ MISMATCH"}`);
  console.log(`    last:  "${solLast}" (expected "${SOL_EXPECTED_LAST}") ${solLast === SOL_EXPECTED_LAST ? "✓" : "⚠ MISMATCH"}`);

  const solNameSet = new Set<string>();
  if (solFirst === SOL_EXPECTED_FIRST) {
    sagaNames.push("Stories of Legend");
    for (let i = 0; i < SOL_COUNT; i++) {
      const name = allNames[i];
      if (name) {
        subchapters.push({ sortOrder: i, name, sagaName: "Stories of Legend", maxCrowns: SOL_MAX_CROWNS });
        solNameSet.add(name);
      }
    }
    console.log(`    Added ${SOL_COUNT} SoL subchapters`);
  } else {
    console.error("  ERROR: Stories of Legend not found at expected position — skipping SoL");
  }

  // --- Uncanny Legends: 49 hardcoded names, searched individually ---
  console.log(`  Uncanny Legends: searching for ${UL_NAMES.length} known names`);
  let ulFound = 0;
  const ulMissing: string[] = [];
  const ulNameSet = new Set<string>();

  for (let i = 0; i < UL_NAMES.length; i++) {
    const target = UL_NAMES[i];
    const found = fuzzyFindName(target, allNames);
    if (found) {
      subchapters.push({ sortOrder: i, name: found, sagaName: "Uncanny Legends", maxCrowns: UL_MAX_CROWNS });
      ulNameSet.add(found);
      if (found !== target) {
        console.log(`    Fuzzy match: "${target}" → "${found}"`);
      }
      ulFound++;
    } else {
      ulMissing.push(target);
    }
  }
  if (ulFound > 0) sagaNames.push("Uncanny Legends");
  console.log(`    Found ${ulFound}/${UL_NAMES.length} in Map_Name.csv`);
  if (ulMissing.length > 0) {
    console.warn(`    Missing ${ulMissing.length} UL names: ${ulMissing.join(", ")}`);
  }

  // --- Zero Legends: known names + forward scanning for new ones ---
  console.log(`  Zero Legends: searching for ${ZL_KNOWN_NAMES.length} known names`);
  let zlFound = 0;
  const zlMissing: string[] = [];
  const zlNameSet = new Set<string>(ZL_KNOWN_NAMES);

  for (let i = 0; i < ZL_KNOWN_NAMES.length; i++) {
    const target = ZL_KNOWN_NAMES[i];
    const found = fuzzyFindName(target, allNames);
    if (found) {
      subchapters.push({ sortOrder: i, name: found, sagaName: "Zero Legends", maxCrowns: getZlMaxCrowns(i + 1, found, wikiCrownMap) });
      zlNameSet.add(found); // Add the ACTUAL name from Map_Name.csv
      if (found !== target) {
        console.log(`    Fuzzy match: "${target}" → "${found}"`);
      }
      zlFound++;
    } else {
      zlMissing.push(target);
    }
  }
  console.log(`    Found ${zlFound}/${ZL_KNOWN_NAMES.length} in Map_Name.csv`);
  if (zlMissing.length > 0) {
    console.warn(`    Missing ${zlMissing.length} ZL names: ${zlMissing.join(", ")}`);
  }

  if (zlFound > 0) sagaNames.push("Zero Legends");

  // Forward scan for NEW ZL subchapters added after our known list.
  // ZL grows with game updates — PONOS adds new subchapters over time.
  // Since UL is fully hardcoded (all 49 names), we can safely identify
  // new entries by elimination: anything after the last known ZL entry
  // that's NOT SoL, NOT UL, and NOT a non-legend stage must be new ZL.
  //
  // We scan from the last known ZL index all the way to the end of
  // Map_Name.csv (not just a small buffer). With UL hardcoded, false
  // positives can only come from non-legend names slipping through
  // the filter, and we cap at ZL_MAX to be safe.
  let lastKnownZlIdx = -1;
  for (const name of [...ZL_KNOWN_NAMES]) {
    // Check both the hardcoded name and any fuzzy-matched actual name
    const idx = nameToIdx.get(name);
    if (idx !== undefined && idx > lastKnownZlIdx) {
      lastKnownZlIdx = idx;
    }
  }
  // Also check actual names in zlNameSet (in case of fuzzy matches)
  for (const name of zlNameSet) {
    const idx = nameToIdx.get(name);
    if (idx !== undefined && idx > lastKnownZlIdx) {
      lastKnownZlIdx = idx;
    }
  }

  if (lastKnownZlIdx >= 0) {
    // Scan from after last known ZL entry to end of Map_Name.csv.
    // New ZL entries could be far past the current UL/ZL region if many
    // non-legend entries were added in between.
    console.log(`    Scanning for new ZL entries from idx ${lastKnownZlIdx + 1} to end of Map_Name.csv (${allNames.length - 1})`);

    let newZlCount = 0;
    // Track consecutive non-legend entries to detect when we've left
    // the legend region entirely (avoid scanning thousands of irrelevant entries)
    let consecutiveSkips = 0;
    const MAX_CONSECUTIVE_SKIPS = 100; // stop after 100 consecutive non-legend names

    for (let i = lastKnownZlIdx + 1; i < allNames.length && zlFound + newZlCount < ZL_MAX; i++) {
      const nm = allNames[i];
      if (!nm) { consecutiveSkips++; continue; }
      if (solNameSet.has(nm)) { consecutiveSkips++; continue; }
      if (zlNameSet.has(nm)) { consecutiveSkips = 0; continue; } // known ZL resets counter
      if (ulNameSet.has(nm)) { consecutiveSkips = 0; continue; } // known UL resets counter
      if (isNonLegendName(nm)) { consecutiveSkips++; continue; }

      // Found a name that's not SoL, not UL, not ZL, not non-legend.
      // This is likely a new ZL subchapter!
      const sortOrder = ZL_KNOWN_NAMES.length + newZlCount;
      // Defaults to 1 crown unless the wiki scrape has a note for this
      // subchapter number (a brand-new ZL subchapter is almost always
      // 1-crown-only at launch, but no reason not to pick up day-one data
      // if the wiki's already been updated).
      subchapters.push({ sortOrder, name: nm, sagaName: "Zero Legends", maxCrowns: getZlMaxCrowns(sortOrder + 1, nm, wikiCrownMap) });
      zlNameSet.add(nm);
      newZlCount++;
      consecutiveSkips = 0;
      console.log(`    NEW ZL subchapter: "${nm}" at idx ${i} (sortOrder=${sortOrder})`);
    }

    if (newZlCount > 0) {
      console.log(`    Discovered ${newZlCount} new ZL subchapters beyond known list`);
    } else {
      console.log(`    No new ZL subchapters found beyond known list`);
    }
  }

  // ── Step 3: Summary ────────────────────────────────────────────────────
  const sagaDist: Record<string, number> = {};
  for (const sub of subchapters) {
    sagaDist[sub.sagaName] = (sagaDist[sub.sagaName] ?? 0) + 1;
  }
  console.log(`  Total legend subchapters: ${subchapters.length}`);
  for (const [saga, count] of Object.entries(sagaDist)) {
    console.log(`    ${saga}: ${count}`);
  }

  if (subchapters.length === 0) {
    console.error("  ERROR: No legend subchapters found. Aborting.");
    return;
  }

  // ── Step 4: Get or create sagas in DB ──────────────────────────────────
  const existingSagas = await (prisma as any).legendSaga.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const sagaIdMap = new Map<string, string>();
  for (const s of existingSagas) sagaIdMap.set(s.displayName, s.id);

  const SAGA_ORDER = ["Stories of Legend", "Uncanny Legends", "Zero Legends"];
  for (const sagaName of sagaNames) {
    if (!sagaIdMap.has(sagaName)) {
      const sortOrder = SAGA_ORDER.indexOf(sagaName) + 1 || sagaNames.indexOf(sagaName) + 1;
      const created = await (prisma as any).legendSaga.create({
        data: { displayName: sagaName, sortOrder },
      });
      sagaIdMap.set(sagaName, created.id);
      console.log(`  Created saga: "${sagaName}"`);
    }
  }

  // ── Step 5: Upsert subchapters ─────────────────────────────────────────
  // Track valid (sagaId, displayName) pairs for saga-aware cleanup
  const validPairs = new Set<string>();
  let upsertedCount = 0;

  for (const sub of subchapters) {
    const sagaId = sagaIdMap.get(sub.sagaName);
    if (!sagaId) continue;
    validPairs.add(`${sagaId}::${sub.name}`);

    try {
      await (prisma as any).legendSubchapter.upsert({
        where: { sagaId_displayName: { sagaId, displayName: sub.name } },
        create: { sagaId, displayName: sub.name, sortOrder: sub.sortOrder, maxCrowns: sub.maxCrowns },
        update: { sortOrder: sub.sortOrder, maxCrowns: sub.maxCrowns },
      });
      upsertedCount++;
    } catch (e: any) {
      console.warn(`    Failed to upsert "${sub.name}": ${e.message}`);
    }
  }

  console.log(`  ✓ Upserted ${upsertedCount} legend subchapters`);

  // ── Step 6: Saga-aware cleanup of stale subchapters ────────────────────
  // SAFETY: Only clean up if we upserted enough (SoL alone has 49)
  if (upsertedCount >= 50) {
    const allExisting = await (prisma as any).legendSubchapter.findMany({
      select: { id: true, displayName: true, sagaId: true },
    });
    const toDelete: string[] = [];
    for (const existing of allExisting) {
      const key = `${existing.sagaId}::${existing.displayName}`;
      if (!validPairs.has(key)) {
        toDelete.push(existing.id);
        console.log(`    Stale: "${existing.displayName}" (saga=${existing.sagaId})`);
      }
    }
    if (toDelete.length > 0) {
      console.log(`  Cleaning up ${toDelete.length} stale subchapters (keeping ${allExisting.length - toDelete.length})`);
      await (prisma as any).userLegendProgress.deleteMany({
        where: { subchapterId: { in: toDelete } },
      });
      await (prisma as any).legendSubchapter.deleteMany({
        where: { id: { in: toDelete } },
      });
    } else {
      console.log("  No stale subchapters to clean up");
    }
  } else if (upsertedCount > 0) {
    console.warn(`  Only upserted ${upsertedCount} subchapters — skipping cleanup to protect existing data`);
  } else {
    console.warn("  No subchapters upserted — skipping cleanup.");
  }
}


// ── Meow Medal Sync ──────────────────────────────────────────────────────────

/**
 * Strips star-glyph decorations, collapses whitespace, and lowercases a
 * medal name so it can be matched regardless of formatting differences
 * between data sources (e.g. the retired Miraheze scraper vs BCData's raw
 * text may render the "★ Name ★" decoration with different spacing or a
 * visually-identical-but-different Unicode star character).
 */
function normalizeMedalName(name: string): string {
  return name
    .replace(/[★☆✩✪✫✬✭✮✯✰⭐]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function medalImageFile(sortOrder: number): string {
  return `Medal_${String(sortOrder).padStart(3, "0")}.png`;
}

/**
 * BCData's medal descriptions carry literal `<br>` tags meant for the
 * in-game text renderer (e.g. "Clear All Level 1<br>Stories of Legend
 * stages") — our UI renders this as plain text, so left alone it shows the
 * raw tag instead of a line break. Replace with a space and collapse
 * whitespace rather than rendering as HTML, since these strings ultimately
 * come from an external data source we don't control.
 */
function cleanMedalText(s: string): string {
  return s.replace(/<br\s*\/?>/gi, " ").replace(/\s+/g, " ").trim();
}

/**
 * Merges any MeowMedal rows that are really the same medal but ended up as
 * separate DB rows (normalized names match, exact names don't). This
 * happened when the previous version of this sync matched on exact `name`
 * equality: the pre-existing Miraheze-scraped rows apparently differ from
 * BCData's formatting just enough (star glyph/whitespace) that every single
 * medal failed to match and got inserted a second time, doubling the
 * catalog (125 → 252) without touching anyone's earned progress on the
 * original rows.
 *
 * Runs as a self-healing step before every sync so this can't silently
 * recur, and so anyone who already has the duplicated data gets it fixed
 * automatically on the next sync run rather than needing a one-off script.
 */
async function consolidateDuplicateMedals(prisma: PrismaClient) {
  const rows: {
    id: string;
    name: string;
    imageFile: string | null;
    autoKey: string | null;
  }[] = await (prisma as any).meowMedal.findMany({
    select: { id: true, name: true, imageFile: true, autoKey: true },
  });

  const groups = new Map<string, typeof rows>();
  for (const r of rows) {
    const key = normalizeMedalName(r.name);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(r);
  }

  const dupeGroups = [...groups.values()].filter((g) => g.length > 1);
  if (dupeGroups.length === 0) {
    console.log("  No duplicate medals found — nothing to consolidate");
    return;
  }

  console.log(`  Found ${dupeGroups.length} duplicate medal group(s) — consolidating...`);
  let mergedCount = 0;

  for (const group of dupeGroups) {
    const autoKeys = [...new Set(group.map((r) => r.autoKey).filter(Boolean))];
    if (autoKeys.length > 1) {
      console.warn(
        `    ⚠ "${group[0].name}" duplicates have conflicting autoKeys (${autoKeys.join(", ")}) — keeping one, please verify manually`
      );
    }

    // Prefer keeping the row with an autoKey (hand-curated, hard to
    // reconstruct), then one with an imageFile, else just the first.
    const keep = group.find((r) => r.autoKey) ?? group.find((r) => r.imageFile) ?? group[0];
    const dupes = group.filter((r) => r.id !== keep.id);

    for (const dupe of dupes) {
      // Carry over earned progress so nobody loses a medal they'd already earned.
      const dupeProgress: { userId: string; earned: boolean; earnedAt: Date | null }[] =
        await (prisma as any).userMeowMedal.findMany({
          where: { meowMedalId: dupe.id, earned: true },
          select: { userId: true, earned: true, earnedAt: true },
        });

      for (const p of dupeProgress) {
        const keepRow = await (prisma as any).userMeowMedal.findUnique({
          where: { userId_meowMedalId: { userId: p.userId, meowMedalId: keep.id } },
          select: { earned: true },
        });
        if (keepRow?.earned) continue;

        await (prisma as any).userMeowMedal.upsert({
          where: { userId_meowMedalId: { userId: p.userId, meowMedalId: keep.id } },
          create: { userId: p.userId, meowMedalId: keep.id, earned: true, earnedAt: p.earnedAt },
          update: { earned: true, earnedAt: p.earnedAt },
        });
      }

      await (prisma as any).userMeowMedal.deleteMany({ where: { meowMedalId: dupe.id } });
      await (prisma as any).meowMedal.delete({ where: { id: dupe.id } });
      mergedCount++;
    }
  }

  console.log(`  ✓ Consolidated ${mergedCount} duplicate row(s) across ${dupeGroups.length} group(s)`);
}

/**
 * Syncs the Meow Medal catalog from resLocal/medalname.tsv.
 *
 * File format: one medal per line, tab-separated `Name\tDescription`, in the
 * same order as DataLocal/medallist.json's `iconID` array (verified 1:1 —
 * both have the same entry count in every version checked so far). That
 * order matches the in-game medal list order, so we reuse it as sortOrder
 * AND as the local image filename index (public/medals/Medal_NNN.png — the
 * 125 checked-in images are numbered by this same position).
 *
 * This replaces the old one-off Miraheze wiki scraper
 * (scripts/import-meow-medals-miraheze.ts) as the source of truth — BCData
 * is the authoritative, versioned game data source already used for units
 * and legend stages, so new medals (e.g. a new Great Advent "Clear X" medal)
 * show up automatically on the next weekly sync instead of requiring someone
 * to notice the wiki is out of date and re-run the scraper by hand.
 *
 * Matches existing rows by normalized name (see normalizeMedalName) rather
 * than exact string equality, and updates by id — this is what fixes (and
 * prevents recurrence of) the duplication bug from the first version of
 * this function.
 *
 * Deliberately does NOT touch `autoKey` on update — that field drives the
 * separate auto-completion system (see src/app/api/meow-medals/sync/route.ts
 * and the scripts/set-*-autokeys.ts helpers) and is hand-curated per medal.
 */
async function syncMeowMedals(prisma: PrismaClient, resLocal: string) {
  const medalNamePath = path.join(resLocal, "medalname.tsv");
  if (!existsSync(medalNamePath)) {
    console.log("  medalname.tsv not found — skipping meow medals");
    return;
  }

  const raw = readFileSync(medalNamePath, "utf-8");
  const lines = raw.split("\n").filter((l) => l.trim().length > 0);

  type ParsedMedal = { name: string; description: string; sortOrder: number; imageFile: string };
  const medals: ParsedMedal[] = [];
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split("\t");
    if (parts.length < 2) {
      console.warn(`    Skipping malformed line ${i}: ${JSON.stringify(lines[i])}`);
      continue;
    }
    const name = parts[0].trim();
    const description = cleanMedalText(parts.slice(1).join("\t"));
    if (!name) continue;
    medals.push({ name, description, sortOrder: i, imageFile: medalImageFile(i) });
  }

  console.log(`  medalname.tsv: ${medals.length} medals`);
  if (medals.length === 0) return;

  // Step 0: fix up any pre-existing duplicates before matching new data in.
  await consolidateDuplicateMedals(prisma);

  // Step 1: match against existing rows by normalized name, not exact name.
  const existing: { id: string; name: string }[] = await (prisma as any).meowMedal.findMany({
    select: { id: true, name: true },
  });
  const existingByKey = new Map(existing.map((r) => [normalizeMedalName(r.name), r]));

  const batchSize = 50;
  let created = 0;
  let updated = 0;
  for (let i = 0; i < medals.length; i += batchSize) {
    const batch = medals.slice(i, i + batchSize);
    await Promise.all(
      batch.map((m) => {
        const match = existingByKey.get(normalizeMedalName(m.name));
        if (match) {
          updated++;
          return (prisma as any).meowMedal.update({
            where: { id: match.id },
            data: {
              name: m.name,
              description: m.description,
              requirementText: m.description,
              sortOrder: m.sortOrder,
              imageFile: m.imageFile,
            },
          });
        }
        created++;
        return (prisma as any).meowMedal.create({
          data: {
            name: m.name,
            description: m.description,
            requirementText: m.description,
            category: "Other",
            sortOrder: m.sortOrder,
            imageFile: m.imageFile,
          },
        });
      })
    );
    process.stdout.write(`\r  Synced ${Math.min(i + batchSize, medals.length)}/${medals.length} medals...`);
  }
  console.log(`\n  ✓ ${created} created, ${updated} matched & updated (${medals.length} total from BCData)`);
}

// ── Run ──────────────────────────────────────────────────────────────────────
// Guarded so main() only fires when this file is executed directly (`npx tsx
// ./scripts/sync-bcdata.ts`, or the weekly GitHub Action) — NOT merely
// imported. Found 2026-07-14 while tracing a user question about unrelated
// unit-sort-order data: audit-gacha-names.ts imports cloneOrPull/
// findLatestVersion/detectEventFamilies/fetchBcuGachaNameMap/
// BCU_CATEGORY_ALIAS from this module. Without this guard, ES modules
// execute their ENTIRE top-level body on first import regardless of which
// specific named bindings are requested — so every run of "Audit Gacha
// Names" was silently triggering this file's real main() (a full BCData
// sync with real database writes) as a side effect of the import
// statement, before the audit script's own read-only logic ever started —
// directly contradicting that script's own "read-only, no writes" doc
// comment. This is the standard Node/ESM equivalent of the old CommonJS
// `if (require.main === module)` check.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error("Sync failed:", e);
    process.exit(1);
  });
}
