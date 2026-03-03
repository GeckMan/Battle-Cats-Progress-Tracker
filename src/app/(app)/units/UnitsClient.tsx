"use client";

import { useEffect, useState, useCallback } from "react";
import { FORM_LEVELS, UNIT_CATEGORY_META } from "@/lib/unit-catalog";

/* ── Types ─────────────────────────────────────────────────────────────── */

type UnitRow = {
  id: string;
  unitNumber: number;
  name: string;
  category: string;
  formCount: number;
  sortOrder: number;
  isCollab: boolean;
  formLevel: number; // 0–4
};

/* ── Constants ──────────────────────────────────────────────────────────── */

// Rarity order — matches the in-game Cat Guide ordering
const RARITY_ORDER = [
  "NORMAL",
  "SPECIAL",
  "RARE",
  "SUPER_RARE",
  "UBER_RARE",
  "LEGEND_RARE",
] as const;

// Accent colours per rarity for section headers
const RARITY_ACCENT: Record<string, string> = {
  NORMAL:      "border-gray-600 text-gray-300 bg-gray-900/60",
  SPECIAL:     "border-blue-800 text-blue-300 bg-blue-950/30",
  RARE:        "border-green-800 text-green-300 bg-green-950/30",
  SUPER_RARE:  "border-amber-700 text-amber-300 bg-amber-950/30",
  UBER_RARE:   "border-orange-700 text-orange-300 bg-orange-950/30",
  LEGEND_RARE: "border-red-700 text-red-300 bg-red-950/30",
};

// Form index → letter used in Miraheze filenames (F1=f, F2=c, TF=s, UF=u)
const FORM_LETTER = ["f", "c", "s", "u"] as const;

function spriteUrl(unitNumber: number, formIndex: number, unitName?: string) {
  // Ancient Egg units share a common egg sprite (Uni000_m00.png) for base form
  if (unitName?.startsWith("Ancient Egg") && formIndex === 0) {
    return `/api/sprite?u=0&f=m`;
  }
  const letter = FORM_LETTER[formIndex] ?? "f";
  return `/api/sprite?u=${unitNumber}&f=${letter}`;
}

/* ── Form badge colors ─────────────────────────────────────────────────── */

const FORM_BADGE: Record<number, string> = {
  0: "bg-gray-800 border-gray-700 text-gray-500",
  1: "bg-yellow-950/70 border-yellow-700/60 text-yellow-300",
  2: "bg-red-950/70 border-red-700/60 text-red-300",
  3: "bg-gray-900 border-gray-400 text-gray-100",
  4: "bg-purple-950/70 border-purple-500/60 text-purple-200",
};

const FORM_LABEL: Record<number, string> = {
  0: "—",
  1: "F1",
  2: "F2",
  3: "TF",
  4: "UF",
};

function cardTint(level: number) {
  if (level >= 3) return "bg-gray-950 border-gray-500/60";
  if (level === 2) return "bg-red-950/10 border-red-900/40";
  if (level === 1) return "bg-yellow-950/10 border-yellow-900/40";
  return "bg-black border-gray-800";
}

/* ── Progress bar ───────────────────────────────────────────────────────── */

function MiniBar({ value, total }: { value: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((value / total) * 100);
  const fill =
    pct >= 80 ? "bg-amber-400" : pct >= 40 ? "bg-amber-600" : pct > 0 ? "bg-amber-800" : "bg-gray-700";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded bg-gray-800 overflow-hidden">
        <div className={`h-1.5 ${fill}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-500 w-14 text-right">{value}/{total}</span>
    </div>
  );
}

/* ── Single Unit Card ───────────────────────────────────────────────────── */

function UnitCard({
  unit,
  onUpdate,
  pending,
}: {
  unit: UnitRow;
  onUpdate: (id: string, level: number) => void;
  pending: boolean;
}) {
  const maxLevel = unit.formCount;
  const level = unit.formLevel;

  function cycle() {
    const next = (level + 1) % (maxLevel + 1);
    onUpdate(unit.id, next);
  }

  const displayForm = Math.max(0, level - 1); // formLevel 1 → form index 0 (f00)
  const imgUrl = spriteUrl(unit.unitNumber, displayForm, unit.name);

  return (
    <button
      type="button"
      onClick={cycle}
      disabled={pending}
      title={`${unit.name} — click to cycle form (${FORM_LABEL[level]})`}
      className={`relative flex flex-col items-center rounded-lg border p-2 gap-1 transition-all
        ${cardTint(level)}
        ${pending ? "opacity-50 cursor-not-allowed" : "hover:border-amber-700/60 hover:bg-amber-950/10 cursor-pointer"}
      `}
    >
      {/* Sprite */}
      <div className="w-14 h-14 flex items-center justify-center">
        <img
          src={imgUrl}
          alt={unit.name}
          width={56}
          height={56}
          loading="lazy"
          className={`w-14 h-14 object-contain pixelated select-none ${level === 0 ? "opacity-30 grayscale" : ""}`}
          onError={(e) => { e.currentTarget.style.opacity = "0"; }}
        />
      </div>

      {/* Form badge */}
      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${FORM_BADGE[level]}`}>
        {FORM_LABEL[level]}
      </div>

      {/* Unit name */}
      <div className="text-[10px] text-gray-400 text-center leading-tight line-clamp-2 w-full">
        {unit.name}
      </div>
    </button>
  );
}

