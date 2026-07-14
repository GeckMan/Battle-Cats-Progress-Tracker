/**
 * One-time (manually-triggered) diagnostic: dumps every unit's raw
 * nyankoPictureBookData.csv row alongside its unitNumber/name/category from
 * our own database, for manual comparison against the real in-game "Cat
 * Guide" (図鑑) screen's display order.
 *
 * Why this exists: a user noticed the website's unit grid (sorted by
 * `sortOrder = CATEGORY_SORT_BASE[category] + unitNumber` — i.e. release/ID
 * order within each rarity tier, see sync-bcdata.ts's syncUnits()) doesn't
 * match the order units appear in the actual mobile game's Cat Guide screen,
 * and asked whether our synced data has anything that reflects the real
 * in-game order. nyankoPictureBookData.csv's row index already equals unit
 * ID (documented in sync-bcdata.ts's rarity-detection comments), so IF the
 * real Cat Guide order differs from ID order, that difference would have to
 * come from some OTHER column in this same file (or a different file
 * entirely) that we've never examined for this specific purpose — we've
 * only ever mined it for a rarity-tier value and a form-count value at
 * specific columns.
 *
 * This script makes NO attempt to guess which column (if any) is the real
 * display-order field — it just dumps the raw data in a form a human (or
 * the next Claude session, working from a screenshot of the real Cat Guide
 * screen) can scan for a column whose sort order visibly reproduces a
 * DIFFERENT grouping/sequence than plain unitNumber ascending. Read-only:
 * makes no database writes and no commits.
 *
 * Run manually via the "Audit Cat Guide Order" GitHub Action
 * (workflow_dispatch) — needs real internet access to clone BCData, which
 * this sandbox doesn't have.
 */
import "dotenv/config";
import path from "path";
import { existsSync, readFileSync } from "fs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";
import { CLONE_DIR, REGION, cloneOrPull, findLatestVersion } from "./sync-bcdata.js";

async function main() {
  const dbUrl = process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("ERROR: DATABASE_URL or DIRECT_DATABASE_URL must be set");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: dbUrl, max: 5 });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

  try {
    console.log("── Cloning BCData repository ──");
    cloneOrPull();

    const latestVersion = findLatestVersion();
    console.log(`Latest EN version: ${latestVersion}`);

    const dataDir = path.join(CLONE_DIR, "game_data", REGION, latestVersion);
    const altDataDir = path.join(CLONE_DIR, `${latestVersion}${REGION}`);
    const baseDir = existsSync(dataDir) ? dataDir : existsSync(altDataDir) ? altDataDir : null;
    if (!baseDir) {
      console.error(`ERROR: Cannot find data directory. Tried:\n  ${dataDir}\n  ${altDataDir}`);
      process.exit(1);
    }
    const dataLocal = path.join(baseDir, "DataLocal");

    const pbPath = path.join(dataLocal, "nyankoPictureBookData.csv");
    if (!existsSync(pbPath)) {
      console.error(`ERROR: ${pbPath} not found`);
      process.exit(1);
    }
    const lines = readFileSync(pbPath, "utf-8")
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0);
    const maxCols = Math.max(...lines.map((l) => l.split(",").length));
    console.log(`  nyankoPictureBookData.csv: ${lines.length} rows, up to ${maxCols} columns per row`);

    const units = await (prisma as any).unit.findMany({
      select: { unitNumber: true, name: true, category: true },
      orderBy: { unitNumber: "asc" },
    });
    const byUnitNumber = new Map(units.map((u: any) => [u.unitNumber, u]));

    console.log("\n── Raw picture-book row per unit (unitNumber, name, category, csv columns) ──");
    console.log("  Compare against the real in-game Cat Guide screen's order for the same");
    console.log("  category — if any column's sort reproduces a different sequence than");
    console.log("  plain unitNumber ascending, that's a candidate 'display order' field.\n");

    let dumped = 0;
    let noCsvRow = 0;
    let noDbUnit = 0;
    for (let i = 0; i < lines.length; i++) {
      const unit = byUnitNumber.get(i) as { unitNumber: number; name: string; category: string } | undefined;
      if (!unit) {
        noDbUnit++;
        continue; // row exists in the CSV but no corresponding unit in our DB (gap in ID space)
      }
      console.log(`#${unit.unitNumber}\t${unit.name}\t${unit.category}\t${lines[i]}`);
      dumped++;
    }
    // Any DB unit whose ID is beyond the CSV's row count has no picture-book row at all.
    for (const u of units as any[]) {
      if (u.unitNumber >= lines.length) noCsvRow++;
    }

    console.log(`\n✓ Dumped ${dumped} unit(s). ${noDbUnit} CSV row(s) had no matching DB unit, ${noCsvRow} DB unit(s) had no CSV row.`);
    console.log("(Read-only — no database writes were made)");
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
