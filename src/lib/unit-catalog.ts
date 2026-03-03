/**
 * Unit catalog metadata and display constants.
 * The actual unit data (850 units) is seeded via the Prisma migration
 * prisma/migrations/20260303000001_seed_units/migration.sql.
 * The API route calls ensureUnitCatalog() which is now a no-op since
 * units are always present after migration.
 */

export type UnitSeed = {
  unitNumber: number;
  name: string;
  category: "NORMAL" | "SPECIAL" | "RARE" | "SUPER_RARE" | "UBER_RARE" | "LEGEND_RARE";
  formCount: number;
  sortOrder: number;
};

/** Empty — units come from the migration, not runtime seeding */
export const NORMAL_CATS: UnitSeed[] = [];

/** Category display labels */
export const UNIT_CATEGORY_META: Record<string, { label: string; color: string }> = {
  NORMAL:      { label: "Normal",      color: "text-gray-300" },
  SPECIAL:     { label: "Special",     color: "text-blue-300" },
  RARE:         { label: "Rare",        color: "text-green-300" },
  SUPER_RARE:  { label: "Super Rare",  color: "text-amber-300" },
  UBER_RARE:   { label: "Uber Rare",   color: "text-orange-300" },
  LEGEND_RARE: { label: "Legend Rare", color: "text-red-300" },
};

/** Form level display info */
export const FORM_LEVELS = [
  { level: 0, label: "Not Obtained", short: "—",   color: "bg-gray-700 border-gray-600 text-gray-400" },
  { level: 1, label: "Form 1",       short: "F1",  color: "bg-yellow-900/60 border-yellow-700 text-yellow-300" },
  { level: 2, label: "Form 2",       short: "F2",  color: "bg-red-900/60 border-red-700 text-red-300" },
  { level: 3, label: "True Form",    short: "TF",  color: "bg-gray-900 border-gray-500 text-gray-100" },
] as const;
