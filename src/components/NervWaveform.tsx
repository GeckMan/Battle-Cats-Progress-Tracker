"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * NervWaveform — Multi-line SVG progress waveform chart.
 * Fetches /api/progress-timeline and renders cumulative progress lines
 * scaled as percentages of each category's max total.
 *
 * When two or more series overlap (similar percentage values), lines are
 * rendered with a dashed pattern so both colors remain visible.
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
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
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

  // Chart dimensions
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

  // Build SVG paths — each series scaled as PERCENTAGE of its max total.
  // e.g. 120/125 medals = 96% → plotted at 96% of chart height.
  const paths = SERIES_CONFIG.map((cfg) => {
    const values = data.series[cfg.key as keyof typeof data.series] ?? [];
    const total = data.totals?.[cfg.key as keyof typeof data.totals] ?? 0;
    if (values.length === 0) return { ...cfg, d: "", areaD: "", pctValues: [] as number[] };

    // Convert raw counts to percentages (0–100)
    const pctValues = values.map((v) => total > 0 ? (v / total) * 100 : 0);

    const points = pctValues.map((pct, i) => ({
      x: PAD_L + i * xStep,
      y: PAD_T + chartH - (pct / 100) * chartH,
    }));

    // Smooth curve
    const d = smoothPath(points);

    // Area fill
    const areaD = d
      ? `${d} L ${points[points.length - 1].x},${PAD_T + chartH} L ${points[0].x},${PAD_T + chartH} Z`
      : "";

    return { ...cfg, d, areaD, pctValues };
  });

  // ── Overlap detection ──────────────────────────────────────────────────
  // For the final day, find which series have similar percentage values.
  // If two lines are within 3% of each other, offset their dash patterns
  // so both colors are visible (alternating dashes).
  const lastIdx = numDays - 1;
  const OVERLAP_THRESHOLD = 3; // percentage points

  // Group series by proximity at the final data point
  type OverlapInfo = { dashArray?: string; dashOffset?: number };
  const overlapMap = new Map<string, OverlapInfo>();

  // Get final percentages for all series
  const finalPcts = paths.map((p) => ({
    key: p.key,
    pct: p.pctValues.length > 0 ? p.pctValues[p.pctValues.length - 1] : -999,
  }));

  // Sort by pct to find neighbors
  const sorted = [...finalPcts].sort((a, b) => a.pct - b.pct);
  const visited = new Set<string>();

  for (let i = 0; i < sorted.length; i++) {
    if (visited.has(sorted[i].key)) continue;
    const group: string[] = [sorted[i].key];
    visited.add(sorted[i].key);

    for (let j = i + 1; j < sorted.length; j++) {
      if (visited.has(sorted[j].key)) continue;
      if (Math.abs(sorted[j].pct - sorted[i].pct) <= OVERLAP_THRESHOLD) {
        group.push(sorted[j].key);
        visited.add(sorted[j].key);
      }
    }

    if (group.length > 1) {
      // Assign alternating dash patterns so both colors show
      const dashLen = 8;
      const totalLen = dashLen * group.length;
      for (let g = 0; g < group.length; g++) {
        overlapMap.set(group[g], {
          dashArray: `${dashLen} ${totalLen - dashLen}`,
          dashOffset: -(g * dashLen),
        });
      }
    }
  }

  // Date labels
  const labelCount = Math.min(5, numDays);
  const labelIndices = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (numDays - 1))
  );

  const startDate = data.days[0];
  const endDate = data.days[data.days.length - 1];

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
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontSize: "9px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase" as const,
                  color: isActive ? cfg.color : "var(--steel-dim)",
                  opacity: isActive ? 1 : 0.4,
                  transition: "opacity 0.2s, color 0.2s",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  outline: "none",
                }}
              >
                <span style={{
                  width: "8px",
                  height: "3px",
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
          {/* Grid lines at 0%, 25%, 50%, 75%, 100% */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = PAD_T + chartH - frac * chartH;
            return (
              <line
                key={frac}
                x1={PAD_L}
                y1={y}
                x2={PAD_L + chartW}
                y2={y}
                stroke="rgba(200,200,192,0.06)"
                strokeWidth="1"
              />
            );
          })}

          {/* Area fills */}
          {paths.map((p) => {
            if (!p.areaD) return null;
            const isActive = !hoveredSeries || hoveredSeries === p.key;
            return (
              <path
                key={`area-${p.key}`}
                d={p.areaD}
                fill={p.dimColor}
                opacity={isActive ? 0.6 : 0.05}
                style={{ transition: "opacity 0.3s" }}
              />
            );
          })}

          {/* Lines */}
          {paths.map((p) => {
            if (!p.d) return null;
            const isActive = !hoveredSeries || hoveredSeries === p.key;
            const overlap = overlapMap.get(p.key);
            return (
              <path
                key={`line-${p.key}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={isActive ? 2.5 : 1}
                strokeLinecap="butt"
                opacity={isActive ? 1 : 0.15}
                strokeDasharray={overlap?.dashArray}
                strokeDashoffset={overlap?.dashOffset}
                style={{ transition: "opacity 0.3s" }}
              />
            );
          })}

          {/* Date labels */}
          {labelIndices.map((idx) => {
            const x = PAD_L + idx * xStep;
            const label = formatDateLabel(data.days[idx]);
            return (
              <text
                key={idx}
                x={x}
                y={H - 4}
                fill="rgba(136,136,128,0.5)"
                fontSize="9"
                fontFamily="var(--font-sys)"
                textAnchor="middle"
                letterSpacing="0.06em"
              >
                {label}
              </text>
            );
          })}
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
 * Build a smooth SVG path using monotone cubic Hermite interpolation.
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
    if (slopes[i - 1] * slopes[i] <= 0) {
      m.push(0);
    } else {
      m.push((slopes[i - 1] + slopes[i]) / 2);
    }
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
    const cp1x = points[i].x + seg;
    const cp1y = points[i].y + m[i] * seg;
    const cp2x = points[i + 1].x - seg;
    const cp2y = points[i + 1].y - m[i + 1] * seg;
    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${points[i + 1].x},${points[i + 1].y}`;
  }

  return d;
}
