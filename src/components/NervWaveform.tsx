"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * NervWaveform — Multi-line SVG progress waveform chart.
 * Fetches /api/progress-timeline and renders cumulative progress lines
 * in the NERV color palette (green, cyan, orange, magenta, yellow).
 *
 * Inspired by the "Yield Flow — Waveform Monitor" in the NERV UI reference.
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
      // Start from Jan 1 2026 (site launch) — calculate days dynamically
      const launchDate = new Date("2026-01-01T00:00:00");
      const daysSinceLaunch = Math.floor((Date.now() - launchDate.getTime()) / 86400000);
      const res = await fetch(`/api/progress-timeline?days=${Math.max(daysSinceLaunch, 7)}`);
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
  const PAD_B = 24; // space for date labels
  const chartW = W - PAD_L - PAD_R;
  const chartH = H - PAD_T - PAD_B;

  // Find global max across all series for Y scaling
  const allValues = SERIES_CONFIG.flatMap(
    (s) => data.series[s.key as keyof typeof data.series] ?? []
  );
  const maxVal = Math.max(1, ...allValues);

  const numDays = data.days.length;
  const xStep = numDays > 1 ? chartW / (numDays - 1) : chartW;

  // Build SVG paths for each series (skip flat/degenerate series to avoid sub-pixel artifacts)
  const paths = SERIES_CONFIG.map((cfg) => {
    const values = data.series[cfg.key as keyof typeof data.series] ?? [];
    if (values.length === 0) return { ...cfg, d: "", areaD: "", flat: true };

    const seriesMin = Math.min(...values);
    const seriesMax = Math.max(...values);
    // Skip rendering if series has no variation (flat line) — prevents sub-pixel artifacts
    if (seriesMax === seriesMin) return { ...cfg, d: "", areaD: "", flat: true };

    const points = values.map((v, i) => ({
      x: PAD_L + i * xStep,
      y: PAD_T + chartH - (v / maxVal) * chartH,
    }));

    // Smooth curve using monotone cubic Hermite interpolation
    const d = smoothPath(points);

    // Area fill (path down to bottom, back to start)
    const areaD = `${d} L ${points[points.length - 1].x},${PAD_T + chartH} L ${points[0].x},${PAD_T + chartH} Z`;

    return { ...cfg, d, areaD, flat: false };
  });

  // Date labels (show ~5 evenly spaced)
  const labelCount = Math.min(5, numDays);
  const labelIndices = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / (labelCount - 1)) * (numDays - 1))
  );

  // Time range label
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
          {SERIES_CONFIG.map((cfg) => {
            const values = data.series[cfg.key as keyof typeof data.series] ?? [];
            const latest = values.length > 0 ? values[values.length - 1] : 0;
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
                <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{latest}</span>
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
          {/* Grid lines */}
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

          {/* Area fills (behind lines) — skip flat/degenerate series */}
          {paths.map((p) => {
            if (!p.areaD || p.flat) return null;
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

          {/* Lines — skip flat/degenerate series */}
          {paths.map((p) => {
            if (!p.d || p.flat) return null;
            const isActive = !hoveredSeries || hoveredSeries === p.key;
            return (
              <path
                key={`line-${p.key}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={isActive ? 2 : 1}
                strokeLinecap="butt"
                opacity={isActive ? 1 : 0.15}
                style={{
                  transition: "opacity 0.3s",
                }}
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
 * Unlike Catmull-Rom, this method guarantees no overshooting —
 * the curve stays within the bounding box of consecutive data points.
 */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;

  // Compute slopes (Fritsch–Carlson monotone method)
  const n = points.length;
  const dx: number[] = [];
  const dy: number[] = [];
  const slopes: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    dx.push(points[i + 1].x - points[i].x);
    dy.push(points[i + 1].y - points[i].y);
    slopes.push(dx[i] === 0 ? 0 : dy[i] / dx[i]);
  }

  // Tangents
  const m: number[] = [slopes[0]];
  for (let i = 1; i < n - 1; i++) {
    if (slopes[i - 1] * slopes[i] <= 0) {
      m.push(0); // Flat at local extrema — prevents overshoot
    } else {
      m.push((slopes[i - 1] + slopes[i]) / 2);
    }
  }
  m.push(slopes[n - 2]);

  // Clamp tangents for monotonicity
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

  // Build path
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
