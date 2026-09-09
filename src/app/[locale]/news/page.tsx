import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, collectionPage, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { getNews, getPageCopy } from "@/content/source";
import { byNewestFirst, categoryLabel, countLabel, dayInTashkent, formatDate } from "@/content/types";
import PageHero from "@/components/PageHero";
import { GirihStar } from "@/components/Girih";
import { ArrowMark } from "@/components/Icons";
import s from "./News.module.css";
import SectionBackdrop from "@/components/SectionBackdrop";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  const copy = await getPageCopy("newsPage", locale, t.news);
  return pageMetadata({
    locale,
    path: "/news",
    title: copy.metaTitle,
    description: copy.metaDescription,
    titleAbsolute: true,
  });
}

export default async function NewsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const copy = await getPageCopy("newsPage", locale, t.news);

  const sorted = [...(await getNews())].sort(byNewestFirst);
  const [lead, ...rest] = sorted;

  /* group the archive by year, newest first */
  const years = [...new Set(rest.map((a) => a.date.slice(0, 4)))];

  const monthShort = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    month: "short",
    timeZone: "Asia/Tashkent",
  });

  const jsonLd = graph(
    collectionPage({
      locale,
      path: "/news",
      name: copy.metaTitle,
      description: copy.metaDescription,
      items: sorted.map((a) => ({ name: a.title[locale], path: `/news/${a.slug}` })),
    }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.news, path: "/news" },
    ]),
  );

  const leadDate = lead ? new Date(lead.date) : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main">
        <PageHero
          locale={locale}
          t={t}
          latticeId="girih-news"
          crumbs={[{ label: t.nav.news }]}
          kicker={copy.kicker}
          title={copy.title}
          lede={copy.lede}
          meta={[
            countLabel(sorted.length, locale, {
              uz: "xabar",
              ru: ["публикация", "публикации", "публикаций"],
            }),
            ...(lead ? [formatDate(lead.date, locale)] : []),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id="news-body" placement="left" />
          <div className="container">
            {!lead && <p className={s.empty}>{t.ui.empty}</p>}

            {lead && leadDate && (
            <article className={s.lead}>
              <span className={s.plate} aria-hidden="true">
                <GirihStar size={112} strokeWidth={1} className={s.plateStar} />
                <span className={s.plateInner}>
                  <span className={s.plateDay}>{dayInTashkent(lead.date)}</span>
                  <span className={s.plateMonth}>{monthShort.format(leadDate)}</span>
                  <span className={s.plateYear}>{lead.date.slice(0, 4)}</span>
                </span>
              </span>

              <a href={paths.newsItem(locale, lead.slug)} className={`${s.leadBody} ${s.leadLink}`}>
                <span className={s.leadLabel}>
                  <GirihStar size={11} strokeWidth={1.6} />
                  {copy.latest}
                </span>
                <h2 className={s.leadTitle}>{lead.title[locale]}</h2>
                <p className={s.leadExcerpt}>{lead.excerpt[locale]}</p>
                <span className={s.leadCta}>
                  {t.ui.readMore}
                  <ArrowMark />
                </span>
              </a>
            </article>
            )}

            {years.map((year) => (
              <section key={year} aria-label={year}>
                <div className={s.yearHead}>
                  <h2 className={s.yearNum}>{year}</h2>
                  <span className={s.yearRule} aria-hidden="true" />
                </div>

                {rest
                  .filter((a) => a.date.startsWith(year))
                  .map((a) => (
                    <a key={a.slug} href={paths.newsItem(locale, a.slug)} className={s.row}>
                      <span className={s.rowMeta}>
                        <time className={s.rowDate} dateTime={a.date}>
                          {formatDate(a.date, locale)}
                        </time>
                        <span className={s.rowCat}>
                          <GirihStar size={10} strokeWidth={1.6} />
                          {categoryLabel[a.category][locale]}
                        </span>
                      </span>

                      <span>
                        <h3 className={s.rowTitle}>{a.title[locale]}</h3>
                        <p className={s.rowExcerpt}>{a.excerpt[locale]}</p>
                      </span>

                      <span className={s.rowArrow} aria-hidden="true">
                        <ArrowMark />
                      </span>
                    </a>
                  ))}
              </section>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
