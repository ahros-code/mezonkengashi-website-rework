import Prose from "./Prose";
import { GirihField, GirihMedallion, GirihStar } from "./Girih";
import { ArrowMark, ClockMark } from "./Icons";
import { pick, categoryLabel, formatDate, type Article } from "@/content/types";
import type { Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";
import s from "./ArticleView.module.css";
import SectionBackdrop from "./SectionBackdrop";

/** Shared reading layout for a news item or a research piece. */
export default function ArticleView({
  article,
  related,
  locale,
  t,
  listPath,
  listLabel,
  itemPath,
}: {
  article: Article;
  related: Article[];
  locale: Locale;
  t: Dict;
  listPath: string;
  listLabel: string;
  itemPath: (slug: string) => string;
}) {
  const author = t.council.members[article.author as keyof typeof t.council.members];

  return (
    <>
      <article>
        <header className={`${s.head} grain`}>
          <div className={s.headLattice} aria-hidden="true">
            <GirihField id={`girih-art-${article.slug}`} tile={162} strokeWidth={0.9} />
          </div>
          <span className={s.headBloom} aria-hidden="true" />

          <div className="container">
            <nav className={s.crumbs} aria-label={t.ui.breadcrumb}>
              <a href={`/${locale}`} className={s.crumbLink}>
                {t.ui.home}
              </a>
              <span className={s.crumbSep} aria-hidden="true">
                /
              </span>
              <a href={listPath} className={s.crumbLink}>
                {listLabel}
              </a>
              <span className={s.crumbSep} aria-hidden="true">
                /
              </span>
              <span className={s.crumbCurrent} aria-current="page">
                {pick(article.title, locale)}
              </span>
            </nav>

            <p className={s.chip}>
              <GirihStar size={10} strokeWidth={1.6} />
              {pick(categoryLabel[article.category], locale)}
            </p>

            <h1 className={s.title}>{pick(article.title, locale)}</h1>
            <p className={s.excerpt} data-speakable>{pick(article.excerpt, locale)}</p>

            <div className={s.byline}>
              <span className={s.bylineMed}>
                <GirihMedallion seed={article.author} scope="byline" />
              </span>
              <span>
                <span className={s.bylineName}>{author.name}</span>
                <span className={s.bylineRole}>{author.role}</span>
              </span>
              <span className={s.bylineMeta}>
                <span>
                  <GirihStar size={11} strokeWidth={1.5} />
                  <time dateTime={article.date}>{formatDate(article.date, locale)}</time>
                </span>
                <span>
                  <ClockMark />
                  {article.readingMinutes} {t.ui.minRead}
                </span>
              </span>
            </div>
          </div>
        </header>

        <section className={s.bodySection}>
          <SectionBackdrop id={`art-${article.slug}`} placement="right" />
          <div className={`container ${s.bodyGrid}`}>
            <Prose blocks={article.body} locale={locale} latticeId={`pq-${article.slug}`} />

            <aside className={s.aside}>
              <p className={s.asideLabel}>{listLabel}</p>
              <a href={listPath} className={s.asideBack}>
                <ArrowMark />
                {t.ui.backToList}
              </a>
            </aside>
          </div>
        </section>
      </article>

      {related.length > 0 && (
        <section className={s.related} aria-labelledby="related-title">
          <div className="container">
            <h2 id="related-title" className={s.relatedTitle}>
              {t.ui.related}
            </h2>
            <div className={s.relatedGrid}>
              {related.map((r) => (
                <a key={r.slug} href={itemPath(r.slug)} className={s.relatedCard}>
                  <span className={s.relatedMeta}>
                    <GirihStar size={10} strokeWidth={1.6} />
                    {pick(categoryLabel[r.category], locale)}
                    <time dateTime={r.date}>{formatDate(r.date, locale)}</time>
                  </span>
                  <h3 className={s.relatedName}>{pick(r.title, locale)}</h3>
                  <p className={s.relatedExcerpt}>{pick(r.excerpt, locale)}</p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