/* ── Rarity Section ─────────────────────────────────────────────────────── */

function RaritySection({
  rarity,
  units,
  onUpdate,
  pendingIds,
}: {
  rarity: string;
  units: UnitRow[];
  onUpdate: (id: string, level: number) => void;
  pendingIds: Set<string>;
}) {
  const label = UNIT_CATEGORY_META[rarity]?.label ?? rarity;
  const accent = RARITY_ACCENT[rarity] ?? "border-gray-600 text-gray-300 bg-gray-900/60";
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;

  return (
    <div className="space-y-2">
      {/* Section header */}
      <div className={`flex items-center justify-between rounded-md border px-3 py-2 ${accent}`}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs opacity-60">{units.length} units</span>
        </div>
        <div className="flex items-center gap-4 text-xs opacity-70">
          <span>{obtained} obtained</span>
          <span>{trueForm} TF</span>
        </div>
      </div>

      {/* Unit grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onUpdate={onUpdate}
            pending={pendingIds.has(unit.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

const ALL_KEY = "ALL";

type CategoryMeta = { key: string; label: string };

export default function UnitsClient({ categories }: { categories: CategoryMeta[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_KEY);
  const [hideCollab, setHideCollab] = useState(false);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const allTabs = [{ key: ALL_KEY, label: "All" }, ...categories];

  /* Fetch all units for current filters */
  const fetchUnits = useCallback(async (cat: string, collab: boolean) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cat !== ALL_KEY) params.set("category", cat);
      if (collab) params.set("hideCollab", "true");
      const res = await fetch(`/api/units?${params}`);
      if (!res.ok) throw new Error("Failed to load units");
      const data = await res.json();
      setUnits(data.units);
    } catch {
      setError("Failed to load units. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits(activeCategory, hideCollab);
  }, [activeCategory, hideCollab, fetchUnits]);

  function handleTabChange(key: string) {
    setActiveCategory(key);
    setSearchQuery("");
  }

  async function handleUpdate(id: string, formLevel: number) {
    setUnits((prev) => prev.map((u) => (u.id === id ? { ...u, formLevel } : u)));
    setPendingIds((s) => new Set(s).add(id));
    try {
      const res = await fetch(`/api/units/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formLevel }),
      });
      if (!res.ok) throw new Error("save failed");
    } catch {
      await fetchUnits(activeCategory, hideCollab);
      setError("Failed to save. Please try again.");
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  /* Search filter */
  const filtered = searchQuery
    ? units.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(u.unitNumber).includes(searchQuery)
      )
    : units;

  /* Overall stats */
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;

  /* Group units by rarity for the "All" tab sectioned view */
  const grouped = RARITY_ORDER.reduce<Record<string, UnitRow[]>>((acc, rarity) => {
    const rarityUnits = filtered.filter((u) => u.category === rarity);
    if (rarityUnits.length > 0) acc[rarity] = rarityUnits;
    return acc;
  }, {});

  const showSections = activeCategory === ALL_KEY && !searchQuery;

  return (
    <div className="p-6 space-y-5 w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Unit Collection</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track each cat's form level — click a card to cycle forms.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap border-b border-gray-800 pb-3">
        {allTabs.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => handleTabChange(key)}
            className={`px-3 py-1.5 text-sm rounded transition-colors
              ${activeCategory === key
                ? "bg-amber-950/50 border border-amber-800 text-amber-300"
                : "text-gray-400 hover:text-gray-200 hover:bg-gray-900 border border-transparent"
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Obtained</div>
          <MiniBar value={obtained} total={units.length} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">True Form</div>
          <MiniBar value={trueForm} total={units.length} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-sm text-gray-300">{units.length} units</div>
        </div>
      </div>

      {/* Search + Collab toggle row */}
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or #…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0 max-w-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Clear
          </button>
        )}

        {/* Collab toggle */}
        <button
          type="button"
          onClick={() => setHideCollab((v) => !v)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs transition-colors ${
            hideCollab
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
          title="Collab units come from limited-time events, serial codes, or campaign downloads"
        >
          <span>{hideCollab ? "✓" : ""} Hide Collab</span>
        </button>

        <span className="text-xs text-gray-600 ml-auto">
          {filtered.length}{filtered.length !== units.length ? ` of ${units.length}` : ""} units
        </span>
      </div>

      {/* Form legend */}
      <div className="flex gap-3 flex-wrap text-xs">
        {FORM_LEVELS.map((f) => (
          <div key={f.level} className="flex items-center gap-1.5">
            <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${FORM_BADGE[f.level]}`}>
              {FORM_LABEL[f.level]}
            </span>
            <span className="text-gray-500">{f.label}</span>
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Grid / Sections */}
      {loading ? (
        <div className="text-sm text-gray-500 py-8 text-center">Loading units…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center">
          {searchQuery ? "No units match your search." : "No units found."}
        </div>
      ) : showSections ? (
        /* All-tab: show rarity section headers like the in-game Cat Guide */
        <div className="space-y-8">
          {RARITY_ORDER.filter((r) => grouped[r]).map((rarity) => (
            <RaritySection
              key={rarity}
              rarity={rarity}
              units={grouped[rarity]}
              onUpdate={handleUpdate}
              pendingIds={pendingIds}
            />
          ))}
        </div>
      ) : (
        /* Single-rarity tab or search results: flat grid */
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {filtered.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onUpdate={handleUpdate}
              pending={pendingIds.has(unit.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
