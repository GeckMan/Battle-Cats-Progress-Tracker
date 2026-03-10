"use client";

import { useMemo, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeColors, pctColor, barFill, type ThemeColors } from "@/lib/theme-colors";

type Row = {
  id: string;
  crownMax: number | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  subchapter: {
    id: string;
    displayName: string;
    sortOrder: number;
    stageCount: number | null;
    saga: { id: string; displayName: string; sortOrder: number };
  };
};

type Group = { sagaId: string; sagaName: string; sortOrder: number; rows: Row[] };

function rowPct(r: Row) { return Math.round(((r.crownMax ?? 0) / 4) * 100); }
function sagaPct(rows: Row[]) { return rows.length ? Math.round(rows.reduce((s, r) => s + rowPct(r), 0) / rows.length) : 0; }

/* ── Crown Picker ───────────────────────────────────────────────────────── */

function CrownPicker({ value, onChange, c }: { value: number; onChange: (v: number) => void; c: ThemeColors }) {
  const crownColors: Record<number, { bg: string; border: string; color: string }> = {
    0: { bg: "rgba(136,136,128,0.1)", border: c.textDim, color: c.text },
    1: { bg: c.accentFill, border: c.accentDim, color: c.accentDim },
    2: { bg: c.accentFill, border: c.accent, color: c.accent },
    3: { bg: c.accentFill, border: c.accentHot, color: c.accentHot },
    4: { bg: c.dataOkFill, border: c.dataOk, color: c.dataOk },
  };

  return (
    <div style={{ display: "flex", gap: 1, alignItems: "center" }}>
      {[0, 1, 2, 3, 4].map((n) => {
        const isActive = value === n;
        const base: React.CSSProperties = {
          width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, fontFamily: c.fontSys, border: "1px solid",
          cursor: "pointer", transition: "all 0.15s", padding: 0,
        };
        const cc = crownColors[n];
        if (isActive) {
          return <button key={n} type="button" onClick={() => onChange(n)} style={{ ...base, background: cc.bg, borderColor: cc.border, color: cc.color, boxShadow: `0 0 3px ${cc.border}` }} title={n === 0 ? "Not started" : `Crown ${n}`}>{n === 0 ? "—" : n}</button>;
        }
        return <button key={n} type="button" onClick={() => onChange(n)} style={{ ...base, background: "transparent", borderColor: c.borderFaint, color: c.textDim }} title={n === 0 ? "Not started" : `Crown ${n}`}>{n === 0 ? "—" : n}</button>;
      })}
    </div>
  );
}

/* ── Bulk Button ────────────────────────────────────────────────────────── */

