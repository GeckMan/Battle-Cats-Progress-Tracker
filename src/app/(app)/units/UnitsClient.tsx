"use client";

import { useEffect, useState, useCallback, useRef, memo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { FORM_LEVELS, UNIT_CATEGORY_META } from "@/lib/unit-catalog";
import { useLongPress } from "@/lib/hooks/useLongPress";
import { PretextAccordion } from "@/components/PretextAccordion";
import { groupSetNames } from "@/lib/set-categories";

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
  catGuideOrder: number | null;
  isCollab: boolean;
  source: string | null;
  setName: string | null;
  evolutionData: EvolutionData;
  formLevel: number; // 0–4
};

/**
 * Compute the real max form level for a unit based on which form names exist.
 * formCount from the DB can overcount because BCData has placeholder text for
 * forms that don't actually exist in-game yet.
 *
 * Level 0 = not obtained, 1 = NF (base), 2 = EF (evolved), 3 = TF, 4 = UF
 * A unit only has a form if its corresponding name field is a real name
 * (not null and not matching a placeholder pattern like "817-1").
 */
const PLACEHOLDER_RE = /^[\d_\-.\s]+$/;
function isRealName(name: string | null): boolean {
  return !!name && !PLACEHOLDER_RE.test(name);
}

function realMaxForm(unit: UnitRow): number {
  // Every unit has at least F1 (level 1)
  let max = 1;
  if (isRealName(unit.evolvedName)) max = 2;
  if (isRealName(unit.trueName)) max = 3;
  if (isRealName(unit.ultraName)) max = 4;
  return max;
}

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
// NOTE: EVENT_CAPSULE used to be labeled "Collab" here, which was actively
// misleading — this source value just means "obtained via an event capsule
// banner" and is used for plenty of non-collab seasonal units (Li'l cats,
// Consultant Cat, Tasmanian Giant Crab, Ancient Egg: N202, Blue Shinobi's
// Lunar New Year capsule, etc.) as well as real collabs. Whether a unit is
// an actual real-world collaboration is what the separate isCollab field
// means, not this source value — see the Sets dropdown's "Collabs" option
// (src/app/api/units/route.ts's onlyCollab param) for that real filter.
const SOURCE_LABELS: Record<string, string> = {
  RARE_CAPSULE:        "Rare Cat Capsule",
  EVENT_CAPSULE:       "Event Capsule",
  SEASONAL_EVENT:      "Seasonal Event",
  STAGE_DROP:          "Stage Drop",
  EMPIRE_OF_CATS:      "Empire of Cats",
  DAILY_LOGIN:         "Daily Login",
  CATNIP_CHALLENGES:   "Catnip Challenges",
  SPECIAL_SALE:        "Special Sale",
  EXTERNAL_APP:        "External App",
  STAMP_REWARD:        "Stamp Reward",
  EASTER_EGG:          "Easter Egg",
  UNOBTAINABLE:        "Unobtainable",
  // Added 2026-07-14: units unlocked by clearing a specific story chapter
  // (e.g. Cat God the Great from Cats of the Cosmos Chapter 2) rather than
  // any kind of capsule/gacha/login mechanic — auto-detected by
  // sync-bcdata.ts's syncSourceFromReleaseOrder() from the Cat Release
  // Order wiki page's "<Story> - complete Chapter N" phrasing.
  STORY_CHAPTER_CLEAR: "Story Chapter Clear",
  // Added 2026-07-16: three distinct 13th Anniversary one-off unlock
  // mechanics, auto-detected by sync-bcdata.ts's syncSourceFromReleaseOrder()
  // from the Cat Release Order wiki page (Fedora Cat #832, Goggles Cat #834,
  // Ribbon Cat #835). STAGE_DROP already covers the Invasion-clear case
  // (Jagando Jr. #622) — no new label needed there.
  GAMATOTO_EXPEDITION: "Gamatoto Expedition",
  CAT_GUIDE_UNLOCK:    "Cat Guide",
  EVENT_POSTER:        "Event Poster",
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
  1: "NF",
  2: "EF",
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

/* ── Wiki URL helper ───────────────────────────────────────────────────── */

const WIKI_SUFFIX: Record<string, string> = {
  NORMAL:      "Normal_Cat",
  SPECIAL:     "Special_Cat",
  RARE:        "Rare_Cat",
  SUPER_RARE:  "Super_Rare_Cat",
  UBER_RARE:   "Uber_Rare_Cat",
  LEGEND_RARE: "Legend_Rare_Cat",
};

function wikiUrl(unitName: string, category: string) {
  // Don't strip "&" — several real unit names contain a literal ampersand
  // (e.g. "Chika Amatori & Cat", "Takuya & Yuki") and MediaWiki page titles
  // preserve it as-is; encodeURIComponent below already escapes it to %26
  // correctly. Confirmed 2026-07-13: stripping it produced a double
  // underscore and a 404 for every one of those units' wiki links. "#"/"?"
  // are still stripped since they're genuine URL delimiters, not known to
  // appear in any real unit name.
  const slug = unitName.replace(/\s+/g, "_").replace(/[#?]/g, "");
  const suffix = WIKI_SUFFIX[category] ?? "Cat";
  return `https://battlecats.miraheze.org/wiki/${encodeURIComponent(slug)}_(${suffix})`;
}

/* ── Unit Detail Panel ─────────────────────────────────────────────────── */

function UnitDetailPanel({
  unit,
  onClose,
}: {
  unit: UnitRow;
  onClose: () => void;
}) {
  const evo = unit.evolutionData;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-[380px] max-w-[90vw] bg-gray-950 border-l border-gray-800 z-50 overflow-y-auto p-5 space-y-5 animate-slide-in">
        {/* Close */}
        <button type="button" onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-300 text-lg">✕</button>

        {/* Header with sprite */}
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

        {/* Form names — accordion with pretext height calculation */}
        <PretextAccordion
          title="Forms"
          defaultOpen
          textContent={[
            `NF: ${unit.name}`,
            unit.evolvedName ? `EF: ${unit.evolvedName}` : "",
            unit.trueName ? `TF: ${unit.trueName}` : "",
            unit.ultraName ? `UF: ${unit.ultraName}` : "",
          ].filter(Boolean).join(" | ")}
          font='14px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif'
          lineHeight={22}
          extraHeight={8}
        >
          <div className="flex flex-col gap-0.5 text-sm pt-1">
            <span className="text-gray-300">NF: {unit.name}</span>
            {unit.evolvedName && <span className="text-gray-300">EF: {unit.evolvedName}</span>}
            {unit.trueName && <span className="text-gray-300">TF: {unit.trueName}</span>}
            {unit.ultraName && <span className="text-gray-300">UF: {unit.ultraName}</span>}
          </div>
        </PretextAccordion>

        {/* Source / How to obtain — accordion */}
        <PretextAccordion
          title="How to Obtain"
          defaultOpen
          textContent={`${SOURCE_LABELS[unit.source ?? ""] ?? unit.source ?? "Unknown"}${unit.setName ? " " + unit.setName : ""}`}
          lineHeight={21}
          extraHeight={4}
        >
          <div className="pt-1">
            <p className="text-sm text-gray-300">{SOURCE_LABELS[unit.source ?? ""] ?? unit.source ?? "Unknown"}</p>
            {unit.setName && <p className="text-xs text-gray-500 mt-0.5">{unit.setName}</p>}
          </div>
        </PretextAccordion>

        {/* Evolution — accordion (starts collapsed for cleaner look) */}
        {evo?.tf && (
          <PretextAccordion
            title="True Form Evolution"
            defaultOpen={false}
            accentColor="rgb(252 211 77)"
            extraHeight={80 + (evo.tf.items.length * 32)}
          >
            <div className="rounded border border-gray-800 bg-gray-900/60 p-3 space-y-2 mt-1">
              <div className="text-sm text-amber-300 font-medium">{evo.tf.xp.toLocaleString()} XP</div>
              <div className="flex flex-wrap gap-2">
                {evo.tf.items.map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-gray-700 bg-gray-800 text-xs text-gray-300">
                    {item.name} <span className="text-amber-400 font-bold">&times;{item.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </PretextAccordion>
        )}

        {evo?.uf && (
          <PretextAccordion
            title="Ultra Form Evolution"
            defaultOpen={false}
            accentColor="rgb(192 132 252)"
            extraHeight={80 + (evo.uf.items.length * 32)}
          >
            <div className="rounded border border-purple-900/40 bg-purple-950/20 p-3 space-y-2 mt-1">
              <div className="text-sm text-purple-300 font-medium">{evo.uf.xp.toLocaleString()} XP</div>
              <div className="flex flex-wrap gap-2">
                {evo.uf.items.map((item) => (
                  <span key={item.id} className="inline-flex items-center gap-1 px-2 py-1 rounded border border-purple-800/40 bg-purple-900/30 text-xs text-gray-300">
                    {item.name} <span className="text-purple-300 font-bold">&times;{item.count}</span>
                  </span>
                ))}
              </div>
            </div>
          </PretextAccordion>
        )}

        {!evo?.tf && !evo?.uf && (
          <PretextAccordion title="Evolution" defaultOpen>
            <p className="text-sm text-gray-500 pt-1">
              {realMaxForm(unit) <= 2
                ? "This unit does not have a True Form."
                : "Evolution data not available for this unit."}
            </p>
          </PretextAccordion>
        )}

        {/* Wiki link */}
        <a
          href={wikiUrl(unit.name, unit.category)}
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

/* ── Single Unit Card ───────────────────────────────────────────────────── */

const UnitCard = memo(function UnitCard({
  unit,
  onUpdate,
  pending,
  selectionMode,
  selected,
  onToggleSelect,
  onInfo,
  focused,
}: {
  unit: UnitRow;
  onUpdate: (id: string, level: number) => void;
  pending: boolean;
  selectionMode?: boolean;
  selected?: boolean;
  onToggleSelect?: (id: string) => void;
  onInfo?: (unit: UnitRow) => void;
  focused?: boolean;
}) {
  const maxLevel = realMaxForm(unit);
  const level = Math.min(unit.formLevel, maxLevel); // clamp in case DB has a higher level than available forms
  const preloaded = useRef(false);

  /* Long-press to open info panel */
  const { handlers: lpHandlers, pressActive, longPressed } = useLongPress({
    onLongPress: () => onInfo?.(unit),
  });

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
    // After a long-press, suppress the click that follows touch release
    if (longPressed.current) { longPressed.current = false; return; }

    if (selectionMode) {
      onToggleSelect?.(unit.id);
      return;
    }
    if (e.shiftKey) {
      if (level < maxLevel) {
        onUpdate(unit.id, maxLevel);
      } else {
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
      {...lpHandlers}
      disabled={pending && !selectionMode}
      style={{ touchAction: "manipulation" }}
      title={selectionMode
        ? `${unit.name}: click to ${selected ? "deselect" : "select"}`
        : [
            unit.name,
            unit.evolvedName ? `→ ${unit.evolvedName}` : null,
            unit.trueName ? `→ ${unit.trueName}` : null,
            unit.ultraName ? `→ ${unit.ultraName}` : null,
            `\nCurrent: ${FORM_LABEL[level]} · Click to cycle · Shift+click for max`,
          ].filter(Boolean).join(" ")
      }
      className={`group relative flex flex-col items-center rounded-lg border p-2 gap-1 transition-all
        ${selectionMode && selected ? "border-amber-500 bg-amber-950/40 ring-1 ring-amber-500/50" : cardTint(level)}
        ${pending && !selectionMode ? "opacity-50 cursor-not-allowed" : "hover:border-amber-700/60 hover:bg-amber-950/10 cursor-pointer"}
        ${focused ? "ring-2 ring-amber-500/70" : ""}
        ${pressActive ? "long-press-active" : ""}
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

      {/* Info icon — visible on hover (desktop) or always (touch devices) */}
      {!selectionMode && onInfo && (
        <div
          className="info-icon-hover absolute top-1 left-1 w-5 h-5 rounded-full border border-gray-600 bg-gray-900/90 text-[10px] text-gray-400 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:!opacity-100 hover:border-amber-600 hover:text-amber-400 transition-opacity cursor-pointer z-10"
          onClick={(e) => { e.stopPropagation(); onInfo(unit); }}
          title="View details"
        >
          i
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
          onError={(e) => {
            // If current form sprite doesn't exist, try falling back to previous form
            const img = e.currentTarget;
            if (displayForm > 0) {
              const prevUrl = spriteUrl(unit.unitNumber, displayForm - 1, unit.name);
              if (img.src !== prevUrl && !img.src.endsWith(prevUrl.split("?")[1])) {
                img.src = prevUrl;
                return;
              }
            }
            img.style.opacity = "0";
          }}
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
  onInfo,
}: {
  rarity: string;
  units: UnitRow[];
  onUpdate: (id: string, level: number) => void;
  pendingIds: Set<string>;
  defaultOpen?: boolean;
  selectionMode?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onInfo?: (unit: UnitRow) => void;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const label = UNIT_CATEGORY_META[rarity]?.label ?? rarity;
  const accent = RARITY_ACCENT[rarity] ?? "border-gray-600 text-gray-300 bg-gray-900/60";
  const obtained = units.filter((u) => u.formLevel > 0).length;
  // "Maxed" — obtained AND already at that unit's own highest real form
  // (see the matching comment on the global stats bar for why this
  // replaced a flat formLevel >= 3 "TF" count).
  const maxedForm = units.filter((u) => u.formLevel > 0 && u.formLevel === realMaxForm(u)).length;

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
          <span>{maxedForm} Maxed</span>
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
              onInfo={onInfo}
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
  groups,
  onChange,
  labelMap,
}: {
  label: string;
  value: string;
  // Flat option list — used as-is by filters that don't need sectioning
  // (e.g. Sources), and as trailing ungrouped extras after `groups` (e.g.
  // the synthetic "Collabs" entry, which intentionally stands apart from
  // any category since it opens its own drill-down submenu).
  options?: string[];
  // Optional <optgroup> sections, rendered before any flat `options`.
  groups?: { label: string; sets: string[] }[];
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
      {groups?.map((g) => (
        <optgroup key={g.label} label={g.label}>
          {g.sets.map((opt) => (
            <option key={opt} value={opt}>
              {labelMap?.[opt] ?? opt}
            </option>
          ))}
        </optgroup>
      ))}
      {options?.map((opt) => (
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
  // "Cat Guide Order" (default, since 2026-07-21) uses catGuideOrder,
  // scraped from the wiki's Cat_Guide page, which reproduces the real
  // in-game Cat Guide screen's grouping/order (confirmed genuinely
  // different from release order — Ryan, 2026-07-21). Falls back to
  // sortOrder for any unit the wiki hasn't caught up to yet (null
  // catGuideOrder), so nothing silently disappears from the grid.
  // "Release Order" sorts by sortOrder — release/unit-ID order within
  // each rarity — and is opt-in.
  //
  // Priority for the initial value: an explicit `order` URL param wins
  // (so shared links behave predictably), then a previously-saved
  // preference in localStorage (so the toggle sticks across refreshes —
  // Ryan, 2026-07-21), then the catGuide default.
  const ORDER_MODE_STORAGE_KEY = "bcp:unitsOrderMode";
  const [orderMode, setOrderMode] = useState<"release" | "catGuide">(() => {
    const urlOrder = searchParams.get("order");
    if (urlOrder === "release" || urlOrder === "catGuide") return urlOrder;
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(ORDER_MODE_STORAGE_KEY);
      if (saved === "release" || saved === "catGuide") return saved;
    }
    return "catGuide";
  });

  // Persist the toggle whenever it changes so it survives a refresh.
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ORDER_MODE_STORAGE_KEY, orderMode);
    }
  }, [orderMode]);

  const [units, setUnits] = useState<UnitRow[]>([]);
  const [availableSources, setAvailableSources] = useState<string[]>([]);
  const [availableSets, setAvailableSets] = useState<string[]>([]);
  const [availableCollabSets, setAvailableCollabSets] = useState<string[]>([]);
  const [bcDataVersion, setBcDataVersion] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());

  /* ── Selection mode state ── */
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkSaving, setBulkSaving] = useState(false);

  /* ── Detail panel state ── */
  const [detailUnit, setDetailUnit] = useState<UnitRow | null>(null);
  const openDetail = useCallback((unit: UnitRow) => setDetailUnit(unit), []);

  /* ── Keyboard navigation ── */
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const gridRef = useRef<HTMLDivElement>(null);
  const filteredRef = useRef<UnitRow[]>([]);

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
    if (orderMode === "release") p.set("order", "release");
    const qs = p.toString();
    router.replace(qs ? `?${qs}` : "/units", { scroll: false });
  }, [activeCategory, hideCollab, sourceFilter, setFilter, collabFilter, searchQuery, orderMode, router]);

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
      // "Collabs" selected with no sub-selection → show all collab units via
      // the real isCollab field (previously sent source=EVENT_CAPSULE, which
      // was wrong: plenty of real collabs use other sources, and plenty of
      // non-collab seasonal units use EVENT_CAPSULE too).
      if (sn === COLLABS_KEY) {
        if (cf) {
          params.set("setName", cf);
        } else {
          params.set("onlyCollab", "true");
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
      if (data.bcDataVersion !== undefined) setBcDataVersion(data.bcDataVersion);
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
      prev.map((u) => (selectedIds.has(u.id) ? { ...u, formLevel: Math.min(formLevel, realMaxForm(u)) } : u))
    );
    try {
      const updates = [...selectedIds].map((unitId) => {
        const unit = units.find((u) => u.id === unitId);
        return { unitId, formLevel: Math.min(formLevel, unit ? realMaxForm(unit) : formLevel) };
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

  // Cat Guide order — reorders within each rarity section using the real
  // in-game Cat Guide screen's position instead of release/unit-ID order.
  // Units the wiki hasn't caught up to yet (null catGuideOrder) fall back
  // to sortOrder so they still appear, just at their release-order spot.
  const orderedUnits = orderMode === "catGuide"
    ? [...units].sort((a, b) => {
        const av = a.catGuideOrder ?? Number.MAX_SAFE_INTEGER;
        const bv = b.catGuideOrder ?? Number.MAX_SAFE_INTEGER;
        return av !== bv ? av - bv : a.sortOrder - b.sortOrder;
      })
    : units;

  /* Search filter — matches across all form names */
  const filtered = searchQuery
    ? orderedUnits.filter((u) => {
        const q = searchQuery.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          (u.evolvedName?.toLowerCase().includes(q) ?? false) ||
          (u.trueName?.toLowerCase().includes(q) ?? false) ||
          (u.ultraName?.toLowerCase().includes(q) ?? false) ||
          String(u.unitNumber).includes(searchQuery)
        );
      })
    : orderedUnits;

  // Keep ref in sync for keyboard handler
  filteredRef.current = filtered;

  // Compute columns from the grid container width
  const getGridCols = useCallback(() => {
    const el = gridRef.current;
    if (!el) return 1;
    const style = getComputedStyle(el);
    return style.gridTemplateColumns.split(" ").length || 1;
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;

      if (e.key === "Escape") {
        if (detailUnit) { setDetailUnit(null); e.preventDefault(); return; }
        if (selectionMode) { exitSelectionMode(); e.preventDefault(); return; }
        if (focusedIdx >= 0) { setFocusedIdx(-1); e.preventDefault(); return; }
        return;
      }

      const list = filteredRef.current;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        if (list.length === 0) return;
        const cols = getGridCols();
        setFocusedIdx((prev) => {
          if (prev < 0) return 0;
          switch (e.key) {
            case "ArrowRight": return Math.min(prev + 1, list.length - 1);
            case "ArrowLeft": return Math.max(prev - 1, 0);
            case "ArrowDown": return Math.min(prev + cols, list.length - 1);
            case "ArrowUp": return Math.max(prev - cols, 0);
            default: return prev;
          }
        });
        return;
      }

      if (focusedIdx < 0 || focusedIdx >= list.length) return;
      const unit = list[focusedIdx];

      if (/^[0-4]$/.test(e.key)) {
        const level = Number(e.key);
        if (level <= realMaxForm(unit)) handleUpdate(unit.id, level);
        return;
      }
      if (e.key === "i" || e.key === "I") { setDetailUnit(unit); return; }
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const maxForm = realMaxForm(unit);
        if (selectionMode) { toggleSelect(unit.id); }
        else { handleUpdate(unit.id, (unit.formLevel + 1) % (maxForm + 1)); }
        return;
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIdx, detailUnit, selectionMode, getGridCols]);

  // Reset focus when filters change
  useEffect(() => { setFocusedIdx(-1); }, [activeCategory, sourceFilter, setFilter, collabFilter, searchQuery, hideCollab]);

  // Scroll focused card into view
  useEffect(() => {
    if (focusedIdx < 0) return;
    const el = gridRef.current?.children[focusedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [focusedIdx]);

  /* Overall stats */
  const obtained = units.filter((u) => u.formLevel > 0).length;
  // "Maxed" — obtained AND at that unit's own highest real form, rather
  // than a flat formLevel >= 3 check. Some units cap out at Evolved Form
  // (no True Form at all) and some go all the way to Ultra Form, so
  // counting "True Form" specifically both under- and over-counted what
  // people actually want to track: which units still need evolving
  // further. Setredid's Discord suggestion, 2026-07-22. The denominator
  // is `obtained` (not total units) since a unit can only be "maxed" once
  // you actually have it.
  const maxedForm = units.filter((u) => u.formLevel > 0 && u.formLevel === realMaxForm(u)).length;

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
          Track each cat's form level. Click to cycle, <span className="text-gray-400">Shift+click</span> to jump to max form.
        </p>
        <p className="text-xs text-gray-600 mt-0.5">
          {bcDataVersion && <>Unit data current to game version {bcDataVersion} · </>}
          <span className="text-gray-700">Arrow keys to navigate, 0-4 to set form, i for info</span>
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
          <div className="text-xs text-gray-500 mb-1">Maxed</div>
          <MiniBar value={maxedForm} total={obtained} />
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
            groups={groupSetNames(availableSets)}
            options={availableCollabSets.length > 0 ? [COLLABS_KEY] : []}
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

        {/* Cat Guide order (real in-game Cat Guide screen's grouping,
            scraped from the wiki) is the untoggled/default state. Toggling
            this ON switches to Release Order (sortOrder / unit-ID order)
            instead — the static "Release Order" label names the state the
            toggle switches TO, so clicking it does what it says
            — Ryan, 2026-07-21. Choice is saved to localStorage so it
            survives a refresh. */}
        <label
          className="flex items-center gap-2 px-2 py-1.5 rounded border border-gray-700 text-xs text-gray-300 cursor-pointer select-none"
          title="Units are sorted by the in-game Cat Guide order by default. Toggle to switch to Release Order (sortOrder / unit-ID order) instead."
        >
          <span>Release Order</span>
          <button
            type="button"
            role="switch"
            aria-checked={orderMode === "release"}
            onClick={() => setOrderMode((v) => (v === "catGuide" ? "release" : "catGuide"))}
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
              orderMode === "release" ? "bg-amber-600" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                orderMode === "release" ? "translate-x-4" : "translate-x-0.5"
              }`}
            />
          </button>
        </label>

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
            { level: 1, label: "NF", color: "border-yellow-700/60 text-yellow-300 hover:bg-yellow-950/50" },
            { level: 2, label: "EF", color: "border-red-700/60 text-red-300 hover:bg-red-950/50" },
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
              onInfo={openDetail}
            />
          ))}
        </div>
      ) : (
        /* Single-rarity tab or search results: flat grid */
        <div ref={gridRef} className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2">
          {filtered.map((unit, idx) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onUpdate={handleUpdate}
              pending={pendingIds.has(unit.id)}
              selectionMode={selectionMode}
              selected={selectedIds.has(unit.id)}
              onToggleSelect={toggleSelect}
              onInfo={openDetail}
              focused={focusedIdx === idx}
            />
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
