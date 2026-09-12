"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { GirihField, GirihStar } from "./Girih";
import { useSpecular } from "@/lib/useSpecular";
import { paths } from "@/lib/routes";
import { company } from "@/lib/site";
import { readTrail, requestResume, type TrailEntry } from "@/lib/trail";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { pick, script, type L } from "@/content/types";
import s from "./NotFound.module.css";

export type SectionId = keyof Dict["notFound"]["sections"];

export type NotFoundCopy = Dict["notFound"] & {
  labels: Record<SectionId, string>;
};

/** A page that exists, as a candidate for "did you mean". Path has no locale. */
export type KnownPage = { path: string; title: L };

const SECTIONS: SectionId[] = [
  "services",
  "council",
  "about",
  "research",
  "news",
  "events",
  "faq",
  "contact",
];

/* ------------------------------------------------------------------------- */

function levenshtein(a: string, b: string) {
  if (a === b) return 0;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    prev = cur;
  }
  return prev[b.length];
}

function similarity(a: string, b: string) {
  const len = Math.max(a.length, b.length);
  return len ? 1 - levenshtein(a, b) / len : 1;
}

/**
 * Best guess at what a mistyped path meant: a near-miss on a known page, or
 * failing that the section the path was clearly inside.
 */
function guess(rest: string, known: KnownPage[]): KnownPage | null {
  const want = rest.toLowerCase().replace(/\/+$/, "");
  if (!want) return null;

  let best: KnownPage | null = null;
  let score = 0;
  for (const page of known) {
    const v = similarity(want, page.path);
    if (v > score) [best, score] = [page, v];
  }
  if (best && score >= 0.6) return best;

  const head = `/${want.split("/")[1] ?? ""}`;
  const sections = known.filter((p) => p.path.split("/").length === 2);
  let section: KnownPage | null = null;
  let sScore = 0;
  for (const page of sections) {
    const v = similarity(head, page.path);
    if (v > sScore) [section, sScore] = [page, v];
  }
  return section && sScore >= 0.6 ? section : null;
}

function safeDecode(v: string) {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

/* Browsers ship Russian relative-time data but often not Uzbek, where Intl
   silently answers in English — so Uzbek is spelled out here. */
const UZ_UNITS: Partial<Record<Intl.RelativeTimeFormatUnit, string>> = {
  minute: "daqiqa",
  hour: "soat",
  day: "kun",
  week: "hafta",
  month: "oy",
  year: "yil",
};

function ago(at: number, locale: Locale) {
  const sec = Math.max(0, Math.round((Date.now() - at) / 1000));
  if (sec < 60) return locale === "ru" ? "только что" : script("hozirgina", locale);

  const steps: [Intl.RelativeTimeFormatUnit, number][] = [
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
    ["week", 4.35],
    ["month", 12],
    ["year", Infinity],
  ];
  let v = sec / 60;
  for (const [unit, size] of steps) {
    if (v < size) {
      const n = Math.max(1, Math.round(v));
      return locale === "ru"
        ? new Intl.RelativeTimeFormat("ru", { numeric: "auto" }).format(-n, unit)
        : script(`${n} ${UZ_UNITS[unit]} oldin`, locale);
    }
    v /= size;
  }
  return "";
}

/* ------------------------------------------------------------------------- */

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 8h10M9 4l4 4-4 4" />
    </svg>
  );
}

