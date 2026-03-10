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

function pctCssColor(pct: number): string {
  if (pct >= 100) return "var(--data-green, #50FF50)";
  if (pct >= 75) return "var(--nerv-orange-hot, #FFCC50)";
  if (pct >= 25) return "var(--nerv-orange, #FF9830)";
  if (pct > 0) return "var(--nerv-orange-dim, #C87020)";
  return "var(--steel-dim, #888880)";
}

function barFillColor(pct: number): string {
  if (pct >= 100) return "#50FF50";
  if (pct >= 75) return "#FFCC50";
  if (pct >= 25) return "#FF9830";
  if (pct > 0) return "#C87020";
  return "#333";
}

/* ── Status Select ──────────────────────────────────────────────────────── */

function StatusPill({ value, onChange }: {
  value: "NONE" | "PARTIAL" | "ALL";
  onChange: (v: "NONE" | "PARTIAL" | "ALL") => void;
}) {
  const colorMap: Record<string, { bg: string; border: string; color: string }> = {
    NONE: { bg: "transparent", border: "var(--steel-faint, rgba(200,200,192,0.12))", color: "var(--steel-dim, #888880)" },
    PARTIAL: { bg: "rgba(255,152,48,0.06)", border: "var(--nerv-orange-dim, #C87020)", color: "var(--nerv-orange, #FF9830)" },
    ALL: { bg: "rgba(80,255,80,0.06)", border: "var(--data-green-dim, #30BB30)", color: "var(--data-green, #50FF50)" },
  };
  const c = colorMap[value];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as "NONE" | "PARTIAL" | "ALL")}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: "var(--font-sys, monospace)",
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

function NervCheck({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      style={{
        width: 20,
        height: 20,
        border: `1px solid ${checked ? "var(--data-green, #50FF50)" : "var(--steel-faint, rgba(200,200,192,0.12))"}`,
        background: checked ? "rgba(80,255,80,0.1)" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "all 0.15s",
        flexShrink: 0,
      }}
    >
      {checked && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="var(--data-green, #50FF50)" strokeWidth="2.5">
          <polyline points="2,6 5,9 10,3" />
        </svg>
      )}
    </button>
  );
}

/* ── Bulk Button ────────────────────────────────────────────────────────── */

