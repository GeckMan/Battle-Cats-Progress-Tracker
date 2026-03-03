"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
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
  source: string | null;
  setName: string | null;
  formLevel: number; // 0–4
};

/* ── Constants ──────────────────────────────────────────────────────────── */

const RARITY_ORDER = [
  "NORMAL", "SPECIAL", "RARE", "SUPER_RARE", "UBER_RARE", "LEGEND_RARE",
] as const;

const RARITY_ACCENT: Record<string, string> = {
  NORMAL:      "border-gray-600 text-gray-300 bg-gray-900/60",
  SPECIAL:     "border-blue-800 text-blue-300 bg-blue-950/30",
  RARE:        "border-green-800 text-green-300 bg-green-950/30",
  SUPER_RARE:  "border-amber-700 text-amber-300 bg-amber-950/30",
  UBER_RARE:   "border-orange-700 text-orange-300 bg-orange-950/30",
  LEGEND_RARE: "border-red-700 text-red-300 bg-red-950/30",
};

const SOURCE_LABELS: Record<string, string> = {
  RARE_CAPSULE:      "Rare Cat Capsule",
  EVENT_CAPSULE:     "Collab",
  SEASONAL_EVENT:    "Seasonal Event",
  STAGE_DROP:        "Stage Drop",
  EMPIRE_OF_CATS:    "Empire of Cats",
  DAILY_LOGIN:       "Daily Login",
  CATNIP_CHALLENGES: "Catnip Challenges",
  SPECIAL_SALE:      "Special Sale",
  EXTERNAL_APP:      "External App",
  STAMP_REWARD:      "Stamp Reward",
  EASTER_EGG:        "Easter Egg",
  UNOBTAINABLE:      "Unobtainable",
};

const FORM_LETTER = ["f", "c", "s", "u"] as const;

function spriteUrl(unitNumber: number, formIndex: number, unitName?: string) {
  if (unitName?.startsWith("Ancient Egg") && formIndex <= 1) {
    return `/api/sprite?u=0&f=m`;
  }
  const letter = FORM_LETTER[formIndex] ?? "f";
  return `/api/sprite?u=${unitNumber}&f=${letter}`;
}

const FORM_BADGE: Record<number, string> = {
  0: "bg-gray-800 border-gray-700 text-gray-500",
  1: "bg-yellow-950/70 border-yellow-700/60 text-yellow-300",
  2: "bg-red-950/70 border-red-700/60 text-red-300",
  3: "bg-gray-900 border-gray-400 text-gray-100",
  4: "bg-purple-950/70 border-purple-500/60 text-purple-200",
};

const FORM_LABEL: Record<number, string> = {
  0: "—", 1: "F1", 2: "F2", 3: "TF", 4: "UF",
};

