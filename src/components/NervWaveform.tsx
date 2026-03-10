"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * NervWaveform — Multi-line SVG progress waveform chart.
 *
 * Each series is scaled as a percentage of its category's max total
 * (e.g. 120/125 medals = 96% = near the top).
 *
 * When two or more series converge (within 3%), the individual solid
 * lines transition into a single candy-cane stripe path that blends
 * the colors of all overlapping series with diagonal stripes.
 */

type TimelineData = {
  days: string[];
  series: {
    units: number[];
    medals: number[];
    milestones: number[];
    story: number[];
    legend: number[];
  };
  totals: {
    units: number;
    medals: number;
    milestones: number;
    story: number;
    legend: number;
  };
};

const SERIES_CONFIG = [
  { key: "units",      label: "UNITS",      color: "#50FF50", dimColor: "rgba(80,255,80,0.15)" },
  { key: "medals",     label: "MEDALS",     color: "#20F0FF", dimColor: "rgba(32,240,255,0.12)" },
  { key: "milestones", label: "MILESTONES", color: "#FF9830", dimColor: "rgba(255,152,48,0.12)" },
  { key: "story",      label: "STORY",      color: "#FFE820", dimColor: "rgba(255,232,32,0.12)" },
  { key: "legend",     label: "LEGEND",     color: "#F030C0", dimColor: "rgba(240,48,192,0.12)" },
] as const;

