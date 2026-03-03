"use client";

import { useState } from "react";
import type { MilestoneCategory } from "@/generated/prisma/client";
import { CATEGORY_META } from "@/lib/milestone-catalog";

export type MilestoneRow = {
  id: string;
  displayName: string;
  category: MilestoneCategory;
  sortOrder: number;
  cleared: boolean;
  notes: string | null;
};

type CategoryGroup = {
  category: MilestoneCategory;
  label: string;
  rows: MilestoneRow[];
};

function barFill(pct: number) {
  if (pct >= 80) return "bg-amber-400";
  if (pct >= 40) return "bg-amber-600";
  if (pct > 0)   return "bg-amber-800";
  return "bg-gray-700";
}

export default function MilestonesClient({ groups }: { groups: CategoryGroup[] }) {
  const [data, setData] = useState<Map<string, boolean>>(
    () => new Map(groups.flatMap((g) => g.rows.map((r) => [r.id, r.cleared])))
  );
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const totalCount = groups.reduce((s, g) => s + g.rows.length, 0);
  const clearedCount = [...data.values()].filter(Boolean).length;
  const overallPct = totalCount ? Math.round((clearedCount / totalCount) * 100) : 0;

  async function toggle(milestoneId: string) {
    if (pending.has(milestoneId)) return;
    setError(null);

    const prev = data.get(milestoneId) ?? false;
    const next = !prev;

    setData((m) => new Map(m).set(milestoneId, next));
    setPending((s) => new Set(s).add(milestoneId));

    try {
      const res = await fetch(`/api/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cleared: next }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch {
      setData((m) => new Map(m).set(milestoneId, prev));
      setError("Failed to save - please try again.");
    } finally {
      setPending((s) => {
        const next = new Set(s);
        next.delete(milestoneId);
        return next;
      });
    }
  }

  async function bulkToggle(ids: string[], cleared: boolean) {
    setError(null);
    // Optimistic update
    setData((m) => {
      const next = new Map(m);
      ids.forEach((id) => next.set(id, cleared));
      return next;
    });
    setPending((s) => {
      const next = new Set(s);
      ids.forEach((id) => next.add(id));
      return next;
    });

    try {
      const res = await fetch("/api/milestones/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, cleared }),
      });
      if (!res.ok) throw new Error(await res.text());
    } catch {
      // Rollback
      setData((m) => {
        const prev = new Map(m);
        ids.forEach((id) => prev.set(id, !cleared));
        return prev;
      });
      setError("Failed to save - please try again.");
    } finally {
      setPending((s) => {
        const next = new Set(s);
        ids.forEach((id) => next.delete(id));
        return next;
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-100">Milestone Stages</h1>
        <div className="text-sm text-gray-400">
          {clearedCount}/{totalCount} cleared
        </div>
      </div>

      {/* Overall bar */}
      <div>
        <div className="h-2 rounded bg-gray-800 overflow-hidden">
          <div
            className={`h-2 transition-all duration-300 ${barFill(overallPct)}`}
            style={{ width: `${overallPct}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-right" style={{ color: overallPct >= 80 ? "#fbbf24" : overallPct >= 40 ? "#d97706" : "#6b7280" }}>
          {overallPct}% overall
        </div>
      </div>

      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {groups.map((g) => {
        const groupRows = g.rows;
        const groupIds = groupRows.map((r) => r.id);
        const groupCleared = groupRows.filter((r) => data.get(r.id)).length;
        const groupTotal = groupRows.length;
        const groupPct = groupTotal ? Math.round((groupCleared / groupTotal) * 100) : 0;
        const allCleared = groupCleared === groupTotal;
        const anyPending = groupIds.some((id) => pending.has(id));

        return (
          <section key={g.category} className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-800 pb-2 gap-4">
              <h2 className="text-base font-semibold text-gray-100">{g.label}</h2>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {groupCleared}/{groupTotal}
                  <span className="ml-1 text-gray-600">({groupPct}%)</span>
                </span>

                <button
                  type="button"
                  disabled={anyPending || allCleared}
                  onClick={() => bulkToggle(groupIds, true)}
                  className="text-xs px-2 py-1 rounded border border-amber-800 bg-amber-950/30 text-amber-300 hover:bg-amber-950/60 disabled:opacity-40 transition-colors"
                >
                  Mark all ✓
                </button>
                <button
                  type="button"
                  disabled={anyPending || groupCleared === 0}
                  onClick={() => bulkToggle(groupIds, false)}
                  className="text-xs px-2 py-1 rounded border border-gray-700 bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-200 disabled:opacity-40 transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>

            <div className="space-y-1">
              {groupRows.map((r) => {
                const isCleared = data.get(r.id) ?? false;
                const isLoading = pending.has(r.id);

                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => toggle(r.id)}
                    disabled={isLoading}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded border text-left transition-colors
                      ${isCleared
                        ? "border-amber-900 bg-amber-950/30 hover:bg-amber-950/50"
                        : "border-gray-800 bg-black hover:bg-gray-950"
                      }
                      ${isLoading ? "opacity-60" : ""}
                    `}
                  >
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center transition-colors
                        ${isCleared ? "bg-amber-500 border-amber-500" : "border-gray-600 bg-transparent"}
                      `}
                    >
                      {isCleared && (
                        <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </div>

                    <span
                      className={`text-sm ${
                        isCleared ? "text-gray-500 line-through" : "text-gray-100"
                      }`}
                    >
                      {r.displayName}
                    </span>

                    {isLoading && (
                      <span className="ml-auto text-xs text-gray-600">saving...</span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