function BulkBtn({ children, onClick, variant, c }: { children: React.ReactNode; onClick: () => void; variant: "primary" | "danger"; c: ThemeColors }) {
  const s = variant === "danger"
    ? { border: `1px solid ${c.alert}`, background: c.alertFill, color: c.alert }
    : { border: `1px solid ${c.accentDim}`, background: c.accentFill, color: c.accent };
  return (
    <button type="button" onClick={onClick} style={{
      ...s, fontSize: 9, fontFamily: c.fontSys, fontWeight: 500, letterSpacing: "0.08em",
      textTransform: "uppercase", padding: "2px 6px", cursor: "pointer",
    }}>{children}</button>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function Sections({ groups }: { groups: Group[] }) {
  const { theme } = useTheme();
  const c = getThemeColors(theme);

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
    for (const [, rows] of map) rows.sort((a, b) => a.subchapter.sortOrder - b.subchapter.sortOrder);
    return map;
  }, [data, groups]);

  async function update(id: string, uiCrown: number) {
    const crownMax = uiCrown === 0 ? null : uiCrown;
    const status = crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";
    const prev = data.find((r) => r.id === id);
    setData((d) => d.map((r) => (r.id === id ? { ...r, crownMax, status } : r)));
    const res = await fetch("/api/legend", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, patch: { crownMax, status } }) });
    if (!res.ok) { if (prev) setData((d) => d.map((r) => (r.id === id ? prev : r))); setError("Failed to save."); }
  }

  async function bulkUpdate(ids: string[], uiCrown: number) {
    const crownMax = uiCrown === 0 ? null : uiCrown;
    const status = crownMax === null ? "NOT_STARTED" : crownMax >= 4 ? "COMPLETED" : "IN_PROGRESS";
    const idSet = new Set(ids);
    setData((prev) => prev.map((r) => (idSet.has(r.id) ? { ...r, crownMax, status } : r)));
    const res = await fetch("/api/legend/bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, patch: { crownMax, status } }) });
    if (!res.ok) setError("Failed to save.");
  }

  const allRows = data;
  const totalSubs = allRows.length;
  const crown4Total = allRows.filter((r) => r.crownMax === 4).length;
  const startedTotal = allRows.filter((r) => (r.crownMax ?? 0) > 0).length;
  const globalPct = sagaPct(allRows);
  const sortedGroups = groups.slice().sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* ── Global Metrics ─────────────────────────────────────────────────── */}
      <div style={{ background: c.panelBg, border: `1px solid ${c.border}`, overflow: "hidden" }}>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase",
          color: c.accent, padding: "6px 10px 5px", borderBottom: `1px solid ${c.accentDim}`,
          display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: c.fontSys,
        }}>
          <span>Legend Progress Overview</span>
          <span style={{ fontSize: 9, color: c.textDim, letterSpacing: "0.08em" }}>{groups.length} SAGAS</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 1, background: c.border }}>
          {[
            { label: "Completion", value: `${globalPct}%`, sub: `${totalSubs} subchapters` },
            { label: "Crown 4", value: `${crown4Total}`, sub: `of ${totalSubs}` },
            { label: "Started", value: `${startedTotal}`, sub: `of ${totalSubs}` },
            { label: "Remaining", value: `${totalSubs - startedTotal}`, sub: "not started" },
          ].map((m) => (
            <div key={m.label} style={{ background: c.panelBg, padding: "10px 12px", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, marginBottom: 2, fontFamily: c.fontSys }}>{m.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c.dataOk, fontVariantNumeric: "tabular-nums", lineHeight: 1.1, fontFamily: c.fontSys }}>{m.value}</div>
              <div style={{ fontSize: 9, color: c.textDim, marginTop: 2, letterSpacing: "0.06em", fontFamily: c.fontSys }}>{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {error && (
        <div style={{ border: `1px solid ${c.alert}`, background: c.alertFill, padding: "6px 10px", fontSize: 12, color: c.alert, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: c.fontSys }}>
          <span>{error}</span>
          <button type="button" onClick={() => setError(null)} style={{ background: "none", border: "none", color: c.alert, cursor: "pointer", fontSize: 14 }}>✕</button>
        </div>
      )}

      {/* ── Saga Panels — side by side ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${sortedGroups.length}, 1fr)`, gap: 8, alignItems: "start" }}>
        {sortedGroups.map((g) => {
          const rows = dataBySaga.get(g.sagaId) ?? [];
          const ids = rows.map((r) => r.id);
          const pct = sagaPct(rows);
          const total = rows.length;
          const crown4 = rows.filter((r) => r.crownMax === 4).length;
          const started = rows.filter((r) => (r.crownMax ?? 0) > 0).length;
          const isOpen = open[g.sagaId];

          return (
            <div key={g.sagaId} style={{ background: c.panelBg, border: `1px solid ${c.border}`, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* Header */}
              <div style={{ borderBottom: isOpen ? `1px solid ${c.accentDim}` : "none", padding: "6px 8px 5px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontFamily: c.fontSys, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.sagaName}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: c.fontSys, color: pctColor(pct, c), fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>{pct}%</span>
                  <button type="button" onClick={() => setOpen((o) => ({ ...o, [g.sagaId]: !o[g.sagaId] }))}
                    style={{ flexShrink: 0, fontSize: 9, fontFamily: c.fontSys, fontWeight: 500, color: c.textDim, padding: "2px 6px", border: `1px solid ${c.border}`, background: "transparent", cursor: "pointer" }}
                  >{isOpen ? "▲" : "▼"}</button>
                </div>
                <div style={{ height: 3, background: c.voidPanel, border: `1px solid ${c.border}`, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: barFill(pct, theme), transition: "width 0.3s" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, fontFamily: c.fontSys, flexWrap: "wrap" }}>
                  <span style={{ color: c.accentDim, fontSize: 9, textTransform: "uppercase" }}>S</span>
                  <span style={{ color: started === total ? c.dataOk : c.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{started}/{total}</span>
                  <span style={{ color: c.accentDim, fontSize: 9, textTransform: "uppercase", marginLeft: 4 }}>C4</span>
                  <span style={{ color: crown4 === total ? c.dataOk : c.text, fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>{crown4}/{total}</span>
                  <span style={{ flex: 1 }} />
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 4)} c={c}>4</BulkBtn>
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 3)} c={c}>3</BulkBtn>
                  <BulkBtn variant="primary" onClick={() => bulkUpdate(ids, 1)} c={c}>1</BulkBtn>
                  <BulkBtn variant="danger" onClick={() => bulkUpdate(ids, 0)} c={c}>0</BulkBtn>
                </div>
              </div>

              {/* Rows */}
              {isOpen && (
                <div style={{ overflowY: "auto", maxHeight: "70vh", background: c.void, flex: 1 }}>
                  {rows.map((r) => {
                    const crown = r.crownMax ?? 0;
                    return (
                      <div key={r.id} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "4px 8px",
                        borderBottom: `1px solid ${c.borderFaint}`, fontSize: 13, fontFamily: c.fontSys,
                        background: crown >= 4 ? c.dataOkFill : crown >= 1 ? c.accentFill : "transparent",
                      }}>
                        <span style={{
                          flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500,
                          color: crown >= 4 ? c.dataOk : crown >= 1 ? c.text : c.textDim,
                        }}>
                          {r.subchapter.displayName}
                          {r.subchapter.stageCount != null && <span style={{ fontSize: 9, color: c.textDim, marginLeft: 4 }}>({r.subchapter.stageCount})</span>}
                        </span>
                        <CrownPicker value={crown} onChange={(v) => update(r.id, v)} c={c} />
                      </div>
                    );
                  })}
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 8px", fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: c.textDim, borderTop: `1px solid ${c.border}`, fontFamily: c.fontSys }}>
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
