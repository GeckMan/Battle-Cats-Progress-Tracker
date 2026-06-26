/**
 * sync-bcdata.ts — Automated data sync from fieryhenry/BCData
 *
 * Clones the BCData repository, finds the latest EN game version,
 * and upserts units + legend stages into the database.
 *
 * Usage:
 *   npx tsx ./scripts/sync-bcdata.ts
 *
 * Environment:
 *   DATABASE_URL or DIRECT_DATABASE_URL — Neon PostgreSQL connection string
 *
 * Data source:
 *   https://git.battlecatsmodding.org/fieryhenry/BCData.git
 *   Fallback: https://github.com/fieryhenry/BCData.git
 *
 * What it syncs:
 *   - Units: name (all forms), rarity/category, form count
 *   - Legend Stages: saga names + subchapter names
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
const BCDATA_REPO_URLS = [
  "https://git.battlecatsmodding.org/fieryhenry/BCData.git",
  "https://github.com/fieryhenry/BCData.git",
];
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

    // Step 4: Parse and sync legend stages
    console.log("\n── Syncing Legend Stages ──");
    await syncLegendStages(prisma, dataLocal, resLocal);

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
      console.log(`  Failed to clone from ${url}, trying next...`);
    }
  }

  throw new Error("Failed to clone BCData from any source");
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

function parseRarityMap(dataLocal: string, resLocal: string): Map<number, string> {
  const map = new Map<number, string>();

  // Try both data files and pick the best result
  const candidates: { source: string; col: number; score: number; values: number[] }[] = [];

  // ── DEBUG: Dump known unit rows to help diagnose column changes ────────
  // Unit 209 = Fuma Kotaro (Uber Rare, rarity=4)
  // Unit 57 = Salon Cat (Rare, rarity=2)
  // Unit 25 = Ninja Frog Cat (Special, rarity=1)
  // Unit 0 = Cat (Normal, rarity=0)
  const debugUnits = [0, 25, 57, 209];
  for (const file of ["unitbuy.csv", "nyankoPictureBookData.csv"]) {
    const fp = path.join(dataLocal, file);
    if (!existsSync(fp)) continue;
    const content = readFileSync(fp, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());
    console.log(`  DEBUG ${file}: ${lines.length} rows`);
    for (const uid of debugUnits) {
      if (uid < lines.length) {
        const vals = lines[uid].split(",").map((c) => c.trim());
        console.log(`    row ${uid}: [${vals.join(", ")}]`);
      }
    }
  }

  // ── DEBUG: Dump key suspect files ────────────────────────────────────────
  const suspectFiles = ["Hidden_rarity.csv", "t_unit.csv", "unitlimit.csv",
    "nyankoPictureBookData_Attribute.csv", "nyankoPictureBookData_CharaGet.csv",
    "Charagroup.csv", "GatyaDataSetR1.csv"];
  for (const file of suspectFiles) {
    for (const dir of [dataLocal, resLocal]) {
      const fp = path.join(dir, file);
      if (!existsSync(fp)) continue;
      const content = readFileSync(fp, "utf-8");
      const lines = content.trim().split("\n").filter((l) => l.trim());
      console.log(`  DEBUG ${file}: ${lines.length} rows`);
      // Dump first 5 rows + rows for known units if they exist
      for (let i = 0; i < Math.min(5, lines.length); i++) {
        console.log(`    row ${i}: ${lines[i].substring(0, 200)}`);
      }
      // For files with enough rows, dump ground truth unit rows
      for (const uid of debugUnits) {
        if (uid >= 5 && uid < lines.length) {
          console.log(`    row ${uid}: ${lines[uid].substring(0, 200)}`);
        }
      }
    }
  }

  // ── DEBUG: Search for key-value pair format (unitId, rarity) ──────────
  // Some files might store rarity as [unitId, rarity] pairs rather than
  // having row index = unit ID
  const GROUND_TRUTH_RARITY: Record<number, number> = {
    0: 0, 25: 1, 57: 2, 209: 4,
  };
  const allCsvFiles = readdirSync(dataLocal).filter((f) => f.endsWith(".csv"));
  console.log(`  DEBUG: Key-value pair search across ${allCsvFiles.length} DataLocal CSVs`);
  for (const csvFile of allCsvFiles) {
    const fp = path.join(dataLocal, csvFile);
    const content = readFileSync(fp, "utf-8");
    const lines = content.trim().split("\n").filter((l) => l.trim());
    if (lines.length < 4) continue; // need at least 4 rows for our ground truth

    const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
    const numCols = Math.min(...rows.slice(0, 50).map((r) => r.length));
    if (numCols < 2) continue;

    // For each potential ID column + value column pair
    for (let idCol = 0; idCol < Math.min(numCols, 3); idCol++) {
      // Build a map of id → row for this column
      const idToRow = new Map<number, number[]>();
      for (const row of rows) {
        const id = row[idCol];
        if (!idToRow.has(id)) idToRow.set(id, row);
      }

      // Check if all ground truth unit IDs are present
      const gtIds = Object.keys(GROUND_TRUTH_RARITY).map(Number);
      if (!gtIds.every((id) => idToRow.has(id))) continue;

      // For each potential rarity column
      for (let valCol = 0; valCol < numCols; valCol++) {
        if (valCol === idCol) continue;
        let allMatch = true;
        for (const [uid, expected] of Object.entries(GROUND_TRUTH_RARITY)) {
          const row = idToRow.get(Number(uid));
          if (!row || row[valCol] !== expected) { allMatch = false; break; }
        }
        if (allMatch) {
          // Verify values are in rarity range
          const vals = rows.map((r) => r[valCol]);
          const allInRange = vals.every((v) => v >= 0 && v <= 5);
          if (allInRange) {
            const dist: Record<number, number> = {};
            for (const v of vals) dist[v] = (dist[v] ?? 0) + 1;
            console.log(`  ★ KV RARITY MATCH: ${csvFile} idCol=${idCol} valCol=${valCol} — ${rows.length} rows, dist=${JSON.stringify(dist)}`);
          }
        }
      }
    }
  }

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

  // ── Strategy 4: Ground-truth search ─────────────────────────────────────
  // If no candidate passed scoring, scan ALL columns for one that matches
  // known unit rarities exactly, even if it has fewer distinct values.
  // This handles cases where the column format changed completely.
  const viableCandidates = candidates.filter((c) => c.score >= 100);
  if (viableCandidates.length === 0) {
    console.log("  Strategy 4: Ground-truth search — looking for columns matching known unit rarities");
    const GROUND_TRUTH: Record<number, number> = {
      0: 0,   // Cat = Normal
      25: 1,  // Ninja Frog Cat = Special
      57: 2,  // Salon Cat = Rare
      209: 4, // Fuma Kotaro = Uber Rare
    };

    // Scan ALL CSV files in DataLocal, not just unitbuy/nyankoPictureBookData
    const csvFiles = readdirSync(dataLocal).filter((f) => f.endsWith(".csv"));
    console.log(`    Scanning ${csvFiles.length} CSV files for ground-truth matches`);
    for (const file of csvFiles) {
      const fp = path.join(dataLocal, file);
      const content = readFileSync(fp, "utf-8");
      const lines = content.trim().split("\n").filter((l) => l.trim());
      if (lines.length <= 209) continue;

      const rows = lines.map((l) => l.split(",").map((c) => parseInt(c.trim(), 10)));
      const numCols = Math.min(...rows.slice(0, 300).map((r) => r.length));

      for (let col = 0; col < numCols; col++) {
        const colVals = rows.map((r) => r[col]);
        // Check ground truth
        let matches = 0;
        for (const [uid, expected] of Object.entries(GROUND_TRUTH)) {
          if (colVals[Number(uid)] === expected) matches++;
        }
        if (matches === Object.keys(GROUND_TRUTH).length) {
          // All ground truth units match! Check if values are in rarity range (0-5)
          const allInRange = colVals.every((v) => v >= 0 && v <= 5);
          if (allInRange) {
            const score = scoreRarityColumn(colVals);
            console.log(`  Strategy 4 MATCH: ${file} col ${col} — all ${matches} ground truth units match, score=${score.toFixed(1)}`);
            const dist: Record<number, number> = {};
            for (const v of colVals) dist[v] = (dist[v] ?? 0) + 1;
            console.log(`    Distribution: ${JSON.stringify(dist)}`);
            candidates.push({ source: `${file}(ground-truth)`, col, score: score + 200, values: colVals }); // +200 bonus for ground truth match
          }
        }
      }
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

  console.warn("  WARNING: Could not parse rarity from any data file, using fallback guessRarity()");
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

  // GROUND TRUTH validation: check known unit rarities.
  // Unit 0 (Cat) = 0 (Normal), Unit 57 (Salon Cat) = 2 (Rare),
  // Unit 209 (Fuma Kotaro) = 4 (Uber Rare)
  // If ANY of these don't match, this column is definitely wrong.
  if (values.length > 209) {
    if (values[0] !== 0) score -= 100;   // Cat must be Normal
    if (values[57] !== 2) score -= 100;  // Salon Cat must be Rare
    if (values[209] !== 4) score -= 100; // Fuma Kotaro must be Uber Rare
    // Bonus for matching all three
    if (values[0] === 0 && values[57] === 2 && values[209] === 4) score += 50;
  }

  // Reward correct ordering: Rare > Super Rare > Uber Rare > Legend Rare
  if (counts[2] > counts[3]) score += 20; // more Rare than Super Rare
  if (counts[3] > counts[4]) score += 20; // more Super Rare than Uber Rare
  if (counts[4] > counts[5]) score += 20; // more Uber Rare than Legend Rare

  // Reward Legend Rare being rare (< 5% of total)
  if (counts[5] > 0 && counts[5] < total * 0.05) score += 15;

  // Reward Uber Rare being a moderate chunk (5-20% of total)
  const uberPct = counts[4] / total;
  if (uberPct > 0.05 && uberPct < 0.25) score += 15;

  // Reward Rare being the largest non-Normal/Special group
  if (counts[2] > counts[3] && counts[2] > counts[4] && counts[2] > counts[5]) score += 10;

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


// ── Run ──────────────────────────────────────────────────────────────────────
main().catch((e) => {
  console.error("Sync failed:", e);
  process.exit(1);
});
