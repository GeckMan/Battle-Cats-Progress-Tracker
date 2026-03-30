"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * BattleCatPlayground — Transparent canvas overlay that sits on top of
 * the About page. When mounted, it scans all text nodes in the parent
 * container, measures each character's position, hides the DOM text,
 * and re-renders every character on canvas as a physics body.
 *
 * The cat is draggable/throwable with gravity. Characters inside the
 * cat's elliptical hitbox get pushed outward and spring back.
 *
 * On unmount, DOM text is restored.
 */

/* ── Config ────────────────────────────────────────────────────────────── */

const PUSH_FORCE = 9;
const SPRING = 0.02;
const DAMPING = 0.91;
const GRAVITY = 0.5;
const BOUNCE = 0.5;
const THROW_SCALE = 1.4;
const CAT_SIZE = 130;
const CAT_RX = 56;
const CAT_RY = 48;
const MAX_LETTERS = 5000;

/* ── Types ─────────────────────────────────────────────────────────────── */

type State = {
  count: number;
  homeX: Float32Array; homeY: Float32Array;
  x: Float32Array; y: Float32Array;
  vx: Float32Array; vy: Float32Array;
  angle: Float32Array; angVel: Float32Array;
  charW: Float32Array; alpha: Float32Array;
  fSize: Float32Array;
  chars: string[]; fonts: string[]; colors: string[];
  catX: number; catY: number; catVx: number; catVy: number; catRot: number;
  dragging: boolean; dragOX: number; dragOY: number;
  dragLX: number; dragLY: number; dragVX: number; dragVY: number;
  catImg: HTMLImageElement | null;
  animId: number; lastTime: number;
  hiddenEls: { el: HTMLElement; orig: string }[];
};

