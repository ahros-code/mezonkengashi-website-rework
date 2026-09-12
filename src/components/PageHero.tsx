import { GirihField, GirihStar } from "./Girih";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import { paths } from "@/lib/routes";
import s from "./PageHero.module.css";

export type Crumb = { label: string; href?: string };

/**
 * Shared header for every sub-page: the same lapis band and lattice as the home
 * hero, at a quarter of its height, so the pages read as one site.
 */
export default function PageHero({
  locale,
  t,
  crumbs,
  kicker,
  title,
  lede,
  meta,
  latticeId,
}: {
  locale: Locale;
  t: Dict;
  crumbs: Crumb[];
  kicker: string;
  title: string;
  lede?: string;
  /** Short facts shown on the base rule — counts, dates, reading time. */
  meta?: string[];
  latticeId: string;
}) {
  const trail: Crumb[] = [{ label: t.ui.home, href: paths.home(locale) }, ...crumbs];

  return (
    <section className={`${s.hero} grain`}>
      <div className={s.lattice} aria-hidden="true">
        <GirihField id={latticeId} tile={168} strokeWidth={0.9} />
      </div>
      <span className={s.bloom} aria-hidden="true" />

      <div className="container">
        <nav className={s.crumbs} aria-label={t.ui.breadcrumb}>
          {trail.map((c, i) => (
            <span key={c.label} className={s.crumb}>
              {i > 0 && (
                <span className={s.crumbSep} aria-hidden="true">
                  /{" "}
                </span>
              )}
              {c.href ? (
                <a href={c.href} className={s.crumb}>
                  {c.label}
                </a>
              ) : (
                <span className={s.crumbCurrent} aria-current="page">
                  {c.label}
                </span>
              )}
            </span>
          ))}
        </nav>

        <div className={s.inner}>
          <div>
            <p className={s.kicker}>{kicker}</p>
            <h1 className={s.title}>{title}</h1>
          </div>
          {lede && (
            <p className={s.lede} data-speakable>
              {lede}
            </p>
          )}
        </div>

        {meta && meta.length > 0 && (
          <p className={s.foot}>
            {meta.map((m) => (
              <span key={m} className={s.footItem}>
                <GirihStar size={11} strokeWidth={1.4} />
                {m}
              </span>
            ))}
          </p>
        )}
      </div>
    </section>
  );
}