export default function NervWaveform() {
  const [data, setData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredSeries, setHoveredSeries] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/progress-timeline?days=30`);
      if (res.ok) setData(await res.json());
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) {
    return (
      <div className="nerv-panel">
        <div className="nerv-panel-header">
          <span>Progress Waveform</span>
          <span className="tag">Loading...</span>
        </div>
        <div className="nerv-panel-body" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--steel-dim)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Scanning data...
          </span>
        </div>
      </div>
    );
  }

  if (!data || data.days.length === 0) {
    return (
      <div className="nerv-panel">
        <div className="nerv-panel-header">
          <span>Progress Waveform</span>
          <span className="tag">No Data</span>
        </div>
        <div className="nerv-panel-body" style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "var(--steel-dim)", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.1em" }}>
            No activity recorded yet — start tracking to see your waveform
          </span>
        </div>
      </div>
    );
  }

  // ── Chart dimensions ───────────────────────────────────────────────────
  const W = 900;
  const H = 200;
  const PAD_L = 0;
  const PAD_R = 0;
  const PAD_T = 10;
  const PAD_B = 24;
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;
  const numDays = data.days.length;
  const xStep = numDays > 1 ? chartW / (numDays - 1) : chartW;

  // ── Build paths — percentage-scaled ────────────────────────────────────
  const paths = SERIES_CONFIG.map((cfg) => {
    const values = data.series[cfg.key as keyof typeof data.series] ?? [];
    const total = data.totals?.[cfg.key as keyof typeof data.totals] ?? 0;
    if (values.length === 0) return { ...cfg, d: "", areaD: "", pctValues: [] as number[] };

    const pctValues = values.map((v) => total > 0 ? (v / total) * 100 : 0);
    const points = pctValues.map((pct, i) => ({
      x: PAD_L + i * xStep,
      y: PAD_T + chartH - (pct / 100) * chartH,
    }));

    const d = smoothPath(points);
    const areaD = d
      ? `${d} L ${points[points.length - 1].x},${PAD_T + chartH} L ${points[0].x},${PAD_T + chartH} Z`
      : "";

    return { ...cfg, d, areaD, pctValues };
  });

  // ── Overlap detection ──────────────────────────────────────────────────
  // Find groups of series within OVERLAP_THRESHOLD of each other at the
  // final day, then scan backwards to find where they converged.
  const OVERLAP_THRESHOLD = 3;
  const finalDay = numDays - 1;

  const sortedFinal = paths
    .map((p) => ({ key: p.key, color: p.color, pct: p.pctValues[finalDay] ?? -999 }))
    .filter((p) => p.pct > -900)
    .sort((a, b) => a.pct - b.pct);

  type OGroup = {
    keys: string[];
    colors: string[];
    convergeIdx: number;
    d: string;
    patternId: string;
  };

  const oGroups: OGroup[] = [];
  const inGroupSet = new Set<string>();

  // Group consecutive (sorted by pct) series within threshold
  let curKeys = [sortedFinal[0].key];
  let curColors = [sortedFinal[0].color];

  for (let i = 1; i < sortedFinal.length; i++) {
    if (sortedFinal[i].pct - sortedFinal[i - 1].pct <= OVERLAP_THRESHOLD) {
      curKeys.push(sortedFinal[i].key);
      curColors.push(sortedFinal[i].color);
    } else {
      if (curKeys.length > 1) {
        oGroups.push({ keys: curKeys, colors: curColors, convergeIdx: 0, d: "", patternId: "" });
        curKeys.forEach((k) => inGroupSet.add(k));
      }
      curKeys = [sortedFinal[i].key];
      curColors = [sortedFinal[i].color];
    }
  }
  if (curKeys.length > 1) {
    oGroups.push({ keys: curKeys, colors: curColors, convergeIdx: 0, d: "", patternId: "" });
    curKeys.forEach((k) => inGroupSet.add(k));
  }

  // For each group, scan backwards to find the convergence point
  for (const g of oGroups) {
    const gPaths = g.keys.map((k) => paths.find((p) => p.key === k)!);
    g.convergeIdx = 0; // default: overlapping for entire range
    for (let di = numDays - 1; di >= 0; di--) {
      const pcts = gPaths.map((p) => p.pctValues[di]);
      if (Math.max(...pcts) - Math.min(...pcts) > OVERLAP_THRESHOLD) {
        g.convergeIdx = di + 1;
        break;
      }
    }

    // Build candy-cane path using averaged pctValues.
    // Start 1 point before convergence for smooth visual transition.
    const startIdx = Math.max(0, g.convergeIdx - 1);
    const avgPoints: { x: number; y: number }[] = [];
    for (let di = startIdx; di < numDays; di++) {
      const avgPct = gPaths.reduce((s, p) => s + p.pctValues[di], 0) / gPaths.length;
      avgPoints.push({
        x: PAD_L + di * xStep,
        y: PAD_T + chartH - (avgPct / 100) * chartH,
      });
    }
    g.d = smoothPath(avgPoints);
    g.patternId = `candy-${g.colors.map((c) => c.slice(1)).join("-")}`;
  }

  // ── Date labels ────────────────────────────────────────────────────────
  const labelCount = Math.min(5, numDays);
  const labelIndices = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (numDays - 1))
  );
  const startDate = data.days[0];
  const endDate = data.days[data.days.length - 1];

  // Stripe width for candy-cane patterns
  const STRIPE_W = 4;

  return (
    <div className="nerv-panel">
      <div className="nerv-panel-header">
        <span>Progress Waveform</span>
        <span className="tag">{startDate} → {endDate}</span>
      </div>
      <div className="nerv-panel-body" style={{ padding: "8px 12px 4px" }}>
        {/* Legend */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "6px", flexWrap: "wrap" }}>
          {paths.map((cfg) => {
            const values = data.series[cfg.key as keyof typeof data.series] ?? [];
            const total = data.totals?.[cfg.key as keyof typeof data.totals] ?? 0;
            const latest = values.length > 0 ? values[values.length - 1] : 0;
            const pct = total > 0 ? Math.round((latest / total) * 100) : 0;
            const isActive = !hoveredSeries || hoveredSeries === cfg.key;
            return (
              <button
                key={cfg.key}
                onMouseEnter={() => setHoveredSeries(cfg.key)}
                onMouseLeave={() => setHoveredSeries(null)}
                style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  fontSize: "9px", letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: isActive ? cfg.color : "var(--steel-dim)",
                  opacity: isActive ? 1 : 0.4,
                  transition: "opacity 0.2s, color 0.2s",
                  background: "none", border: "none",
                  cursor: "pointer", padding: 0, outline: "none",
                }}
              >
                <span style={{
                  width: "8px", height: "3px",
                  background: cfg.color,
                  opacity: isActive ? 1 : 0.3,
                  display: "inline-block",
                }} />
                {cfg.label}
                <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {latest}/{total} ({pct}%)
                </span>
              </button>
            );
          })}
        </div>

        {/* SVG Chart */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="auto"
          style={{ display: "block", overflow: "hidden" }}
          preserveAspectRatio="xMidYMid meet"
          shapeRendering="geometricPrecision"
        >
          <defs>
            {/* Diagonal candy-cane stripe patterns */}
            {oGroups.map((g) => {
              const tw = g.colors.length * STRIPE_W;
              return (
                <pattern
                  key={g.patternId}
                  id={g.patternId}
                  patternUnits="userSpaceOnUse"
                  width={tw}
                  height={tw}
                  patternTransform="rotate(45)"
                >
                  {g.colors.map((c, i) => (
                    <rect key={i} x={i * STRIPE_W} y={0} width={STRIPE_W} height={tw} fill={c} />
                  ))}
                </pattern>
              );
            })}

            {/* Clip paths: solo region = before convergence */}
            {oGroups.map((g, gi) => {
              const cx = PAD_L + g.convergeIdx * xStep;
              return (
                <clipPath key={`solo-${gi}`} id={`solo-clip-${gi}`}>
                  <rect x={0} y={0} width={cx} height={H} />
                </clipPath>
              );
            })}
          </defs>

          {/* Grid lines at 0%, 25%, 50%, 75%, 100% */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD_T + chartH - frac * chartH;
            return (
              <line key={frac} x1={PAD_L} y1={y} x2={PAD_L + chartW} y2={y}
                stroke="rgba(200,200,192,0.06)" strokeWidth="1" />
            );
          })}

          {/* Area fills (always individual per series) */}
          {paths.map((p) => {
            if (!p.areaD) return null;
            const isActive = !hoveredSeries || hoveredSeries === p.key;
            return (
              <path key={`area-${p.key}`} d={p.areaD} fill={p.dimColor}
                opacity={isActive ? 0.6 : 0.05}
                style={{ transition: "opacity 0.3s" }} />
            );
          })}

          {/* Solid lines — non-overlapping series (full path, no clip) */}
          {paths.map((p) => {
            if (!p.d || inGroupSet.has(p.key)) return null;
            const isActive = !hoveredSeries || hoveredSeries === p.key;
            return (
              <path key={`line-${p.key}`} d={p.d} fill="none"
                stroke={p.color} strokeWidth={isActive ? 2.5 : 1}
                strokeLinecap="butt" opacity={isActive ? 1 : 0.15}
                style={{ transition: "opacity 0.3s" }} />
            );
          })}

          {/* Solid lines — overlapping series, clipped to pre-convergence */}
          {oGroups.map((g, gi) =>
            g.convergeIdx > 0
              ? g.keys.map((key) => {
                  const p = paths.find((pp) => pp.key === key)!;
                  if (!p.d) return null;
                  const isActive = !hoveredSeries || hoveredSeries === key;
                  return (
                    <path key={`solo-${key}`} d={p.d} fill="none"
                      stroke={p.color} strokeWidth={isActive ? 2.5 : 1}
                      strokeLinecap="butt" opacity={isActive ? 1 : 0.15}
                      clipPath={`url(#solo-clip-${gi})`}
                      style={{ transition: "opacity 0.3s" }} />
                  );
                })
              : null
          )}

          {/* Candy-cane lines for overlap groups */}
          {oGroups.map((g, gi) => {
            const isActive = !hoveredSeries || g.keys.includes(hoveredSeries);
            return (
              <path key={`candy-${gi}`} d={g.d} fill="none"
                stroke={`url(#${g.patternId})`}
                strokeWidth={isActive ? 3 : 1.5}
                strokeLinecap="butt" opacity={isActive ? 1 : 0.15}
                style={{ transition: "opacity 0.3s" }} />
            );
          })}

          {/* Date labels */}
          {labelIndices.map((idx) => (
            <text key={idx} x={PAD_L + idx * xStep} y={H - 4}
              fill="rgba(136,136,128,0.5)" fontSize="9"
              fontFamily="var(--font-sys)" textAnchor="middle"
              letterSpacing="0.06em">
              {formatDateLabel(data.days[idx])}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatDateLabel(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/**
 * Monotone cubic Hermite interpolation (Fritsch–Carlson).
 * No overshooting — the curve stays within consecutive data point bounds.
 */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;

  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    dy.push(points[i + 1].y - points[i].y);
    slopes.push(dx[i] === 0 ? 0 : dy[i] / dx[i]);
  }

  const m: number[] = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    m.push(slopes[i - 1] * slopes[i] <= 0 ? 0 : (slopes[i - 1] + slopes[i]) / 2);
  }
  m.push(slopes[n - 2]);

  for (let i = 0; i < n - 1; i++) {
    if (Math.abs(slopes[i]) < 1e-6) {
      m[i] = 0;
      m[i + 1] = 0;
    } else {
      const a = m[i] / slopes[i];
      const b = m[i + 1] / slopes[i];
      const s = a * a + b * b;
      if (s > 9) {
        const t = 3 / Math.sqrt(s);
        m[i] = t * a * slopes[i];
        m[i + 1] = t * b * slopes[i];
      }
    }
  }

  let d = `M ${points[0].x},${points[0].y}`;
  for (let i = 0; i < n - 1; i++) {
    const seg = dx[i] / 3;
    d += ` C ${points[i].x + seg},${points[i].y + m[i] * seg} ${points[i + 1].x - seg},${points[i + 1].y - m[i + 1] * seg} ${points[i + 1].x},${points[i + 1].y}`;
  }

  return d;
}