export default function BattleCatPlayground({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<State | null>(null);

  const getState = useCallback((): State => {
    if (!stateRef.current) {
      stateRef.current = {
        count: 0,
        homeX: new Float32Array(MAX_LETTERS), homeY: new Float32Array(MAX_LETTERS),
        x: new Float32Array(MAX_LETTERS), y: new Float32Array(MAX_LETTERS),
        vx: new Float32Array(MAX_LETTERS), vy: new Float32Array(MAX_LETTERS),
        angle: new Float32Array(MAX_LETTERS), angVel: new Float32Array(MAX_LETTERS),
        charW: new Float32Array(MAX_LETTERS), alpha: new Float32Array(MAX_LETTERS),
        fSize: new Float32Array(MAX_LETTERS),
        chars: [], fonts: [], colors: [],
        catX: 200, catY: 100, catVx: 3, catVy: 0, catRot: 0,
        dragging: false, dragOX: 0, dragOY: 0,
        dragLX: 0, dragLY: 0, dragVX: 0, dragVY: 0,
        catImg: null, animId: 0, lastTime: 0, hiddenEls: [],
      };
    }
    return stateRef.current;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = getState();

    // Load cat image
    const img = new Image();
    img.src = "/battlecat.png";
    img.onload = () => { s.catImg = img; };

    // Scan DOM text and build character arrays
    function scanText() {
      if (!container || !canvas || !ctx) return;
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Restore any previously hidden elements
      for (const h of s.hiddenEls) h.el.style.color = h.orig;
      s.hiddenEls = [];
      s.count = 0;
      s.chars.length = 0;
      s.fonts.length = 0;
      s.colors.length = 0;

      // Walk all text-containing elements
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const textNodes: { node: Text; parent: HTMLElement }[] = [];
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        const parent = node.parentElement;
        if (!parent || !node.textContent?.trim()) continue;
        // Skip the canvas itself and the close/unleash buttons
        if (parent.closest("canvas") || parent.closest("[data-playground-ui]")) continue;
        textNodes.push({ node, parent });
      }

      // For each text node, measure character positions using Range
      const containerRect = container.getBoundingClientRect();

      for (const { node, parent } of textNodes) {
        const text = node.textContent || "";
        const computed = getComputedStyle(parent);
        const font = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;
        const color = computed.color;
        const opacity = parseFloat(computed.opacity) || 1;

        // Track parent to hide later
        if (!s.hiddenEls.some((h) => h.el === parent)) {
          s.hiddenEls.push({ el: parent, orig: parent.style.color });
        }

        const range = document.createRange();
        for (let i = 0; i < text.length; i++) {
          if (s.count >= MAX_LETTERS) break;
          if (text[i] === "\n") continue;

          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const charRect = range.getBoundingClientRect();

          if (charRect.width < 0.5 && text[i] === " ") continue; // Skip collapsed spaces

          const idx = s.count++;
          const cx = charRect.left - containerRect.left + charRect.width / 2;
          const cy = charRect.top - containerRect.top + charRect.height / 2;

          s.homeX[idx] = cx; s.homeY[idx] = cy;
          s.x[idx] = cx; s.y[idx] = cy;
          s.vx[idx] = 0; s.vy[idx] = 0;
          s.angle[idx] = 0; s.angVel[idx] = 0;
          s.charW[idx] = charRect.width;
          s.alpha[idx] = opacity;
          s.fSize[idx] = parseFloat(computed.fontSize);
          s.chars[idx] = text[i];
          s.fonts[idx] = font;
          s.colors[idx] = color;
        }
      }

      // Hide the DOM text (make transparent) so canvas chars show instead
      for (const h of s.hiddenEls) {
        h.el.style.color = "transparent";
      }
    }

    scanText();
    s.lastTime = performance.now();

    const resizeObs = new ResizeObserver(() => scanText());
    resizeObs.observe(container);

    // Main loop
    function frame(now: number) {
      if (!canvas || !ctx || !container) return;
      const dt = Math.min((now - s.lastTime) / 1000, 0.05);
      s.lastTime = now;

      const W = parseFloat(canvas.style.width);
      const H = parseFloat(canvas.style.height);

      // Cat physics
      if (!s.dragging) {
        s.catVy += GRAVITY;
        s.catVx *= 0.995;
        s.catVy *= 0.995;
        s.catX += s.catVx;
        s.catY += s.catVy;
        s.catRot += s.catVx * 0.012;

        if (s.catY + CAT_SIZE / 2 > H) { s.catY = H - CAT_SIZE / 2; s.catVy *= -BOUNCE; s.catVx *= 0.9; if (Math.abs(s.catVy) < 1) s.catVy = 0; }
        if (s.catY - CAT_SIZE / 2 < 0) { s.catY = CAT_SIZE / 2; s.catVy *= -BOUNCE; }
        if (s.catX - CAT_SIZE / 2 < 0) { s.catX = CAT_SIZE / 2; s.catVx *= -BOUNCE; }
        if (s.catX + CAT_SIZE / 2 > W) { s.catX = W - CAT_SIZE / 2; s.catVx *= -BOUNCE; }
      } else {
        s.catRot *= 0.92;
      }

      const cx = s.catX, cy = s.catY;

      // Per-character physics
      for (let i = 0; i < s.count; i++) {
        let vx = s.vx[i], vy = s.vy[i];
        const px = s.x[i], py = s.y[i];

        // Elliptical collision
        const dx = px - cx, dy = py - cy;
        const nx = dx / CAT_RX, ny = dy / CAT_RY;
        const eDist = nx * nx + ny * ny;

        if (eDist < 1.0 && eDist > 0.001) {
          const d = Math.sqrt(eDist);
          const f = PUSH_FORCE * (1 - d) * (1 + Math.abs(s.catVx) * 0.04 + Math.abs(s.catVy) * 0.04);
          const gnx = dx / (CAT_RX * CAT_RX);
          const gny = dy / (CAT_RY * CAT_RY);
          const glen = Math.sqrt(gnx * gnx + gny * gny) || 1;
          vx += (gnx / glen) * f + s.catVx * 0.25;
          vy += (gny / glen) * f + s.catVy * 0.25;
          s.angVel[i] += ((gnx / glen) * 0.2 - (gny / glen) * 0.1) * f * 0.06;
        }

        // Spring home
        const hdx = s.homeX[i] - px, hdy = s.homeY[i] - py;
        const hd = Math.sqrt(hdx * hdx + hdy * hdy);
        if (hd > 0.3) {
          const sf = SPRING * (1 + hd * 0.0004);
          vx += hdx * sf;
          vy += hdy * sf;
          s.angVel[i] -= s.angle[i] * 0.05;
        } else {
          s.angle[i] *= 0.85;
        }

        s.vx[i] = vx * DAMPING;
        s.vy[i] = vy * DAMPING;
        s.angVel[i] *= 0.88;
        s.x[i] = px + s.vx[i];
        s.y[i] = py + s.vy[i];
        s.angle[i] += s.angVel[i];
      }

      // Render
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Characters
      let prevFont = "";
      for (let i = 0; i < s.count; i++) {
        if (s.chars[i] === " ") continue;
        const font = s.fonts[i];
        if (font !== prevFont) { ctx.font = font; prevFont = font; }
        ctx.save();
        ctx.translate(s.x[i], s.y[i]);
        if (Math.abs(s.angle[i]) > 0.001) ctx.rotate(s.angle[i]);
        ctx.globalAlpha = s.alpha[i];
        ctx.fillStyle = s.colors[i];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.chars[i], 0, 0);
        ctx.restore();
      }

      // Cat
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s.catRot);
      if (s.catImg) {
        ctx.drawImage(s.catImg, -CAT_SIZE / 2, -CAT_SIZE / 2, CAT_SIZE, CAT_SIZE);
      } else {
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(0, 0, CAT_RX, CAT_RY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();

      // Shadow
      if (s.catY + CAT_SIZE / 2 < H - 5) {
        const ss = Math.max(0.3, 1 - (H - s.catY - CAT_SIZE / 2) / H);
        ctx.fillStyle = `rgba(0,0,0,${0.1 * ss})`;
        ctx.beginPath();
        ctx.ellipse(cx, H - 3, CAT_RX * ss * 0.7, 3 * ss, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      s.animId = requestAnimationFrame(frame);
    }

    s.animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.animId);
      resizeObs.disconnect();
      // Restore DOM text
      for (const h of s.hiddenEls) h.el.style.color = h.orig;
      s.hiddenEls = [];
    };
  }, [getState, containerRef]);

  // Mouse/touch handlers
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const cx = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const cy = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return { x: cx - rect.left, y: cy - rect.top };
  }, []);

  const handleDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const s = getState();
    const pos = getPos(e);
    const dx = pos.x - s.catX, dy = pos.y - s.catY;
    if ((dx / (CAT_RX + 12)) ** 2 + (dy / (CAT_RY + 12)) ** 2 < 1) {
      s.dragging = true;
      s.dragOX = dx; s.dragOY = dy;
      s.dragLX = pos.x; s.dragLY = pos.y;
      s.dragVX = 0; s.dragVY = 0;
      s.catVx = 0; s.catVy = 0;
      e.preventDefault();
    }
  }, [getState, getPos]);

  const handleMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const s = getState();
    if (!s.dragging) return;
    const pos = getPos(e);
    s.catX = pos.x - s.dragOX;
    s.catY = pos.y - s.dragOY;
    s.dragVX = (pos.x - s.dragLX) * 0.6 + s.dragVX * 0.4;
    s.dragVY = (pos.y - s.dragLY) * 0.6 + s.dragVY * 0.4;
    s.dragLX = pos.x; s.dragLY = pos.y;
    e.preventDefault();
  }, [getState, getPos]);

  const handleUp = useCallback(() => {
    const s = getState();
    if (!s.dragging) return;
    s.catVx = s.dragVX * THROW_SCALE;
    s.catVy = s.dragVY * THROW_SCALE;
    s.dragging = false;
  }, [getState]);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleDown}
      onMouseMove={handleMove}
      onMouseUp={handleUp}
      onMouseLeave={handleUp}
      onTouchStart={handleDown}
      onTouchMove={handleMove}
      onTouchEnd={handleUp}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        cursor: "grab",
        touchAction: "none",
        pointerEvents: "auto",
        zIndex: 10,
      }}
    />
  );
}
