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

/* shared font shorthand */
const SYS: React.CSSProperties = { fontFamily: "var(--font-sys, monospace)" };

/* ── Crown Picker (compact) ─────────────────────────────────────────────── */

function CrownPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[0, 1, 2, 3, 4].map((n) => {
        const isActive = value === n;
        const base: React.CSSProperties = {
          width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, ...SYS, border: "1px solid", cursor: "pointer",
          transition: "all 0.15s", letterSpacing: "0.04em", padding: 0,
        };

        const colors: Record<number, { bg: string; border: string; color: string }> = {
          0: { bg: "rgba(136,136,128,0.1)", border: "var(--steel-dim, #888)", color: "var(--steel, #D8D8D0)" },
          1: { bg: "rgba(255,152,48,0.08)", border: "var(--nerv-orange-dim, #C87020)", color: "var(--nerv-orange-dim, #C87020)" },
          2: { bg: "rgba(255,152,48,0.12)", border: "var(--nerv-orange, #FF9830)", color: "var(--nerv-orange, #FF9830)" },
          3: { bg: "rgba(255,204,80,0.12)", border: "var(--nerv-orange-hot, #FFCC50)", color: "var(--nerv-orange-hot, #FFCC50)" },
          4: { bg: "rgba(80,255,80,0.1)", border: "var(--data-green, #50FF50)", color: "var(--data-green, #50FF50)" },
        };

        if (isActive) {
          const c = colors[n];
          return <button key={n} type="button" onClick={() => onChange(n)} style={{ ...base, background: c.bg, borderColor: c.border, color: c.color, boxShadow: `0 0 3px ${c.border}` }} title={n === 0 ? "Not started" : `Crown ${n}`}>{n === 0 ? "—" : n}</button>;
        }

        return <button key={n} type="button" onClick={() => onChange(n)} style={{ ...base, background: "transparent", borderColor: "var(--steel-faint, rgba(200,200,192,0.12))", color: "var(--steel-dim, #888880)" }} title={n === 0 ? "Not started" : `Crown ${n}`}>{n === 0 ? "—" : n}</button>;
      })}
    </div>
  );
}

/* ── Bulk Button (compact) ──────────────────────────────────────────────── */

