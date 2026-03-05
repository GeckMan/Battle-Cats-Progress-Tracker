"use client";

import { useEffect, useState, useCallback, useRef, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { FORM_LEVELS, UNIT_CATEGORY_META } from "@/lib/unit-catalog";

/* ── Types ─────────────────────────────────────────────────────────────── */

type EvolveItem = { id: number; name: string; count: number };
type EvolveData = { xp: number; items: EvolveItem[] };
type EvolutionData = { tf?: EvolveData; uf?: EvolveData } | null;

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
  evolutionData: EvolutionData;
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

/* ── Wiki URL helper ───────────────────────────────────────────────────── */

function wikiUrl(unitName: string) {
  const slug = unitName.replace(/\s+/g, "_").replace(/[#?&]/g, "");
  return `https://battlecats.miraheze.org/wiki/${encodeURIComponent(slug)}_(Cat)`;
}

/* ── Unit Detail Panel ─────────────────────────────────────────────────── */

function UnitDetailPanel({ unit, onClose }: { unit: UnitRow; onClose: () => void }) {
  const evo = unit.evolutionData;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-[380px] max-w-[90vw] bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto p-5 space-y-5 animate-slide-in">
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg">✕</button>
        <div className="flex items-center gap-4">
          <img
            src={spriteUrl(unit.unitNumber, Math.max(0, unit.formLevel - 1), unit.name)}
            alt={unit.name}
            width={72}
            height={72}
            className={`w-18 h-18 object-contain pixelated ${unit.formLevel === 0 ? "opacity-40 grayscale" : ""}`}
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-100">{unit.name}</h2>
            <p className="text-xs text-gray-500">#{unit.unitNumber} · {UNIT_CATEGORY_META[unit.category]?.label ?? unit.category}</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">Forms</div>
          <div className="flex flex-col gap-0.5 text-sm">
            <span className="text-gray-300">F1: {unit.name}</span>
            {unit.evolvedName && <span className="text-gray-300">F2: {unit.evolvedName}</span>}
            {unit.trueName && <span className="text-gray-300">TF: {unit.trueName}</span>}
            {unit.ultraName && <span className="text-gray-300">UF: {unit.ultraName}</span>}
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-gray-500 uppercase tracking-wide">How to Obtain</div>
          <p className="text-sm text-gray-300">{SOURCE_LABELS[unit.source ?? ""] ?? unit.source ?? "Unknown"}</p>
          {unit.setName && <p className="text-xs text-gray-500">{unit.setName}</p>}
        </div>
        {evo?.tf && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">True Form Evolution</div>
            <div className="rounded border border-gray-800 bg-gray-900/60 p-3 space-y-2">
              <div className="text-sm text-amber-300 font-medium">{evo.tf.xp.toLocaleString()} XP</div>
              <div className="flex flex-wrap gap-2">
                {evo.tf.items.map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-xs text-gray-300">
                    {item.name} <span className="text-amber-400 font-bold">×{item.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {evo?.uf && (
          <div className="space-y-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Ultra Form Evolution</div>
            <div className="rounded border border-purple-900/40 bg-purple-950/20 p-3 space-y-2">
              <div className="text-sm text-purple-300 font-medium">{evo.uf.xp.toLocaleString()} XP</div>
              <div className="flex flex-wrap gap-2">
                {evo.uf.items.map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-purple-800/40 bg-purple-900/30 text-xs text-gray-300">
                    {item.name} <span className="text-purple-300 font-bold">×{item.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        {!evo?.tf && !evo?.uf && (
          <div className="space-y-1">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Evolution</div>
            <p className="text-sm text-gray-500">
              {unit.formCount <= 2 ? "This unit does not have a True Form." : "Evolution data not available for this unit."}
            </p>
          </div>
        )}
        <a
          href={wikiUrl(unit.name)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-700 bg-gray-900 text-sm text-amber-400 hover:text-amber-300 hover:border-amber-800 transition-colors"
        >
          View on Wiki →
        </a>
      </div>
    </>
  );
}

/* ── Read-only Unit Card ───────────────────────────────────────────────── */

const UnitCard = memo(function UnitCard({ unit, onInfo }: { unit: UnitRow; onInfo?: (unit: UnitRow) => void }) {
  const level = unit.formLevel;
  const displayForm = Math.max(0, level - 1);
  const imgUrl = spriteUrl(unit.unitNumber, displayForm, unit.name);

  return (
    <div
      title={[
        unit.name,
        unit.evolvedName ? `→ ${unit.evolvedName}` : null,
        unit.trueName ? `→ ${unit.trueName}` : null,
        unit.ultraName ? `→ ${unit.ultraName}` : null,
        `\nCurrent: ${FORM_LABEL[level]}`,
      ].filter(Boolean).join(" ")}
      className={`group relative flex flex-col items-center rounded-lg border p-2 gap-1 ${cardTint(level)}`}
    >
      {/* Info icon */}
      {onInfo && (
        <button
          type="button"
          className="absolute top-1 left-1 w-5 h-5 rounded-full border border-gray-600 bg-gray-900/90 text-[10px] text-gray-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:border-amber-600 hover:text-amber-400 transition-opacity cursor-pointer z-10"
          onClick={() => onInfo(unit)}
          title="View details"
        >
          i
        </button>
      )}
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
        {displayName(unit)}
      </div>
    </div>
  );
});

/* ── Rarity Section ─────────────────────────────────────────────────────── */

function RaritySection({
  rarity,
  units,
  defaultOpen = true,
  onInfo,
}: {
  rarity: string;
  units: UnitRow[];
  defaultOpen?: boolean;
  onInfo?: (unit: UnitRow) => void;
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
            <UnitCard key={unit.id} unit={unit} onInfo={onInfo} />
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

export default function FriendUnitsClient(props: {
  userId: string;
  displayName: string;
  username: string;
}) {
  return (
    <Suspense fallback={<div className="p-4 pt-16 text-sm text-gray-500">Loading units…</div>}>
      <FriendUnitsInner {...props} />
    </Suspense>
  );
}

function FriendUnitsInner({
  userId,
  displayName,
  username,
}: {
  userId: string;
  displayName: string;
  username: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeCategory, setActiveCategory] = useState<string>(searchParams.get("cat") || ALL_KEY);
  const [hideCollab, setHideCollab] = useState(searchParams.get("hideCollab") === "1");
  const [hideUnowned, setHideUnowned] = useState(searchParams.get("hideUnowned") !== "0");
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
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);
  const [detailUnit, setDetailUnit] = useState<UnitRow | null>(null);
  const openDetail = useCallback((unit: UnitRow) => setDetailUnit(unit), []);

  /* ── Sync filter state → URL ── */
  const initialMount = useRef(true);
  useEffect(() => {
    if (initialMount.current) { initialMount.current = false; return; }
    const p = new URLSearchParams();
    if (activeCategory !== ALL_KEY) p.set("cat", activeCategory);
    if (hideCollab) p.set("hideCollab", "1");
    if (!hideUnowned) p.set("hideUnowned", "0");
    if (sourceFilter) p.set("source", sourceFilter);
    if (setFilter) p.set("set", setFilter);
    if (collabFilter) p.set("collab", collabFilter);
    if (searchQuery) p.set("q", searchQuery);
    const qs = p.toString();
    router.replace(qs ? `?${qs}` : `/social/${encodeURIComponent(username)}/units`, { scroll: false });
  }, [activeCategory, hideCollab, hideUnowned, sourceFilter, setFilter, collabFilter, searchQuery, router, username]);

  const allTabs = [{ key: ALL_KEY, label: "All" }, ...categories];

  /* Fetch units for the friend */
  const COLLABS_KEY = "__COLLABS__";
  const fetchUnits = useCallback(async (cat: string, collab: boolean, src: string, sn: string, cf: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("userId", userId);
      if (cat !== ALL_KEY) params.set("category", cat);
      if (collab) params.set("hideCollab", "true");
      if (src) params.set("source", src);
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
    setHideUnowned(true);
    setSearchQuery("");
  }

  /* Search + hide-unowned filter */
  let filtered = units;
  if (hideUnowned) filtered = filtered.filter((u) => u.formLevel > 0);
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        (u.evolvedName?.toLowerCase().includes(q) ?? false) ||
        (u.trueName?.toLowerCase().includes(q) ?? false) ||
        (u.ultraName?.toLowerCase().includes(q) ?? false) ||
        String(u.unitNumber).includes(searchQuery)
    );
  }

  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;
  const hasTrueForm = units.filter((u) => u.formCount >= 3).length;

  const grouped = RARITY_ORDER.reduce<Record<string, UnitRow[]>>((acc, rarity) => {
    const rarityUnits = filtered.filter((u) => u.category === rarity);
    if (rarityUnits.length > 0) acc[rarity] = rarityUnits;
    return acc;
  }, {});

  const showSections = activeCategory === ALL_KEY && !searchQuery;
  const hasActiveFilters = sourceFilter || setFilter || collabFilter || hideCollab || !hideUnowned;

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
          <MiniBar value={trueForm} total={hasTrueForm} />
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
          onChange={(v) => { setSourceFilter(v); setSetFilter(""); setCollabFilter(""); }}
          labelMap={SOURCE_LABELS}
        />

        {(!sourceFilter || sourceFilter === "RARE_CAPSULE") && availableSets.length > 0 && (
          <FilterSelect
            label="All Sets"
            value={setFilter}
            options={[...availableSets, ...(availableCollabSets.length > 0 ? [COLLABS_KEY] : [])]}
            onChange={(v) => { setSetFilter(v); setCollabFilter(""); }}
            labelMap={{ [COLLABS_KEY]: "Collabs" }}
          />
        )}

        {setFilter === COLLABS_KEY && availableCollabSets.length > 0 && (
          <FilterSelect
            label="All Collabs"
            value={collabFilter}
            options={availableCollabSets}
            onChange={setCollabFilter}
            labelMap={Object.fromEntries(availableCollabSets.map((c) => [c, c.replace(" Collaboration", "")]))}
          />
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
            <RaritySection key={rarity} rarity={rarity} units={grouped[rarity]} onInfo={openDetail} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {filtered.map((unit) => (
            <UnitCard key={unit.id} unit={unit} onInfo={openDetail} />
          ))}
        </div>
      )}

      {/* Detail panel */}
      {detailUnit && (
        <UnitDetailPanel unit={detailUnit} onClose={() => setDetailUnit(null)} />
      )}
    </div>
  );
}
