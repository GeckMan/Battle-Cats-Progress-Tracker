"use client";

import { useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeColors, pctColor, barFill, type ThemeColors } from "@/lib/theme-colors";
import type { MilestoneCategory } from "@/generated/prisma/client";

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
  const { theme } = useTheme();
  const c = getThemeColors(theme);

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
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Global Metrics ────────────────────────────────────────────────── */}
      <div style={{
        background: c.panelBg,
        border: `1px solid ${c.border}`,
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: c.accent, padding: "6px 10px 5px",
          borderBottom: `1px solid ${c.accentDim}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: c.fontSys,
        }}>
          <span>Milestone Stages</span>
          <span style={{ fontSize: 9, color: c.textDim, letterSpacing: "0.08em" }}>{groups.length} CATEGORIES</span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
          background: c.border,
        }}>
          {[
            { label: "Completion", value: `${overallPct}%`, sub: `${totalCount} milestones` },
            { label: "Cleared", value: `${clearedCount}`, sub: `of ${totalCount}` },
            { label: "Remaining", value: `${totalCount - clearedCount}`, sub: "to clear" },
          ].map((m) => (
            <div key={m.label} style={{ background: c.panelBg, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, marginBottom: 2, fontFamily: c.fontSys }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c.dataOk, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, fontFamily: c.fontSys }}>{m.value}</div>
              <div style={{ fontSize: 9, color: c.textDim, marginTop: 2, letterSpacing: "0.06em", fontFamily: c.fontSys }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div style={{ padding: "6px 10px" }}>
          <div style={{ height: 3, background: c.voidPanel, border: `1px solid ${c.borderFaint}`, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${overallPct}%`, background: barFill(overallPct, theme), transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          border: `1px solid ${c.alert}`, background: c.alertFill,
          padding: "6px 10px", fontSize: 12, color: c.alert,
          display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: c.fontSys,
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{ background: "none", border: "none", color: c.alert, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* ── Category Panels — side by side ─────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.min(groups.length, 4)}, 1fr)`,
        gap: 8,
        alignItems: "start",
      }}>
        {groups.map((g) => {
          const groupRows = g.rows;
          const groupIds = groupRows.map((r) => r.id);
          const groupCleared = groupRows.filter((r) => data.get(r.id)).length;
          const groupTotal = groupRows.length;
          const groupPct = groupTotal ? Math.round((groupCleared / groupTotal) * 100) : 0;
          const allCleared = groupCleared === groupTotal;
          const anyPending = groupIds.some((id) => pending.has(id));

          return (
            <div key={g.category} style={{
              background: c.panelBg,
              border: `1px solid ${c.border}`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Category Header */}
              <div style={{
                padding: "6px 8px 5px",
                borderBottom: `1px solid ${c.accentDim}`,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontFamily: c.fontSys, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.label}</span>
                <span style={{ fontSize: 10, fontFamily: c.fontSys, fontWeight: 500, color: groupPct === 100 ? c.dataOk : c.text, fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                  {groupCleared}/{groupTotal}
                </span>
                <span style={{ fontSize: 10, fontFamily: c.fontSys, color: pctColor(groupPct, c), fontWeight: 700, flexShrink: 0 }}>{groupPct}%</span>
                <button
                  type="button"
                  disabled={anyPending || allCleared}
                  onClick={() => bulkToggle(groupIds, true)}
                  style={{
                    fontSize: 9, fontFamily: c.fontSys, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "2px 6px", border: `1px solid ${c.accentDim}`,
                    background: c.accentFill, color: c.accent,
                    cursor: anyPending || allCleared ? "default" : "pointer",
                    opacity: anyPending || allCleared ? 0.3 : 1, flexShrink: 0,
                  }}
                >✓</button>
                <button
                  type="button"
                  disabled={anyPending || groupCleared === 0}
                  onClick={() => bulkToggle(groupIds, false)}
                  style={{
                    fontSize: 9, fontFamily: c.fontSys, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase",
                    padding: "2px 6px", border: `1px solid ${c.borderFaint}`,
                    background: "transparent", color: c.textDim,
                    cursor: anyPending || groupCleared === 0 ? "default" : "pointer",
                    opacity: anyPending || groupCleared === 0 ? 0.3 : 1, flexShrink: 0,
                  }}
                >✕</button>
              </div>

              {/* Milestone Items */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {groupRows.map((r) => {
                  const isCleared = data.get(r.id) ?? false;
                  const isLoading = pending.has(r.id);

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => toggle(r.id)}
                      disabled={isLoading}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 8,
                        padding: "5px 8px", border: "none",
                        borderBottom: `1px solid ${c.borderFaint}`,
                        background: isCleared ? c.dataOkFill : c.void,
                        textAlign: "left", cursor: isLoading ? "wait" : "pointer",
                        opacity: isLoading ? 0.6 : 1, transition: "background 0.15s", fontFamily: c.fontSys,
                      }}
                    >
                      {/* Checkbox */}
                      <div style={{
                        width: 14, height: 14, flexShrink: 0,
                        border: `1px solid ${isCleared ? c.dataOk : c.borderFaint}`,
                        background: isCleared ? c.dataOkFill : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {isCleared && (
                          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke={c.dataOk} strokeWidth="2.5">
                            <polyline points="2,6 5,9 10,3" />
                          </svg>
                        )}
                      </div>

                      <span style={{
                        fontSize: 13, flex: 1,
                        color: isCleared ? c.textDim : c.text,
                        textDecoration: isCleared ? "line-through" : "none",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {r.displayName}
                      </span>

                      {isLoading && (
                        <span style={{ fontSize: 8, color: c.textDim, letterSpacing: "0.08em", textTransform: "uppercase", flexShrink: 0 }}>...</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Status bar */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "4px 8px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                color: c.textDim, borderTop: `1px solid ${c.border}`, fontFamily: c.fontSys,
              }}>
                <span>{groupTotal} milestones</span>
                <span>{groupCleared}/{groupTotal}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
