/**
 * Import Battle Cats unit data from a CSV file into the database.
 *
 * Usage:
 *   npx tsx ./scripts/import-units-csv.ts <path-to-csv>
 *
 * Expected CSV columns (header row required):
 *   unitNumber, name, category, formCount
 *
 *   - unitNumber: integer (0-based unit ID used in game assets)
 *   - name: string (English name, e.g. "Valkyrie Cat")
 *   - category: one of NORMAL, SPECIAL, RARE, SUPER_RARE, UBER_RARE, LEGEND_RARE
 *   - formCount: integer (usually 3, some units have 4 for Ultra Form)
 *
 * Example row:
 *   18,Valkyrie Cat,SPECIAL,3
 *
 * The script is idempotent — it upserts by unitNumber so it's safe to run multiple times.
 *
 * Data sources:
 *   - https://github.com/fieryhenry/BCData — contains unit lists
 *   - Battle Cats wiki (battlecats.miraheze.org)
 *   - nyankoPictureBook_en.csv from save-file editors
 *
 * Manual CSV format if building by hand:
 *   unitNumber,name,category,formCount
 *   0,Cat,NORMAL,3
 *   1,Tank Cat,NORMAL,3
 *   ...
 */

import "dotenv/config";
import { createReadStream } from "fs";
import { createInterface } from "readline";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/index.js";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool), log: ["warn", "error"] });

const VALID_CATEGORIES = new Set([
  "NORMAL", "SPECIAL", "RARE", "SUPER_RARE", "UBER_RARE", "LEGEND_RARE",
]);

// Sort order by category
const CATEGORY_SORT_BASE: Record<string, number> = {
  NORMAL:      0,
  SPECIAL:     10000,
  RARE:         20000,
  SUPER_RARE:  30000,
  UBER_RARE:   40000,
  LEGEND_RARE: 50000,
};

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    console.error("Usage: npx tsx ./scripts/import-units-csv.ts <path-to-csv>");
    process.exit(1);
  }

  const absPath = path.resolve(csvPath);
  console.log(`Reading CSV: ${absPath}`);

  const rl = createInterface({
    input: createReadStream(absPath),
    crlfDelay: Infinity,
  });

  let lineNum = 0;
  let imported = 0;
  let skipped = 0;
  const units: {
    unitNumber: number;
    name: string;
    category: string;
    formCount: number;
    sortOrder: number;
  }[] = [];

  for await (const line of rl) {
    lineNum++;
    if (lineNum === 1) {
      // Validate header
      const headers = line.split(",").map((h) => h.trim().toLowerCase());
      const required = ["unitnumber", "name", "category", "formcount"];
      for (const r of required) {
        if (!headers.includes(r)) {
          console.error(`Missing column: ${r}. Headers found: ${headers.join(", ")}`);
          process.exit(1);
        }
      }
      continue;
    }

    const parts = line.split(",").map((p) => p.trim());
    if (parts.length < 4) { skipped++; continue; }

    const [unitNumberStr, name, category, formCountStr] = parts;
    const unitNumber = parseInt(unitNumberStr, 10);
    const formCount = parseInt(formCountStr, 10) || 3;

    if (isNaN(unitNumber) || !name || !VALID_CATEGORIES.has(category)) {
      console.warn(`  Line ${lineNum}: skipping invalid row — ${line}`);
      skipped++;
      continue;
    }

    const sortOrder = (CATEGORY_SORT_BASE[category] ?? 0) + unitNumber;

    units.push({
      unitNumber,
      name,
      category,
      formCount,
      sortOrder,
    });
  }

  console.log(`Parsed ${units.length} valid rows, ${skipped} skipped`);
  console.log("Upserting into database…");

  // Upsert in batches of 100
  const batchSize = 100;
  for (let i = 0; i < units.length; i += batchSize) {
    const batch = units.slice(i, i + batchSize);
    await Promise.all(
      batch.map((u) =>
        (prisma as any).unit.upsert({
          where: { unitNumber: u.unitNumber },
          create: {
            id: `unit-${u.unitNumber}`,
            unitNumber: u.unitNumber,
            name: u.name,
            category: u.category,
            formCount: u.formCount,
            sortOrder: u.sortOrder,
          },
          update: {
            name: u.name,
            category: u.category,
            formCount: u.formCount,
            sortOrder: u.sortOrder,
          },
        })
      )
    );
    imported += batch.length;
    process.stdout.write(`\r  Imported ${imported}/${units.length}…`);
  }

  console.log(`\nDone! ${imported} units upserted.`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  await pool.end();
  process.exit(1);
});
