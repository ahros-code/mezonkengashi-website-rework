"use client";

import { useEffect, useRef } from "react";

/**
 * Gold motes rising through the hero, like dust in lamplight above the book.
 * One pre-rendered glow sprite, a capped count and device-pixel ratio, and the
 * loop sleeps whenever the hero is off screen or the tab is hidden.
 */
export default function Embers({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sprite = document.createElement("canvas");
    sprite.width = sprite.height = 64;
    const s = sprite.getContext("2d")!;
    const g = s.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255, 226, 140, 1)");
    g.addColorStop(0.25, "rgba(248, 183, 0, 0.55)");
    g.addColorStop(1, "rgba(248, 183, 0, 0)");
    s.fillStyle = g;
    s.fillRect(0, 0, 64, 64);

    type Mote = { x: number; y: number; r: number; vy: number; vx: number; ph: number; a: number };
    let w = 0;
    let h = 0;
    let motes: Mote[] = [];
    const dpr = Math.min(2, window.devicePixelRatio || 1);

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 20,
      r: 2 + Math.random() * 7,
      vy: 0.18 + Math.random() * 0.55,
      vx: (Math.random() - 0.5) * 0.25,
      ph: Math.random() * Math.PI * 2,
      a: 0.25 + Math.random() * 0.6,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(30, (w * h) / 16000)));
      motes = Array.from({ length: count }, () => spawn(true));
    };
    resize();

    let raf = 0;
    let running = false;
    let t = 0;
    const draw = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const m of motes) {
        m.y -= m.vy;
        m.x += m.vx + Math.sin((t + m.ph * 60) / 90) * 0.18;
        if (m.y < -20) Object.assign(m, spawn(false));
        /* fade in from the floor, out toward the top */
        const life = Math.min(1, (h - m.y) / (h * 0.25)) * Math.min(1, m.y / (h * 0.35));
        const flicker = 0.75 + Math.sin(t / 14 + m.ph) * 0.25;
        ctx.globalAlpha = Math.max(0, m.a * life * flicker);
        ctx.drawImage(sprite, m.x - m.r, m.y - m.r, m.r * 2, m.r * 2);
      }
      ctx.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    };

    const start = () => {
      if (running || still) return;
      running = true;
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    if (still) draw();

    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("resize", resize);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
