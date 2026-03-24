"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeColors, pctColor, barFill, type ThemeColors } from "@/lib/theme-colors";

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

/* ── Status Select ──────────────────────────────────────────────────────── */

function StatusPill({ value, onChange, c }: {
  value: "NONE" | "PARTIAL" | "ALL";
  onChange: (v: "NONE" | "PARTIAL" | "ALL") => void;
  c: ThemeColors;
}) {
  const colorMap: Record<string, { bg: string; border: string; color: string }> = {
    NONE: { bg: "transparent", border: c.borderFaint, color: c.textDim },
    PARTIAL: { bg: c.accentFill, border: c.accentDim, color: c.accent },
    ALL: { bg: c.dataOkFill, border: c.dataOkDim, color: c.dataOk },
  };
  const s = colorMap[value];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "NONE" | "PARTIAL" | "ALL")}
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: c.fontSys,
        padding: "3px 6px",
        cursor: "pointer",
        letterSpacing: "0.04em",
        appearance: "auto",
      }}
    >
      <option value="NONE">None</option>
      <option value="PARTIAL">Partial</option>
      <option value="ALL">All</option>
    </select>
  );
}

/* ── Checkbox ───────────────────────────────────────────────────────────── */

function ThemedCheck({ checked, onChange, c }: { checked: boolean; onChange: (v: boolean) => void; c: ThemeColors }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 20,
        height: 20,
        border: `1px solid ${checked ? c.dataOk : c.borderFaint}`,
        background: checked ? c.dataOkFill : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke={c.dataOk} strokeWidth="2.5">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      )}
    </button>
  );
}

/* ── Bulk Button ────────────────────────────────────────────────────────── */

