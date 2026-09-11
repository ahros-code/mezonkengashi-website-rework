"use client";

import { useEffect } from "react";

/**
 * Every small motion on the Taʼlim page, wired once by delegation instead of a
 * component per effect. Content is fully visible without this: the root only
 * gets `data-ready` after mount, and the hidden starting states hang off it.
 *
 *   [data-reveal]   fades and rises in once, on first sight
 *   [data-count]    counts up from zero to its own text on first sight
 *   [data-words]    words light up one by one as the block crosses the screen
 *   [data-spot]     a light follows the pointer (--mx / --my)
 *   [data-tilt]     leans toward the pointer (--rx / --ry)
 *   [data-hero]     pointer parallax (--px / --py) and scroll depth (--sy)
 *   [data-sticky]   the floating enrol pill, shown between hero and finale
 */
export default function TalimFx({ rootId }: { rootId: string }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    root.dataset.ready = "true";

    const cleanups: (() => void)[] = [];

    /* ---- reveal + count ---- */
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (!Number.isFinite(target) || still) return;
      const start = performance.now();
      const dur = 1700;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(2, -10 * t);
        el.textContent = String(Math.round(target * (t === 1 ? 1 : eased)));
        if (t < 1) requestAnimationFrame(tick);
      };
      el.textContent = "0";
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          el.dataset.shown = "true";
          if (el.dataset.count !== undefined) countUp(el);
          io.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );
    root.querySelectorAll<HTMLElement>("[data-reveal], [data-count]").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* ---- scroll-driven: words, hero depth, sticky pill ---- */
    const wordBlocks = [...root.querySelectorAll<HTMLElement>("[data-words]")].map((el) => ({
      el,
      words: [...el.querySelectorAll<HTMLElement>("[data-w]")],
      lit: -1,
    }));
    const hero = root.querySelector<HTMLElement>("[data-hero]");
    const sticky = root.querySelector<HTMLElement>("[data-sticky]");
    const finale = root.querySelector<HTMLElement>("[data-finale]");

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const vh = window.innerHeight;

        for (const b of wordBlocks) {
          const r = b.el.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.3)));
          const lit = still ? b.words.length : Math.floor(p * (b.words.length + 1));
          if (lit !== b.lit) {
            b.words.forEach((w, i) => (w.dataset.lit = String(i < lit)));
            b.lit = lit;
          }
        }

        if (hero) {
          const h = hero.offsetHeight;
          hero.style.setProperty("--sy", String(Math.min(1, window.scrollY / h)));
          if (sticky) {
            const past = window.scrollY > h * 0.85;
            const atEnd = finale ? finale.getBoundingClientRect().top < vh * 0.9 : false;
            sticky.dataset.show = String(past && !atEnd);
          }
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    });

    /* ---- pointer: spotlight, tilt, hero parallax ---- */
    if (fine && !still) {
      const onMove = (e: PointerEvent) => {
        const target = e.target as HTMLElement;

        const spot = target.closest<HTMLElement>("[data-spot]");
        if (spot) {
          const r = spot.getBoundingClientRect();
          spot.style.setProperty("--mx", `${e.clientX - r.left}px`);
          spot.style.setProperty("--my", `${e.clientY - r.top}px`);
        }

        const tilt = target.closest<HTMLElement>("[data-tilt]");
        if (tilt) {
          const r = tilt.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          const max = Number(tilt.dataset.tilt) || 6;
          tilt.style.setProperty("--ry", `${(x * max).toFixed(2)}deg`);
          tilt.style.setProperty("--rx", `${(-y * max).toFixed(2)}deg`);
        }

        if (hero && hero.contains(target)) {
          const x = e.clientX / window.innerWidth - 0.5;
          const y = e.clientY / window.innerHeight - 0.5;
          hero.style.setProperty("--px", x.toFixed(3));
          hero.style.setProperty("--py", y.toFixed(3));
        }
      };
      const onOut = (e: PointerEvent) => {
        const from = (e.target as HTMLElement).closest<HTMLElement>("[data-tilt]");
        const to = (e.relatedTarget as HTMLElement | null)?.closest?.("[data-tilt]");
        if (from && from !== to) {
          from.style.setProperty("--rx", "0deg");
          from.style.setProperty("--ry", "0deg");
        }
      };
      root.addEventListener("pointermove", onMove, { passive: true });
      root.addEventListener("pointerout", onOut, { passive: true });
      cleanups.push(() => {
        root.removeEventListener("pointermove", onMove);
        root.removeEventListener("pointerout", onOut);
      });
    }

    return () => cleanups.forEach((fn) => fn());
  }, [rootId]);

  return null;
}