function cardTint(level: number) {
  if (level >= 4) return "bg-purple-950/20 border-purple-500/50";
  if (level === 3) return "bg-gray-950 border-gray-500/60";
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

/* ── Read-only Unit Card ───────────────────────────────────────────────── */

function UnitCard({ unit }: { unit: UnitRow }) {
  const level = unit.formLevel;
  const displayForm = Math.max(0, level - 1);
  const imgUrl = spriteUrl(unit.unitNumber, displayForm, unit.name);

  return (
    <div
      title={`${unit.name} — ${FORM_LABEL[level]}`}
      className={`relative flex flex-col items-center rounded-lg border p-2 gap-1 ${cardTint(level)}`}
    >
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
      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${FORM_BADGE[level]}`}>
        {FORM_LABEL[level]}
      </div>
      <div className="text-[10px] text-gray-400 text-center leading-tight line-clamp-2 w-full">
        {unit.name}
      </div>
    </div>
  );
}

/* ── Rarity Section ─────────────────────────────────────────────────────── */

function RaritySection({
  rarity,
  units,
  defaultOpen = true,
}: {
  rarity: string;
  units: UnitRow[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const label = UNIT_CATEGORY_META[rarity]?.label ?? rarity;
  const accent = RARITY_ACCENT[rarity] ?? "border-gray-600 text-gray-300 bg-gray-900/60";
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 cursor-pointer transition-colors hover:brightness-110 ${accent}`}
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>&#9654;</span>
          <span className="text-sm font-semibold">{label}</span>
          <span className="text-xs opacity-60">{units.length} units</span>
        </div>
        <div className="flex items-center gap-4 text-xs opacity-70">
          <span>{obtained} obtained</span>
          <span>{trueForm} TF</span>
        </div>
      </button>

      {open && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {units.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Filter Select ──────────────────────────────────────────────────────── */

function FilterSelect({
  label,
  value,
  options,
  onChange,
  labelMap,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  labelMap?: Record<string, string>;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-2 py-1.5 rounded border border-gray-700 bg-gray-900 text-xs text-gray-200 focus:outline-none focus:border-amber-700 max-w-[200px] truncate"
      title={label}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {labelMap?.[opt] ?? opt}
        </option>
      ))}
    </select>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

const ALL_KEY = "ALL";

export default function FriendUnitsClient({
  userId,
  displayName,
  username,
}: {
  userId: string;
  displayName: string;
  username: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_KEY);
  const [hideCollab, setHideCollab] = useState(false);
  const [hideUnowned, setHideUnowned] = useState(true);
  const [sourceFilter, setSourceFilter] = useState("");
  const [setFilter, setSetFilter] = useState("");
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [availableSets, setAvailableSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);

  const allTabs = [{ key: ALL_KEY, label: "All" }, ...categories];

  /* Fetch units for the friend */
  const fetchUnits = useCallback(async (cat: string, collab: boolean, src: string, sn: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("userId", userId);
      if (cat !== ALL_KEY) params.set("category", cat);
      if (collab) params.set("hideCollab", "true");
      if (src) params.set("source", src);
      if (sn) params.set("setName", sn);
      const res = await fetch(`/api/units?${params}`);
      if (!res.ok) throw new Error("Failed to load units");
      const data = await res.json();
      setUnits(data.units);
      if (data.sources) setAvailableSources(data.sources);
      if (data.sets) setAvailableSets(data.sets);

      // Derive category tabs from first fetch
      if (categories.length === 0) {
        const cats = new Set(data.units.map((u: UnitRow) => u.category));
        const ordered = RARITY_ORDER.filter((r) => cats.has(r));
        setCategories(ordered.map((k) => ({ key: k, label: UNIT_CATEGORY_META[k]?.label ?? k })));
      }
    } catch {
      setError("Failed to load units. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [userId, categories.length]);

  useEffect(() => {
    fetchUnits(activeCategory, hideCollab, sourceFilter, setFilter);
  }, [activeCategory, hideCollab, sourceFilter, setFilter, fetchUnits]);

  function handleTabChange(key: string) {
    setActiveCategory(key);
    setSearchQuery("");
  }

  function clearFilters() {
    setSourceFilter("");
    setSetFilter("");
    setHideCollab(false);
    setHideUnowned(true);
    setSearchQuery("");
  }

  /* Search + hide-unowned filter */
  let filtered = units;
  if (hideUnowned) filtered = filtered.filter((u) => u.formLevel > 0);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (u) => u.name.toLowerCase().includes(q) || String(u.unitNumber).includes(searchQuery)
    );
  }

  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;

  const grouped = RARITY_ORDER.reduce<Record<string, UnitRow[]>>((acc, rarity) => {
    const rarityUnits = filtered.filter((u) => u.category === rarity);
    if (rarityUnits.length > 0) acc[rarity] = rarityUnits;
    return acc;
  }, {});

  const showSections = activeCategory === ALL_KEY && !searchQuery;
  const hasActiveFilters = sourceFilter || setFilter || hideCollab || !hideUnowned;

  return (
    <div className="p-4 pt-16 md:p-6 space-y-5 w-full">

      {/* Header */}
      <div>
        <Link
          href={`/social/${encodeURIComponent(username)}`}
          className="text-xs text-amber-600 hover:text-amber-400 transition-colors mb-2 inline-block"
        >
          ← Back to Profile
        </Link>
        <h1 className="text-2xl font-semibold text-gray-100">
          {displayName}&apos;s Units
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Browsing their unit collection (read-only).
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
      <div className="grid grid-cols-3 gap-2 md:gap-3">
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

      {/* Search + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search by name or #…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0 max-w-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} className="text-xs text-gray-500 hover:text-gray-300">
            Clear
          </button>
        )}

        <FilterSelect
          label="All Sources"
          value={sourceFilter}
          options={availableSources}
          onChange={(v) => { setSourceFilter(v); setSetFilter(""); }}
          labelMap={SOURCE_LABELS}
        />

        {(!sourceFilter || sourceFilter === "RARE_CAPSULE") && availableSets.length > 0 && (
          <FilterSelect label="All Sets" value={setFilter} options={availableSets} onChange={setSetFilter} />
        )}

        <button
          type="button"
          onClick={() => setHideUnowned((v) => !v)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            hideUnowned
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
        >
          <span>{hideUnowned ? "✓" : ""} Owned Only</span>
        </button>

        <button
          type="button"
          onClick={() => setHideCollab((v) => !v)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            hideCollab
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
        >
          <span>{hideCollab ? "✓" : ""} Hide Collab</span>
        </button>

        {hasActiveFilters && (
          <button type="button" onClick={clearFilters} className="text-xs text-amber-600 hover:text-amber-400">
            Clear filters
          </button>
        )}

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
        <div className="space-y-8">
          {RARITY_ORDER.filter((r) => grouped[r]).map((rarity) => (
            <RaritySection key={rarity} rarity={rarity} units={grouped[rarity]} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {filtered.map((unit) => (
            <UnitCard key={unit.id} unit={unit} />
          ))}
        </div>
      )}
    </div>
  );
}
