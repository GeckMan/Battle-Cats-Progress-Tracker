/**
 * Theme-aware color tokens for progress tracking pages.
 *
 * Default theme: warm amber/gray palette (Tailwind-like hex values)
 * NERV theme: CSS custom properties from nerv-theme.css
 */

export type ThemeColors = {
  /** Panel/card backgrounds */
  panelBg: string;
  void: string;
  voidPanel: string;

  /** Primary accent (headers, labels) */
  accent: string;
  accentDim: string;
  accentHot: string;
  accentFill: string;

  /** Data/success color */
  dataOk: string;
  dataOkDim: string;
  dataOkFill: string;

  /** Alert/danger */
  alert: string;
  alertFill: string;

  /** Neutrals */
  text: string;
  textDim: string;
  textFaint: string;
  border: string;
  borderFaint: string;

  /** Font */
  fontSys: string;
};

const DEFAULT_COLORS: ThemeColors = {
  panelBg: "#111827",       // gray-900
  void: "#030712",          // gray-950
  voidPanel: "#0a0f1a",

  accent: "#f59e0b",        // amber-500
  accentDim: "#92400e",     // amber-800
  accentHot: "#fbbf24",     // amber-400
  accentFill: "rgba(245,158,11,0.08)",

  dataOk: "#fbbf24",        // amber-400 (default uses amber for "done")
  dataOkDim: "#d97706",     // amber-600
  dataOkFill: "rgba(251,191,36,0.08)",

  alert: "#ef4444",         // red-500
  alertFill: "rgba(239,68,68,0.08)",

  text: "#f3f4f6",          // gray-100
  textDim: "#9ca3af",       // gray-400
  textFaint: "rgba(156,163,175,0.12)",
  border: "#374151",        // gray-700
  borderFaint: "rgba(55,65,81,0.5)",

  fontSys: "inherit",
};

const NERV_COLORS: ThemeColors = {
  panelBg: "var(--void-warm, #080807)",
  void: "var(--void, #000)",
  voidPanel: "var(--void-panel, #0C0C0A)",

  accent: "var(--nerv-orange, #FF9830)",
  accentDim: "var(--nerv-orange-dim, #C87020)",
  accentHot: "var(--nerv-orange-hot, #FFCC50)",
  accentFill: "rgba(255,152,48,0.06)",

  dataOk: "var(--data-green, #50FF50)",
  dataOkDim: "var(--data-green-dim, #30BB30)",
  dataOkFill: "rgba(80,255,80,0.06)",

  alert: "var(--alert-red, #FF3030)",
  alertFill: "rgba(255,48,48,0.08)",

  text: "var(--steel, #D8D8D0)",
  textDim: "var(--steel-dim, #888880)",
  textFaint: "var(--steel-faint, rgba(200,200,192,0.12))",
  border: "var(--steel-faint, rgba(200,200,192,0.12))",
  borderFaint: "rgba(200,200,192,0.06)",

  fontSys: "var(--font-sys, monospace)",
};

export function getThemeColors(theme: "default" | "nerv"): ThemeColors {
  return theme === "nerv" ? NERV_COLORS : DEFAULT_COLORS;
}

/** Progress percentage → color */
export function pctColor(pct: number, c: ThemeColors): string {
  if (pct >= 100) return c.dataOk;
  if (pct >= 75) return c.accentHot;
  if (pct >= 25) return c.accent;
  if (pct > 0) return c.accentDim;
  return c.textDim;
}

/** Progress percentage → bar fill hex (must be a concrete color for inline style) */
export function barFill(pct: number, theme: "default" | "nerv"): string {
  if (theme === "nerv") {
    if (pct >= 100) return "#50FF50";
    if (pct >= 75) return "#FFCC50";
    if (pct >= 25) return "#FF9830";
    if (pct > 0) return "#C87020";
    return "#333";
  }
  // Default theme
  if (pct >= 100) return "#fbbf24";
  if (pct >= 75) return "#f59e0b";
  if (pct >= 25) return "#d97706";
  if (pct > 0) return "#92400e";
  return "#374151";
}
