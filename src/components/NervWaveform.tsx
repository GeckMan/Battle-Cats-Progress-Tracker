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
      const res = await fetch("/api/progress-timeline?days=90");
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

  // Build SVG paths for each series
  const paths = SERIES_CONFIG.map((cfg) => {
    const values = data.series[cfg.key as keyof typeof data.series] ?? [];
    if (values.length === 0) return { ...cfg, d: "", areaD: "" };

    const points = values.map((v, i) => ({
      x: PAD_L + i * xStep,
      y: PAD_T + chartH - (v / maxVal) * chartH,
    }));

    // Smooth curve using catmull-rom → cubic bezier
    const d = smoothPath(points);

    // Area fill (path down to bottom, back to start)
    const areaD = `${d} L ${points[points.length - 1].x},${PAD_T + chartH} L ${points[0].x},${PAD_T + chartH} Z`;

    return { ...cfg, d, areaD };
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
        <span>Progress Waveform — 90 Day</span>
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
          style={{ display: "block", overflow: "visible" }}
          preserveAspectRatio="xMidYMid meet"
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

          {/* Area fills (behind lines) */}
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
            return (
              <path
                key={`line-${p.key}`}
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 1 : 0.15}
                style={{
                  transition: "opacity 0.3s, stroke-width 0.3s",
                  filter: isActive ? `drop-shadow(0 0 4px ${p.dimColor})` : "none",
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

/** Build a smooth SVG path from points using monotone cubic interpolation */
function smoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;
  if (points.length === 2) return `M ${points[0].x},${points[0].y} L ${points[1].x},${points[1].y}`;

  let d = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];

    // Catmull-Rom to cubic bezier conversion
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  return d;
}
