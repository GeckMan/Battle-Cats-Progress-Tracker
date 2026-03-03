"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { FORM_LEVELS, UNIT_CATEGORY_META } from "@/lib/unit-catalog";

/* ── Types ─────────────────────────────────────────────────────────────── */

type UnitRow = {
  id: string;
  unitNumber: number;
  name: string;
  category: string;
  formCount: number;
  sortOrder: number;
  formLevel: number; // 0–3 (or 0–4 if 4-form unit)
};

type CategoryMeta = { key: string; label: string };

/* ── Sprite URL helper ──────────────────────────────────────────────────── */

function spriteUrl(unitNumber: number, form: number) {
  // form: 0 = F1, 1 = F2, 2 = TF, 3 = UF
  const num = String(unitNumber).padStart(3, "0");
  const f = String(form).padStart(2, "0");
  return `https://battlecats-db.com/unit/img/uni${num}${f}.png`;
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

/* ── Card tint based on form level ─────────────────────────────────────── */

function cardTint(level: number) {
  if (level >= 3) return "bg-gray-950 border-gray-500/60";
  if (level === 2) return "bg-red-950/10 border-red-900/40";
  if (level === 1) return "bg-yellow-950/10 border-yellow-900/40";
  return "bg-black border-gray-800";
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
  const maxLevel = unit.formCount; // 3 or 4
  const level = unit.formLevel;

  function cycle() {
    const next = (level + 1) % (maxLevel + 1);
    onUpdate(unit.id, next);
  }

  // Display the sprite for the current form (or form 0 if not obtained)
  const displayForm = Math.max(0, level - 1); // formLevel 1 = form index 0 (f00)
  const imgUrl = spriteUrl(unit.unitNumber, displayForm);

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
          className={`w-14 h-14 object-contain pixelated select-none ${level === 0 ? "opacity-30 grayscale" : ""}`}
          onError={(e) => {
            // Fallback: try alternate sprite CDN
            const el = e.currentTarget;
            if (!el.dataset.fallback) {
              el.dataset.fallback = "1";
              const num = String(unit.unitNumber).padStart(3, "0");
              el.src = `https://battlecats.miraheze.org/wiki/Special:FilePath/Unit_icon_${num}_f00.png`;
            }
          }}
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
      <span className="text-xs text-gray-500 w-12 text-right">{value}/{total}</span>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

const ALL_KEY = "ALL";

export default function UnitsClient({ categories }: { categories: CategoryMeta[] }) {
  const [activeCategory, setActiveCategory] = useState<string>(ALL_KEY);
  const [page, setPage] = useState(1);
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const perPage = 60;

  const allTabs = [{ key: ALL_KEY, label: "All" }, ...categories];

  /* Fetch units for current tab + page */
  const fetchUnits = useCallback(async (cat: string, p: number) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(p) });
      if (cat !== ALL_KEY) params.set("category", cat);
      const res = await fetch(`/api/units?${params}`);
      if (!res.ok) throw new Error("Failed to load units");
      const data = await res.json();
      setUnits(data.units);
      setTotal(data.total);
    } catch (e) {
      setError("Failed to load units. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUnits(activeCategory, page);
  }, [activeCategory, page, fetchUnits]);

  function handleTabChange(key: string) {
    setActiveCategory(key);
    setPage(1);
    setSearchQuery("");
  }

  async function handleUpdate(id: string, formLevel: number) {
    // Optimistic update
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
      // Rollback
      await fetchUnits(activeCategory, page);
      setError("Failed to save. Please try again.");
    } finally {
      setPendingIds((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }
  }

  /* Filtered units based on search */
  const filtered = searchQuery
    ? units.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(u.unitNumber).includes(searchQuery)
      )
    : units;

  /* Stats for current category */
  const obtained = units.filter((u) => u.formLevel > 0).length;
  const trueForm = units.filter((u) => u.formLevel >= 3).length;
  const totalDisplayed = units.length;

  const totalPages = Math.ceil(total / perPage);

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
          <MiniBar value={obtained} total={totalDisplayed} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">True Form</div>
          <MiniBar value={trueForm} total={totalDisplayed} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Total Shown</div>
          <div className="text-sm text-gray-300">{total} units</div>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or #…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 max-w-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700"
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
        <span className="text-xs text-gray-600 ml-auto">
          {filtered.length} {filtered.length !== units.length ? `of ${units.length}` : ""} units
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

      {/* Grid */}
      {loading ? (
        <div className="text-sm text-gray-500 py-8 text-center">Loading units…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center">
          {searchQuery ? "No units match your search." : "No units found. Import a CSV to populate the catalog."}
        </div>
      ) : (
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

      {/* Pagination */}
      {!searchQuery && totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="text-xs text-gray-500">
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="text-xs px-3 py-1.5 rounded border border-gray-700 text-gray-400 hover:text-gray-200 hover:bg-gray-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
