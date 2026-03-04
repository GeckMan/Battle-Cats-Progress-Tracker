"use client";

import { useEffect, useState, useCallback, useRef, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FORM_LEVELS, UNIT_CATEGORY_META } from "@/lib/unit-catalog";

/* ── Types ─────────────────────────────────────────────────────────────── */

type UnitRow = {
  id: string;
  unitNumber: number;
  name: string;
  evolvedName: string | null;
  trueName: string | null;
  ultraName: string | null;
  category: string;
  formCount: number;
  sortOrder: number;
  isCollab: boolean;
  source: string | null;
  setName: string | null;
  formLevel: number; // 0–4
};

/** Return the display name for the unit's current form level */
function displayName(unit: UnitRow): string {
  switch (unit.formLevel) {
    case 4: return unit.ultraName ?? unit.trueName ?? unit.name;
    case 3: return unit.trueName ?? unit.name;
    case 2: return unit.evolvedName ?? unit.name;
    default: return unit.name;
  }
}

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

// Human-readable source labels
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

// Form index → letter used in Miraheze filenames (F1=f, F2=c, TF=s, UF=u)
const FORM_LETTER = ["f", "c", "s", "u"] as const;

function spriteUrl(unitNumber: number, formIndex: number, unitName?: string) {
  // Ancient Egg units: base & evolved forms use shared egg sprite (non-standard
  // filenames like Uni007_m01.png that can't be derived from the unit number).
  // True Form (s00) and Ultra Form (u00) follow the standard naming.
  if (unitName?.startsWith("Ancient Egg") && formIndex <= 1) {
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

/* ── Single Unit Card ───────────────────────────────────────────────────── */

const UnitCard = memo(function UnitCard({
  unit,
  onUpdate,
  pending,
  selectionMode,
  selected,
  onToggleSelect,
}: {
  unit: UnitRow;
  onUpdate: (id: string, level: number) => void;
  pending: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
}) {
  const maxLevel = unit.formCount;
  const level = unit.formLevel;
  const preloaded = useRef(false);

  /** Preload all form sprites on first hover so cycling feels instant */
  function preloadSprites() {
    if (preloaded.current) return;
    preloaded.current = true;
    for (let i = 0; i < maxLevel; i++) {
      const img = new Image();
      img.src = spriteUrl(unit.unitNumber, i, unit.name);
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (selectionMode) {
      onToggleSelect?.(unit.id);
      return;
    }
    if (e.shiftKey) {
      // Shift+click → jump straight to max form
      if (level < maxLevel) {
        onUpdate(unit.id, maxLevel);
      } else {
        // Already at max — reset to 0
        onUpdate(unit.id, 0);
      }
    } else {
      const next = (level + 1) % (maxLevel + 1);
      onUpdate(unit.id, next);
    }
  }

  const displayForm = Math.max(0, level - 1); // formLevel 1 → form index 0 (f00)
  const imgUrl = spriteUrl(unit.unitNumber, displayForm, unit.name);

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseEnter={preloadSprites}
      disabled={pending && !selectionMode}
      title={selectionMode
        ? `${unit.name} — click to ${selected ? "deselect" : "select"}`
        : [
            unit.name,
            unit.evolvedName ? `→ ${unit.evolvedName}` : null,
            unit.trueName ? `→ ${unit.trueName}` : null,
            unit.ultraName ? `→ ${unit.ultraName}` : null,
            `\nCurrent: ${FORM_LABEL[level]} · Click to cycle · Shift+click for max`,
          ].filter(Boolean).join(" ")
      }
      className={`relative flex flex-col items-center rounded-lg border p-2 gap-1 transition-all
        ${selectionMode && selected ? "border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50" : cardTint(level)}
        ${pending && !selectionMode ? "opacity-50 cursor-not-allowed" : "hover:border-amber-700/60 hover:bg-amber-950/10 cursor-pointer"}
      `}
    >
      {/* Selection checkbox overlay */}
      {selectionMode && (
        <div className={`absolute top-1 right-1 w-4 h-4 rounded border text-[10px] flex items-center justify-center
          ${selected ? "bg-amber-600 border-amber-500 text-white" : "border-gray-600 bg-gray-900"}
        `}>
          {selected ? "✓" : ""}
        </div>
      )}

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

      {/* Unit name — shows current form name */}
      <div className="text-[10px] text-gray-400 text-center leading-tight line-clamp-2 w-full">
        {displayName(unit)}
      </div>
    </button>
  );
});

/* ── Rarity Section ─────────────────────────────────────────────────────── */

function RaritySection({
  rarity,
  units,
  onUpdate,
  pendingIds,
  defaultOpen = true,
  selectionMode,
  selectedIds,
  onToggleSelect,
}: {
  rarity: string;
  units: UnitRow[];
  onUpdate: (id: string, level: number) => void;
  pendingIds: Set<string>;
  defaultOpen?: boolean;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const label = UNIT_CATEGORY_META[rarity]?.label ?? rarity;
  const accent = RARITY_ACCENT[rarity] ?? "border-gray-600 text-gray-300 bg-gray-900/60";
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;

  return (
    <div className="space-y-2">
      {/* Section header — clickable to collapse */}
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

      {/* Unit grid — collapsible */}
      {open && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onUpdate={onUpdate}
              pending={pendingIds.has(unit.id)}
              selectionMode={selectionMode}
              selected={selectedIds?.has(unit.id)}
              onToggleSelect={onToggleSelect}
            />
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

type CategoryMeta = { key: string; label: string };

export default function UnitsClient({ categories }: { categories: CategoryMeta[] }) {
  return (
    <Suspense fallback={<div className="p-4 pt-16 text-sm text-gray-500">Loading units…</div>}>
      <UnitsClientInner categories={categories} />
    </Suspense>
  );
}

function UnitsClientInner({ categories }: { categories: CategoryMeta[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  /* ── Initialise filter state from URL params ── */
  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("cat") || ALL_KEY);
  const [hideCollab, setHideCollab] = useState(searchParams.get("hideCollab") === "1");
  const [sourceFilter, setSourceFilter] = useState(searchParams.get("source") || "");
  const [setFilter, setSetFilter] = useState(searchParams.get("set") || "");
  const [collabFilter, setCollabFilter] = useState(searchParams.get("collab") || "");
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

  const [units, setUnits] = useState<UnitRow[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [availableSets, setAvailableSets] = useState<string[]>([]);
  const [availableCollabSets, setAvailableCollabSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  /* ── Selection mode state ── */
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);

  /* ── Sync filter state → URL ── */
  const initialMount = useRef(true);
  useEffect(() => {
    // Skip the first render to avoid replacing the URL we just read from
    if (initialMount.current) { initialMount.current = false; return; }
    const p = new URLSearchParams();
    if (activeCategory !== ALL_KEY) p.set("cat", activeCategory);
    if (hideCollab) p.set("hideCollab", "1");
    if (sourceFilter) p.set("source", sourceFilter);
    if (setFilter) p.set("set", setFilter);
    if (collabFilter) p.set("collab", collabFilter);
    if (searchQuery) p.set("q", searchQuery);
    const qs = p.toString();
    router.replace(qs ? `?${qs}` : "/units", { scroll: false });
  }, [activeCategory, hideCollab, sourceFilter, setFilter, collabFilter, searchQuery, router]);

  const allTabs = [{ key: ALL_KEY, label: "All" }, ...categories];

  /* Fetch all units for current filters */
  const COLLABS_KEY = "__COLLABS__";
  const fetchUnits = useCallback(async (cat: string, collab: boolean, src: string, sn: string, cf: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (cat !== ALL_KEY) params.set("category", cat);
      if (collab) params.set("hideCollab", "true");
      if (src) params.set("source", src);
      // Handle collab grouping: specific collab selected → filter by that banner
      // "Collabs" selected with no sub-selection → show all collab units via source
      if (sn === COLLABS_KEY) {
        if (cf) {
          params.set("setName", cf);
        } else {
          params.set("source", "EVENT_CAPSULE");
        }
      } else if (sn) {
        params.set("setName", sn);
      }
      const res = await fetch(`/api/units?${params}`);
      if (!res.ok) throw new Error("Failed to load units");
      const data = await res.json();
      setUnits(data.units);
      if (data.sources) setAvailableSources(data.sources);
      if (data.sets) setAvailableSets(data.sets);
      if (data.collabSets) setAvailableCollabSets(data.collabSets);
    } catch {
      setError("Failed to load units. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits(activeCategory, hideCollab, sourceFilter, setFilter, collabFilter);
  }, [activeCategory, hideCollab, sourceFilter, setFilter, collabFilter, fetchUnits]);

  function handleTabChange(key: string) {
    setActiveCategory(key);
    setSearchQuery("");
  }

  function clearFilters() {
    setSourceFilter("");
    setSetFilter("");
    setCollabFilter("");
    setHideCollab(false);
    setSearchQuery("");
    exitSelectionMode();
  }

  /* ── Selection mode helpers ── */
  function exitSelectionMode() {
    setSelectionMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllVisible() {
    setSelectedIds(new Set(filtered.map((u) => u.id)));
  }

  async function handleBulkAction(formLevel: number) {
    if (selectedIds.size === 0) return;
    setBulkSaving(true);
    setError(null);
    // Optimistic update
    setUnits((prev) =>
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, formLevel: Math.min(formLevel, u.formCount) } : u))
    );
    try {
      const updates = [...selectedIds].map((unitId) => {
        const unit = units.find((u) => u.id === unitId);
        return { unitId, formLevel: Math.min(formLevel, unit?.formCount ?? formLevel) };
      });
      const res = await fetch("/api/units/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates }),
      });
      if (!res.ok) throw new Error("Bulk update failed");
      exitSelectionMode();
    } catch {
      // Revert on failure
      await fetchUnits(activeCategory, hideCollab, sourceFilter, setFilter, collabFilter);
      setError("Bulk update failed. Please try again.");
    } finally {
      setBulkSaving(false);
    }
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
      await fetchUnits(activeCategory, hideCollab, sourceFilter, setFilter, collabFilter);
      setError("Failed to save. Please try again.");
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  /* Search filter — matches across all form names */
  const filtered = searchQuery
    ? units.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          (u.evolvedName?.toLowerCase().includes(q) ?? false) ||
          (u.trueName?.toLowerCase().includes(q) ?? false) ||
          (u.ultraName?.toLowerCase().includes(q) ?? false) ||
          String(u.unitNumber).includes(searchQuery)
        );
      })
    : units;

  /* Overall stats */
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;
  const hasTrueForm = units.filter((u) => u.formCount >= 3).length;

  /* Group units by rarity for the "All" tab sectioned view */
  const grouped = RARITY_ORDER.reduce<Record<string, UnitRow[]>>((acc, rarity) => {
    const rarityUnits = filtered.filter((u) => u.category === rarity);
    if (rarityUnits.length > 0) acc[rarity] = rarityUnits;
    return acc;
  }, {});

  const showSections = activeCategory === ALL_KEY && !searchQuery;
  const hasActiveFilters = sourceFilter || setFilter || collabFilter || hideCollab;

  return (
    <div className="p-4 pt-16 md:p-6 space-y-5 w-full">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-100">Unit Collection</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Track each cat's form level — click to cycle, <span className="text-gray-400">Shift+click</span> to jump to max form.
        </p>
        <p className="text-xs text-gray-600 mt-0.5">Unit data current to game version 15.1.1</p>
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
          <MiniBar value={trueForm} total={hasTrueForm} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-sm text-gray-300">{units.length} units</div>
        </div>
      </div>

      {/* Search + filters row */}
      <div className="flex items-center gap-2 flex-wrap">
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

        {/* Source filter dropdown */}
        <FilterSelect
          label="All Sources"
          value={sourceFilter}
          options={availableSources}
          onChange={(v) => { setSourceFilter(v); setSetFilter(""); setCollabFilter(""); }}
          labelMap={SOURCE_LABELS}
        />

        {/* Set/collection filter dropdown — shown when source is Rare Cat Capsule or no source selected */}
        {(!sourceFilter || sourceFilter === "RARE_CAPSULE") && availableSets.length > 0 && (
          <FilterSelect
            label="All Sets"
            value={setFilter}
            options={[...availableSets, ...(availableCollabSets.length > 0 ? [COLLABS_KEY] : [])]}
            onChange={(v) => { setSetFilter(v); setCollabFilter(""); }}
            labelMap={{ [COLLABS_KEY]: "Collabs" }}
          />
        )}

        {/* Collab sub-filter — shown when "Collabs" is selected */}
        {setFilter === COLLABS_KEY && availableCollabSets.length > 0 && (
          <FilterSelect
            label="All Collabs"
            value={collabFilter}
            options={availableCollabSets}
            onChange={setCollabFilter}
            labelMap={Object.fromEntries(availableCollabSets.map((c) => [c, c.replace(" Collaboration", "")]))}
          />
        )}

        {/* Collab toggle */}
        <button
          type="button"
          onClick={() => setHideCollab((v) => !v)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            hideCollab
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
          title="Collab units come from limited-time events, serial codes, or campaign downloads"
        >
          <span>{hideCollab ? "✓" : ""} Hide Collab</span>
        </button>

        {/* Select mode toggle */}
        <button
          type="button"
          onClick={() => selectionMode ? exitSelectionMode() : setSelectionMode(true)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            selectionMode
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
        >
          <span>{selectionMode ? "✓" : ""} Select</span>
        </button>

        {/* Clear all filters */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-xs text-amber-600 hover:text-amber-400"
          >
            Clear filters
          </button>
        )}

        <span className="text-xs text-gray-600 ml-auto">
          {filtered.length}{filtered.length !== units.length ? ` of ${units.length}` : ""} units
        </span>
      </div>

      {/* Bulk action bar — shown in selection mode */}
      {selectionMode && (
        <div className="flex items-center gap-2 flex-wrap rounded-lg border border-amber-800 bg-amber-950/20 px-4 py-2.5">
          <span className="text-xs text-amber-300 font-medium mr-1">
            {selectedIds.size} selected
          </span>
          <button type="button" onClick={selectAllVisible} className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 border border-gray-700 rounded">
            Select All
          </button>
          <button type="button" onClick={() => setSelectedIds(new Set())} className="text-xs text-gray-400 hover:text-gray-200 px-2 py-1 border border-gray-700 rounded">
            Deselect All
          </button>
          <span className="w-px h-4 bg-gray-700 mx-1" />
          <span className="text-xs text-gray-500">Set to:</span>
          {[
            { level: 1, label: "F1", color: "border-yellow-700/60 text-yellow-300 hover:bg-yellow-950/50" },
            { level: 2, label: "F2", color: "border-red-700/60 text-red-300 hover:bg-red-950/50" },
            { level: 3, label: "TF", color: "border-gray-400 text-gray-100 hover:bg-gray-800" },
            { level: 4, label: "UF", color: "border-purple-500/60 text-purple-200 hover:bg-purple-950/50" },
            { level: 0, label: "Clear", color: "border-gray-700 text-gray-400 hover:bg-gray-900" },
          ].map((btn) => (
            <button
              key={btn.level}
              type="button"
              onClick={() => handleBulkAction(btn.level)}
              disabled={selectedIds.size === 0 || bulkSaving}
              className={`px-2 py-1 text-xs font-bold rounded border transition-colors disabled:opacity-40 ${btn.color}`}
            >
              {btn.label}
            </button>
          ))}
          <button type="button" onClick={exitSelectionMode} className="text-xs text-gray-500 hover:text-gray-300 ml-auto">
            Cancel
          </button>
        </div>
      )}

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

      {/* Unobtainable banner */}
      {sourceFilter === "UNOBTAINABLE" && (
        <div className="rounded border border-gray-700 bg-gray-900/60 px-4 py-2 text-sm text-gray-400">
          These units were from serial codes or other methods that are no longer available. They don't count towards your collection progress.
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
              selectionMode={selectionMode}
              selectedIds={selectedIds}
              onToggleSelect={toggleSelect}
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
              selectionMode={selectionMode}
              selected={selectedIds.has(unit.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
