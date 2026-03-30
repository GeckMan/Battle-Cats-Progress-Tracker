"use client";

import { useState, useRef, useCallback, useEffect, type ReactNode } from "react";
import { measure } from "@/lib/pretext";

/**
 * MedalTooltip — a hover tooltip that uses pretext (canvas measureText)
 * to pre-calculate the exact text wrapping before the tooltip renders.
 * This means the tooltip appears at the perfect size instantly, with no
 * reflow flicker or incorrect sizing on the first frame.
 *
 * The tooltip shows medal name (bold) + description (regular) in a
 * compact floating card that follows the cursor horizontally.
 */

const TOOLTIP_MAX_W = 220; // px
const TOOLTIP_PAD_X = 16;  // horizontal padding inside tooltip
const TOOLTIP_PAD_Y = 10;  // vertical padding inside tooltip
const NAME_FONT = 'bold 13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const DESC_FONT = '12px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const NAME_LH = 18;   // line height px
const DESC_LH = 17;   // line height px
const GAP = 4;         // gap between name and description

type Props = {
  name: string;
  description: string;
  earned: boolean;
  children: ReactNode;
};

export function MedalTooltip({ name, description, earned, children }: Props) {
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Pre-calculate tooltip dimensions using pretext
  const calculateDims = useCallback(() => {
    const innerW = TOOLTIP_MAX_W - TOOLTIP_PAD_X * 2;
    const nameLayout = measure(name, NAME_FONT, innerW, NAME_LH);
    const descLayout = description
      ? measure(description, DESC_FONT, innerW, DESC_LH)
      : { height: 0, lineCount: 0, lines: [] };

    const totalH = TOOLTIP_PAD_Y * 2 + nameLayout.height + (description ? GAP + descLayout.height : 0);
    setDims({ w: TOOLTIP_MAX_W, h: totalH });
  }, [name, description]);

  const handleMouseEnter = useCallback((e: React.MouseEvent) => {
    clearTimeout(timeoutRef.current);
    calculateDims();
    setPos({ x: e.clientX, y: e.clientY });
    // Small delay so tooltip doesn't flash on quick mouse-overs
    timeoutRef.current = setTimeout(() => setVisible(true), 200);
  }, [calculateDims]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setVisible(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // Position tooltip above cursor, centered horizontally
  const tooltipStyle = dims && visible ? (() => {
    const x = Math.max(8, Math.min(pos.x - dims.w / 2, (typeof window !== "undefined" ? window.innerWidth : 1200) - dims.w - 8));
    const y = pos.y - dims.h - 12; // 12px above cursor
    return {
      position: "fixed" as const,
      left: x,
      top: Math.max(4, y),
      width: dims.w,
      zIndex: 100,
      pointerEvents: "none" as const,
      opacity: 1,
      transform: "translateY(0)",
      transition: "opacity 0.15s ease, transform 0.15s ease",
    };
  })() : undefined;

  return (
    <div
      ref={wrapRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "contents" }}
    >
      {children}

      {visible && dims && (
        <div style={tooltipStyle}>
          <div
            style={{
              background: "rgba(17, 17, 17, 0.95)",
              border: "1px solid rgba(75, 75, 75, 0.6)",
              borderRadius: 6,
              padding: `${TOOLTIP_PAD_Y}px ${TOOLTIP_PAD_X}px`,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.5)",
            }}
          >
            {/* Medal name */}
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: earned ? "rgb(251 191 36)" : "rgb(156 163 175)", // amber-400 or gray-400
              lineHeight: `${NAME_LH}px`,
              marginBottom: description ? GAP : 0,
            }}>
              {earned ? "★ " : ""}{name}
            </div>

            {/* Description */}
            {description && (
              <div style={{
                fontSize: 12,
                color: "rgb(209 213 219)", // gray-300
                lineHeight: `${DESC_LH}px`,
              }}>
                {description}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
