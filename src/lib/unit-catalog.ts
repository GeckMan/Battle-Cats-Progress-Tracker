/**
 * Seed data for Battle Cats units.
 * Normal cats: units 0–9 (the base 10 normal cats).
 * More units can be imported via the CSV import script.
 */

export type UnitSeed = {
  unitNumber: number;
  name: string;
  category: "NORMAL" | "SPECIAL" | "RARE" | "SUPER_RARE" | "UBER_RARE" | "LEGEND_RARE";
  formCount: number; // usually 3 (F1/F2/TF), some have 4 (with Ultra Form)
  sortOrder: number;
};

/** The original 10 Normal cats (unit numbers 0–9) */
export const NORMAL_CATS: UnitSeed[] = [
  { unitNumber: 0,  name: "Cat",         category: "NORMAL", formCount: 3, sortOrder: 0 },
  { unitNumber: 1,  name: "Tank Cat",    category: "NORMAL", formCount: 3, sortOrder: 1 },
  { unitNumber: 2,  name: "Axe Cat",     category: "NORMAL", formCount: 3, sortOrder: 2 },
  { unitNumber: 3,  name: "Gross Cat",   category: "NORMAL", formCount: 3, sortOrder: 3 },
  { unitNumber: 4,  name: "Cow Cat",     category: "NORMAL", formCount: 3, sortOrder: 4 },
  { unitNumber: 5,  name: "Bird Cat",    category: "NORMAL", formCount: 3, sortOrder: 5 },
  { unitNumber: 6,  name: "Fish Cat",    category: "NORMAL", formCount: 3, sortOrder: 6 },
  { unitNumber: 7,  name: "Lizard Cat",  category: "NORMAL", formCount: 3, sortOrder: 7 },
  { unitNumber: 8,  name: "Titan Cat",   category: "NORMAL", formCount: 3, sortOrder: 8 },
  { unitNumber: 9,  name: "Crazed Cat",  category: "NORMAL", formCount: 3, sortOrder: 9 },
  { unitNumber: 10, name: "Crazed Tank Cat",  category: "NORMAL", formCount: 3, sortOrder: 10 },
  { unitNumber: 11, name: "Crazed Axe Cat",   category: "NORMAL", formCount: 3, sortOrder: 11 },
  { unitNumber: 12, name: "Crazed Gross Cat",  category: "NORMAL", formCount: 3, sortOrder: 12 },
  { unitNumber: 13, name: "Crazed Cow Cat",    category: "NORMAL", formCount: 3, sortOrder: 13 },
  { unitNumber: 14, name: "Crazed Bird Cat",   category: "NORMAL", formCount: 3, sortOrder: 14 },
  { unitNumber: 15, name: "Crazed Fish Cat",   category: "NORMAL", formCount: 3, sortOrder: 15 },
  { unitNumber: 16, name: "Crazed Lizard Cat", category: "NORMAL", formCount: 3, sortOrder: 16 },
  { unitNumber: 17, name: "Crazed Titan Cat",  category: "NORMAL", formCount: 3, sortOrder: 17 },
];

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
