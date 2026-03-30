"use client";

import {
  useState,
  useRef,
  useCallback,
  useEffect,
  createContext,
  useContext,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { measure } from "@/lib/pretext";

/**
 * MedalTooltip — a hover tooltip that uses pretext (canvas measureText)
 * to pre-calculate the exact text wrapping before the tooltip renders.
 * This means the tooltip appears at the perfect size instantly, with no
 * reflow flicker or incorrect sizing on the first frame.
 *
 * Uses a portal to render into document.body so the tooltip is never
 * clipped by overflow:hidden or affected by parent transforms/clip-paths.
 *
 * Two-part API:
 *   <MedalTooltipProvider>  — wrap once around the medals grid
 *   <MedalTooltipTrigger>   — wrap each medal button
 */

const TOOLTIP_MAX_W = 240; // px
const TOOLTIP_PAD_X = 14;  // horizontal padding inside tooltip
const TOOLTIP_PAD_Y = 10;  // vertical padding inside tooltip
const NAME_FONT = 'bold 13px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const DESC_FONT = '12px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const NAME_LH = 18;   // line height px
const DESC_LH = 17;   // line height px
const GAP = 4;         // gap between name and description
const SHOW_DELAY = 300; // ms before showing tooltip

/* ── Shared state via context (one tooltip visible at a time) ─────────── */

type TooltipData = {
  name: string;
  description: string;
  earned: boolean;
  x: number;
  y: number;
};

type TooltipCtx = {
  show: (data: TooltipData) => void;
  move: (x: number, y: number) => void;
  hide: () => void;
};

const Ctx = createContext<TooltipCtx | null>(null);

/* ── Provider — renders the single floating tooltip via portal ────────── */

export function MedalTooltipProvider({ children }: { children: ReactNode }) {
  const [tip, setTip] = useState<TooltipData | null>(null);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pendingRef = useRef<TooltipData | null>(null);

  const show = useCallback((data: TooltipData) => {
    clearTimeout(timerRef.current);
    pendingRef.current = data;
    setTip(data);
    timerRef.current = setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY);
  }, []);

  const move = useCallback((x: number, y: number) => {
    setTip((prev) => (prev ? { ...prev, x, y } : null));
  }, []);

  const hide = useCallback(() => {
    clearTimeout(timerRef.current);
    pendingRef.current = null;
    setVisible(false);
    // Clear data after fade-out
    setTimeout(() => {
      if (!pendingRef.current) setTip(null);
    }, 150);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // Pre-calculate tooltip size using pretext
  const dims = tip ? (() => {
    const innerW = TOOLTIP_MAX_W - TOOLTIP_PAD_X * 2;
    const nameLayout = measure(tip.name, NAME_FONT, innerW, NAME_LH);
    const descLayout = tip.description
      ? measure(tip.description, DESC_FONT, innerW, DESC_LH)
      : { height: 0 };
    const h = TOOLTIP_PAD_Y * 2 + nameLayout.height + (tip.description ? GAP + descLayout.height : 0);
    return { w: TOOLTIP_MAX_W, h };
  })() : null;

  // Position: above cursor, horizontally centered
  const style = tip && dims ? (() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const x = Math.max(8, Math.min(tip.x - dims.w / 2, vw - dims.w - 8));
    const y = tip.y - dims.h - 14; // 14px above cursor
    return {
      position: "fixed" as const,
      left: x,
      top: Math.max(4, y),
      width: dims.w,
      zIndex: 9999,
      pointerEvents: "none" as const,
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(4px)",
      transition: "opacity 0.15s ease, transform 0.15s ease",
    };
  })() : undefined;

  const ctx: TooltipCtx = { show, move, hide };

  return (
    <Ctx.Provider value={ctx}>
      {children}

      {/* Portal tooltip into document.body */}
      {tip && typeof document !== "undefined" &&
        createPortal(
          <div style={style}>
            <div
              style={{
                background: "rgba(17, 17, 17, 0.96)",
                border: "1px solid rgba(90, 90, 90, 0.6)",
                borderRadius: 6,
                padding: `${TOOLTIP_PAD_Y}px ${TOOLTIP_PAD_X}px`,
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: tip.earned ? "rgb(251 191 36)" : "rgb(156 163 175)",
                  lineHeight: `${NAME_LH}px`,
                  marginBottom: tip.description ? GAP : 0,
                }}
              >
                {tip.earned ? "★ " : ""}{tip.name}
              </div>
              {tip.description && (
                <div
                  style={{
                    fontSize: 12,
                    color: "rgb(209 213 219)",
                    lineHeight: `${DESC_LH}px`,
                  }}
                >
                  {tip.description}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )}
    </Ctx.Provider>
  );
}

/* ── Hook — returns mouse handlers to spread onto any element ─────────── */

export function useMedalTooltip() {
  const ctx = useContext(Ctx);
  return ctx;
}

/* ── Trigger wrapper (for CircleGrid and simple cases) ────────────────── */

type TriggerProps = {
  name: string;
  description: string;
  earned: boolean;
  children: ReactNode;
};

export function MedalTooltip({ name, description, earned, children }: TriggerProps) {
  const ctx = useContext(Ctx);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent) => {
      ctx?.show({ name, description, earned, x: e.clientX, y: e.clientY });
    },
    [ctx, name, description, earned],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      ctx?.move(e.clientX, e.clientY);
    },
    [ctx],
  );

  const handleMouseLeave = useCallback(() => {
    ctx?.hide();
  }, [ctx]);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ display: "contents" }}
    >
      {children}
    </div>
  );
}
