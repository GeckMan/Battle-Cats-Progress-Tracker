"use client";

import { useState, useRef, useEffect, useCallback, type ReactNode } from "react";
import { prepare, layout, type PreparedText } from "@/lib/pretext";

/**
 * PretextAccordion — smooth expand/collapse with canvas-based height
 * pre-calculation. Instead of measuring a hidden DOM node (which causes
 * reflow), we use pretext to compute the exact pixel height of the text
 * content before the CSS transition starts, so the animation is perfectly
 * smooth from 0 → exact height.
 *
 * For non-text children (like evolution item badges), we add a static
 * `extraHeight` that accounts for the fixed-size elements.
 */

type Props = {
  /** Section header label */
  title: string;
  /** Whether section starts expanded */
  defaultOpen?: boolean;
  /** Accent color for the header chevron/border */
  accentColor?: string;
  /** Children to render inside the collapsible body */
  children: ReactNode;
  /**
   * Optional: text content to pre-measure for smooth animation height.
   * If provided, pretext calculates the exact pixel height before expanding.
   * If omitted, falls back to scrollHeight measurement (still smooth, just
   * one extra layout pass on first expand).
   */
  textContent?: string;
  /** CSS font string for pretext measurement, e.g. "14px Inter, sans-serif" */
  font?: string;
  /** Line height in px for pretext measurement */
  lineHeight?: number;
  /** Extra height in px to add beyond measured text (for badges, padding, etc.) */
  extraHeight?: number;
};

export function PretextAccordion({
  title,
  defaultOpen = false,
  accentColor = "rgb(251 191 36)", // amber-400
  children,
  textContent,
  font = '14px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
  lineHeight = 21,
  extraHeight = 0,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [height, setHeight] = useState<number | undefined>(defaultOpen ? undefined : 0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const preparedRef = useRef<PreparedText | null>(null);

  // Prepare text measurement once (or when textContent changes)
  useEffect(() => {
    if (textContent) {
      preparedRef.current = prepare(textContent, font);
    }
  }, [textContent, font]);

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const willOpen = !prev;

      if (willOpen) {
        // Calculate target height BEFORE triggering render
        let targetHeight: number;

        if (preparedRef.current && bodyRef.current) {
          // Use pretext to calculate text height without DOM measurement
          const containerWidth = bodyRef.current.parentElement?.clientWidth ?? 340;
          const padding = 24; // px (p-3 = 12px each side)
          const result = layout(preparedRef.current, containerWidth - padding, lineHeight);
          targetHeight = result.height + extraHeight;
        } else if (bodyRef.current) {
          // Fallback: quick DOM measurement
          targetHeight = bodyRef.current.scrollHeight;
        } else {
          targetHeight = 200; // safe fallback
        }

        // Set height to 0 first (might already be), then to target on next frame
        setHeight(0);
        requestAnimationFrame(() => {
          setHeight(targetHeight);
        });
      } else {
        // Collapse: capture current height, then set to 0
        if (bodyRef.current) {
          setHeight(bodyRef.current.scrollHeight);
          requestAnimationFrame(() => {
            setHeight(0);
          });
        } else {
          setHeight(0);
        }
      }

      return willOpen;
    });
  }, [lineHeight, extraHeight]);

  // After expand animation finishes, switch to auto height so content can reflow
  const handleTransitionEnd = useCallback(() => {
    if (open) {
      setHeight(undefined); // auto height
    }
  }, [open]);

  return (
    <div className="space-y-0">
      {/* Header — clickable toggle */}
      <button
        type="button"
        onClick={toggle}
        className="w-full flex items-center justify-between group"
        style={{ padding: "2px 0" }}
      >
        <span
          className="text-xs uppercase tracking-wide"
          style={{ color: "rgb(107 114 128)" }} // gray-500
        >
          {title}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          stroke={accentColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: "transform 0.25s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <polyline points="2,4 6,8 10,4" />
        </svg>
      </button>

      {/* Collapsible body */}
      <div
        ref={bodyRef}
        onTransitionEnd={handleTransitionEnd}
        style={{
          height: height === undefined ? "auto" : height,
          overflow: "hidden",
          transition: "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: open ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}
