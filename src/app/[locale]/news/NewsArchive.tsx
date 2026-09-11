"use client";

import { useMemo, useState } from "react";
import { GirihStar } from "@/components/Girih";
import { ArrowMark } from "@/components/Icons";
import s from "./News.module.css";

export type ArchiveItem = {
  slug: string;
  href: string;
  /** ISO date */
  date: string;
  day: string;
  month: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  minutes: string;
};

/**
 * The archive under the front block. With no topic picked it lists everything
 * the front block did not already show; picking a topic lists every story in
 * it, featured ones included, so a filter never hides a match.
 */
export default function NewsArchive({
  items,
  featured,
  labels,
}: {
  /** every story, newest first */
  items: ArchiveItem[];
  /** how many of `items` the front block already shows */
  featured: number;
  labels: { archive: string; filterLabel: string; all: string; noMatch: string };
}) {
  const [topic, setTopic] = useState<string | null>(null);

  const topics = useMemo(() => {
    const seen = new Map<string, { label: string; count: number }>();
    for (const a of items) {
      const t = seen.get(a.category);
      if (t) t.count++;
      else seen.set(a.category, { label: a.categoryLabel, count: 1 });
    }
    return [...seen].map(([id, v]) => ({ id, ...v }));
  }, [items]);

  const shown = topic ? items.filter((a) => a.category === topic) : items.slice(featured);
  const years = [...new Set(shown.map((a) => a.date.slice(0, 4)))];

  /* Nothing left to list once the front block has taken its share. */
  if (items.length <= featured) return null;

  return (
    <div className={s.archive}>
      <div className={s.archiveHead}>
        <h2 className={s.archiveTitle}>{labels.archive}</h2>
        <span className={s.archiveCount}>{shown.length}</span>
      </div>

      {topics.length > 1 && (
        <div className={s.chips} role="group" aria-label={labels.filterLabel}>
          <button
            type="button"
            className={s.chip}
            aria-pressed={topic === null}
            onClick={() => setTopic(null)}
          >
            {labels.all}
            <span className={s.chipCount}>{items.length}</span>
          </button>
          {topics.map((t) => (
            <button
              key={t.id}
              type="button"
              className={s.chip}
              aria-pressed={topic === t.id}
              onClick={() => setTopic(topic === t.id ? null : t.id)}
            >
              {t.label}
              <span className={s.chipCount}>{t.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* keyed on the topic so the rows replay their entrance on every change */}
      <div key={topic ?? "all"} aria-live="polite">
        {!shown.length && <p className={s.noMatch}>{labels.noMatch}</p>}

        {years.map((year) => (
          <section key={year} aria-label={year}>
            <div className={s.yearHead}>
              <h3 className={s.yearNum}>{year}</h3>
              <span className={s.yearRule} aria-hidden="true" />
            </div>

            {shown
              .filter((a) => a.date.startsWith(year))
              .map((a, i) => (
                <a
                  key={a.slug}
                  href={a.href}
                  className={s.row}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <time className={s.rowDate} dateTime={a.date}>
                    <span className={s.rowDay}>{a.day}</span>
                    <span className={s.rowMonth}>{a.month}</span>
                  </time>

                  <span className={s.rowMain}>
                    <span className={s.rowMeta}>
                      <span className={s.rowCat}>
                        <GirihStar size={10} strokeWidth={1.6} />
                        {a.categoryLabel}
                      </span>
                      <span className={s.rowDot} aria-hidden="true" />
                      <span>{a.minutes}</span>
                    </span>
                    <span className={s.rowTitle}>{a.title}</span>
                    <span className={s.rowExcerpt}>{a.excerpt}</span>
                  </span>

                  <span className={s.rowArrow} aria-hidden="true">
                    <ArrowMark />
                  </span>
                </a>
              ))}
          </section>
        ))}
      </div>
    </div>
  );
}
