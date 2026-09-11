"use client";

import { useId, useRef, useState } from "react";
import { GirihStar } from "./Girih";
import { ArrowMark } from "./Icons";
import s from "./Faq.module.css";

type QA = { q: string; a: string };
type Category = { id: string; name: string; items: QA[] };

const POPULAR = "__popular";

export default function FaqDesk({
  popular,
  categories,
  copy,
  contactHref,
  faqHref,
}: {
  popular: readonly QA[];
  categories: Category[];
  copy: Record<
    | "kicker"
    | "title"
    | "lede"
    | "popular"
    | "askTitle"
    | "askBody"
    | "askCta"
    | "allLink",
    string
  >;
  contactHref: string;
  faqHref: string;
}) {
  const uid = useId();
  const [tab, setTab] = useState(POPULAR);
  const [open, setOpen] = useState<string | null>(popular[0]?.q ?? null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const list: readonly QA[] =
    tab === POPULAR ? popular : (categories.find((c) => c.id === tab)?.items ?? []);

  const pickTab = (id: string) => {
    setTab(id);
    const first = id === POPULAR ? popular[0] : categories.find((c) => c.id === id)?.items[0];
    setOpen(first?.q ?? null);
  };

  /* Up/Down/Home/End move between questions, as in any listbox. */
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const last = list.length - 1;
    const to =
      e.key === "ArrowDown" ? Math.min(i + 1, last)
      : e.key === "ArrowUp" ? Math.max(i - 1, 0)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    buttons.current[to]?.focus();
  };

  return (
    <div className={s.grid}>
      {/* ---------------- left: intro, help ---------------- */}
      <div className={s.intro}>
        <p className="kicker">{copy.kicker}</p>
        <h2 id="faq-title" className={s.title}>
          {copy.title}
        </h2>
        <p className={s.lede}>{copy.lede}</p>

        <div className={s.ask}>
          <GirihStar size={20} strokeWidth={1.2} className={s.askMark} />
          <p className={s.askTitle}>{copy.askTitle}</p>
          <p className={s.askBody}>{copy.askBody}</p>
          <div className={s.askActions}>
            <a href={contactHref} className="btn btn--gold">
              {copy.askCta}
            </a>
            <a href={faqHref} className={s.askLink}>
              {copy.allLink}
              <ArrowMark />
            </a>
          </div>
        </div>
      </div>

      {/* ---------------- right: topics + answers ---------------- */}
      <div className={s.desk}>
        <div className={s.tabs} role="tablist" aria-label={copy.kicker}>
          {[{ id: POPULAR, name: copy.popular }, ...categories].map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              className={s.tab}
              aria-selected={tab === c.id}
              onClick={() => pickTab(c.id)}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* keyed so a new topic replays the entrance */}
        <ol className={s.list} key={tab}>
          {list.map((item, i) => {
            const isOpen = open === item.q;
            const panel = `${uid}-a-${i}`;
            return (
              <li
                key={item.q}
                className={s.item}
                data-open={isOpen}
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <button
                  ref={(el) => {
                    buttons.current[i] = el;
                  }}
                  type="button"
                  id={`${uid}-q-${i}`}
                  className={s.q}
                  aria-expanded={isOpen}
                  aria-controls={panel}
                  onClick={() => setOpen(isOpen ? null : item.q)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  <span className={s.num}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={s.qText}>
                    {item.q}
                  </span>
                  <span className={s.toggle} aria-hidden="true">
                    <GirihStar size={30} strokeWidth={1} />
                    <span className={s.plus} />
                  </span>
                </button>
                <div id={panel} role="region" aria-labelledby={`${uid}-q-${i}`} className={s.panel}>
                  <div className={s.panelInner}>
                    <p className={s.a}>{item.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
