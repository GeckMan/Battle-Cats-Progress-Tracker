/**
 * pretext-lite — Canvas-based text measurement for layout pre-calculation.
 *
 * Inspired by chenglou/pretext. Uses CanvasRenderingContext2D.measureText()
 * to compute multiline text layout (line breaks, total height) without ever
 * touching the DOM. This lets us animate accordion heights and size tooltips
 * with zero layout thrash.
 *
 * Core idea: prepare text + font once → layout against any width instantly.
 */

/* ── Types ─────────────────────────────────────────────────────────────── */

export type PreparedText = {
  text: string;
  font: string;
  words: string[];          // split on whitespace
  wordWidths: number[];     // pixel width of each word
  spaceWidth: number;       // width of a single space in this font
};

export type LayoutResult = {
  lineCount: number;
  height: number;
  lines: string[];          // the actual text per line
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

/* ── API ────────────────────────────────────────────────────────────────── */

/**
 * Prepare text for fast repeated layout. Splits into words and measures each
 * word width using the given CSS font string (e.g. "14px Inter, sans-serif").
 * Call once, then call `layout()` as many times as you want with different widths.
 */
export function prepare(text: string, font: string): PreparedText {
  const ctx = getCtx();
  ctx.font = font;

  // Normalize whitespace: collapse runs, trim
  const normalized = text.replace(/\s+/g, " ").trim();
  const words = normalized.split(" ");
  const wordWidths = words.map((w) => ctx.measureText(w).width);
  const spaceWidth = ctx.measureText(" ").width;

  return { text: normalized, font, words, wordWidths, spaceWidth };
}

/**
 * Compute the multiline layout of prepared text within a given pixel width.
 * Returns exact line count, pixel height, and the text content of each line.
 *
 * @param prepared  - output of `prepare()`
 * @param maxWidth  - container width in px
 * @param lineHeight - line height in px (e.g. fontSize * 1.5)
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

  return {
    lineCount: lines.length,
    height: lines.length * lineHeight,
    lines,
  };
}

/**
 * Convenience: prepare + layout in one call. Use when you only need
 * to measure once (e.g. tooltip sizing).
 */
export function measure(
  text: string,
  font: string,
  maxWidth: number,
  lineHeight: number,
): LayoutResult {
  return layout(prepare(text, font), maxWidth, lineHeight);
}
