"use client";

import { useRef, useEffect, useCallback } from "react";

/**
 * BattleCatPlayground — Full-page canvas overlay where every character
 * in the About page becomes a physics body. A draggable/throwable Battle Cat
 * pushes characters away on contact; they spring back when the cat leaves.
 *
 * Inspired by 0xNyk/pretext-playground (per-character physics with
 * struct-of-arrays storage for zero GC in the hot loop).
 */

/* ── Physics config ────────────────────────────────────────────────────── */

const PUSH_FORCE = 8;
const SPRING = 0.025;
const DAMPING = 0.92;
const GRAVITY = 0.5;
const BOUNCE = 0.5;
const THROW_SCALE = 1.4;
const CAT_W = 120;
const CAT_H = 120;
// Elliptical hitbox for form-fitting collision (cat body is roughly oval)
const CAT_RX = 52;  // horizontal radius
const CAT_RY = 44;  // vertical radius

/* ── Text entries to render (mirrors the About page content) ──────────── */

type TextEntry = {
  text: string;
  font: string;
  fontSize: number;
  color: string;
  alpha: number;
  yOffset: number;
  maxWidth: number;
  lineHeight: number;
  bold?: boolean;
};

const TEXT_ENTRIES: TextEntry[] = [
  // Hero
  { text: "Battle Cats Progress", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 30, color: "#f3f4f6", alpha: 1, yOffset: 0, maxWidth: 600, lineHeight: 38, bold: true },
  { text: "A fan-made tracker for The Battle Cats by PONOS. Not affiliated with or endorsed by PONOS Corporation.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#9ca3af", alpha: 0.9, yOffset: 48, maxWidth: 580, lineHeight: 22 },

  // What is this
  { text: "What is this?", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 18, color: "#f3f4f6", alpha: 1, yOffset: 110, maxWidth: 600, lineHeight: 28, bold: true },
  { text: "Battle Cats Progress is a personal tracker built for fans of The Battle Cats. The game doesn't have a great way to share your progress or see where your friends are at, so this site tries to fill that gap.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.85, yOffset: 148, maxWidth: 580, lineHeight: 22 },
  { text: "You can track your Story, Legend, Medals, Milestones, and Unit Collection, add friends, and compare where you both stand. More features are in the works.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.85, yOffset: 240, maxWidth: 580, lineHeight: 22 },

  // Features header
  { text: "Current Features", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 18, color: "#f3f4f6", alpha: 1, yOffset: 310, maxWidth: 600, lineHeight: 28, bold: true },
  { text: "Story — track cleared chapters, treasures, and zombie outbreaks across all three arcs", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.8, yOffset: 350, maxWidth: 560, lineHeight: 22 },
  { text: "Legend — log your crown progress through Stories of Legend, Uncanny Legends, and Zero Legends", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.8, yOffset: 396, maxWidth: 560, lineHeight: 22 },
  { text: "Medals — see all Meow Medals and mark which ones you've earned, with auto-sync from progress", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.8, yOffset: 442, maxWidth: 560, lineHeight: 22 },
  { text: "Units — browse 800+ cats with sprites, track form levels, filter by rarity, source, and gacha set", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.8, yOffset: 488, maxWidth: 560, lineHeight: 22 },
  { text: "Social — add friends, view profiles, compare progress side by side, browse unit collections", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#d1d5db", alpha: 0.8, yOffset: 534, maxWidth: 560, lineHeight: 22 },

  // Credits
  { text: "Credits", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 18, color: "#f3f4f6", alpha: 1, yOffset: 600, maxWidth: 600, lineHeight: 28, bold: true },
  { text: "Built by Geck. Started as a personal project to track progress and compare with friends.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#9ca3af", alpha: 0.75, yOffset: 638, maxWidth: 580, lineHeight: 22 },
  { text: "The Battle Cats is developed and published by PONOS Corporation. All game assets belong to PONOS.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 14, color: "#9ca3af", alpha: 0.75, yOffset: 682, maxWidth: 580, lineHeight: 22 },

  // Fun text
  { text: "Drag the cat. Throw it. Watch the text scatter and spring back.", font: "ui-sans-serif, system-ui, sans-serif", fontSize: 12, color: "#6b7280", alpha: 0.5, yOffset: 740, maxWidth: 580, lineHeight: 20 },
];

/* ── Struct-of-arrays for per-character physics (no GC in hot loop) ──── */

const MAX_LETTERS = 4000;

export default function BattleCatPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<{
    letterCount: number;
    homeX: Float32Array; homeY: Float32Array;
    x: Float32Array; y: Float32Array;
    vx: Float32Array; vy: Float32Array;
    angle: Float32Array; angVel: Float32Array;
    charW: Float32Array; baseAlpha: Float32Array;
    fontSize: Float32Array;
    chars: string[]; fonts: string[]; colors: string[];
    // Cat state
    catX: number; catY: number; catVx: number; catVy: number;
    catRot: number;
    // Drag
    dragging: boolean; dragOX: number; dragOY: number;
    dragLastX: number; dragLastY: number;
    dragVelX: number; dragVelY: number;
    // Image
    catImg: HTMLImageElement | null;
    // Animation
    animId: number;
    lastTime: number;
  } | null>(null);

  // Initialize state once
  const getState = useCallback(() => {
    if (!stateRef.current) {
      stateRef.current = {
        letterCount: 0,
        homeX: new Float32Array(MAX_LETTERS),
        homeY: new Float32Array(MAX_LETTERS),
        x: new Float32Array(MAX_LETTERS),
        y: new Float32Array(MAX_LETTERS),
        vx: new Float32Array(MAX_LETTERS),
        vy: new Float32Array(MAX_LETTERS),
        angle: new Float32Array(MAX_LETTERS),
        angVel: new Float32Array(MAX_LETTERS),
        charW: new Float32Array(MAX_LETTERS),
        baseAlpha: new Float32Array(MAX_LETTERS),
        fontSize: new Float32Array(MAX_LETTERS),
        chars: [], fonts: [], colors: [],
        catX: 300, catY: 200, catVx: 2, catVy: 0, catRot: 0,
        dragging: false, dragOX: 0, dragOY: 0,
        dragLastX: 0, dragLastY: 0, dragVelX: 0, dragVelY: 0,
        catImg: null, animId: 0, lastTime: 0,
      };
    }
    return stateRef.current;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = getState();

    // Load cat image
    const img = new Image();
    img.src = "/battlecat.png";
    img.onload = () => { s.catImg = img; };

    // Resize
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      layoutText(ctx!, rect.width);
    }

    // Layout all text entries into per-character arrays
    function layoutText(c: CanvasRenderingContext2D, containerW: number) {
      s.letterCount = 0;
      s.chars.length = 0;
      s.fonts.length = 0;
      s.colors.length = 0;

      const padX = 32;
      const padY = 40;

      for (const entry of TEXT_ENTRIES) {
        const fontStr = `${entry.bold ? "bold " : ""}${entry.fontSize}px ${entry.font}`;
        c.font = fontStr;

        const maxW = Math.min(entry.maxWidth, containerW - padX * 2);
        const baseX = padX;
        const baseY = padY + entry.yOffset;

        // Word-wrap and place each character
        const words = entry.text.split(" ");
        let lineX = 0;
        let lineY = 0;

        for (let wi = 0; wi < words.length; wi++) {
          const word = words[wi];
          const wordW = c.measureText(word).width;
          const spaceW = wi > 0 ? c.measureText(" ").width : 0;

          if (lineX + spaceW + wordW > maxW && lineX > 0) {
            lineX = 0;
            lineY += entry.lineHeight;
          }

          if (wi > 0 && lineX > 0) {
            // Space character
            if (s.letterCount < MAX_LETTERS) {
              const i = s.letterCount++;
              const sw = c.measureText(" ").width;
              s.homeX[i] = baseX + lineX + sw / 2;
              s.homeY[i] = baseY + lineY + entry.lineHeight / 2;
              s.x[i] = s.homeX[i]; s.y[i] = s.homeY[i];
              s.vx[i] = 0; s.vy[i] = 0; s.angle[i] = 0; s.angVel[i] = 0;
              s.charW[i] = sw; s.baseAlpha[i] = entry.alpha;
              s.fontSize[i] = entry.fontSize;
              s.chars[i] = " "; s.fonts[i] = fontStr; s.colors[i] = entry.color;
              lineX += sw;
            }
          }

          // Each character of the word
          for (const ch of word) {
            if (s.letterCount >= MAX_LETTERS) break;
            const cw = c.measureText(ch).width;
            const i = s.letterCount++;
            s.homeX[i] = baseX + lineX + cw / 2;
            s.homeY[i] = baseY + lineY + entry.lineHeight / 2;
            s.x[i] = s.homeX[i]; s.y[i] = s.homeY[i];
            s.vx[i] = 0; s.vy[i] = 0; s.angle[i] = 0; s.angVel[i] = 0;
            s.charW[i] = cw; s.baseAlpha[i] = entry.alpha;
            s.fontSize[i] = entry.fontSize;
            s.chars[i] = ch; s.fonts[i] = fontStr; s.colors[i] = entry.color;
            lineX += cw;
          }
        }
      }
    }

    resize();
    window.addEventListener("resize", resize);
    s.lastTime = performance.now();

    // Main loop
    function frame(now: number) {
      if (!canvas || !ctx) return;
      const dt = Math.min((now - s.lastTime) / 1000, 0.05);
      s.lastTime = now;

      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;

      // ── Cat physics ──────────────────────────────────────
      if (!s.dragging) {
        s.catVy += GRAVITY;
        s.catVx *= 0.995;
        s.catVy *= 0.995;
        s.catX += s.catVx;
        s.catY += s.catVy;
        s.catRot += s.catVx * 0.015;

        // Floor
        if (s.catY + CAT_H / 2 > H) {
          s.catY = H - CAT_H / 2;
          s.catVy *= -BOUNCE;
          s.catVx *= 0.9;
          if (Math.abs(s.catVy) < 1) s.catVy = 0;
        }
        // Ceiling
        if (s.catY - CAT_H / 2 < 0) {
          s.catY = CAT_H / 2;
          s.catVy *= -BOUNCE;
        }
        // Walls
        if (s.catX - CAT_W / 2 < 0) {
          s.catX = CAT_W / 2;
          s.catVx *= -BOUNCE;
        }
        if (s.catX + CAT_W / 2 > W) {
          s.catX = W - CAT_W / 2;
          s.catVx *= -BOUNCE;
        }
      } else {
        s.catRot *= 0.92;
      }

      // Cat center for collision
      const cx = s.catX;
      const cy = s.catY;

      // ── Per-character physics ─────────────────────────────
      for (let i = 0; i < s.letterCount; i++) {
        let vx = s.vx[i], vy = s.vy[i];
        const px = s.x[i], py = s.y[i];

        // Elliptical collision with cat
        const dx = px - cx;
        const dy = py - cy;
        // Normalize to ellipse space
        const nx = dx / CAT_RX;
        const ny = dy / CAT_RY;
        const ellDist = nx * nx + ny * ny;

        if (ellDist < 1.0 && ellDist > 0.001) {
          // Inside the ellipse — push outward
          const d = Math.sqrt(ellDist);
          const f = PUSH_FORCE * ((1 - d) / 1) * (1 + Math.abs(s.catVx) * 0.05 + Math.abs(s.catVy) * 0.05);
          // Push direction (gradient of ellipse)
          const gnx = dx / (CAT_RX * CAT_RX);
          const gny = dy / (CAT_RY * CAT_RY);
          const glen = Math.sqrt(gnx * gnx + gny * gny) || 1;
          vx += (gnx / glen) * f + s.catVx * 0.3;
          vy += (gny / glen) * f + s.catVy * 0.3;
          s.angVel[i] += ((gnx / glen) * 0.2 - (gny / glen) * 0.15) * f * 0.08;
        }

        // Spring back to home position
        const hdx = s.homeX[i] - px;
        const hdy = s.homeY[i] - py;
        const hd = Math.sqrt(hdx * hdx + hdy * hdy);
        if (hd > 0.5) {
          const sf = SPRING * (1 + hd * 0.0005);
          vx += hdx * sf;
          vy += hdy * sf;
          s.angVel[i] -= s.angle[i] * 0.06;
        } else {
          s.angle[i] *= 0.9;
        }

        s.vx[i] = vx * DAMPING;
        s.vy[i] = vy * DAMPING;
        s.angVel[i] *= 0.9;
        s.x[i] = px + s.vx[i];
        s.y[i] = py + s.vy[i];
        s.angle[i] += s.angVel[i];
      }

      // ── Render ────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // Draw characters
      let prevFont = "";
      for (let i = 0; i < s.letterCount; i++) {
        if (s.chars[i] === " ") continue;

        const font = s.fonts[i];
        if (font !== prevFont) { ctx.font = font; prevFont = font; }

        ctx.save();
        ctx.translate(s.x[i], s.y[i]);
        if (Math.abs(s.angle[i]) > 0.001) ctx.rotate(s.angle[i]);
        ctx.globalAlpha = s.baseAlpha[i];
        ctx.fillStyle = s.colors[i];
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(s.chars[i], 0, 0);
        ctx.restore();
      }

      // Draw cat
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s.catRot);
      if (s.catImg) {
        ctx.drawImage(s.catImg, -CAT_W / 2, -CAT_H / 2, CAT_W, CAT_H);
      } else {
        // Fallback circle
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.ellipse(0, 0, CAT_RX, CAT_RY, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(-14, -6, 4, 0, Math.PI * 2);
        ctx.arc(14, -6, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Drop shadow
      if (s.catY + CAT_H / 2 < H - 5) {
        const shadowScale = Math.max(0.3, 1 - (H - s.catY - CAT_H / 2) / H);
        ctx.fillStyle = `rgba(0,0,0,${0.12 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(cx, H - 3, CAT_RX * shadowScale * 0.8, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      s.animId = requestAnimationFrame(frame);
    }

    s.animId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(s.animId);
      window.removeEventListener("resize", resize);
    };
  }, [getState]);

  // ── Mouse/touch ──────────────────────────────────────────
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handleDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const s = getState();
    const pos = getPos(e);
    const dx = pos.x - s.catX;
    const dy = pos.y - s.catY;
    // Elliptical hit test
    if ((dx / (CAT_RX + 10)) ** 2 + (dy / (CAT_RY + 10)) ** 2 < 1) {
      s.dragging = true;
      s.dragOX = dx; s.dragOY = dy;
      s.dragLastX = pos.x; s.dragLastY = pos.y;
      s.dragVelX = 0; s.dragVelY = 0;
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
    s.dragVelX = (pos.x - s.dragLastX) * 0.6 + s.dragVelX * 0.4;
    s.dragVelY = (pos.y - s.dragLastY) * 0.6 + s.dragVelY * 0.4;
    s.dragLastX = pos.x;
    s.dragLastY = pos.y;
    e.preventDefault();
  }, [getState, getPos]);

  const handleUp = useCallback(() => {
    const s = getState();
    if (!s.dragging) return;
    s.catVx = s.dragVelX * THROW_SCALE;
    s.catVy = s.dragVelY * THROW_SCALE;
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
        zIndex: 10,
      }}
    />
  );
}
