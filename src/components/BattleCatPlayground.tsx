"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import {
  prepare,
  layoutNextLine,
  availableWidth,
  type PreparedText,
  type LayoutCursor,
  type Obstacle,
} from "@/lib/pretext";

/**
 * BattleCatPlayground — Easter egg on the About page.
 *
 * A physics-based Battle Cat that can be click-dragged around and thrown.
 * Text in the canvas flows around the cat in real-time using pretext's
 * layoutNextLine() with per-line variable width (obstacle avoidance).
 *
 * Physics: simple verlet integration with gravity, velocity damping,
 * floor/wall bouncing, and throw momentum from drag velocity.
 */

/* ── Constants ─────────────────────────────────────────────────────────── */

const GRAVITY = 0.45;
const DAMPING = 0.985;
const BOUNCE = 0.55;
const FLOOR_FRICTION = 0.92;
const THROW_SCALE = 1.2;
const CAT_SIZE = 100;
const LINE_HEIGHT = 22;
const FONT = '15px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const BOLD_FONT = 'bold 16px ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
const PADDING = 24;

const ABOUT_TEXT =
  "The Battle Cats is a tower defense game developed by PONOS Corporation. " +
  "Players collect and upgrade a bizarre army of cats to defend their base against " +
  "equally bizarre enemies. What started as a simple mobile game in Japan has grown into " +
  "a global phenomenon with millions of players worldwide. The game features hundreds of " +
  "unique cat units, each with their own abilities and evolution paths. From the humble " +
  "Cat to the legendary Uber Rare units, every cat has a role to play. Battle Cats Progress " +
  "was built to help fans track their journey through Empire of Cats, Stories of Legend, " +
  "Uncanny Legends, and beyond. Whether you are hunting for Crazed Cats, grinding True Forms, " +
  "or chasing down every last Meow Medal, this tracker has you covered. " +
  "The community of Battle Cats players is passionate and creative, sharing strategies, " +
  "fan art, and tier lists across the internet. We hope this tool helps you connect with " +
  "fellow players and celebrate your progress together. Now go forth and conquer!";

/* ── Physics state ─────────────────────────────────────────────────────── */

type CatState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationV: number;
};