function BulkBtn({ children, onClick, variant, c }: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "muted" | "danger";
  c: ThemeColors;
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { border: `1px solid ${c.accentDim}`, background: c.accentFill, color: c.accent },
    muted: { border: `1px solid ${c.borderFaint}`, background: "transparent", color: c.textDim },
    danger: { border: `1px solid ${c.alert}`, background: c.alertFill, color: c.alert },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles[variant],
        fontSize: 10,
        fontFamily: c.fontSys,
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: "4px 8px",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function ArcSections({ groups }: { groups: Group[] }) {
  const { theme } = useTheme();
  const c = getThemeColors(theme);

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
    for (const [, rows] of map) {
      rows.sort((a, b) => a.chapter.sortOrder - b.chapter.sortOrder);
    }
    return map;
  }, [data, groups]);

  // Global summary
  const allRows = data;
  const totalChaps = allRows.length;
  const clearedTotal = allRows.filter((r) => r.cleared).length;
  const treasuresTotal = allRows.filter((r) => r.treasures === "ALL").length;
  const zombiesTotal = allRows.filter((r) => r.zombies === "ALL").length;
  const globalPct = arcPct(allRows);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Global Metrics ────────────────────────────────────────────────── */}
      <div style={{
        background: c.panelBg,
        border: `1px solid ${c.border}`,
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: c.accent, padding: "8px 12px 7px",
          borderBottom: `1px solid ${c.accentDim}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: c.fontSys,
        }}>
          <span>Story Progress Overview</span>
          <span style={{ fontSize: 9, color: c.textDim, letterSpacing: "0.08em" }}>
            {groups.length} ARCS
          </span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1,
          background: c.border,
        }}>
          {[
            { label: "Completion", value: `${globalPct}%`, sub: `${totalChaps} chapters` },
            { label: "Cleared", value: `${clearedTotal}`, sub: `of ${totalChaps}` },
            { label: "Treasures", value: `${treasuresTotal}`, sub: `all collected` },
            { label: "Zombies", value: `${zombiesTotal}`, sub: `all cleared` },
          ].map((m) => (
            <div key={m.label} style={{
              background: c.panelBg, padding: "12px 14px",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                color: c.accent, marginBottom: 3, fontFamily: c.fontSys,
              }}>{m.label}</div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: c.dataOk,
                fontVariantNumeric: "tabular-nums", lineHeight: 1.1, fontFamily: c.fontSys,
              }}>{m.value}</div>
              <div style={{
                fontSize: 9, color: c.textDim, marginTop: 3,
                letterSpacing: "0.06em", fontFamily: c.fontSys,
              }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          border: `1px solid ${c.alert}`, background: c.alertFill,
          padding: "8px 14px", fontSize: 12, color: c.alert,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: c.fontSys,
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            background: "none", border: "none", color: c.alert, cursor: "pointer", fontSize: 14,
          }}>✕</button>
        </div>
      )}

      {/* ── Arc Panels — side by side like Legend ──────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${groups.length}, 1fr)`, gap: 8, alignItems: "start" }}>
        {groups.map((g) => {
          const rows = dataByArc.get(g.arc) ?? [];
          const ids = rows.map((r) => r.id);
          const pct = arcPct(rows);
          const cleared = rows.filter((r) => r.cleared).length;
          const treasuresAll = rows.filter((r) => r.treasures === "ALL").length;
          const zombiesAll = rows.filter((r) => r.zombies === "ALL").length;
          const total = rows.length;
          const isOpen = open[g.arc];

          return (
            <div key={g.arc} style={{
              background: c.panelBg,
              border: `1px solid ${c.border}`,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}>

              {/* Arc Header — compact like Legend */}
              <div style={{
                borderBottom: isOpen ? `1px solid ${c.accentDim}` : "none",
                padding: "6px 8px 5px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{
                    fontFamily: c.fontSys, fontSize: 11, fontWeight: 700,
                    letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent,
                    flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{arcLabel(g.arc)}</span>
                  <span style={{
                    fontSize: 14, fontWeight: 700, fontFamily: c.fontSys,
                    color: pctColor(pct, c), fontVariantNumeric: "tabular-nums", flexShrink: 0,
                  }}>{pct}%</span>
                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [g.arc]: !o[g.arc] }))}
                    style={{
                      flexShrink: 0, fontSize: 9, fontFamily: c.fontSys, fontWeight: 500,
                      color: c.textDim, padding: "2px 6px", border: `1px solid ${c.border}`,
                      background: "transparent", cursor: "pointer",
                    }}
                  >
                    {isOpen ? "▲" : "▼"}
                  </button>
                </div>

                <div style={{
                  height: 3, background: c.voidPanel,
                  border: `1px solid ${c.border}`,
                  overflow: "hidden", marginBottom: 4,
                }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: barFill(pct, theme), transition: "width 0.3s" }} />
                </div>

                <div style={{
                  display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: c.fontSys, flexWrap: "wrap",
                }}>
                  {[
                    { label: "C", val: cleared },
                    { label: "T", val: treasuresAll },
                    { label: "Z", val: zombiesAll },
                  ].map((s) => (
                    <span key={s.label}>
                      <span style={{ color: c.accentDim, fontSize: 9, textTransform: "uppercase" }}>{s.label} </span>
                      <span style={{ color: s.val === total ? c.dataOk : c.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{s.val}/{total}</span>
                    </span>
                  ))}
                  <span style={{ flex: 1 }} />
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { cleared: true, treasures: "ALL", zombies: "ALL" })} c={c}>All</BulkBtn>
                  <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, { cleared: false, treasures: "NONE", zombies: "NONE" })} c={c}>Reset</BulkBtn>
                </div>
              </div>

              {/* Chapter Rows — compact list like Legend */}
              {isOpen && (
                <div style={{ overflowY: "auto", maxHeight: "70vh", background: c.void, flex: 1 }}>
                  {rows.map((r) => {
                    const rPct = rowPct(r);
                    const isComplete = rPct === 100;
                    return (
                      <div key={r.id} style={{
                        display: "flex", flexDirection: "column", gap: 3,
                        padding: "5px 8px",
                        borderBottom: `1px solid ${c.borderFaint}`,
                        background: isComplete ? c.dataOkFill : r.cleared ? c.accentFill : "transparent",
                        fontSize: 12, fontFamily: c.fontSys,
                      }}>
                        {/* Chapter name + progress bar */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{
                            flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis",
                            whiteSpace: "nowrap", fontWeight: 500,
                            color: isComplete ? c.dataOk : r.cleared ? c.text : c.textDim,
                          }}>
                            {r.chapter.displayName}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 600, fontFamily: c.fontSys,
                            color: pctColor(rPct, c), fontVariantNumeric: "tabular-nums", flexShrink: 0,
                          }}>{rPct}%</span>
                        </div>
                        {/* Controls row */}
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <ThemedCheck checked={r.cleared} onChange={(v) => update(r.id, { cleared: v })} c={c} />
                          <span style={{ fontSize: 9, color: c.accentDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>T</span>
                          <StatusPill value={r.treasures} onChange={(v) => update(r.id, { treasures: v })} c={c} />
                          <span style={{ fontSize: 9, color: c.accentDim, textTransform: "uppercase", letterSpacing: "0.06em" }}>Z</span>
                          <StatusPill value={r.zombies} onChange={(v) => update(r.id, { zombies: v })} c={c} />
                        </div>
                      </div>
                    );
                  })}
                  <div style={{
                    display: "flex", justifyContent: "space-between", padding: "4px 8px",
                    fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: c.textDim, borderTop: `1px solid ${c.border}`, fontFamily: c.fontSys,
                  }}>
                    <span>{total} chapters</span>
                    <span>{cleared}/{total} cleared</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
