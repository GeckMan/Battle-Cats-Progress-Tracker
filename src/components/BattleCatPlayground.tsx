"use client";

import { useRef, useEffect } from "react";

/**
 * BattleCatPlayground — Per-character DOM displacement.
 *
 * Instead of rendering text on canvas (which caused duplication and missing text),
 * this wraps every visible character in a <span> and applies CSS transforms
 * for physics displacement. The cat is a simple positioned <img>.
 *
 * ✅ No text duplication (text stays in DOM)
 * ✅ No text disappearing (nothing is hidden)
 * ✅ Per-character displacement with rotation
 * ✅ Works with all content (badges, links, styled elements)
 * ✅ Clean restoration on unmount
 */

/* ── Config ── */
const PUSH = 12;
const SPRING = 0.025;
const DAMP = 0.9;
const GRAVITY = 0.5;
const BOUNCE = 0.5;
const THROW = 1.4;
const CAT_W = 130;
const CAT_RX = 60;
const CAT_RY = 52;
const MAX = 8000;

type Restoration = {
  wrapper: HTMLSpanElement;
  parent: Node;
  original: Text;
};

export default function BattleCatPlayground({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const catRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctr = containerRef.current;
    const catEl = catRef.current;
    if (!ctr || !catEl) return;

    /* ── Physics arrays ── */
    const els: HTMLSpanElement[] = [];
    let count = 0;
    const hx = new Float32Array(MAX), hy = new Float32Array(MAX);
    const ddx = new Float32Array(MAX), ddy = new Float32Array(MAX);
    const vx = new Float32Array(MAX), vy = new Float32Array(MAX);
    const ang = new Float32Array(MAX), angV = new Float32Array(MAX);
    const restorations: Restoration[] = [];

    /* Cat state */
    let catX = 200, catY = 100, catVx = 3, catVy = 0, catRot = 0;
    let dragging = false, dragOX = 0, dragOY = 0;
    let dragLX = 0, dragLY = 0, dragVX = 0, dragVY = 0;
    let animId = 0;

    /* ── Wrap text nodes in per-character spans ── */
    const walker = document.createTreeWalker(ctr, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const p = (node as Text).parentElement;
      if (!p || !(node as Text).textContent?.trim()) continue;
      if (p.closest("[data-playground-ui]")) continue;
      textNodes.push(node as Text);
    }

    for (const tn of textNodes) {
      const text = tn.textContent || "";
      const par = tn.parentNode;
      if (!par) continue;

      const wrap = document.createElement("span");
      wrap.style.display = "contents"; // doesn't affect layout

      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        // Leave whitespace as plain text nodes to preserve natural spacing/wrapping
        if (/\s/.test(ch)) {
          wrap.appendChild(document.createTextNode(ch));
          continue;
        }
        if (count >= MAX) {
          wrap.appendChild(document.createTextNode(text.slice(i)));
          break;
        }
        const sp = document.createElement("span");
        sp.textContent = ch;
        sp.style.display = "inline-block";
        sp.style.willChange = "transform";
        wrap.appendChild(sp);
        els.push(sp);
        count++;
      }

      par.replaceChild(wrap, tn);
      restorations.push({ wrapper: wrap, parent: par, original: tn });
    }

    /* ── Measure home positions (container-relative) ── */
    function measureHomes() {
      const cr = ctr!.getBoundingClientRect();
      for (let i = 0; i < count; i++) {
        const r = els[i].getBoundingClientRect();
        hx[i] = r.left - cr.left + r.width / 2;
        hy[i] = r.top - cr.top + r.height / 2;
      }
    }
    measureHomes();

    let W = ctr.scrollWidth || ctr.offsetWidth;
    let H = ctr.scrollHeight || ctr.offsetHeight;

    /* ── Animation loop ── */
    function frame() {
      /* Cat physics */
      if (!dragging) {
        catVy += GRAVITY;
        catVx *= 0.995;
        catVy *= 0.995;
        catX += catVx;
        catY += catVy;
        catRot += catVx * 0.012;

        // Bounce off walls/floor
        if (catY + CAT_W / 2 > H) {
          catY = H - CAT_W / 2;
          catVy *= -BOUNCE;
          catVx *= 0.9;
          if (Math.abs(catVy) < 1) catVy = 0;
        }
        if (catY - CAT_W / 2 < 0) { catY = CAT_W / 2; catVy *= -BOUNCE; }
        if (catX - CAT_W / 2 < 0) { catX = CAT_W / 2; catVx *= -BOUNCE; }
        if (catX + CAT_W / 2 > W) { catX = W - CAT_W / 2; catVx *= -BOUNCE; }
      } else {
        catRot *= 0.92;
      }

      // Update cat element position
      catEl!.style.left = (catX - CAT_W / 2) + "px";
      catEl!.style.top = (catY - CAT_W / 2) + "px";
      catEl!.style.transform = `rotate(${catRot}rad)`;

      /* Per-character physics */
      for (let i = 0; i < count; i++) {
        let _vx = vx[i], _vy = vy[i];
        const cx = hx[i] + ddx[i], cy = hy[i] + ddy[i];

        // Elliptical collision with cat
        const ex = cx - catX, ey = cy - catY;
        const nx = ex / CAT_RX, ny = ey / CAT_RY;
        const eD = nx * nx + ny * ny;

        if (eD < 1.0 && eD > 0.001) {
          const d = Math.sqrt(eD);
          const f = PUSH * (1 - d) * (1 + Math.abs(catVx) * 0.04 + Math.abs(catVy) * 0.04);
          const gx = ex / (CAT_RX * CAT_RX);
          const gy = ey / (CAT_RY * CAT_RY);
          const gl = Math.sqrt(gx * gx + gy * gy) || 1;
          _vx += (gx / gl) * f + catVx * 0.25;
          _vy += (gy / gl) * f + catVy * 0.25;
          angV[i] += ((gx / gl) * 0.2 - (gy / gl) * 0.1) * f * 0.06;
        }

        // Spring back to home
        const sd = Math.sqrt(ddx[i] * ddx[i] + ddy[i] * ddy[i]);
        if (sd > 0.3) {
          const sf = SPRING * (1 + sd * 0.0004);
          _vx -= ddx[i] * sf;
          _vy -= ddy[i] * sf;
          angV[i] -= ang[i] * 0.05;
        } else {
          ang[i] *= 0.85;
        }

        vx[i] = _vx * DAMP;
        vy[i] = _vy * DAMP;
        angV[i] *= 0.88;
        ddx[i] += vx[i];
        ddy[i] += vy[i];
        ang[i] += angV[i];

        // Apply CSS transform (only when needed)
        if (Math.abs(ddx[i]) > 0.1 || Math.abs(ddy[i]) > 0.1 || Math.abs(ang[i]) > 0.001) {
          els[i].style.transform = `translate(${ddx[i]}px,${ddy[i]}px) rotate(${ang[i]}rad)`;
        } else if (els[i].style.transform) {
          els[i].style.transform = "";
        }
      }

      animId = requestAnimationFrame(frame);
    }

    animId = requestAnimationFrame(frame);

    /* ── Resize observer ── */
    let rt: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        W = ctr.scrollWidth || ctr.offsetWidth;
        H = ctr.scrollHeight || ctr.offsetHeight;
        // Re-measure home positions (transforms are additive to home, so reset first)
        for (let i = 0; i < count; i++) {
          els[i].style.transform = "";
          ddx[i] = 0; ddy[i] = 0;
          vx[i] = 0; vy[i] = 0;
          ang[i] = 0; angV[i] = 0;
        }
        measureHomes();
      }, 200);
    });
    ro.observe(ctr);

    /* ── Input handlers ── */
    function pos(e: MouseEvent | TouchEvent) {
      const cr = ctr!.getBoundingClientRect();
      const px = "touches" in e
        ? (e as TouchEvent).touches[0]?.clientX ?? 0
        : (e as MouseEvent).clientX;
      const py = "touches" in e
        ? (e as TouchEvent).touches[0]?.clientY ?? 0
        : (e as MouseEvent).clientY;
      return { x: px - cr.left, y: py - cr.top };
    }

    function onDown(e: MouseEvent | TouchEvent) {
      const p = pos(e);
      const ex = p.x - catX, ey = p.y - catY;
      if ((ex / (CAT_RX + 15)) ** 2 + (ey / (CAT_RY + 15)) ** 2 < 1) {
        dragging = true;
        dragOX = ex; dragOY = ey;
        dragLX = p.x; dragLY = p.y;
        dragVX = 0; dragVY = 0;
        catVx = 0; catVy = 0;
        catEl!.style.cursor = "grabbing";
        e.preventDefault();
      }
    }

    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging) return;
      const p = pos(e);
      catX = p.x - dragOX;
      catY = p.y - dragOY;
      dragVX = (p.x - dragLX) * 0.6 + dragVX * 0.4;
      dragVY = (p.y - dragLY) * 0.6 + dragVY * 0.4;
      dragLX = p.x; dragLY = p.y;
      e.preventDefault();
    }

    function onUp() {
      if (!dragging) return;
      catVx = dragVX * THROW;
      catVy = dragVY * THROW;
      dragging = false;
      catEl!.style.cursor = "grab";
    }

    // Attach mouse events to cat element (for grab detection) and window (for move/up)
    catEl.addEventListener("mousedown", onDown);
    catEl.addEventListener("touchstart", onDown, { passive: false });
    // Also listen on container for clicks that might be slightly outside cat bounds
    ctr.addEventListener("mousedown", onDown);
    ctr.addEventListener("touchstart", onDown, { passive: false });
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    /* ── Cleanup ── */
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      clearTimeout(rt);

      catEl.removeEventListener("mousedown", onDown);
      catEl.removeEventListener("touchstart", onDown);
      ctr.removeEventListener("mousedown", onDown);
      ctr.removeEventListener("touchstart", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);

      // Restore original text nodes
      for (const { wrapper, parent, original } of restorations) {
        try {
          parent.replaceChild(original, wrapper);
        } catch {
          // If DOM has changed, just remove transforms
        }
      }
    };
  }, [containerRef]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={catRef}
      src="/battlecat.png"
      alt=""
      draggable={false}
      style={{
        position: "absolute",
        width: CAT_W,
        height: CAT_W,
        cursor: "grab",
        zIndex: 20,
        pointerEvents: "auto",
        userSelect: "none",
      }}
    />
  );
}
