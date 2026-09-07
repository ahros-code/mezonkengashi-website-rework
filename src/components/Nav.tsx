"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GirihStar, GirihField } from "./Girih";
import { useSpecular } from "@/lib/useSpecular";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import s from "./Nav.module.css";

const SECTIONS = ["services", "council", "process", "contact"] as const;
type SectionId = (typeof SECTIONS)[number];

export default function Nav({ t, locale }: { t: Dict; locale: Locale }) {
  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  const pillRef = useRef<HTMLElement | null>(null);
  const linkRefs = useRef(new Map<SectionId, HTMLAnchorElement>());
  const spec = useSpecular<HTMLDivElement>();

  /* --- glass plate appears once the hero has scrolled away --- */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- which section is in view --- */
  useEffect(() => {
    const targets = SECTIONS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id as SectionId);
        else if (window.scrollY < 200) setActive(null);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6, 1] },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  /* --- move the sliding indicator to the active link --- */
  const placeThumb = useCallback(() => {
    if (!active) return setThumb(null);
    const link = linkRefs.current.get(active);
    const pill = pillRef.current;
    if (!link || !pill) return setThumb(null);
    const a = link.getBoundingClientRect();
    const b = pill.getBoundingClientRect();
    setThumb({ x: a.left - b.left, w: a.width });
  }, [active]);

  useEffect(() => {
    placeThumb();
    window.addEventListener("resize", placeThumb);
    return () => window.removeEventListener("resize", placeThumb);
  }, [placeThumb]);

  /* --- lock the page behind the mobile sheet --- */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const labels: Record<SectionId, string> = {
    services: t.nav.services,
    council: t.nav.council,
    process: t.nav.process,
    contact: t.nav.contact,
  };

  const otherLocale = locales.find((l) => l !== locale) as Locale;

  return (
    <>
      <header className={s.header} data-stuck={stuck}>
        <div className={`container ${s.row}`}>
          <a href={`/${locale}`} className={s.brand} aria-label={`MEZON — ${t.footer.tagline}`}>
            <GirihStar size={26} stroke="currentColor" strokeWidth={1.1} className={s.brandMark} />
            <span>
              <span className={s.brandName}>MEZON</span>
              <span className={s.brandSub}>Islamic Finance</span>
            </span>
          </a>

          <nav
            className={`${s.pill} glass`}
            ref={pillRef as React.RefObject<HTMLElement>}
            aria-label={t.nav.services}
            onPointerMove={spec.onPointerMove as unknown as React.PointerEventHandler<HTMLElement>}
          >
            {thumb && (
              <span
                className={s.thumb}
                aria-hidden="true"
                style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }}
              />
            )}
            {SECTIONS.map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className={s.link}
                data-active={active === id}
                ref={(el) => {
                  if (el) linkRefs.current.set(id, el);
                }}
              >
                {labels[id]}
              </a>
            ))}
          </nav>

          <div className={s.right}>
            <div className={`${s.langs} glass`} role="group" aria-label={t.nav.langLabel}>
              {locales.map((l) => (
                <a key={l} href={`/${l}`} className={s.lang} aria-current={l === locale} hrefLang={l}>
                  {localeLabel[l]}
                </a>
              ))}
            </div>

            <a href="#contact" className={`btn btn--gold ${s.cta}`}>
              {t.nav.cta}
            </a>

            <button
              type="button"
              className={`${s.burger} glass`}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              onClick={() => setOpen((v) => !v)}
            >
              <span className={s.burgerBox} aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className={s.sheet} id="mobile-menu" data-open={open} hidden={!open}>
        <div className={s.sheetLattice} aria-hidden="true">
          <GirihField id="girih-sheet" tile={130} strokeWidth={0.8} />
        </div>
        <nav className={s.sheetNav} aria-label={t.nav.openMenu}>
          {SECTIONS.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              className={s.sheetLink}
              style={{ animationDelay: `${0.06 * i + 0.05}s` }}
              onClick={() => setOpen(false)}
            >
              {labels[id]}
            </a>
          ))}
        </nav>
        <div className={s.sheetFoot}>
          <a href="#contact" className="btn btn--gold" onClick={() => setOpen(false)}>
            {t.nav.cta}
          </a>
          <a href={`/${otherLocale}`} className="btn btn--ghost" hrefLang={otherLocale}>
            {localeLabel[otherLocale]}
          </a>
        </div>
      </div>
    </>
  );
}
