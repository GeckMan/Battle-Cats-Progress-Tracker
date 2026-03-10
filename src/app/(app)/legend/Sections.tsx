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
    stageCount: number | null;
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

/** Returns CSS color var for progress level */
function pctCssColor(pct: number): string {
  if (pct >= 100) return "var(--data-green, #50FF50)";
  if (pct >= 75) return "var(--nerv-orange-hot, #FFCC50)";
  if (pct >= 25) return "var(--nerv-orange, #FF9830)";
  if (pct > 0) return "var(--nerv-orange-dim, #C87020)";
  return "var(--steel-dim, #888880)";
}

/** Tailwind fallback fill color for progress bar */
function barFillColor(pct: number): string {
  if (pct >= 100) return "#50FF50";
  if (pct >= 75) return "#FFCC50";
  if (pct >= 25) return "#FF9830";
  if (pct > 0) return "#C87020";
  return "#333";
}

/* ── Crown Picker ───────────────────────────────────────────────────────── */

function CrownPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[0, 1, 2, 3, 4].map((n) => {
        const isActive = value === n;
        const baseStyle: React.CSSProperties = {
          width: 28,
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 700,
          fontFamily: "var(--font-sys, monospace)",
          border: "1px solid",
          cursor: "pointer",
          transition: "all 0.15s",
          letterSpacing: "0.04em",
        };

        if (isActive) {
          const colors: Record<number, { bg: string; border: string; color: string }> = {
            0: { bg: "rgba(136,136,128,0.1)", border: "var(--steel-dim, #888)", color: "var(--steel, #D8D8D0)" },
            1: { bg: "rgba(255,152,48,0.08)", border: "var(--nerv-orange-dim, #C87020)", color: "var(--nerv-orange-dim, #C87020)" },
            2: { bg: "rgba(255,152,48,0.12)", border: "var(--nerv-orange, #FF9830)", color: "var(--nerv-orange, #FF9830)" },
            3: { bg: "rgba(255,204,80,0.12)", border: "var(--nerv-orange-hot, #FFCC50)", color: "var(--nerv-orange-hot, #FFCC50)" },
            4: { bg: "rgba(80,255,80,0.1)", border: "var(--data-green, #50FF50)", color: "var(--data-green, #50FF50)" },
          };
          const c = colors[n];
          return (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              style={{ ...baseStyle, background: c.bg, borderColor: c.border, color: c.color, boxShadow: `0 0 4px ${c.border}` }}
              title={n === 0 ? "Not started" : `Crown ${n}`}
            >
              {n === 0 ? "—" : n}
            </button>
          );
        }

        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              ...baseStyle,
              background: "transparent",
              borderColor: "var(--steel-faint, rgba(200,200,192,0.12))",
              color: "var(--steel-dim, #888880)",
            }}
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
  variant: "primary" | "muted" | "danger";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      border: "1px solid var(--nerv-orange-dim, #C87020)",
      background: "rgba(255,152,48,0.06)",
      color: "var(--nerv-orange, #FF9830)",
    },
    muted: {
      border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
      background: "transparent",
      color: "var(--steel-dim, #888880)",
    },
    danger: {
      border: "1px solid var(--alert-red-dim, #CC2020)",
      background: "rgba(255,48,48,0.06)",
      color: "var(--alert-red, #FF3030)",
    },
  };
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...styles[variant],
        fontSize: 10,
        fontFamily: "var(--font-sys, monospace)",
        fontWeight: 500,
        letterSpacing: "0.08em",
        textTransform: "uppercase" as const,
        padding: "4px 8px",
        cursor: "pointer",
        transition: "opacity 0.15s",
      }}
    >
      {children}
    </button>
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
    for (const [, rows] of map) {
      rows.sort((a, b) => a.subchapter.sortOrder - b.subchapter.sortOrder);
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

  // Global summary
  const allRows = data;
  const totalSubs = allRows.length;
  const crown4Total = allRows.filter((r) => r.crownMax === 4).length;
  const startedTotal = allRows.filter((r) => (r.crownMax ?? 0) > 0).length;
  const globalPct = sagaPct(allRows);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Global Metrics Grid ───────────────────────────────────────────── */}
      <div className="nerv-panel" style={{
        background: "var(--void-warm, #080807)",
        border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
        overflow: "hidden",
      }}>
        <div className="nerv-panel-header" style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--nerv-orange, #FF9830)",
          padding: "8px 12px 7px",
          borderBottom: "1px solid var(--nerv-orange-dim, #C87020)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontFamily: "var(--font-sys, monospace)",
        }}>
          <span>Legend Progress Overview</span>
          <span style={{ fontSize: 9, color: "var(--steel-dim, #888880)", letterSpacing: "0.08em" }}>
            {groups.length} SAGAS
          </span>
        </div>

        <div className="nerv-metrics-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 1,
          background: "var(--steel-faint, rgba(200,200,192,0.12))",
        }}>
          {[
            { label: "Completion", value: `${globalPct}%`, sub: `${totalSubs} subchapters` },
            { label: "Crown 4", value: `${crown4Total}`, sub: `of ${totalSubs}` },
            { label: "Started", value: `${startedTotal}`, sub: `of ${totalSubs}` },
            { label: "Remaining", value: `${totalSubs - startedTotal}`, sub: "not started" },
          ].map((m) => (
            <div key={m.label} style={{
              background: "var(--void-warm, #080807)",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}>
              <div style={{
                fontSize: 10,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--nerv-orange, #FF9830)",
                marginBottom: 3,
                fontFamily: "var(--font-sys, monospace)",
              }}>{m.label}</div>
              <div style={{
                fontSize: 22,
                fontWeight: 700,
                color: "var(--data-green, #50FF50)",
                fontVariantNumeric: "tabular-nums",
                textShadow: "0 0 4px rgba(80,255,80,0.3)",
                lineHeight: 1.1,
                fontFamily: "var(--font-sys, monospace)",
              }}>{m.value}</div>
              <div style={{
                fontSize: 9,
                color: "var(--steel-dim, #888880)",
                marginTop: 3,
                letterSpacing: "0.06em",
                fontFamily: "var(--font-sys, monospace)",
              }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          border: "1px solid var(--alert-red-dim, #CC2020)",
          background: "rgba(255,48,48,0.08)",
          padding: "8px 14px",
          fontSize: 12,
          color: "var(--alert-red, #FF3030)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "var(--font-sys, monospace)",
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            background: "none",
            border: "none",
            color: "var(--alert-red, #FF3030)",
            cursor: "pointer",
            fontSize: 14,
          }}>✕</button>
        </div>
      )}

      {/* ── Saga Panels ───────────────────────────────────────────────────── */}
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
          const isOpen = open[g.sagaId];

          return (
            <div key={g.sagaId} style={{
              background: "var(--void-warm, #080807)",
              border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
              overflow: "hidden",
            }}>

              {/* ── Saga Header (NERV Panel Header) ───────────────────────── */}
              <div style={{
                borderBottom: isOpen ? "1px solid var(--nerv-orange-dim, #C87020)" : "none",
                padding: "10px 12px 8px",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>

                    {/* Title row */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        fontFamily: "var(--font-sys, monospace)",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--nerv-orange, #FF9830)",
                      }}>{g.sagaName}</span>
                      <span style={{
                        marginLeft: "auto",
                        fontSize: 18,
                        fontWeight: 700,
                        fontFamily: "var(--font-sys, monospace)",
                        color: pctCssColor(pct),
                        fontVariantNumeric: "tabular-nums",
                        textShadow: pct >= 75 ? `0 0 4px ${pctCssColor(pct)}` : "none",
                      }}>{pct}%</span>
                    </div>

                    {/* Progress bar */}
                    <div style={{
                      height: 4,
                      background: "var(--void-panel, #0C0C0A)",
                      border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                      overflow: "hidden",
                      marginBottom: 8,
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: barFillColor(pct),
                        transition: "width 0.3s",
                      }} />
                    </div>

                    {/* Stats row — NERV data-row style */}
                    <div style={{
                      display: "flex",
                      gap: 16,
                      fontSize: 11,
                      fontFamily: "var(--font-sys, monospace)",
                      marginBottom: 8,
                    }}>
                      <span>
                        <span style={{ color: "var(--nerv-orange-dim, #C87020)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }}>Started </span>
                        <span style={{ color: started === total ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{started}/{total}</span>
                      </span>
                      <span>
                        <span style={{ color: "var(--nerv-orange-dim, #C87020)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }}>Crown 4 </span>
                        <span style={{ color: crown4 === total ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{crown4}/{total}</span>
                      </span>
                    </div>

                    {/* Bulk actions */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                      <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 4)}>All → 4</BulkBtn>
                      <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 3)}>All → 3</BulkBtn>
                      <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 2)}>All → 2</BulkBtn>
                      <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 1)}>All → 1</BulkBtn>
                      <span style={{ color: "var(--steel-faint, rgba(200,200,192,0.12))", padding: "0 2px" }}>│</span>
                      <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, 0)}>Reset → 0</BulkBtn>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setOpen((o) => ({ ...o, [g.sagaId]: !o[g.sagaId] }))}
                    style={{
                      flexShrink: 0,
                      fontSize: 10,
                      fontFamily: "var(--font-sys, monospace)",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--steel-dim, #888880)",
                      padding: "4px 10px",
                      border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                      background: "transparent",
                      cursor: "pointer",
                      marginTop: 2,
                    }}
                  >
                    {isOpen ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ── Subchapter Table (NERV Data Table) ────────────────────── */}
              {isOpen && (
                <div style={{ overflowX: "auto", background: "var(--void, #000)" }}>
                  <table style={{
                    width: "100%",
                    fontSize: 12,
                    fontFamily: "var(--font-sys, monospace)",
                    borderCollapse: "collapse",
                    minWidth: 520,
                  }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--steel-faint, rgba(200,200,192,0.12))" }}>
                        <th style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--nerv-orange, #FF9830)",
                          background: "var(--void-warm, #080807)",
                        }}>Subchapter</th>
                        <th style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--nerv-orange, #FF9830)",
                          background: "var(--void-warm, #080807)",
                          width: 80,
                        }}>Stages</th>
                        <th style={{
                          padding: "8px 12px",
                          textAlign: "center",
                          fontSize: 10,
                          fontWeight: 700,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                          color: "var(--nerv-orange, #FF9830)",
                          background: "var(--void-warm, #080807)",
                          width: 180,
                        }}>Crown</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const crown = r.crownMax ?? 0;
                        const rPct = rowPct(r);
                        return (
                          <tr
                            key={r.id}
                            style={{
                              borderBottom: "1px solid var(--steel-faint, rgba(200,200,192,0.06))",
                              background: crown >= 4
                                ? "rgba(80,255,80,0.02)"
                                : crown >= 1
                                  ? "rgba(255,152,48,0.02)"
                                  : "transparent",
                              transition: "background 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLElement).style.background = "var(--void-panel, #0C0C0A)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLElement).style.background = crown >= 4
                                ? "rgba(80,255,80,0.02)"
                                : crown >= 1
                                  ? "rgba(255,152,48,0.02)"
                                  : "transparent";
                            }}
                          >
                            {/* Subchapter name + mini progress */}
                            <td style={{ padding: "8px 12px" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                <span style={{
                                  fontWeight: 500,
                                  color: crown >= 4
                                    ? "var(--data-green, #50FF50)"
                                    : crown >= 1
                                      ? "var(--steel, #D8D8D0)"
                                      : "var(--steel-dim, #888880)",
                                  fontSize: 12,
                                }}>
                                  {r.subchapter.displayName}
                                </span>
                                {/* Mini progress bar */}
                                <div style={{
                                  width: 100,
                                  height: 2,
                                  background: "var(--void-panel, #0C0C0A)",
                                  overflow: "hidden",
                                }}>
                                  <div style={{
                                    height: "100%",
                                    width: `${rPct}%`,
                                    background: barFillColor(rPct),
                                    transition: "width 0.2s",
                                  }} />
                                </div>
                              </div>
                            </td>

                            {/* Stage count */}
                            <td style={{
                              padding: "8px 12px",
                              textAlign: "center",
                              fontVariantNumeric: "tabular-nums",
                              color: r.subchapter.stageCount
                                ? "var(--steel, #D8D8D0)"
                                : "var(--steel-faint, rgba(200,200,192,0.12))",
                              fontSize: 11,
                            }}>
                              {r.subchapter.stageCount ?? "—"}
                            </td>

                            {/* Crown picker */}
                            <td style={{ padding: "8px 12px" }}>
                              <div style={{ display: "flex", justifyContent: "center" }}>
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

                  {/* Status bar */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "5px 12px",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "var(--steel-dim, #888880)",
                    borderTop: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                    fontFamily: "var(--font-sys, monospace)",
                  }}>
                    <span>{total} subchapters</span>
                    <span>{crown4}/{total} complete</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
