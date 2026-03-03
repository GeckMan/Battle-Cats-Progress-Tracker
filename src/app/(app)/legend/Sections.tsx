"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  crownMax: number | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  subchapter: {
    id: string;
    displayName: string;
    sortOrder: number;
    saga: {
      id: string;
      displayName: string;
      sortOrder: number;
    };
  };
};

type Group = {
  sagaId: string;
  sagaName: string;
  sortOrder: number;
  rows: Row[];
};

/* ── Helpers ────────────────────────────────────────────────────────────── */

function rowPct(r: Row) {
  return Math.round(((r.crownMax ?? 0) / 4) * 100);
}

function sagaPct(rows: Row[]) {
  if (!rows.length) return 0;
  return Math.round(rows.reduce((s, r) => s + rowPct(r), 0) / rows.length);
}

function pctColor(pct: number) {
  if (pct >= 80) return "#fbbf24";
  if (pct >= 40) return "#d97706";
  if (pct > 0)   return "#92400e";
  return "#4b5563";
}

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

/** Subtle amber row tint based on crown level */
function rowTint(crown: number) {
  if (crown >= 4) return "bg-amber-950/25 hover:bg-amber-950/35";
  if (crown >= 3) return "bg-amber-950/15 hover:bg-amber-950/25";
  if (crown >= 1) return "bg-amber-950/5  hover:bg-gray-950";
  return "hover:bg-gray-950";
}

/* ── Crown Picker ───────────────────────────────────────────────────────── */

const CROWN_COLORS: Record<number, string> = {
  0: "border-gray-700 bg-gray-900 text-gray-500 hover:border-gray-600",
  1: "border-amber-900 bg-amber-950/40 text-amber-700 hover:border-amber-800",
  2: "border-amber-800 bg-amber-950/60 text-amber-600 hover:border-amber-700",
  3: "border-amber-700 bg-amber-900/50 text-amber-400 hover:border-amber-600",
  4: "border-amber-500 bg-amber-500/20 text-amber-300 hover:border-amber-400",
};

const CROWN_ACTIVE: Record<number, string> = {
  0: "border-gray-500 bg-gray-800 text-gray-300 ring-1 ring-gray-500",
  1: "border-amber-800 bg-amber-950 text-amber-600 ring-1 ring-amber-900",
  2: "border-amber-700 bg-amber-900/70 text-amber-500 ring-1 ring-amber-800",
  3: "border-amber-600 bg-amber-800/60 text-amber-400 ring-1 ring-amber-700",
  4: "border-amber-400 bg-amber-500/30 text-amber-200 ring-1 ring-amber-500",
};

function CrownPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1 items-center">
      {[0, 1, 2, 3, 4].map((n) => {
        const isActive = value === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-8 h-8 rounded border text-xs font-semibold transition-all flex items-center justify-center
              ${isActive ? CROWN_ACTIVE[n] : CROWN_COLORS[n]}`}
            title={n === 0 ? "Not started" : `Crown ${n}`}
          >
            {n === 0 ? "—" : n}
          </button>
        );
      })}
    </div>
  );
}

/* ── Bulk Button ────────────────────────────────────────────────────────── */

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

/* ── StatBadge ──────────────────────────────────────────────────────────── */

function StatBadge({ label, value, total }: { label: string; value: number; total: number }) {
  const done = value === total;
  return (
    <span className={done ? "text-amber-400" : "text-gray-400"}>
      {label}: <span className="font-medium">{value}/{total}</span>
    </span>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function Sections({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.sagaId, true]))
  );
  const [data, setData] = useState<Row[]>(groups.flatMap((g) => g.rows));
  const [error, setError] = useState<string | null>(null);

  const dataBySaga = useMemo(() => {
    const map = new Map<string, Row[]>();
    for (const g of groups) map.set(g.sagaId, []);
    for (const r of data) {
      const id = r.subchapter.saga.id;
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(r);
    }
    for (const [id, rows] of map) {
      rows.sort((a, b) => a.subchapter.sortOrder - b.subchapter.sortOrder);
      map.set(id, rows);
    }
    return map;
  }, [data, groups]);

  async function update(id: string, uiCrown: number) {
    const crownMax = uiCrown === 0 ? null : uiCrown;
    const status = crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";
    const prev = data.find((r) => r.id === id);
    setData((d) => d.map((r) => (r.id === id ? { ...r, crownMax, status } : r)));

    const res = await fetch("/api/legend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, patch: { crownMax, status } }),
    });

    if (!res.ok) {
      if (prev) setData((d) => d.map((r) => (r.id === id ? prev : r)));
      setError("Failed to save. Please try again.");
    }
  }

  async function bulkUpdate(ids: string[], uiCrown: number) {
    const crownMax = uiCrown === 0 ? null : uiCrown;
    const status = crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";
    const idSet = new Set(ids);
    setData((prev) => prev.map((r) => (idSet.has(r.id) ? { ...r, crownMax, status } : r)));

    const res = await fetch("/api/legend/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, patch: { crownMax, status } }),
    });

    if (!res.ok) setError("Failed to save changes. Please try again.");
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {groups
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((g) => {
          const rows = dataBySaga.get(g.sagaId) ?? [];
          const ids = rows.map((r) => r.id);
          const pct = sagaPct(rows);
          const total = rows.length;
          const crown4 = rows.filter((r) => r.crownMax === 4).length;
          const started = rows.filter((r) => (r.crownMax ?? 0) > 0).length;

          return (
            <div key={g.sagaId} className="border border-gray-700 rounded-lg overflow-hidden">

              {/* Saga header */}
              <div className="bg-gray-900 px-5 pt-4 pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">

                    {/* Title + % */}
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-100 font-semibold text-base">{g.sagaName}</span>
                      <span className="ml-auto text-sm font-semibold" style={{ color: pctColor(pct) }}>{pct}%</span>
                    </div>

                    {/* Progress bar */}
                    <div className="h-1.5 rounded bg-gray-800 overflow-hidden mb-2">
                      <div className={`h-1.5 transition-all duration-300 ${barFill(pct)}`} style={{ width: `${pct}%` }} />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-xs mb-3">
                      <StatBadge label="Started"  value={started} total={total} />
                      <StatBadge label="Crown 4"  value={crown4}  total={total} />
                    </div>

                    {/* Bulk actions */}
                    <div className="flex flex-wrap gap-1.5">
                      <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, 4)}>Set all → Crown 4</BulkBtn>
                      <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, 3)}>Set all → Crown 3</BulkBtn>
                      <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, 2)}>Set all → Crown 2</BulkBtn>
                      <BulkBtn variant="amber" onClick={() => bulkUpdate(ids, 1)}>Set all → Crown 1</BulkBtn>
                      <span className="text-gray-700 self-center px-0.5">|</span>
                      <BulkBtn variant="red"   onClick={() => bulkUpdate(ids, 0)}>Reset all → 0</BulkBtn>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [g.sagaId]: !o[g.sagaId] }))}
                    className="flex-shrink-0 text-xs text-gray-400 px-2.5 py-1.5 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700 hover:text-gray-200 transition-colors mt-1"
                  >
                    {open[g.sagaId] ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Subchapter table */}
              {open[g.sagaId] && (
                <div className="bg-black overflow-x-auto">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-800 bg-gray-950">
                        <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subchapter</th>
                        <th className="px-4 py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-52">Crown Max</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const crown = r.crownMax ?? 0;
                        const rPct = rowPct(r);
                        return (
                          <tr
                            key={r.id}
                            className={`border-b border-gray-900 transition-colors ${rowTint(crown)}`}
                          >
                            <td className="px-4 py-2.5">
                              <div className="flex flex-col gap-1">
                                <span className={`font-medium ${crown >= 4 ? "text-amber-300/80" : "text-gray-200"}`}>
                                  {r.subchapter.displayName}
                                </span>
                                {/* Mini crown progress bar */}
                                <div className="w-32 h-1 rounded bg-gray-800 overflow-hidden">
                                  <div className={`h-1 ${barFill(rPct)}`} style={{ width: `${rPct}%` }} />
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-2.5">
                              <div className="flex justify-center">
                                <CrownPicker
                                  value={crown}
                                  onChange={(v) => update(r.id, v)}
                                />
                              </div>
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
