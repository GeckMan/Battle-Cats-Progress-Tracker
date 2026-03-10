"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { getThemeColors, barFill, type ThemeColors } from "@/lib/theme-colors";

type Row = {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  imageFile?: string | null;
};

/* ── Hexagonal Honeycomb (NERV theme) ──────────────────────────────────── */

const HEX_CLIP = "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";
const HEX_GAP = 4; // px gap between hexagons
const HEX_RATIO = 1.155; // height/width ratio for regular hexagon (2/√3)

function HexGrid({ items, c, onToggle }: { items: Row[]; c: ThemeColors; onToggle: (id: string, earned: boolean) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(1200);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      for (const e of entries) setContainerW(e.contentRect.width);
    });
    obs.observe(containerRef.current);
    setContainerW(containerRef.current.clientWidth);
    return () => obs.disconnect();
  }, []);

  // Compute hex size to fill the container width
  // Target ~12-14 columns for a nice honeycomb, with hexes ~100px wide
  const targetCols = Math.max(6, Math.floor(containerW / 110));
  // Odd rows are offset by half a hex, so we need room for that
  const hexW = Math.floor((containerW - HEX_GAP * targetCols) / (targetCols + 0.5));
  const hexH = Math.floor(hexW * HEX_RATIO);
  const cols = targetCols;

  const colW = hexW + HEX_GAP;
  const rowH = Math.floor(hexH * 0.75) + HEX_GAP; // 75% vertical stacking for honeycomb
  const rowCount = Math.ceil(items.length / cols);
  const totalH = rowCount * rowH + (hexH - rowH) + 8;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: totalH, minHeight: 200 }}>
      {items.map((m, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const isOddRow = row % 2 === 1;
        const x = col * colW + (isOddRow ? colW / 2 : 0);
        const y = row * rowH;

        return (
          <button
            key={m.id}
            type="button"
            onClick={() => onToggle(m.id, !m.earned)}
            title={`${m.name}\n${m.description}`}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: hexW,
              height: hexH,
              clipPath: HEX_CLIP,
              border: "none",
              background: m.earned ? c.accentFill : c.void,
              cursor: "pointer",
              transition: "all 0.15s",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Inner hex border effect */}
            <div style={{
              position: "absolute",
              inset: 0,
              clipPath: HEX_CLIP,
              border: "none",
              background: m.earned
                ? `linear-gradient(135deg, ${c.accentFill}, rgba(255,152,48,0.12))`
                : c.void,
            }} />
            {/* Hex outline via box-shadow trick on an inner div */}
            <div style={{
              position: "absolute",
              inset: 2,
              clipPath: HEX_CLIP,
              background: m.earned ? "rgba(255,152,48,0.03)" : c.void,
              boxShadow: m.earned
                ? `0 0 8px ${c.accent}`
                : "none",
            }} />
            {/* Content */}
            <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {m.imageFile ? (
                <img
                  src={`/medals/${m.imageFile}`}
                  alt={m.name}
                  loading="lazy"
                  style={{
                    width: "75%",
                    height: "75%",
                    objectFit: "contain",
                    pointerEvents: "none",
                    filter: m.earned ? "none" : "grayscale(1)",
                    opacity: m.earned ? 1 : 0.3,
                  }}
                />
              ) : (
                <span style={{
                  fontSize: Math.max(16, hexW * 0.25),
                  fontWeight: 700,
                  color: m.earned ? c.accent : c.textDim,
                  fontFamily: c.fontSys,
                }}>
                  {m.earned ? "★" : "?"}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

/* ── Circular Grid (Default theme) ─────────────────────────────────────── */

function CircleGrid({ items, c, onToggle }: { items: Row[]; c: ThemeColors; onToggle: (id: string, earned: boolean) => void }) {
  return (
    <div style={{
      display: "grid",
      gap: 10,
      gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))",
    }}>
      {items.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => onToggle(m.id, !m.earned)}
          title={`${m.name}\n${m.description}`}
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            border: m.earned
              ? `1px solid ${c.accent}`
              : `1px solid ${c.borderFaint}`,
            background: m.earned ? c.accentFill : c.void,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            cursor: "pointer",
            transition: "all 0.15s",
            opacity: m.earned ? 1 : 0.6,
            boxShadow: m.earned ? `0 0 6px ${c.accentFill}` : "none",
          }}
        >
          {m.imageFile ? (
            <img
              src={`/medals/${m.imageFile}`}
              alt={m.name}
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
                filter: m.earned ? "none" : "grayscale(1)",
                opacity: m.earned ? 1 : 0.4,
              }}
            />
          ) : (
            <span style={{
              fontSize: 18,
              fontWeight: 700,
              color: m.earned ? c.accent : c.textDim,
            }}>
              {m.earned ? "★" : "?"}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function MedalsClient({ rows }: { rows: Row[] }) {
  const { theme } = useTheme();
  const c = getThemeColors(theme);

  const [data, setData] = useState(rows);
  const [syncing, setSyncing] = useState(false);

  const earnedCount = useMemo(() => data.filter((r) => r.earned).length, [data]);
  const pct = data.length ? Math.round((earnedCount / data.length) * 100) : 0;

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch("/api/meow-medals/sync", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } finally {
      setSyncing(false);
    }
  }

  async function handleToggle(id: string, earned: boolean) {
    setData((prev) => prev.map((x) => (x.id === id ? { ...x, earned } : x)));

    const res = await fetch(`/api/meow-medals/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ earned }),
    });

    if (!res.ok) {
      setData((prev) => prev.map((x) => (x.id === id ? { ...x, earned: !earned } : x)));
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* ── Header Panel ──────────────────────────────────────────────────── */}
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
          <span>Meow Medals</span>
          <button
            type="button"
            onClick={handleSync}
            disabled={syncing}
            style={{
              fontSize: 10, fontFamily: c.fontSys, fontWeight: 500,
              letterSpacing: "0.08em", textTransform: "uppercase", padding: "3px 10px",
              border: `1px solid ${c.accentDim}`,
              background: c.accentFill, color: c.accent,
              cursor: syncing ? "wait" : "pointer", opacity: syncing ? 0.5 : 1,
            }}
          >
            {syncing ? "Syncing..." : "Sync"}
          </button>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1,
          background: c.border,
        }}>
          {[
            { label: "Earned", value: `${earnedCount}`, sub: `of ${data.length}` },
            { label: "Completion", value: `${pct}%`, sub: `${data.length} medals total` },
            { label: "Remaining", value: `${data.length - earnedCount}`, sub: "to earn" },
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

        {/* Progress bar */}
        <div style={{ padding: "6px 10px" }}>
          <div style={{ height: 3, background: c.voidPanel, border: `1px solid ${c.borderFaint}`, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: barFill(pct, theme), transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* ── Medal Grid — hexagonal for NERV, circular for default ─────────── */}
      {theme === "nerv" ? (
        <HexGrid items={data} c={c} onToggle={handleToggle} />
      ) : (
        <CircleGrid items={data} c={c} onToggle={handleToggle} />
      )}
    </div>
  );
}
