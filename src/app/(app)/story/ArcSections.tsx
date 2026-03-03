"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  cleared: boolean;
  treasures: "NONE" | "PARTIAL" | "ALL";
  zombies: "NONE" | "PARTIAL" | "ALL";
  chapter: {
    id: string;
    arc: string;
    chapterNumber: number;
    displayName: string;
    sortOrder: number;
  };
};

type Group = {
  arc: string;
  rows: Row[];
};

function arcLabel(arc: string) {
  if (arc === "EoC")  return "Empire of Cats";
  if (arc === "ItF")  return "Into the Future";
  if (arc === "CotC") return "Cats of the Cosmos";
  return arc;
}

function arcShort(arc: string) {
  if (arc === "EoC")  return "EoC";
  if (arc === "ItF")  return "ItF";
  if (arc === "CotC") return "CotC";
  return arc;
}

/** Compute a 0-100 overall % for a row (cleared + both treasures + zombies = 3 metrics). */
function rowPct(r: Row) {
  let score = 0;
  if (r.cleared)              score += 34;
  if (r.treasures === "ALL")  score += 33;
  else if (r.treasures === "PARTIAL") score += 17;
  if (r.zombies === "ALL")    score += 33;
  else if (r.zombies === "PARTIAL")   score += 17;
  return Math.min(100, score);
}

function arcPct(rows: Row[]) {
  if (!rows.length) return 0;
  return Math.round(rows.reduce((s, r) => s + rowPct(r), 0) / rows.length);
}

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24"; // amber-400
  if (pct >= 40) return "#d97706"; // amber-600
  if (pct > 0)   return "#92400e"; // amber-800
  return "#4b5563"; // gray-600
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

// Colored pill for NONE / PARTIAL / ALL
function StatusPill({ value, onChange, type }: {
  value: "NONE" | "PARTIAL" | "ALL";
  onChange: (v: "NONE" | "PARTIAL" | "ALL") => void;
  type: "treasures" | "zombies";
}) {
  const colors = {
    NONE:    "bg-gray-800 border-gray-700 text-gray-400",
    PARTIAL: "bg-amber-950/60 border-amber-800 text-amber-400",
    ALL:     "bg-amber-500/20 border-amber-500 text-amber-300",
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "NONE" | "PARTIAL" | "ALL")}
      className={`rounded border px-2 py-1 text-xs font-medium cursor-pointer transition-colors focus:outline-none focus:ring-1 focus:ring-amber-600 ${colors[value]}`}
    >
      <option value="NONE">None</option>
      <option value="PARTIAL">Partial</option>
      <option value="ALL">All</option>
    </select>
  );
}

