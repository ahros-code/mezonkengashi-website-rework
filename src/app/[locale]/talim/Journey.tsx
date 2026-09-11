"use client";

import { useEffect, useRef, useState } from "react";
import s from "./Talim.module.css";

export type JourneyModule = {
  title: string;
  ar: string;
  standards: { n: number; name: string }[];
};

type Props = {
  title: string;
  lede: string;
  moduleLabel: string;
  modules: JourneyModule[];
};

/**
 * The fifteen weeks as a road. On wide screens the section pins and vertical
 * scrolling drives the nine modules sideways along a gold line; on phones and
 * under reduced motion it is an ordinary swipeable row with snap points.
 */
export default function Journey({ title, lede, moduleLabel, modules }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const view = viewRef.current;
    const track = trackRef.current;
    const fill = fillRef.current;
    if (!section || !view || !track || !fill) return;

    const wide = window.matchMedia("(min-width: 900px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let overflow = 0;
    let frame = 0;
    let last = -1;

    const setActiveFrom = (p: number) => {
      const i = Math.round(p * (modules.length - 1));
      if (i !== last) {
        last = i;
        setActive(i);
      }
    };

    const measure = () => {
      const pin = wide.matches && !still.matches;
      setPinned(pin);
      if (!pin) {
        setHeight(null);
        track.style.transform = "";
        return;
      }
      overflow = Math.max(0, track.scrollWidth - view.clientWidth);
      setHeight(window.innerHeight + overflow);
    };

    const update = () => {
      frame = 0;
      if (wide.matches && !still.matches) {
        const r = section.getBoundingClientRect();
        const span = r.height - window.innerHeight;
        const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        track.style.transform = `translate3d(${-p * overflow}px, 0, 0)`;
        fill.style.transform = `scaleX(${p})`;
        setActiveFrom(p);
      } else {
        const max = view.scrollWidth - view.clientWidth;
        const p = max > 0 ? view.scrollLeft / max : 0;
        fill.style.transform = `scaleX(${p})`;
        setActiveFrom(p);
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    view.addEventListener("scroll", onScroll, { passive: true });
    const onResize = () => {
      measure();
      onScroll();
    };
    window.addEventListener("resize", onResize);
    wide.addEventListener("change", onResize);
    document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      view.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      wide.removeEventListener("change", onResize);
    };
  }, [modules.length]);

  return (
    <section
      ref={sectionRef}
      id="journey"
      className={s.journey}
      data-pinned={pinned}
      style={height ? { height } : undefined}
      aria-labelledby="journey-title"
    >
      <div className={s.journeySticky}>
        <div className={`container ${s.journeyHead}`}>
          <h2 id="journey-title" className={s.h2}>
            {title}
          </h2>
          <p className={s.sectionLede}>{lede}</p>
        </div>

        <div className={`container ${s.rail}`} aria-hidden="true">
          <span className={s.railLine}>
            <span ref={fillRef} className={s.railFill} />
          </span>
          <span className={s.railNodes}>
            {modules.map((_, i) => (
              <span key={i} className={s.railNode} data-on={i <= active} />
            ))}
          </span>
        </div>

        <div ref={viewRef} className={s.journeyView}>
          <ol ref={trackRef} className={s.track}>
            {modules.map((m, i) => (
              <li key={m.ar} className={s.stop} data-active={i === active}>
                <span className={s.stopAr} lang="ar" dir="rtl" aria-hidden="true">
                  {m.ar}
                </span>
                <span className={s.stopNum}>{String(i + 1).padStart(2, "0")}</span>
                <p className={s.stopLabel}>
                  {moduleLabel} {i + 1} / {modules.length}
                </p>
                <h3 className={s.stopTitle}>{m.title}</h3>
                <ul className={s.stopStandards}>
                  {m.standards.map((st) => (
                    <li key={st.n}>
                      <span>№ {st.n}</span>
                      {st.name}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