function BulkBtn({ children, onClick, variant }: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "danger";
}) {
  const s = variant === "danger"
    ? { border: "1px solid var(--alert-red-dim, #CC2020)", background: "rgba(255,48,48,0.06)", color: "var(--alert-red, #FF3030)" }
    : { border: "1px solid var(--nerv-orange-dim, #C87020)", background: "rgba(255,152,48,0.06)", color: "var(--nerv-orange, #FF9830)" };
  return (
    <button type="button" onClick={onClick} style={{
      ...s, fontSize: 9, ...SYS, fontWeight: 500, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "2px 6px", cursor: "pointer",
    }}>{children}</button>
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

  const sortedGroups = groups.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Global Metrics Grid ───────────────────────────────────────────── */}
      <div style={{
        background: "var(--void-warm, #080807)",
        border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))",
        overflow: "hidden",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "var(--nerv-orange, #FF9830)", padding: "6px 10px 5px",
          borderBottom: "1px solid var(--nerv-orange-dim, #C87020)",
          display: "flex", justifyContent: "space-between", alignItems: "center", ...SYS,
        }}>
          <span>Legend Progress Overview</span>
          <span style={{ fontSize: 9, color: "var(--steel-dim, #888880)", letterSpacing: "0.08em" }}>{groups.length} SAGAS</span>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1,
          background: "var(--steel-faint, rgba(200,200,192,0.12))",
        }}>
          {[
            { label: "Completion", value: `${globalPct}%`, sub: `${totalSubs} subchapters` },
            { label: "Crown 4", value: `${crown4Total}`, sub: `of ${totalSubs}` },
            { label: "Started", value: `${startedTotal}`, sub: `of ${totalSubs}` },
            { label: "Remaining", value: `${totalSubs - startedTotal}`, sub: "not started" },
          ].map((m) => (
            <div key={m.label} style={{ background: "var(--void-warm, #080807)", padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--nerv-orange, #FF9830)", marginBottom: 2, ...SYS }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--data-green, #50FF50)", fontVariantNumeric: "tabular-nums", textShadow: "0 0 4px rgba(80,255,80,0.3)", lineHeight: 1.1, ...SYS }}>{m.value}</div>
              <div style={{ fontSize: 9, color: "var(--steel-dim, #888880)", marginTop: 2, letterSpacing: "0.06em", ...SYS }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Error Banner ──────────────────────────────────────────────────── */}
      {error && (
        <div style={{
          border: "1px solid var(--alert-red-dim, #CC2020)", background: "rgba(255,48,48,0.08)",
          padding: "6px 10px", fontSize: 12, color: "var(--alert-red, #FF3030)",
          display: "flex", alignItems: "center", justifyContent: "space-between", ...SYS,
        }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{ background: "none", border: "none", color: "var(--alert-red, #FF3030)", cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* ── Saga Panels — side by side ─────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${sortedGroups.length}, 1fr)`,
        gap: 8,
        alignItems: "start",
      }}>
        {sortedGroups.map((g) => {
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
              display: "flex",
              flexDirection: "column",
            }}>
              {/* Saga Header */}
              <div style={{ borderBottom: isOpen ? "1px solid var(--nerv-orange-dim, #C87020)" : "none", padding: "6px 8px 5px" }}>
                {/* Title + % + toggle */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--nerv-orange, #FF9830)", ...SYS, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1, minWidth: 0 }}>{g.sagaName}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, ...SYS, color: pctCssColor(pct), fontVariantNumeric: "tabular-nums", textShadow: pct >= 75 ? `0 0 4px ${pctCssColor(pct)}` : "none", flexShrink: 0 }}>{pct}%</span>
                  <button type="button" onClick={() => setOpen((o) => ({ ...o, [g.sagaId]: !o[g.sagaId] }))}
                    style={{ flexShrink: 0, fontSize: 9, ...SYS, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--steel-dim, #888880)", padding: "2px 6px", border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))", background: "transparent", cursor: "pointer" }}
                  >{isOpen ? "▲" : "▼"}</button>
                </div>

                {/* Progress bar */}
                <div style={{ height: 3, background: "var(--void-panel, #0C0C0A)", border: "1px solid var(--steel-faint, rgba(200,200,192,0.12))", overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: barFillColor(pct), transition: "width 0.3s" }} />
                </div>

                {/* Stats + bulk actions inline */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, ...SYS, flexWrap: "wrap" }}>
                  <span style={{ color: "var(--nerv-orange-dim, #C87020)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>S</span>
                  <span style={{ color: started === total ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)", fontWeight: 500, fontVariantNumeric: "tabular-nums", fontSize: 10 }}>{started}/{total}</span>
                  <span style={{ color: "var(--nerv-orange-dim, #C87020)", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase", marginLeft: 4 }}>C4</span>
                  <span style={{ color: crown4 === total ? "var(--data-green, #50FF50)" : "var(--steel, #D8D8D0)", fontWeight: 500, fontVariantNumeric: "tabular-nums", fontSize: 10 }}>{crown4}/{total}</span>
                  <span style={{ flex: 1 }} />
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 4)}>4</BulkBtn>
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 3)}>3</BulkBtn>
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 1)}>1</BulkBtn>
                  <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, 0)}>0</BulkBtn>
                </div>
              </div>

              {/* Subchapter Rows — compact, no separate table headers */}
              {isOpen && (
                <div style={{ overflowY: "auto", maxHeight: "70vh", background: "var(--void, #000)", flex: 1 }}>
                  {rows.map((r) => {
                    const crown = r.crownMax ?? 0;
                    return (
                      <div
                        key={r.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          padding: "4px 8px",
                          borderBottom: "1px solid var(--steel-faint, rgba(200,200,192,0.04))",
                          background: crown >= 4 ? "rgba(80,255,80,0.02)" : crown >= 1 ? "rgba(255,152,48,0.02)" : "transparent",
                          fontSize: 13,
                          ...SYS,
                        }}
                      >
                        {/* Subchapter name */}
                        <span style={{
                          flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                          fontWeight: 500,
                          color: crown >= 4 ? "var(--data-green, #50FF50)" : crown >= 1 ? "var(--steel, #D8D8D0)" : "var(--steel-dim, #888880)",
                        }}>
                          {r.subchapter.displayName}
                          {r.subchapter.stageCount != null && (
                            <span style={{ fontSize: 9, color: "var(--steel-dim, #888880)", marginLeft: 4 }}>({r.subchapter.stageCount})</span>
                          )}
                        </span>

                        {/* Crown picker */}
                        <CrownPicker value={crown} onChange={(v) => update(r.id, v)} />
                      </div>
                    );
                  })}

                  {/* Status bar */}
                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "4px 8px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--steel-dim, #888880)", borderTop: "1px solid var(--steel-faint, rgba(200,200,192,0.12))", ...SYS,
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
    </div>
  );
}