// Amber checkbox
function AmberCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`w-5 h-5 rounded border flex items-center justify-center transition-colors flex-shrink-0
        ${checked ? "bg-amber-500 border-amber-500" : "bg-transparent border-gray-600 hover:border-amber-700"}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      )}
    </button>
  );
}

export default function ArcSections({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.arc, true]))
  );
  const [data, setData] = useState<Row[]>(groups.flatMap((g) => g.rows));
  const [error, setError] = useState<string | null>(null);

  async function update(id: string, patch: Partial<Pick<Row, "cleared" | "treasures" | "zombies">>) {
    const prev = data.find((r) => r.id === id);
    setData((d) => d.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, patch }),
    });

    if (!res.ok) {
      if (prev) setData((d) => d.map((r) => (r.id === id ? prev : r)));
      setError("Failed to save. Please try again.");
    }
  }

  async function bulkUpdate(ids: string[], patch: Partial<Pick<Row, "cleared" | "treasures" | "zombies">>) {
    const idSet = new Set(ids);
    const prevRows = data.filter((r) => idSet.has(r.id));
    setData((prev) => prev.map((r) => (idSet.has(r.id) ? { ...r, ...patch } : r)));

    const res = await fetch("/api/story/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, patch }),
    });

    if (!res.ok) {
      setError("Failed to save changes. Please refresh the page.");
      setData((prev) => prev.map((r) => {
        const old = prevRows.find((p) => p.id === r.id);
        return old ?? r;
      }));
    }
  }

  const dataByArc = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const g of groups) map.set(g.arc, []);
    for (const r of data) {
      const arc = r.chapter.arc;
      if (!map.has(arc)) map.set(arc, []);
      map.get(arc)!.push(r);
    }
    for (const [arc, rows] of map) {
      rows.sort((a, b) => a.chapter.sortOrder - b.chapter.sortOrder);
      map.set(arc, rows);
    }
    return map;
  }, [data, groups]);

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {groups.map((g) => {
        const rows = dataByArc.get(g.arc) ?? [];
        const ids = rows.map((r) => r.id);
        const pct = arcPct(rows);
        const cleared = rows.filter((r) => r.cleared).length;
        const treasuresAll = rows.filter((r) => r.treasures === "ALL").length;
        const zombiesAll = rows.filter((r) => r.zombies === "ALL").length;
        const total = rows.length;

        return (
          <div key={g.arc} className="border border-gray-700 rounded-lg overflow-hidden">

            {/* Arc header */}
            <div className="bg-gray-900 px-5 pt-4 pb-3">
              <div className="flex items-start justify-between gap-4">

                <div className="flex-1 min-w-0">
                  {/* Title + badge */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-100 font-semibold text-base">{arcLabel(g.arc)}</span>
                    <span className="text-xs font-mono text-gray-500 border border-gray-700 rounded px-1.5 py-0.5">{arcShort(g.arc)}</span>
                    <span className="ml-auto text-sm font-semibold" style={{ color: pctColor(pct) }}>{pct}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 rounded bg-gray-800 overflow-hidden mb-2">
                    <div className={`h-1.5 transition-all duration-300 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
                  </div>

                  {/* Stats row */}
                  <div className="flex gap-4 text-xs mb-3">
                    <StatBadge label="Cleared" value={cleared} total={total} />
                    <StatBadge label="Treasures" value={treasuresAll} total={total} />
                    <StatBadge label="Zombies" value={zombiesAll} total={total} />
                  </div>

                  {/* Bulk actions */}
                  <div className="flex flex-wrap gap-1.5">
                    <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, { cleared: true })}>Mark all Cleared</BulkBtn>
                    <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, { treasures: "ALL" })}>Treasures → All</BulkBtn>
                    <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, { zombies: "ALL" })}>Zombies → All</BulkBtn>
                    <span className="text-gray-700 self-center px-0.5">|</span>
                    <BulkBtn variant="gray" onClick={() => bulkUpdate(ids, { cleared: false })}>Reset Cleared</BulkBtn>
                    <BulkBtn variant="gray" onClick={() => bulkUpdate(ids, { treasures: "NONE" })}>Reset Treasures</BulkBtn>
                    <BulkBtn variant="gray" onClick={() => bulkUpdate(ids, { zombies: "NONE" })}>Reset Zombies</BulkBtn>
                    <BulkBtn variant="red"  onClick={() => bulkUpdate(ids, { cleared: false, treasures: "NONE", zombies: "NONE" })}>Reset All</BulkBtn>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.arc]: !o[g.arc] }))}
                  className="flex-shrink-0 text-xs text-gray-400 px-2.5 py-1.5 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition-colors mt-1"
                >
                  {open[g.arc] ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Chapter table */}
            {open[g.arc] && (
              <div className="bg-black overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="border-b border-gray-800 bg-gray-950">
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Chapter</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">Cleared</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Treasures</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-32">Zombies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const rPct = rowPct(r);
                      const isComplete = rPct === 100;
                      return (
                        <tr
                          key={r.id}
                          className={`border-b border-gray-900 transition-colors ${
                            isComplete
                              ? "bg-amber-950/20 hover:bg-amber-950/30"
                              : "hover:bg-gray-950"
                          }`}
                        >
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-3">
                              {/* Mini progress bar */}
                              <div className="flex-1 max-w-xs">
                                <div className="flex items-center gap-2">
                                  <span className={`font-medium ${isComplete ? "text-amber-300/80" : "text-gray-200"}`}>
                                    {r.chapter.displayName}
                                  </span>
                                </div>
                                <div className="mt-1 h-1 rounded bg-gray-800 overflow-hidden w-32">
                                  <div className={`h-1 ${barFill(rPct)}`} style={{ width: `${rPct}%` }} />
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-2.5 text-center">
                            <div className="flex justify-center">
                              <AmberCheck
                                checked={r.cleared}
                                onChange={(v) => update(r.id, { cleared: v })}
                              />
                            </div>
                          </td>

                          <td className="px-4 py-2.5 text-center">
                            <StatusPill
                              value={r.treasures}
                              onChange={(v) => update(r.id, { treasures: v })}
                              type="treasures"
                            />
                          </td>

                          <td className="px-4 py-2.5 text-center">
                            <StatusPill
                              value={r.zombies}
                              onChange={(v) => update(r.id, { zombies: v })}
                              type="zombies"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────────── */

function StatBadge({ label, value, total }: { label: string; value: number; total: number }) {
  const done = value === total;
  return (
    <span className={done ? "text-amber-400" : "text-gray-400"}>
      {label}: <span className="font-medium">{value}/{total}</span>
    </span>
  );
}

function BulkBtn({ children, onClick, variant }: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "amber" | "gray" | "red";
}) {
  const styles = {
    amber: "border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60",
    gray:  "border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200",
    red:   "border-red-800 bg-red-900/20 text-red-400 hover:bg-red-900/40",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border transition-colors ${styles[variant]}`}
    >
      {children}
    </button>
  );
}
