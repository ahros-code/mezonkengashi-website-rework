"use client";

import { useEffect, useRef } from "react";
import { GirihField } from "./Girih";
import s from "./Hero.module.css";

/**
 * The moving part of the hero background: the lattice and the dome-light drift
 * a few pixels against the pointer, which gives the flat photograph depth
 * without ever animating on its own once the load sequence is done.
 */
export default function HeroAtmosphere() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let frame = 0;
    let px = 0;
    let py = 0;

    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        el.style.setProperty("--px", px.toFixed(3));
        el.style.setProperty("--py", py.toFixed(3));
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true">
      <div className={s.bloom} />
      <div className={s.lattice}>
        <div className={s.latticeSpin}>
          <GirihField id="girih-hero" tile={188} strokeWidth={0.9} />
        </div>
      </div>
      <div className={s.vignette} />
    </div>
  );
}
