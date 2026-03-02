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

export default function MilestonesClient({ groups }: { groups: CategoryGroup[] }) {
  const [data, setData] = useState<Map<string, boolean>>(
    () => new Map(groups.flatMap((g) => g.rows.map((r) => [r.id, r.cleared])))
  );
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const totalCount = groups.reduce((s, g) => s + g.rows.length, 0);
  const clearedCount = [...data.values()].filter(Boolean).length;

  async function toggle(milestoneId: string) {
    if (pending.has(milestoneId)) return;
    setError(null);

    const prev = data.get(milestoneId) ?? false;
    const next = !prev;

    // Optimistic update
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
      // Rollback
      setData((m) => new Map(m).set(milestoneId, prev));
      setError("Failed to save — please try again.");
    } finally {
      setPending((s) => {
        const next = new Set(s);
        next.delete(milestoneId);
        return next;
      });
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-100">Milestones</h1>
        <div className="text-sm text-gray-400">
          {clearedCount}/{totalCount} cleared
        </div>
      </div>

      {/* Overall bar */}
      <div>
        <div className="h-2 rounded bg-gray-800 overflow-hidden">
          <div
            className="h-2 bg-gray-200 transition-all duration-300"
            style={{ width: `${totalCount ? Math.round((clearedCount / totalCount) * 100) : 0}%` }}
          />
        </div>
        <div className="mt-1 text-xs text-gray-500 text-right">
          {totalCount ? Math.round((clearedCount / totalCount) * 100) : 0}% overall
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded border border-red-700 bg-red-900/30 px-4 py-2 text-sm text-red-200 flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-200">✕</button>
        </div>
      )}

      {/* Category groups */}
      {groups.map((g) => {
        const groupCleared = g.rows.filter((r) => data.get(r.id)).length;
        const groupTotal = g.rows.length;
        const groupPct = groupTotal ? Math.round((groupCleared / groupTotal) * 100) : 0;

        return (
          <section key={g.category} className="space-y-2">
            {/* Category header */}
            <div className="flex items-center justify-between border-b border-gray-800 pb-2">
              <h2 className="text-base font-semibold text-gray-100">{g.label}</h2>
              <div className="text-sm text-gray-400">
                {groupCleared}/{groupTotal}
                <span className="ml-2 text-gray-600">({groupPct}%)</span>
              </div>
            </div>

            {/* Milestone rows */}
            <div className="space-y-1">
              {g.rows.map((r) => {
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
                        ? "border-gray-700 bg-gray-900/50 hover:bg-gray-900"
                        : "border-gray-800 bg-black hover:bg-gray-950"
                      }
                      ${isLoading ? "opacity-60" : ""}
                    `}
                  >
                    {/* Checkbox visual */}
                    <div
                      className={`flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center
                        ${isCleared ? "bg-gray-200 border-gray-200" : "border-gray-600 bg-transparent"}
                      `}
                    >
                      {isCleared && (
                        <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="2,6 5,9 10,3" />
                        </svg>
                      )}
                    </div>

                    {/* Milestone name */}
                    <span
                      className={`text-sm ${
                        isCleared ? "text-gray-400 line-through" : "text-gray-100"
                      }`}
                    >
                      {r.displayName}
                    </span>

                    {isLoading && (
                      <span className="ml-auto text-xs text-gray-600">saving…</span>
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
