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
  if (arc === "EoC") return "Empire of Cats (EoC)";
  if (arc === "ItF") return "Into the Future (ItF)";
  if (arc === "CotC") return "Cats of the Cosmos (CotC)";
  return arc;
}

export default function ArcSections({ groups }: { groups: Group[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(groups.map((g) => [g.arc, true]))
  );

  const [data, setData] = useState<Row[]>(groups.flatMap((g) => g.rows));
  const [error, setError] = useState<string | null>(null);

  async function update(id: string, patch: Partial<Row>) {
    const prev = data.find((r) => r.id === id);
    setData((d) => d.map((r) => (r.id === id ? { ...r, ...patch } : r)));

    const res = await fetch("/api/story", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, patch }),
    });

    if (!res.ok) {
      // Rollback optimistic update
      if (prev) setData((d) => d.map((r) => (r.id === id ? prev : r)));
      setError("Failed to save. Please try again.");
    }
  }

  async function bulkUpdate(ids: string[], patch: Partial<Row>) {
    const idSet = new Set(ids);
    setData((prev) =>
      prev.map((r) => (idSet.has(r.id) ? { ...r, ...patch } : r))
    );

    const res = await fetch("/api/story/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, patch }),
    });

    if (!res.ok) {
      setError("Failed to save changes. Please refresh the page.");
      // Rollback optimistic update
      setData((prev) =>
        prev.map((r) => (idSet.has(r.id) ? { ...r } : r))
      );
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
    <div className="space-y-4">
      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}
      {groups.map((g) => {
        const rows = dataByArc.get(g.arc) ?? [];
        const ids = rows.map((r) => r.id);

        const total = rows.length;
        const cleared = rows.filter((r) => r.cleared).length;
        const treasuresAll = rows.filter((r) => r.treasures === "ALL").length;
        const zombiesAll = rows.filter((r) => r.zombies === "ALL").length;

        return (
          <div key={g.arc} className="border border-gray-700 rounded-lg">
            {/* Header */}
            <div className="w-full p-4 bg-gray-900 rounded-t-lg flex items-start justify-between gap-4">
              <div className="text-left">
                <div className="text-gray-100 font-semibold">
                  {arcLabel(g.arc)}
                </div>

                <div className="text-xs text-gray-400 mt-1">
                  Cleared: {cleared}/{total} • Treasures (ALL): {treasuresAll}/
                  {total} • Zombies (ALL): {zombiesAll}/{total}
                </div>

{/* Quick Actions */}
<div className="mt-3 flex flex-wrap gap-2">
  {/* Set */}
  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
    onClick={() => bulkUpdate(ids, { treasures: "ALL" as any })}
  >
    Set all Treasures = ALL
  </button>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
    onClick={() => bulkUpdate(ids, { zombies: "ALL" as any })}
  >
    Set all Zombies = ALL
  </button>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
    onClick={() => bulkUpdate(ids, { cleared: true })}
  >
    Mark all Cleared
  </button>

  {/* Reset */}
  <span className="mx-1 text-gray-600">|</span>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800"
    onClick={() => bulkUpdate(ids, { treasures: "NONE" as any })}
  >
    Reset Treasures → NONE
  </button>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800"
    onClick={() => bulkUpdate(ids, { zombies: "NONE" as any })}
  >
    Reset Zombies → NONE
  </button>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-gray-900 border border-gray-700 hover:bg-gray-800"
    onClick={() => bulkUpdate(ids, { cleared: false })}
  >
    Reset Cleared → false
  </button>

  <button
    type="button"
    className="text-xs px-2 py-1 rounded bg-red-900/30 border border-red-800 hover:bg-red-900/50 text-red-200"
    onClick={() =>
      bulkUpdate(ids, {
        cleared: false,
        treasures: "NONE" as any,
        zombies: "NONE" as any,
      })
    }
  >
    Reset ALL (Cleared + Treasures + Zombies)
  </button>
</div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setOpen((o) => ({ ...o, [g.arc]: !o[g.arc] }))
                }
                className="text-sm text-gray-300 px-3 py-1 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700"
              >
                {open[g.arc] ? "Hide" : "Show"}
              </button>
            </div>

            {/* Table */}
            {open[g.arc] && (
              <div className="p-4 bg-black rounded-b-lg overflow-x-auto">
                <table className="w-full border border-gray-700 text-sm text-gray-200">
                  <thead className="bg-gray-800 text-gray-100">
                    <tr>
                      <th className="p-3 text-left">Chapter</th>
                      <th className="p-3 text-left">Cleared</th>
                      <th className="p-3 text-left">Treasures</th>
                      <th className="p-3 text-left">Zombies</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, idx) => (
                      <tr
                        key={r.id}
                        className={
                          idx % 2 === 0 ? "bg-gray-900" : "bg-black"
                        }
                      >
                        <td className="p-3 font-medium">
                          {r.chapter.displayName}
                        </td>

                        <td className="p-3">
                          <input
                            type="checkbox"
                            checked={r.cleared}
                            onChange={(e) =>
                              update(r.id, { cleared: e.target.checked })
                            }
                          />
                        </td>

                        <td className="p-3">
                          <select
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
                            value={r.treasures}
                            onChange={(e) =>
                              update(r.id, {
                                treasures: e.target.value as any,
                              })
                            }
                          >
                            <option value="NONE">None</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="ALL">All</option>
                          </select>
                        </td>

                        <td className="p-3">
                          <select
                            className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
                            value={r.zombies}
                            onChange={(e) =>
                              update(r.id, {
                                zombies: e.target.value as any,
                              })
                            }
                          >
                            <option value="NONE">None</option>
                            <option value="PARTIAL">Partial</option>
                            <option value="ALL">All</option>
                          </select>
                        </td>
                      </tr>
                    ))}
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
