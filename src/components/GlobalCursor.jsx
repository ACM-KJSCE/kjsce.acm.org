/**
 * GlobalCursor — full-viewport custom cursor.
 * Uses RAF + lerp directly on a DOM ref — zero React re-renders,
 * no spring settling lag. Buttery smooth at any frame rate.
 */
import { useEffect, useRef, useState } from "react";

const LERP = 0.18;          // 0 = infinite lag, 1 = instant — 0.18 is silky
const SIZE  = 26;           // px

export default function GlobalCursor() {
  const cursorRef   = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const isVisible = useRef(false);

  // ── touch detection ────────────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(pointer: coarse)");
    const sync = () => setIsTouchDevice(mql.matches);
    sync();
    mql.addEventListener?.("change", sync);
    return () => mql.removeEventListener?.("change", sync);
  }, []);

  // ── hide native cursor globally ────────────────────────────────────────────
  useEffect(() => {
    if (isTouchDevice) return;
    const style = document.createElement("style");
    style.id = "__global-cursor-hide";
    style.textContent = "*, *::before, *::after { cursor: none !important; }";
    document.head.appendChild(style);
    return () => document.getElementById("__global-cursor-hide")?.remove();
  }, [isTouchDevice]);

  // ── RAF tracking loop ──────────────────────────────────────────────────────
  useEffect(() => {
    if (isTouchDevice || typeof window === "undefined") return;

    const el = cursorRef.current;
    if (!el) return;

    // Live position targets — updated synchronously in mousemove handler
    const target = { x: -9999, y: -9999 };
    // Rendered position — lerped each frame
    const pos    = { x: -9999, y: -9999 };
    let pressed  = false;
    let rafId;

    const tick = () => {
      // Lerp toward target — exponential decay, frame-rate independent feel
      pos.x += (target.x - pos.x) * LERP;
      pos.y += (target.y - pos.y) * LERP;

      const scale = pressed ? 0.8 : 1;

      el.style.transform =
        `translate(${pos.x}px, ${pos.y}px) scale(${scale})`;
      el.style.opacity = isVisible.current ? "1" : "0";

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    // Event handlers — only update data, never touch DOM directly here
    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!isVisible.current) {
        // Teleport to avoid lerping in from off-screen on first move
        pos.x = e.clientX;
        pos.y = e.clientY;
        isVisible.current = true;
      }
    };
    const onDown  = () => { pressed = true;  };
    const onUp    = () => { pressed = false; };
    const onLeave = () => { isVisible.current = false; };
    const onEnter = () => { isVisible.current = true;  };

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mousedown",  onDown,  { passive: true });
    window.addEventListener("mouseup",    onUp,    { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mousedown",  onDown);
      window.removeEventListener("mouseup",    onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top:    0,
        left:   0,
        width:  SIZE,
        height: SIZE,
        pointerEvents: "none",
        zIndex: 999999,
        /* Anchor at the arrow tip (top-left of SVG viewbox) */
        transformOrigin: "4px 2px",
        opacity: 0,
        /* Transition only opacity; transform is handled by RAF */
        transition: "opacity 140ms ease",
        willChange: "transform",
      }}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block", overflow: "visible" }}
      >
        {/* Soft white outline for readability on dark/image backgrounds */}
        <path
          d="M4 2 L22 13 L13 15 L10 23 Z"
          fill="rgba(255,255,255,0.30)"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth={2.8}
          strokeLinejoin="round"
          style={{ transform: "translate(0.5px, 0.6px)" }}
        />
        {/* Main black arrow */}
        <path
          d="M4 2 L22 13 L13 15 L10 23 Z"
          fill="#0a0a0a"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={0.5}
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