function BulkBtn({ children, onClick, variant }: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "muted" | "danger";
}) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { border: "1px solid var(--nerv-orange-dim, #C87020)", background: "rgba(255,152,48,0.06)", color: "var(--nerv-orange, #FF9830)" },
    muted: { border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))", background: "transparent", color: "var(--steel-dim, #888880)" },
    danger: { border: "1px solid var(--alert-red-dim, #CC2020)", background: "rgba(255,48,48,0.06)", color: "var(--alert-red, #FF3030)" },
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
        background: "var(--void-warm, #080807)",
        border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--nerv-orange, #FF9830)", padding: "8px 12px 7px",
          borderBottom: "1px solid var(--nerv-orange-dim, #C87020)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--font-sys, monospace)",
        }}>
          <span>Story Progress Overview</span>
          <span style={{ fontSize: 9, color: "var(--steel-dim, #888880)", letterSpacing: "0.08em" }}>
            {groups.length} ARCS
          </span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1,
          background: "var(--steel-faint, rgba(200,200,192,0.12))",
        }}>
          {[
            { label: "Completion", value: `${globalPct}%`, sub: `${totalChaps} chapters` },
            { label: "Cleared", value: `${clearedTotal}`, sub: `of ${totalChaps}` },
            { label: "Treasures", value: `${treasuresTotal}`, sub: `all collected` },
            { label: "Zombies", value: `${zombiesTotal}`, sub: `all cleared` },
          ].map((m) => (
            <div key={m.label} style={{
              background: "var(--void-warm, #080807)", padding: "12px 14px",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <div style={{
                fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase",
                color: "var(--nerv-orange, #FF9830)", marginBottom: 3,
                fontFamily: "var(--font-sys, monospace)",
              }}>{m.label}</div>
              <div style={{
                fontSize: 22, fontWeight: 700, color: "var(--data-green, #50FF50)",
                fontVariantNumeric: "tabular-nums", textShadow: "0 0 4px rgba(80,255,80,0.3)",
                lineHeight: 1.1, fontFamily: "var(--font-sys, monospace)",
              }}>{m.value}</div>
              <div style={{
                fontSize: 9, color: "var(--steel-dim, #888880)", marginTop: 3,
                letterSpacing: "0.06em", fontFamily: "var(--font-sys, monospace)",
              }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          border: "1px solid var(--alert-red-dim, #CC2020)", background: "rgba(255,48,48,0.08)",
          padding: "8px 14px", fontSize: 12, color: "var(--alert-red, #FF3030)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontFamily: "var(--font-sys, monospace)",
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{
            background: "none", border: "none", color: "var(--alert-red, #FF3030)", cursor: "pointer", fontSize: 14,
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
            background: "var(--void-warm, #080807)",
            border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
            overflow: "hidden",
          }}>

            {/* Arc Header */}
            <div style={{
              borderBottom: isOpen ? "1px solid var(--nerv-orange-dim, #C87020)" : "none",
              padding: "10px 12px 8px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <span style={{
                      fontFamily: "var(--font-sys, monospace)", fontSize: 11, fontWeight: 700,
                      letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--nerv-orange, #FF9830)",
                    }}>{arcLabel(g.arc)}</span>
                    <span style={{
                      fontSize: 9, fontFamily: "var(--font-sys, monospace)", color: "var(--steel-dim, #888880)",
                      border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))", padding: "1px 6px",
                      letterSpacing: "0.06em",
                    }}>{arcShort(g.arc)}</span>
                    <span style={{
                      marginLeft: "auto", fontSize: 18, fontWeight: 700,
                      fontFamily: "var(--font-sys, monospace)", color: pctCssColor(pct),
                      fontVariantNumeric: "tabular-nums",
                      textShadow: pct >= 75 ? `0 0 4px ${pctCssColor(pct)}` : "none",
                    }}>{pct}%</span>
                  </div>

                  <div style={{
                    height: 4, background: "var(--void-panel, #0C0C0A)",
                    border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                    overflow: "hidden", marginBottom: 8,
                  }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: barFillColor(pct), transition: "width 0.3s" }} />
                  </div>

                  <div style={{
                    display: "flex", gap: 16, fontSize: 11, fontFamily: "var(--font-sys, monospace)", marginBottom: 8,
                  }}>
                    {[
                      { label: "Cleared", val: cleared },
                      { label: "Treasures", val: treasuresAll },
                      { label: "Zombies", val: zombiesAll },
                    ].map((s) => (
                      <span key={s.label}>
                        <span style={{ color: "var(--nerv-orange-dim, #C87020)", letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 10 }}>{s.label} </span>
                        <span style={{ color: s.val === total ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{s.val}/{total}</span>
                      </span>
                    ))}
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "center" }}>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { cleared: true })}>All Cleared</BulkBtn>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { treasures: "ALL" })}>Treasures → All</BulkBtn>
                    <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, { zombies: "ALL" })}>Zombies → All</BulkBtn>
                    <span style={{ color: "var(--steel-faint, rgba(200,200,192,0.12))", padding: "0 2px" }}>│</span>
                    <BulkBtn variant="muted" onClick={() => bulkUpdate(ids, { cleared: false })}>Reset Cleared</BulkBtn>
                    <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, { cleared: false, treasures: "NONE", zombies: "NONE" })}>Reset All</BulkBtn>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen((o) => ({ ...o, [g.arc]: !o[g.arc] }))}
                  style={{
                    flexShrink: 0, fontSize: 10, fontFamily: "var(--font-sys, monospace)", fontWeight: 500,
                    letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--steel-dim, #888880)",
                    padding: "4px 10px", border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                    background: "transparent", cursor: "pointer", marginTop: 2,
                  }}
                >
                  {isOpen ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Chapter Table */}
            {isOpen && (
              <div style={{ overflowX: "auto", background: "var(--void, #000)" }}>
                <table style={{
                  width: "100%", fontSize: 12, fontFamily: "var(--font-sys, monospace)",
                  borderCollapse: "collapse", minWidth: 560,
                }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--steel-faint, rgba(200,200,192,0.12))" }}>
                      {["Chapter", "Cleared", "Treasures", "Zombies"].map((h, i) => (
                        <th key={h} style={{
                          padding: "8px 12px",
                          textAlign: i === 0 ? "left" : "center",
                          fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase",
                          color: "var(--nerv-orange, #FF9830)", background: "var(--void-warm, #080807)",
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
                            borderBottom: "1px solid var(--steel-faint, rgba(200,200,192,0.06))",
                            background: isComplete ? "rgba(80,255,80,0.02)" : "transparent",
                            transition: "background 0.15s",
                          }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--void-panel, #0C0C0A)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isComplete ? "rgba(80,255,80,0.02)" : "transparent"; }}
                        >
                          <td style={{ padding: "8px 12px" }}>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                              <span style={{
                                fontWeight: 500, fontSize: 12,
                                color: isComplete ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)",
                              }}>
                                {r.chapter.displayName}
                              </span>
                              <div style={{ width: 100, height: 2, background: "var(--void-panel, #0C0C0A)", overflow: "hidden" }}>
                                <div style={{ height: "100%", width: `${rPct}%`, background: barFillColor(rPct), transition: "width 0.2s" }} />
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                              <NervCheck checked={r.cleared} onChange={(v) => update(r.id, { cleared: v })} />
                            </div>
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <StatusPill value={r.treasures} onChange={(v) => update(r.id, { treasures: v })} />
                          </td>
                          <td style={{ padding: "8px 12px", textAlign: "center" }}>
                            <StatusPill value={r.zombies} onChange={(v) => update(r.id, { zombies: v })} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  padding: "5px 12px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                  color: "var(--steel-dim, #888880)", borderTop: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
                  fontFamily: "var(--font-sys, monospace)",
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
