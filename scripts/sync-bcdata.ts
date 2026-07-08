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
 *   - Legend Stages: saga names + subchapter names
 *   - Meow Medals: name + description catalog (resLocal/medalname.tsv),
 *     superseding the old one-off Miraheze wiki scraper
 *     (import-meow-medals-miraheze.ts) as the source of truth.
 *
 * Safe to run repeatedly — all writes are upserts.
 */

import "dotenv/config";
import { execSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

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
const CLONE_DIR = "/tmp/bcdata-sync";
const REGION = "en";

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

    // Step 3b: Detect collab units from real gacha banner history, and flag
    // any unit still missing a source/set classification entirely
    console.log("\n── Detecting Collab Units ──");
    await syncCollabFlags(prisma, dataLocal);
    await checkUnitClassificationCoverage(prisma);

    // Step 4: Parse and sync legend stages
    console.log("\n── Syncing Legend Stages ──");
    await syncLegendStages(prisma, dataLocal, resLocal);

    // Step 5: Parse and sync meow medal catalog
    console.log("\n── Syncing Meow Medals ──");
    await syncMeowMedals(prisma, resLocal);

    console.log("\n✓ Sync complete!");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

// ── Git Operations ───────────────────────────────────────────────────────────

function cloneOrPull() {
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

function findLatestVersion(): string {
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

    const name = formNames[0];
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
        // For updates: only include category/sortOrder if we have reliable rarity data
        const updateData: Record<string, unknown> = {
          name: u.name,
          evolvedName: u.evolvedName,
          trueName: u.trueName,
          ultraName: u.ultraName,
          formCount: u.formCount,
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
// This intentionally does NOT try to auto-generate the human-readable
// "setName" shown in the UI (e.g. "Tales of the Nekoluga") — BCData's raw
// banner labels are Japanese-only with no English translation source, and
// dumping untranslated text into the Set filter dropdown would be a worse
// regression than leaving it manually curated. See
// checkUnitClassificationCoverage() below for how those gaps still get
// surfaced instead of silently staying "Unknown" forever.
const GATYA_SET_FILES = ["GatyaDataSetE1.csv", "GatyaDataSetN1.csv", "GatyaDataSetR1.csv"];
const COLLAB_MARKER = "コラボ";

function parseGatyaSetFile(content: string): { unitIds: number[]; label: string }[] {
  return content
    .split("\n")
    .map((line) => {
      const commentIdx = line.indexOf("//");
      const dataPart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
      const label = commentIdx >= 0 ? line.slice(commentIdx + 2).trim() : "";
      const unitIds = dataPart
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "" && s !== "-1")
        .map(Number)
        .filter((n) => Number.isFinite(n));
      return { unitIds, label };
    })
    .filter((row) => row.unitIds.length > 0);
}

function detectCollabUnitIds(dataLocal: string): Set<number> {
  const collabIds = new Set<number>();
  for (const file of GATYA_SET_FILES) {
    const filePath = path.join(dataLocal, file);
    if (!existsSync(filePath)) continue;
    const rows = parseGatyaSetFile(readFileSync(filePath, "utf-8"));
    for (const row of rows) {
      if (row.label.includes(COLLAB_MARKER)) {
        for (const id of row.unitIds) collabIds.add(id);
      }
    }
  }
  return collabIds;
}

async function syncCollabFlags(prisma: PrismaClient, dataLocal: string) {
  // Known limitation: this only catches banners where Ponos's own internal
  // label literally contains コラボ. Verified against real BCData that this
  // reliably matches recent licensed crossovers (Fate, Baki, Bikkuriman,
  // Metal Slug), but some long-running older collabs never got labeled that
  // way at all (e.g. the Sengoku Basara banner is labeled "戦国武神バサラーズ"
  // across ~20 historical appearances, never once with コラボ). Those aren't
  // regressed — anything already isCollab=true stays that way — they just
  // won't be freshly auto-detected here. checkUnitClassificationCoverage()
  // below is the safety net for gaps like that.
  const collabIds = detectCollabUnitIds(dataLocal);
  if (collabIds.size === 0) {
    console.log(
      "  ⚠ No コラボ-marked gacha banners found — GatyaDataSet*.csv may be missing or reformatted in this BCData snapshot, skipping"
    );
  } else {
    console.log(`  Detected ${collabIds.size} unit(s) across all-time コラボ-labeled gacha banners`);

    // Only ever ADD isCollab/source info, never remove it — a unit confirmed
    // as collab (by this detector or the old hardcoded migration) stays
    // collab even if some future BCData snapshot's banner history looks
    // different (e.g. depth-limited history windows).
    const existing = await (prisma as any).unit.findMany({
      where: { unitNumber: { in: [...collabIds] } },
      select: { unitNumber: true, isCollab: true, source: true },
    });

    const toFlag = existing.filter((u: any) => !u.isCollab || !u.source);
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

/**
 * Surfaces units that still have no way to explain "How to Obtain" in the
 * UI — no source, no set, and not flagged as collab. These previously went
 * silently unnoticed (e.g. a brand-new Uber Rare that isn't a collab but
 * also hasn't been manually assigned a gacha set name yet). Rather than
 * trying to guess a set name from untranslated data, this just makes the
 * gap visible in the weekly sync log so it can be fixed with a 30-second
 * manual edit — the same "flag it, don't guess it" pattern used for
 * Great Advent milestone coverage above.
 */
async function checkUnitClassificationCoverage(prisma: PrismaClient) {
  const unclassified = await (prisma as any).unit.findMany({
    where: { isCollab: false, source: null, setName: null },
    select: { unitNumber: true, name: true },
    orderBy: { unitNumber: "asc" },
  });

  if (unclassified.length === 0) {
    console.log("  Unit source/set coverage: OK (every unit has a source, a set, or is flagged as collab)");
    return;
  }

  const preview = unclassified
    .slice(0, 15)
    .map((u: any) => `${u.name} (#${u.unitNumber})`)
    .join(", ");
  const more = unclassified.length > 15 ? ` …and ${unclassified.length - 15} more` : "";
  console.log(`  ⚠ ${unclassified.length} unit(s) have no source, set, or collab classification: ${preview}${more}`);
  console.log(
    `    → These will show "How to Obtain: Unknown" in the app. Set Unit.source/setName manually if known.`
  );
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
// ZL: varies by subchapter. Map_option.csv has this data but BCData doesn't
// extract it, so we hardcode the known values. New ZL subchapters discovered
// by forward scan default to 1 crown.
const SOL_MAX_CROWNS = 4;
const UL_MAX_CROWNS = 4;

// ZL subchapters with 2 crowns (the rest have 1)
const ZL_TWO_CROWN_NAMES = new Set([
  "Zero Field",
  "The Edge of Spacetime",
  "Cats Cradle Basin",
  "The Ururuvu Journals",
  "New World Area: Ehen",
]);

function getZlMaxCrowns(name: string): number {
  return ZL_TWO_CROWN_NAMES.has(name) ? 2 : 1;
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
  } else {
    console.log(
      `  Great Advent milestone coverage: OK (${KNOWN_GREAT_ADVENT_MILESTONES.size} known, 0 new candidates found)`
    );
  }
}

async function syncLegendStages(prisma: PrismaClient, dataLocal: string, resLocal: string) {
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
      subchapters.push({ sortOrder: i, name: found, sagaName: "Zero Legends", maxCrowns: getZlMaxCrowns(found) });
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
      subchapters.push({ sortOrder, name: nm, sagaName: "Zero Legends", maxCrowns: 1 }); // new ZL defaults to 1 crown
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
main().catch((e) => {
  console.error("Sync failed:", e);
  process.exit(1);
});