/** The zero of the 404, drawn as a khatam seal on a scale ring. */
function Seal() {
  const ticks = Array.from({ length: 48 }, (_, i) => i);
  return (
    <svg className={s.seal} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id="nf-seal" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#17629c" />
          <stop offset="60%" stopColor="#003a64" />
          <stop offset="100%" stopColor="#00223d" />
        </radialGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="url(#nf-seal)" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.6" />
      <g className={s.sealTicks} stroke="rgba(248,183,0,0.7)" strokeLinecap="round">
        {ticks.map((i) => {
          const a = (i * 7.5 * Math.PI) / 180;
          const major = i % 6 === 0;
          const r1 = 84;
          const r2 = major ? 72 : 78;
          return (
            <line
              key={i}
              x1={(100 + r1 * Math.cos(a)).toFixed(3)}
              y1={(100 + r1 * Math.sin(a)).toFixed(3)}
              x2={(100 + r2 * Math.cos(a)).toFixed(3)}
              y2={(100 + r2 * Math.sin(a)).toFixed(3)}
              strokeWidth={major ? 1.6 : 0.8}
              opacity={major ? 1 : 0.6}
            />
          );
        })}
      </g>
      <g className={s.sealStar}>
        <g transform="translate(34 34)">
          <GirihStar size={132} strokeWidth={1.2} stroke="rgba(248,183,0,0.85)" />
        </g>
      </g>
      <circle cx="100" cy="100" r="34" fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
      <g transform="translate(78 78)">
        <GirihStar size={44} strokeWidth={1.2} stroke="#f8b700" fill="rgba(248,183,0,0.22)" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------------- */

export default function NotFoundView({
  copy,
  known,
}: {
  copy: Record<Locale, NotFoundCopy>;
  known: KnownPage[];
}) {
  const pathname = usePathname() ?? "/";
  const first = pathname.split("/")[1] ?? "";
  const locale: Locale = isLocale(first) ? first : defaultLocale;
  const t = copy[locale];
  const rest = isLocale(first) ? pathname.slice(first.length + 1) : pathname;

  const requested = safeDecode(pathname);
  const suggestion = useMemo(() => guess(rest, known), [rest, known]);

  /* Storage and history only exist in the browser, so both land after mount. */
  const [trail, setTrail] = useState<TrailEntry[] | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setTrail(readTrail().filter((e) => e.path !== pathname));
    const ref = document.referrer;
    setCanGoBack(window.history.length > 1 && ref.startsWith(window.location.origin));
  }, [pathname]);

  const spec = useSpecular<HTMLElement>();
  const onMove = spec.onPointerMove as unknown as React.PointerEventHandler<HTMLElement>;

  const [last, ...recent] = trail ?? [];

  return (
    <main id="main" className={`${s.page} grain`} data-not-found lang={locale}>
      <div className={s.backdrop} aria-hidden="true">
        <span className={s.photo}>
          <Image src="/img/registan-night.jpg" alt="" fill sizes="100vw" quality={50} priority />
        </span>
        <span className={s.wash} />
        <span className={s.lattice}>
          <GirihField id="girih-404" tile={150} strokeWidth={0.9} />
        </span>
        <span className={s.bloom} />
        <span className={s.arch} />
      </div>

      <div className="container">
        <section className={s.top} aria-labelledby="nf-title">
          <div className={s.lead}>
            <p className={s.code}>
              <span className={s.codeDot} aria-hidden="true" />
              {t.code}
            </p>

            <p className={s.digits} aria-hidden="true">
              <span className={s.digit}>4</span>
              <Seal />
              <span className={`${s.digit} ${s.digitLate}`}>4</span>
            </p>

            <h1 className={s.title} id="nf-title">
              {t.title}
            </h1>
            <p className={s.lede}>{t.lede}</p>

            <p className={s.requested}>
              <span className={s.requestedLabel}>{t.requested}</span>
              <code className={s.requestedPath}>{requested}</code>
            </p>

            {suggestion && (
              <a href={`/${locale}${suggestion.path}`} className={s.suggest}>
                <GirihStar size={14} strokeWidth={1.4} />
                <span>
                  {t.suggestLabel}:{" "}
                  <strong className={s.suggestTitle}>{pick(suggestion.title, locale)}</strong>
                </span>
                <Arrow className={s.suggestArrow} />
              </a>
            )}

            <div className={s.actions}>
              <a href={paths.home(locale)} className="btn btn--gold">
                {t.home}
              </a>
              {canGoBack && (
                <button type="button" className="btn btn--ghost" onClick={() => history.back()}>
                  {t.back}
                </button>
              )}
            </div>
          </div>

          {/* ---- where the reader left off ---- */}
          <aside
            className={`${s.resume} glass`}
            onPointerMove={onMove}
            aria-live="polite"
            aria-busy={trail === null}
          >
            {trail === null ? (
              <div className={s.skeleton} aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
            ) : last ? (
              <>
                <p className={s.cardLabel}>
                  <span className={s.pulse} aria-hidden="true" />
                  {t.resumeLabel}
                  <span className={s.cardTime}>{ago(last.at, locale)}</span>
                </p>
                <p className={s.resumeTitle}>{last.title}</p>
                <p className={s.resumePath}>{safeDecode(last.path)}</p>

                <div className={s.progress}>
                  <span className={s.progressTrack}>
                    <span
                      className={s.progressFill}
                      style={{ transform: `scaleX(${Math.max(0.03, last.read)})` }}
                    />
                  </span>
                  <span className={s.progressText}>
                    {Math.round(last.read * 100)}% {t.progress}
                  </span>
                </div>

                <a
                  href={last.path}
                  className={`btn btn--gold btn--wide ${s.resumeCta}`}
                  onClick={() => requestResume(last.path, last.y)}
                >
                  {t.resumeCta}
                  <Arrow />
                </a>

                {recent.length > 0 && (
                  <div className={s.recent}>
                    <p className={s.recentLabel}>{t.recentLabel}</p>
                    <ul className={s.recentList}>
                      {recent.slice(0, 3).map((e) => (
                        <li key={e.path}>
                          <a
                            href={e.path}
                            className={s.recentLink}
                            onClick={() => requestResume(e.path, e.y)}
                          >
                            <GirihStar size={11} strokeWidth={1.4} />
                            <span className={s.recentTitle}>{e.title}</span>
                            <span className={s.recentTime}>{ago(e.at, locale)}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className={s.cardLabel}>
                  <span className={s.pulse} aria-hidden="true" />
                  {t.startLabel}
                </p>
                <p className={s.resumeTitle}>{t.startTitle}</p>
                <p className={s.startBody}>{t.startBody}</p>
                <a href={paths.contact(locale)} className={`btn btn--gold btn--wide ${s.resumeCta}`}>
                  {t.startCta}
                  <Arrow />
                </a>
              </>
            )}
          </aside>
        </section>

        {/* ---- every section, one step away ---- */}
        <section className={s.sections} aria-labelledby="nf-sections">
          <h2 className={s.sectionsLabel} id="nf-sections">
            {t.sectionsLabel}
          </h2>
          <ul className={s.grid}>
            {SECTIONS.map((id, i) => (
              <li key={id} style={{ animationDelay: `${0.9 + i * 0.05}s` }} className={s.cell}>
                <a href={paths[id](locale)} className={`${s.tile} glass`} onPointerMove={onMove}>
                  <span className={s.tileIndex}>{String(i + 1).padStart(2, "0")}</span>
                  <Arrow className={s.tileArrow} />
                  <span className={s.tileName}>{t.labels[id]}</span>
                  <span className={s.tileBlurb}>{t.sections[id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className={s.help}>
          <p className={s.helpText}>{t.help}</p>
          <div className={s.helpLinks}>
            <a
              href={company.telegram}
              className={s.helpLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
            <a href={`tel:${company.phoneHref}`} className={s.helpLink}>
              {company.phone}
            </a>
            <a href={`mailto:${company.email}`} className={s.helpLink}>
              {company.email}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