export default function BattleCatPlayground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const catRef = useRef<CatState>({ x: 100, y: 50, vx: 2, vy: 0, rotation: 0, rotationV: 0 });
  const dragRef = useRef<{
    active: boolean;
    offsetX: number;
    offsetY: number;
    lastX: number;
    lastY: number;
    velocityX: number;
    velocityY: number;
  }>({ active: false, offsetX: 0, offsetY: 0, lastX: 0, lastY: 0, velocityX: 0, velocityY: 0 });
  const preparedRef = useRef<PreparedText | null>(null);
  const catImgRef = useRef<HTMLImageElement | null>(null);
  const animRef = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  // Load cat image and prepare text
  useEffect(() => {
    // Prepare text
    preparedRef.current = prepare(ABOUT_TEXT, FONT);

    // Load the classic Battle Cat sprite
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = "/api/sprite?u=0&f=f";
    img.onload = () => {
      catImgRef.current = img;
      setMounted(true);
    };
    // Fallback if sprite doesn't load
    img.onerror = () => {
      setMounted(true);
    };

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  // Main render loop
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function loop() {
      if (!canvas || !ctx) return;
      const W = canvas.getBoundingClientRect().width;
      const H = canvas.getBoundingClientRect().height;
      const cat = catRef.current;
      const drag = dragRef.current;

      // ── Physics step ───────────────────────────────────────────
      if (!drag.active) {
        cat.vy += GRAVITY;
        cat.vx *= DAMPING;
        cat.vy *= DAMPING;
        cat.x += cat.vx;
        cat.y += cat.vy;

        // Rotation follows horizontal velocity
        cat.rotationV = cat.vx * 0.02;
        cat.rotation += cat.rotationV;

        // Floor bounce
        if (cat.y + CAT_SIZE > H) {
          cat.y = H - CAT_SIZE;
          cat.vy *= -BOUNCE;
          cat.vx *= FLOOR_FRICTION;
          if (Math.abs(cat.vy) < 1.5) cat.vy = 0;
        }

        // Ceiling
        if (cat.y < 0) {
          cat.y = 0;
          cat.vy *= -BOUNCE;
        }

        // Wall bounce
        if (cat.x < 0) {
          cat.x = 0;
          cat.vx *= -BOUNCE;
        }
        if (cat.x + CAT_SIZE > W) {
          cat.x = W - CAT_SIZE;
          cat.vx *= -BOUNCE;
        }
      } else {
        // Slowly decay rotation while dragging
        cat.rotation *= 0.95;
      }

      // ── Clear ──────────────────────────────────────────────────
      ctx.clearRect(0, 0, W, H);

      // ── Draw text flowing around cat ───────────────────────────
      if (preparedRef.current) {
        const textW = W - PADDING * 2;
        const obstacle: Obstacle = {
          x: cat.x - PADDING + 4,  // relative to text area, with small margin
          y: cat.y - 8,
          width: CAT_SIZE + 8,
          height: CAT_SIZE + 8,
        };

        ctx.font = FONT;
        ctx.fillStyle = "rgb(209, 213, 219)"; // gray-300
        ctx.textBaseline = "top";

        let cursor: LayoutCursor = { wordIndex: 0 };
        let lineY = PADDING;

        while (cursor.wordIndex < preparedRef.current.words.length && lineY < H - 10) {
          // Get available segments on this line
          const segs = availableWidth(lineY, LINE_HEIGHT, textW, [obstacle]);

          // Find the widest segment to place text
          let bestSeg = segs[0];
          for (const s of segs) {
            if (s.width > bestSeg.width) bestSeg = s;
          }

          if (bestSeg.width < 40) {
            // Too narrow, skip this line
            lineY += LINE_HEIGHT;
            continue;
          }

          const line = layoutNextLine(preparedRef.current, cursor, bestSeg.width);
          if (!line) break;

          ctx.fillText(line.text, PADDING + bestSeg.x, lineY);
          cursor = line.next;
          lineY += LINE_HEIGHT;
        }
      }

      // ── Draw cat ───────────────────────────────────────────────
      ctx.save();
      ctx.translate(cat.x + CAT_SIZE / 2, cat.y + CAT_SIZE / 2);
      ctx.rotate(cat.rotation);

      if (catImgRef.current) {
        ctx.drawImage(
          catImgRef.current,
          -CAT_SIZE / 2,
          -CAT_SIZE / 2,
          CAT_SIZE,
          CAT_SIZE,
        );
      } else {
        // Fallback: draw a simple cat face
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, CAT_SIZE / 2 - 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#333";
        ctx.lineWidth = 3;
        ctx.stroke();
        // Eyes
        ctx.fillStyle = "#333";
        ctx.beginPath();
        ctx.arc(-12, -8, 4, 0, Math.PI * 2);
        ctx.arc(12, -8, 4, 0, Math.PI * 2);
        ctx.fill();
        // Mouth
        ctx.beginPath();
        ctx.arc(0, 4, 8, 0, Math.PI);
        ctx.stroke();
      }

      // Drop shadow when airborne
      ctx.restore();
      if (cat.y + CAT_SIZE < H - 2) {
        const shadowY = H - 4;
        const shadowScale = Math.max(0.3, 1 - (H - cat.y - CAT_SIZE) / H);
        ctx.fillStyle = `rgba(0,0,0,${0.15 * shadowScale})`;
        ctx.beginPath();
        ctx.ellipse(
          cat.x + CAT_SIZE / 2,
          shadowY,
          (CAT_SIZE / 2) * shadowScale,
          4 * shadowScale,
          0, 0, Math.PI * 2,
        );
        ctx.fill();
      }

      animRef.current = requestAnimationFrame(loop);
    }

    animRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [mounted]);

  // ── Mouse/touch handlers ──────────────────────────────────────
  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]?.clientX ?? 0 : e.clientX;
    const clientY = "touches" in e ? e.touches[0]?.clientY ?? 0 : e.clientY;
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const handlePointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const pos = getPos(e);
    const cat = catRef.current;
    const dx = pos.x - (cat.x + CAT_SIZE / 2);
    const dy = pos.y - (cat.y + CAT_SIZE / 2);
    if (dx * dx + dy * dy < (CAT_SIZE / 2 + 10) * (CAT_SIZE / 2 + 10)) {
      dragRef.current = {
        active: true,
        offsetX: pos.x - cat.x,
        offsetY: pos.y - cat.y,
        lastX: pos.x,
        lastY: pos.y,
        velocityX: 0,
        velocityY: 0,
      };
      cat.vx = 0;
      cat.vy = 0;
      e.preventDefault();
    }
  }, [getPos]);

  const handlePointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const pos = getPos(e);
    const cat = catRef.current;
    cat.x = pos.x - drag.offsetX;
    cat.y = pos.y - drag.offsetY;

    // Track velocity for throw
    drag.velocityX = (pos.x - drag.lastX) * 0.6 + drag.velocityX * 0.4;
    drag.velocityY = (pos.y - drag.lastY) * 0.6 + drag.velocityY * 0.4;
    drag.lastX = pos.x;
    drag.lastY = pos.y;
    e.preventDefault();
  }, [getPos]);

  const handlePointerUp = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.active) return;
    const cat = catRef.current;
    cat.vx = drag.velocityX * THROW_SCALE;
    cat.vy = drag.velocityY * THROW_SCALE;
    drag.active = false;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handlePointerDown}
      onMouseMove={handlePointerMove}
      onMouseUp={handlePointerUp}
      onMouseLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={handlePointerMove}
      onTouchEnd={handlePointerUp}
      style={{
        width: "100%",
        height: 500,
        cursor: dragRef.current?.active ? "grabbing" : "grab",
        borderRadius: 8,
        border: "1px solid rgb(55, 65, 81)",
        background: "rgb(3, 7, 18)",
        touchAction: "none",
      }}
    />
  );
}
