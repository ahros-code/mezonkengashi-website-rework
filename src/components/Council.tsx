"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GirihMedallion } from "./Girih";
import { boardMembers, expertMembers, teamMembers } from "@/lib/site";
import type { Dict } from "@/i18n";
import s from "./Council.module.css";

type GroupId = "board" | "experts" | "team";
const GROUPS: GroupId[] = ["board", "experts", "team"];

/** Who sits in each tab: the two councils, then the people who run the work. */
const ROSTER: Record<GroupId, typeof boardMembers> = {
  board: boardMembers,
  experts: expertMembers,
  team: teamMembers,
};

export default function Council({ t }: { t: Dict }) {
  const [group, setGroup] = useState<GroupId>("board");
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  const switchRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<GroupId, HTMLButtonElement>());
  const panelRefs = useRef(new Map<GroupId, HTMLDivElement>());
  /* phone carousel: which card is in view */
  const [slide, setSlide] = useState(0);

  const placeThumb = useCallback(() => {
    const tab = tabRefs.current.get(group);
    const box = switchRef.current;
    if (!tab || !box) return;
    const a = tab.getBoundingClientRect();
    const b = box.getBoundingClientRect();
    const border = parseFloat(getComputedStyle(box).borderLeftWidth) || 0;
    setThumb({ x: a.left - b.left - border + box.scrollLeft, w: a.width });
  }, [group]);

  useEffect(() => {
    placeThumb();
    window.addEventListener("resize", placeThumb);
    return () => window.removeEventListener("resize", placeThumb);
  }, [placeThumb]);

  const members = ROSTER[group];

  /* On a phone each panel is a swipe row; the pager reads and drives it. */
  const step = () => {
    const panel = panelRefs.current.get(group);
    const card = panel?.firstElementChild as HTMLElement | null;
    if (!panel || !card) return 0;
    return card.offsetWidth + parseFloat(getComputedStyle(panel).columnGap || "0");
  };
  const onPanelScroll = (id: GroupId) => {
    if (id !== group) return;
    const panel = panelRefs.current.get(id);
    const w = step();
    if (!panel || !w) return;
    /* the last card cannot reach the left edge, so the end of the row counts as it */
    const atEnd = panel.scrollLeft >= panel.scrollWidth - panel.clientWidth - 2;
    setSlide(atEnd ? panel.children.length - 1 : Math.round(panel.scrollLeft / w));
  };
  const go = (dir: 1 | -1) => {
    panelRefs.current.get(group)?.scrollBy({ left: dir * step(), behavior: "smooth" });
  };
  useEffect(() => {
    setSlide(0);
    panelRefs.current.get(group)?.scrollTo({ left: 0 });
  }, [group]);

  /* Left/right arrows move between tabs, as a tablist should. */
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = GROUPS.indexOf(group);
    const next = GROUPS[(i + (e.key === "ArrowRight" ? 1 : GROUPS.length - 1)) % GROUPS.length];
    setGroup(next);
    tabRefs.current.get(next)?.focus();
  }

  return (
    <section id="council" className={s.section} aria-labelledby="council-title">
      <div className={s.screen} aria-hidden="true">
        <Image
          src="/img/panjara.jpg"
          alt=""
          fill
          sizes="(max-width: 1080px) 100vw, 46vw"
          quality={65}
        />
        <span className={s.screenWash} />
      </div>
      <span className={s.glow} aria-hidden="true" />

      <div className="container">
        <header className={s.head}>
          <p className={s.kicker}>{t.council.kicker}</p>
          <h2 id="council-title" className={s.title}>
            {t.council.title}
          </h2>
          <p className={s.lede}>{t.council.lede}</p>
        </header>

        <div
          className={`${s.switch} glass`}
          role="tablist"
          aria-label={t.council.title}
          ref={switchRef}
          onKeyDown={onKeyDown}
        >
          {thumb && (
            <span
              className={s.thumb}
              aria-hidden="true"
              style={{ transform: `translateX(${thumb.x}px)`, width: thumb.w }}
            />
          )}
          {GROUPS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={group === id}
              aria-controls={`panel-${id}`}
              tabIndex={group === id ? 0 : -1}
              className={s.tab}
              ref={(el) => {
                if (el) tabRefs.current.set(id, el);
              }}
              onClick={() => setGroup(id)}
            >
              <span className={s.tabName}>{t.council.groups[id].short}</span>
              <span className={s.tabRole}>{t.council.groups[id].role}</span>
            </button>
          ))}
        </div>

        {GROUPS.map((id) => {
          const members = ROSTER[id];
          return (
          <div
            key={id}
            ref={(el) => {
              if (el) panelRefs.current.set(id, el);
            }}
            onScroll={() => onPanelScroll(id)}
            /* a roster shorter than a full row centres itself instead of leaving a ragged edge */
            className={`${s.grid} ${members.length < 4 ? s.gridShort : ""}`}
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            hidden={group !== id}
          >
            {members.map((m) => {
              const person = t.council.members[m.id as keyof typeof t.council.members];
              return (
                <article key={m.id} className={s.member}>
                  <div className={`${s.portrait} ${m.photo ? s.hasPhoto : ""}`}>
                    {m.photo ? (
                      <Image
                        className={s.photo}
                        src={`/img/council/${m.id}.webp`}
                        alt={person.name}
                        width={720}
                        height={720}
                        sizes="(max-width: 760px) 80vw, (max-width: 1080px) 50vw, 25vw"
                      />
                    ) : (
                      <>
                        <GirihMedallion seed={m.id} scope={`council-${id}`} />
                        <span className={s.initials} aria-hidden="true">
                          {m.initials}
                        </span>
                      </>
                    )}
                  </div>
                  <div className={s.body}>
                    <h3 className={s.name}>{person.name}</h3>
                    <p className={s.role}>{person.role}</p>
                    <p className={s.bio}>{person.bio}</p>
                    <ul className={s.creds}>
                      {person.credentials.map((c) => (
                        <li key={c} className={s.cred}>
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
          );
        })}

        {/* phones only: position and arrows for the swipe row */}
        <div className={s.pager}>
          <button type="button" className={s.pagerBtn} onClick={() => go(-1)} disabled={slide <= 0} aria-label={t.council.prev}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className={s.pagerTrack} aria-hidden="true">
            <span
              className={s.pagerFill}
              style={{ transform: `scaleX(${(Math.min(slide, members.length - 1) + 1) / members.length})` }}
            />
          </span>
          <span className={s.pagerCount} aria-live="polite">
            {Math.min(slide, members.length - 1) + 1} / {members.length}
          </span>
          <button
            type="button"
            className={s.pagerBtn}
            onClick={() => go(1)}
            disabled={slide >= members.length - 1}
            aria-label={t.council.next}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
