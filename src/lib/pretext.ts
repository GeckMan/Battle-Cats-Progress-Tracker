/**
 * pretext-lite — Canvas-based text measurement for layout pre-calculation.
 *
 * Inspired by chenglou/pretext. Uses CanvasRenderingContext2D.measureText()
 * to compute multiline text layout (line breaks, total height) without ever
 * touching the DOM. This lets us animate accordion heights, size tooltips,
 * and flow text around moving obstacles — all with zero layout thrash.
 */

/* ── Types ─────────────────────────────────────────────────────────────── */

export type PreparedText = {
  text: string;
  font: string;
  words: string[];
  wordWidths: number[];
  spaceWidth: number;
};

export type LayoutResult = {
  lineCount: number;
  height: number;
  lines: string[];
};

/** Cursor into a PreparedText for incremental line-by-line layout */
export type LayoutCursor = {
  wordIndex: number;
};

/** A single laid-out line with its text, pixel width, and next cursor */
export type LayoutLine = {
  text: string;
  width: number;
  next: LayoutCursor;
};

/** Rectangular exclusion zone that text flows around */
export type Obstacle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/* ── Shared canvas context (singleton) ─────────────────────────────────── */

let _ctx: CanvasRenderingContext2D | null = null;

function getCtx(): CanvasRenderingContext2D {
  if (!_ctx) {
    const canvas = document.createElement("canvas");
    _ctx = canvas.getContext("2d")!;
  }
  return _ctx;
}

/* ── Core API ──────────────────────────────────────────────────────────── */

/**
 * Prepare text for fast repeated layout. Call once, then layout many times.
 */
export function prepare(text: string, font: string): PreparedText {
  const ctx = getCtx();
  ctx.font = font;
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");
  const wordWidths = words.map((w) => ctx.measureText(w).width);
  const spaceWidth = ctx.measureText(" ").width;
  return { text: normalized, font, words, wordWidths, spaceWidth };
}

/**
 * Compute full multiline layout within a fixed width.
 */
export function layout(
  prepared: PreparedText,
  maxWidth: number,
  lineHeight: number,
): LayoutResult {
  const { words, wordWidths, spaceWidth } = prepared;
  if (words.length === 0) return { lineCount: 0, height: 0, lines: [] };

  const lines: string[] = [];
  let currentLine = words[0];
  let currentWidth = wordWidths[0];

  for (let i = 1; i < words.length; i++) {
    const needed = spaceWidth + wordWidths[i];
    if (currentWidth + needed <= maxWidth) {
      currentLine += " " + words[i];
      currentWidth += needed;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
      currentWidth = wordWidths[i];
    }
  }
  lines.push(currentLine);

  return { lineCount: lines.length, height: lines.length * lineHeight, lines };
}

/**
 * Layout a single line starting from `cursor`, with a variable `maxWidth`.
 * Returns the line text, its pixel width, and the cursor for the next line.
 * Returns null when all words are consumed.
 *
 * This is the key API for text-around-obstacles: call it per line, adjusting
 * maxWidth based on where obstacles overlap each line's Y position.
 */
export function layoutNextLine(
  prepared: PreparedText,
  cursor: LayoutCursor,
  maxWidth: number,
): LayoutLine | null {
  const { words, wordWidths, spaceWidth } = prepared;
  if (cursor.wordIndex >= words.length) return null;

  let i = cursor.wordIndex;
  let line = words[i];
  let width = wordWidths[i];
  i++;

  while (i < words.length) {
    const needed = spaceWidth + wordWidths[i];
    if (width + needed > maxWidth) break;
    line += " " + words[i];
    width += needed;
    i++;
  }

  return { text: line, width, next: { wordIndex: i } };
}

/**
 * Convenience: prepare + layout in one call.
 */
export function measure(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
): LayoutResult {
  return layout(prepare(text, font), maxWidth, lineHeight);
}

/**
 * Given a line's Y position, line height, and a list of obstacles,
 * compute the available width segments on that line (left of obstacle,
 * right of obstacle). Returns the widest contiguous segment and its X offset.
 */
export function availableWidth(
  lineY: number,
  lineHeight: number,
  containerWidth: number,
  obstacles: Obstacle[],
): { x: number; width: number }[] {
  // Collect horizontal exclusion ranges for obstacles that overlap this line
  const exclusions: { left: number; right: number }[] = [];
  for (const obs of obstacles) {
    if (lineY + lineHeight > obs.y && lineY < obs.y + obs.height) {
      exclusions.push({ left: obs.x, right: obs.x + obs.width });
    }
  }

  if (exclusions.length === 0) return [{ x: 0, width: containerWidth }];

  // Sort by left edge
  exclusions.sort((a, b) => a.left - b.left);

  // Build available segments
  const segments: { x: number; width: number }[] = [];
  let cursor = 0;

  for (const ex of exclusions) {
    const left = Math.max(0, ex.left);
    if (cursor < left) {
      segments.push({ x: cursor, width: left - cursor });
    }
    cursor = Math.max(cursor, Math.min(containerWidth, ex.right));
  }

  if (cursor < containerWidth) {
    segments.push({ x: cursor, width: containerWidth - cursor });
  }

  return segments.length > 0 ? segments : [{ x: 0, width: 0 }];
}
