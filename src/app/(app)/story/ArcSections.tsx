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

      {/* ── Arc Panels ────────────────────────────────────────────────────── */}
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
          }}>

            {/* Arc Header */}
            <div style={{
              borderBottom: isOpen ? `1px solid ${c.accentDim}` : "none",
              padding: "10px 12px 8px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: c.fontSys, fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.14em", textTransform: "uppercase", color: c.accent,
                    }}>{arcLabel(g.arc)}</span>
                    <span style={{
                      fontSize: 9, fontFamily: c.fontSys, color: c.textDim,
                      border: `1px solid ${c.borderFaint}`, padding: "1px 6px",
                      letterSpacing: "0.06em",
                    }}>{arcShort(g.arc)}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: 18, fontWeight: 700,
                      fontFamily: c.fontSys, color: pctColor(pct, c),
                      fontVariantNumeric: "tabular-nums",
                    }}>{pct}%</span>
                  </div>

                  <div style={{
                    height: 4, background: c.voidPanel,
                    border: `1px solid ${c.borderFaint}`,
                    overflow: "hidden", marginBottom: 8,
                  }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: barFill(pct, theme), transition: "width 0.3s" }} />
                  </div>

                  <div style={{
                    display: "flex", gap: 16, fontSize: 11, fontFamily: c.fontSys, marginBottom: 8,
                  }}>
                    {[
                      { label: "Cleared", val: cleared },
                      { label: "Treasures", val: treasuresAll },
                      { label: "Zombies", val: zombiesAll },
                    ].map((s) => (
                      <span key={s.label}>
                        <span style={{ color: c.accentDim, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }}>{s.label} </span>
                        <span style={{ color: s.val === total ? c.dataOk : c.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{s.val}/{total}</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { cleared: true })} c={c}>All Cleared</BulkBtn>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { treasures: "ALL" })} c={c}>Treasures → All</BulkBtn>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { zombies: "ALL" })} c={c}>Zombies → All</BulkBtn>
                    <span style={{ color: c.borderFaint, padding: "0 2px" }}>│</span>
                    <BulkBtn variant="muted" onClick={() => bulkUpdate(ids, { cleared: false })} c={c}>Reset Cleared</BulkBtn>
                    <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, { cleared: false, treasures: "NONE", zombies: "NONE" })} c={c}>Reset All</BulkBtn>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.arc]: !o[g.arc] }))}
                  style={{
                    flexShrink: 0, fontSize: 10, fontFamily: c.fontSys, fontWeight: 500,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: c.textDim,
                    padding: "4px 10px", border: `1px solid ${c.borderFaint}`,
                    background: "transparent", cursor: "pointer", marginTop: 2,
                  }}
                >
                  {isOpen ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Chapter Table */}
            {isOpen && (
              <div style={{ overflowX: "auto", background: c.void }}>
                <table style={{
                  width: "100%", fontSize: 12, fontFamily: c.fontSys,
                  borderCollapse: "collapse", minWidth: 560,
                }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${c.borderFaint}` }}>
                      {["Chapter", "Cleared", "Treasures", "Zombies"].map((h, i) => (
                        <th key={h} style={{
                          padding: "8px 12px",
                          textAlign: i === 0 ? "left" : "center",
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                          color: c.accent, background: c.panelBg,
                          width: i === 0 ? undefined : i === 1 ? 80 : 100,
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => {
                      const rPct = rowPct(r);
                      const isComplete = rPct === 100;
                      return (
                        <tr
                          key={r.id}
                          style={{
                            borderBottom: `1px solid ${c.borderFaint}`,
                            background: isComplete ? c.dataOkFill : "transparent",
                            transition: "background 0.15s",
                          }}
                        >
                          <td style={{ padding: "8px 12px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={{
                                fontWeight: 500, fontSize: 12,
                                color: isComplete ? c.dataOk : c.text,
                              }}>
                                {r.chapter.displayName}
                              </span>
                              <div style={{ width: 100, height: 2, background: c.voidPanel, overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${rPct}%`, background: barFill(rPct, theme), transition: "width 0.2s" }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <ThemedCheck checked={r.cleared} onChange={(v) => update(r.id, { cleared: v })} c={c} />
                            </div>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <StatusPill value={r.treasures} onChange={(v) => update(r.id, { treasures: v })} c={c} />
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <StatusPill value={r.zombies} onChange={(v) => update(r.id, { zombies: v })} c={c} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "5px 12px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: c.textDim, borderTop: `1px solid ${c.border}`,
                  fontFamily: c.fontSys,
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
  );
}
