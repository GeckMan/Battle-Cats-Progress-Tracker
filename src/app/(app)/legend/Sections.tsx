"use client";

import { useMemo, useState } from "react";

type Row = {
  id: string;
  crownMax: number | null; // matches Prisma
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
    const status =
      crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";

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
    const status =
      crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";

    const idSet = new Set(ids);
    setData((prev) =>
      prev.map((r) => (idSet.has(r.id) ? { ...r, crownMax, status } : r))
    );

    const res = await fetch("/api/legend/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids, patch: { crownMax, status } }),
    });

    if (!res.ok) {
      setError("Failed to save changes. Please try again.");
    }
  }


  return (
    <div className="space-y-4">
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

          const total = rows.length;
          const crowns4 = rows.filter((r) => r.crownMax === 4).length;
          const crownsAny = rows.filter((r) => (r.crownMax ?? 0) > 0).length;


          return (
            <div key={g.sagaId} className="border border-gray-700 rounded-lg">
              <div className="w-full p-4 bg-gray-900 rounded-t-lg flex items-start justify-between gap-4">
                <div className="text-left">
                  <div className="text-gray-100 font-semibold">{g.sagaName}</div>
                  <div className="text-xs text-gray-400 mt-1">
                    Started: {crownsAny}/{total} • Crown 4: {crowns4}/{total}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      onClick={() => bulkUpdate(ids, 4)}
                    >
                      Set all → Crown 4
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      onClick={() => bulkUpdate(ids, 3)}
                    >
                      Set all → Crown 3
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      onClick={() => bulkUpdate(ids, 2)}
                    >
                      Set all → Crown 2
                    </button>
                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-gray-800 border border-gray-700 hover:bg-gray-700"
                      onClick={() => bulkUpdate(ids, 1)}
                    >
                      Set all → Crown 1
                    </button>

                    <span className="mx-1 text-gray-600">|</span>

                    <button
                      type="button"
                      className="text-xs px-2 py-1 rounded bg-red-900/30 border border-red-800 hover:bg-red-900/50 text-red-200"
                      onClick={() => bulkUpdate(ids, 0)}
                    >
                      Reset all → 0
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.sagaId]: !o[g.sagaId] }))}
                  className="text-sm text-gray-300 px-3 py-1 rounded border border-gray-700 bg-gray-800 hover:bg-gray-700"
                >
                  {open[g.sagaId] ? "Hide" : "Show"}
                </button>
              </div>

              {open[g.sagaId] && (
                <div className="p-4 bg-black rounded-b-lg overflow-x-auto">
                  <table className="w-full border border-gray-700 text-sm text-gray-200">
                    <thead className="bg-gray-800 text-gray-100">
                      <tr>
                        <th className="p-3 text-left">Subchapter</th>
                        <th className="p-3 text-left">Crown Max</th>

                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r, idx) => (
                        <tr key={r.id} className={idx % 2 === 0 ? "bg-gray-900" : "bg-black"}>
                          <td className="p-3 font-medium">{r.subchapter.displayName}</td>
                          <td className="p-3">
                            <select
                              className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
                              value={r.crownMax ?? 0}

                              onChange={(e) => update(r.id, Number(e.target.value))}
                            >
                              <option value={0}>0 (Not started)</option>
                              <option value={1}>1</option>
                              <option value={2}>2</option>
                              <option value={3}>3</option>
                              <option value={4}>4</option>
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
