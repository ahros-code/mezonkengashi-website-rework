"use client";

import { useCallback, useRef } from "react";

/**
 * Tracks the pointer across a glass surface and writes --mx/--my so the
 * specular highlight in .glass::after follows the hand. Coalesced into one
 * rAF per frame; skipped entirely for coarse pointers and reduced motion.
 */
export function useSpecular<T extends HTMLElement>() {
  const frame = useRef(0);
  const next = useRef({ x: 0, y: 0 });

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    if (e.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    next.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };

    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      el.style.setProperty("--mx", `${next.current.x.toFixed(1)}%`);
      el.style.setProperty("--my", `${next.current.y.toFixed(1)}%`);
    });
  }, []);

  return { onPointerMove };
}
