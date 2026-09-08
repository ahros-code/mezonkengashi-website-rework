"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GirihMedallion } from "./Girih";
import { boardMembers, expertMembers } from "@/lib/site";
import type { Dict } from "@/i18n";
import s from "./Council.module.css";

type GroupId = "board" | "experts";
const GROUPS: GroupId[] = ["board", "experts"];

export default function Council({ t }: { t: Dict }) {
  const [group, setGroup] = useState<GroupId>("board");
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);

  const switchRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<GroupId, HTMLButtonElement>());

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

        {GROUPS.map((id) => (
          <div
            key={id}
            className={s.grid}
            role="tabpanel"
            id={`panel-${id}`}
            aria-labelledby={`tab-${id}`}
            hidden={group !== id}
          >
            {(id === "board" ? boardMembers : expertMembers).map((m) => {
              const person = t.council.members[m.id as keyof typeof t.council.members];
              return (
                <article key={m.id} className={s.member}>
                  <div className={s.portrait}>
                    <GirihMedallion seed={m.id} scope={`council-${id}`} />
                    <span className={s.initials} aria-hidden="true">
                      {m.initials}
                    </span>
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
        ))}
      </div>
    </section>
  );
}
