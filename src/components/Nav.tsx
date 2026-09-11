"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { GirihStar, GirihField } from "./Girih";
import { TalimLeaves } from "./TalimMark";
import { useSpecular } from "@/lib/useSpecular";
import { paths } from "@/lib/routes";
import { locales, localeLabel, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import s from "./Nav.module.css";

type ItemId = "services" | "council" | "knowledge" | "about" | "contact";
type SectionId = "services" | "council" | "contact";

/** Sections the scroll-spy watches — only meaningful on the home page, and only
    those that have a pill item. Tracking a section with no item would blank the
    indicator while it is in view. */
const SPY: SectionId[] = ["services", "council", "contact"];

export default function Nav({ t, locale }: { t: Dict; locale: Locale }) {
  const pathname = usePathname() ?? "";
  const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const [stuck, setStuck] = useState(false);
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<SectionId | null>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  const pillRef = useRef<HTMLElement | null>(null);
  const itemRefs = useRef(new Map<ItemId, HTMLElement>());
  const groupRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const lastX = useRef<number | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /* Set by Escape so returning focus to the trigger does not reopen the menu.
     Cleared once the pointer or focus leaves the group. */
  const dismissed = useRef(false);
  const spec = useSpecular<HTMLDivElement>();

  const knowledge = [
    { id: "research", href: paths.research(locale), label: t.nav.research },
    { id: "news", href: paths.news(locale), label: t.nav.news },
    { id: "events", href: paths.events(locale), label: t.nav.events },
    { id: "faq", href: paths.faq(locale), label: t.nav.faq },
  ];
  const talimHref = paths.talim(locale);
  const onTalim = pathname.startsWith(talimHref);

  const inKnowledge = onTalim || knowledge.some((k) => pathname.startsWith(k.href));
  const onAbout = pathname.startsWith(paths.about(locale));

  /* --- glass plate appears once the hero has scrolled away --- */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* --- which home section is in view --- */
  useEffect(() => {
    if (!isHome) return setActive(null);
    const targets = SPY.map((id) => document.getElementById(id)).filter(
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
  }, [isHome]);

  /* --- the sliding indicator follows whichever item is current --- */
  const currentItem: ItemId | null = inKnowledge
    ? "knowledge"
    : onAbout
      ? "about"
      : (active as ItemId | null);

  const placeThumb = useCallback(() => {
    if (!currentItem) return setThumb(null);
    const el = itemRefs.current.get(currentItem);
    const pill = pillRef.current;
    if (!el || !pill) return setThumb(null);
    const a = el.getBoundingClientRect();
    const b = pill.getBoundingClientRect();
    // 'left: 0' resolves to the padding box, so discount the border.
    const border = parseFloat(getComputedStyle(pill).borderLeftWidth) || 0;
    setThumb({ x: a.left - b.left - border, w: a.width });
  }, [currentItem]);

  useEffect(() => {
    placeThumb();
    window.addEventListener("resize", placeThumb);
    return () => window.removeEventListener("resize", placeThumb);
  }, [placeThumb]);

  /* A long slide drags an opaque white block across the other labels and washes
     them out. Over that distance the indicator dips out and back in, so the move
     reads as a cross-fade; short hops still slide, which looks better. */
  useEffect(() => {
    const el = thumbRef.current;
    if (!el || !thumb) {
      lastX.current = null;
      return;
    }
    const from = lastX.current;
    lastX.current = thumb.x;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const keyframes =
      from === null
        ? [{ opacity: 0 }, { opacity: 1 }]
        : Math.abs(thumb.x - from) > 140
          ? [{ opacity: 1 }, { opacity: 0.1, offset: 0.34 }, { opacity: 1 }]
          : null;
    if (!keyframes) return;

    el.animate(keyframes, {
      duration: from === null ? 320 : 520,
      easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    });
  }, [thumb]);

  /* --- dropdown --- */
  const openMenu = useCallback(() => {
    if (dismissed.current) return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }, []);
  const scheduleClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 180);
  }, []);

  /* Only a real mouse gets hover-open: on touch, pointerenter fires on tap and
     the click that followed used to toggle the menu straight back shut. */
  const onHoverIn = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") openMenu();
    },
    [openMenu],
  );
  const onHoverOut = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      dismissed.current = false;
      scheduleClose();
    },
    [scheduleClose],
  );

  const onGroupBlur = useCallback(() => {
    dismissed.current = false;
    scheduleClose();
  }, [scheduleClose]);

  /* Hover already opened it for mouse users, so a mouse click must not toggle
     it closed. Keyboard activation (detail 0) and touch still toggle. */
  const onTriggerClick = useCallback((e: React.MouseEvent) => {
    if (dismissed.current) {
      dismissed.current = false;
      setMenuOpen(true);
      return;
    }
    const fromKeyboard = e.detail === 0;
    const canHover =
      typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
    if (fromKeyboard || !canHover) setMenuOpen((v) => !v);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      dismissed.current = true;
      setMenuOpen(false);
      itemRefs.current.get("knowledge")?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!groupRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [menuOpen]);

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

  const otherLocale = locales.find((l) => l !== locale) as Locale;

  /* Keeps the locale switch on the current page instead of dropping people home. */
  const swapLocale = (l: Locale) => {
    const rest = pathname.replace(new RegExp(`^/${locale}`), "");
    return `/${l}${rest}` || `/${l}`;
  };

  const primary: { id: ItemId; href: string; label: string }[] = [
    { id: "services", href: paths.services(locale), label: t.nav.services },
    { id: "council", href: paths.council(locale), label: t.nav.council },
  ];
  const trailing: { id: ItemId; href: string; label: string }[] = [
    { id: "about", href: paths.about(locale), label: t.nav.about },
    { id: "contact", href: paths.contact(locale), label: t.nav.contact },
  ];

  return (
    <>
      <header className={s.header} data-stuck={stuck}>
        <div className={`container ${s.row}`}>
          <a
            href={paths.home(locale)}
            className={s.brand}
            aria-label={`MEZON KENGASHI — ${t.footer.tagline}`}
          >
            {/* Approved monochrome lockup: the navbar sits on a dark ground. */}
            <img
              src="/brand/mezon-logo-dark.svg"
              alt="MEZON KENGASHI"
              className={s.brandLogo}
              width={190}
              height={45}
            />
          </a>

          <nav
            className={`${s.pill} glass`}
            ref={pillRef as React.RefObject<HTMLElement>}
            aria-label={t.knowledge.label}
            onPointerMove={spec.onPointerMove as unknown as React.PointerEventHandler<HTMLElement>}
          >
            {thumb && (
              <span
                ref={thumbRef}
                className={s.thumb}
                aria-hidden="true"
                style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }}
              />
            )}

            {primary.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={s.link}
                data-active={currentItem === item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                }}
              >
                {item.label}
              </a>
            ))}

            <div
              className={s.group}
              ref={groupRef}
              data-open={menuOpen}
              onPointerEnter={onHoverIn}
              onPointerLeave={onHoverOut}
              onFocus={openMenu}
              onBlur={onGroupBlur}
            >
              <button
                type="button"
                className={s.trigger}
                data-active={currentItem === "knowledge"}
                aria-expanded={menuOpen}
                aria-haspopup="true"
                onClick={onTriggerClick}
                ref={(el) => {
                  if (el) itemRefs.current.set("knowledge", el);
                }}
              >
                {t.knowledge.label}
                <svg
                  className={s.chev}
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 4l3 3 3-3" />
                </svg>
              </button>

              <div className={`${s.menu} glass`}>
                <p className={s.menuHead}>{t.knowledge.blurb}</p>
                {knowledge.map((k) => (
                  <a
                    key={k.id}
                    href={k.href}
                    className={s.menuLink}
                    aria-current={pathname.startsWith(k.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    <GirihStar size={13} strokeWidth={1.5} />
                    {k.label}
                  </a>
                ))}

                {/* The education sub-brand gets its own lit card, not another row. */}
                <a
                  href={talimHref}
                  className={s.talimCard}
                  aria-current={onTalim ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  <TalimLeaves left="#ffffff" right="#f8b700" className={s.talimMark} />
                  <span className={s.talimText}>
                    <span className={s.talimName}>{t.nav.talim}</span>
                    <span className={s.talimNote}>{t.talim.menuNote}</span>
                  </span>
                  <svg
                    className={s.talimArrow}
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </a>
              </div>
            </div>

            {trailing.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={s.link}
                data-active={currentItem === item.id}
                ref={(el) => {
                  if (el) itemRefs.current.set(item.id, el);
                }}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className={s.right}>
            <div className={`${s.langs} glass`} role="group" aria-label={t.nav.langLabel}>
              {locales.map((l) => (
                <a
                  key={l}
                  href={swapLocale(l)}
                  className={s.lang}
                  aria-current={l === locale}
                  hrefLang={l}
                >
                  {localeLabel[l]}
                </a>
              ))}
            </div>

            <a href={paths.contact(locale)} className={`btn btn--gold ${s.cta}`}>
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
          {[...primary, ...trailing].map((item, i) => (
            <a
              key={item.id}
              href={item.href}
              className={s.sheetLink}
              style={{ animationDelay: `${0.05 + i * 0.06}s` }}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}

          <p className={s.sheetGroupLabel} style={{ animationDelay: "0.3s" }}>
            {t.knowledge.label}
          </p>
          {knowledge.map((k, i) => (
            <a
              key={k.id}
              href={k.href}
              className={`${s.sheetLink} ${s.sheetSub}`}
              style={{ animationDelay: `${0.34 + i * 0.05}s` }}
              onClick={() => setOpen(false)}
            >
              {k.label}
            </a>
          ))}
          <a
            href={talimHref}
            className={`${s.talimCard} ${s.sheetTalim}`}
            style={{ animationDelay: `${0.34 + knowledge.length * 0.05}s` }}
            onClick={() => setOpen(false)}
          >
            <TalimLeaves left="#ffffff" right="#f8b700" className={s.talimMark} />
            <span className={s.talimText}>
              <span className={s.talimName}>{t.nav.talim}</span>
              <span className={s.talimNote}>{t.talim.menuNote}</span>
            </span>
          </a>
        </nav>
        <div className={s.sheetFoot}>
          <a href={paths.contact(locale)} className="btn btn--gold" onClick={() => setOpen(false)}>
            {t.nav.cta}
          </a>
          <a href={swapLocale(otherLocale)} className="btn btn--ghost" hrefLang={otherLocale}>
            {localeLabel[otherLocale]}
          </a>
        </div>
      </div>
    </>
  );
}
