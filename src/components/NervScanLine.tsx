"use client";

import { useTheme } from "@/lib/theme-context";

/**
 * NervScanLine — Thin green line that sweeps down the screen.
 * Only renders when NERV theme is active. Pure CSS animation, no JS overhead.
 */
export default function NervScanLine() {
  const { theme } = useTheme();
  if (theme !== "nerv") return null;
  return <div className="nerv-scan-line" />;
}
