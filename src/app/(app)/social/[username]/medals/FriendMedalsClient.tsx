"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";

/* ── Types ─────────────────────────────────────────────────────────────── */

type MedalRow = {
  id: string;
  name: string;
  description: string;
  category: string | null;
  earned: boolean;
  imageFile: string | null;
};

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

/* ── Medal Token (read-only) ────────────────────────────────────────────── */

function MedalToken({ medal }: { medal: MedalRow }) {
  const base =
    "w-24 h-24 rounded-full border flex items-center justify-center select-none overflow-hidden";
  const locked = "bg-gray-950 border-gray-800 opacity-60";
  const unlocked = "bg-transparent border-amber-700 ring-1 ring-amber-900";
  const tip = `${medal.name}\n${medal.description}`;
  const localSrc = medal.imageFile ? `/medals/${medal.imageFile}` : null;

  return (
    <div className={`${base} ${medal.earned ? unlocked : locked}`} title={tip}>
      {localSrc ? (
        <img
          src={localSrc}
          alt={medal.name}
          loading="lazy"
          className={
            medal.earned
              ? "w-full h-full object-cover pointer-events-none"
              : "w-full h-full object-cover opacity-40 pointer-events-none grayscale"
          }
        />
      ) : (
        <span className={`text-lg font-semibold ${medal.earned ? "text-amber-400" : "text-gray-600"}`}>
          {medal.earned ? "★" : "?"}
        </span>
      )}
    </div>
  );
}

/* ── Category Section ───────────────────────────────────────────────────── */

function CategorySection({
  category,
  medals,
  defaultOpen = true,
}: {
  category: string;
  medals: MedalRow[];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const earned = medals.filter((m) => m.earned).length;

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between rounded-md border border-amber-800/40 bg-amber-950/20 px-3 py-2 cursor-pointer transition-colors hover:brightness-110 text-amber-300"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xs transition-transform ${open ? "rotate-90" : ""}`}>&#9654;</span>
          <span className="text-sm font-semibold">{category}</span>
          <span className="text-xs opacity-60">{medals.length} medals</span>
        </div>
        <div className="text-xs opacity-70">
          {earned}/{medals.length} earned
        </div>
      </button>

      {open && (
        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))" }}
        >
          {medals.map((m) => (
            <MedalToken key={m.id} medal={m} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function FriendMedalsClient({
  userId,
  displayName,
  username,
}: {
  userId: string;
  displayName: string;
  username: string;
}) {
  const [medals, setMedals] = useState<MedalRow[]>([]);
  const [total, setTotal] = useState(0);
  const [earnedCount, setEarnedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hideUnearned, setHideUnearned] = useState(true);

  const fetchMedals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/meow-medals?userId=${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error("Failed to load medals");
      const data = await res.json();
      setMedals(data.medals);
      setTotal(data.total);
      setEarnedCount(data.earned);
    } catch {
      setError("Failed to load medals. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetchMedals(); }, [fetchMedals]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = medals;
    if (hideUnearned) result = result.filter((m) => m.earned);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [medals, hideUnearned, searchQuery]);

  /* Group by category */
  const categories = useMemo(() => {
    const map = new Map<string, MedalRow[]>();
    for (const m of filtered) {
      const cat = m.category ?? "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(m);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const hasActiveFilters = searchQuery || !hideUnearned;

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
          {displayName}&apos;s Medals
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Browsing their medal collection (read-only).
        </p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Earned</div>
          <MiniBar value={earnedCount} total={total} />
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Completion</div>
          <div className="text-sm text-gray-300">
            {total === 0 ? "0" : Math.round((earnedCount / total) * 100)}%
          </div>
        </div>
        <div className="border border-gray-700 rounded-lg p-3 bg-black">
          <div className="text-xs text-gray-500 mb-1">Total</div>
          <div className="text-sm text-gray-300">{total} medals</div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <input
          type="text"
          placeholder="Search medals..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 min-w-0 max-w-xs px-3 py-1.5 rounded border border-gray-700 bg-gray-900 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-700"
        />
        {searchQuery && (
          <button type="button" onClick={() => setSearchQuery("")} className="text-xs text-gray-500 hover:text-gray-300">
            Clear
          </button>
        )}

        <button
          type="button"
          onClick={() => setHideUnearned((v) => !v)}
          className={`flex items-center gap-2 px-2 py-1.5 rounded border text-xs transition-colors ${
            hideUnearned
              ? "bg-amber-950/50 border-amber-700 text-amber-300"
              : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
          }`}
        >
          <span>{hideUnearned ? "✓" : ""} Earned Only</span>
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setSearchQuery(""); setHideUnearned(true); }}
            className="text-xs text-amber-600 hover:text-amber-400"
          >
            Clear filters
          </button>
        )}

        <span className="text-xs text-gray-600 ml-auto">
          {filtered.length}{filtered.length !== medals.length ? ` of ${medals.length}` : ""} medals
        </span>
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
        <div className="text-sm text-gray-500 py-8 text-center">Loading medals…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gray-500 py-8 text-center">
          {searchQuery ? "No medals match your search." : hideUnearned ? "No earned medals yet." : "No medals found."}
        </div>
      ) : categories.length > 1 ? (
        <div className="space-y-6">
          {categories.map(([cat, items]) => (
            <CategorySection key={cat} category={cat} medals={items} />
          ))}
        </div>
      ) : (
        <div
          className="grid gap-2.5"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))" }}
        >
          {filtered.map((m) => (
            <MedalToken key={m.id} medal={m} />
          ))}
        </div>
      )}
    </div>
  );
}
