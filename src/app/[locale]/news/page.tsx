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
import { GirihField, GirihMedallion, GirihStar } from "@/components/Girih";
import { ArrowMark } from "@/components/Icons";
import SectionBackdrop from "@/components/SectionBackdrop";
import { company } from "@/lib/site";
import NewsArchive, { type ArchiveItem } from "./NewsArchive";
import s from "./News.module.css";

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
  /* the two stories that sit beside the lead on the front block */
  const side = rest.slice(0, 2);

  const monthShort = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    month: "short",
    timeZone: "Asia/Tashkent",
  });
  const month = (iso: string) => monthShort.format(new Date(iso)).replace(".", "");
  const minutes = (n: number) => `${n} ${t.ui.minRead}`;

  const archive: ArchiveItem[] = sorted.map((a) => ({
    slug: a.slug,
    href: paths.newsItem(locale, a.slug),
    date: a.date,
    day: dayInTashkent(a.date),
    month: month(a.date),
    category: a.category,
    categoryLabel: categoryLabel[a.category][locale],
    title: a.title[locale],
    excerpt: a.excerpt[locale],
    minutes: minutes(a.readingMinutes),
  }));

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

  const byline = lead
    ? t.council.members[lead.author as keyof typeof t.council.members]
    : null;

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

            {lead && (
              <div className={s.front}>
                {/* ---- lead story ---- */}
                <a href={paths.newsItem(locale, lead.slug)} className={s.lead}>
                  <span className={s.leadLattice} aria-hidden="true">
                    <GirihField id="girih-news-lead" tile={132} strokeWidth={0.9} />
                  </span>

                  <span className={s.leadTop}>
                    <span className={s.plate} aria-hidden="true">
                      <GirihStar size={104} strokeWidth={1} className={s.plateStar} />
                      <span className={s.plateInner}>
                        <span className={s.plateDay}>{dayInTashkent(lead.date)}</span>
                        <span className={s.plateMonth}>{month(lead.date)}</span>
                        <span className={s.plateYear}>{lead.date.slice(0, 4)}</span>
                      </span>
                    </span>
                    <span className={s.leadTags}>
                      <span className={s.leadLabel}>
                        <span className={s.leadPulse} aria-hidden="true" />
                        {copy.latest}
                      </span>
                      <span className={s.leadCat}>{categoryLabel[lead.category][locale]}</span>
                      <span className={s.leadMin}>{minutes(lead.readingMinutes)}</span>
                    </span>
                  </span>

                  <span className={s.leadBody}>
                    <h2 className={s.leadTitle}>{lead.title[locale]}</h2>
                    <p className={s.leadExcerpt}>{lead.excerpt[locale]}</p>
                  </span>

                  <span className={s.leadFoot}>
                    {byline && (
                      <span className={s.byline}>
                        <span className={s.bylineMed}>
                          <GirihMedallion seed={lead.author} scope="news-lead" />
                        </span>
                        <span>
                          <span className={s.bylineName}>{byline.name}</span>
                          <span className={s.bylineRole}>{byline.role}</span>
                        </span>
                      </span>
                    )}
                    <span className={s.leadCta}>
                      {t.ui.readMore}
                      <ArrowMark />
                    </span>
                  </span>
                </a>

                {/* ---- the next two, stacked beside it ---- */}
                {side.length > 0 && (
                  <div className={s.side}>
                    <p className={s.sideLabel}>{copy.alsoLatest}</p>
                    {side.map((a) => (
                      <a key={a.slug} href={paths.newsItem(locale, a.slug)} className={s.sideCard}>
                        <span className={s.sideMeta}>
                          <span className={s.rowCat}>
                            <GirihStar size={10} strokeWidth={1.6} />
                            {categoryLabel[a.category][locale]}
                          </span>
                          <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
                        </span>
                        <span className={s.sideTitle}>{a.title[locale]}</span>
                        <span className={s.sideExcerpt}>{a.excerpt[locale]}</span>
                        <span className={s.sideFoot}>
                          {minutes(a.readingMinutes)}
                          <ArrowMark />
                        </span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className={s.layout}>
              <NewsArchive
                items={archive}
                featured={1 + side.length}
                labels={{
                  archive: copy.archive,
                  filterLabel: copy.filterLabel,
                  all: copy.all,
                  noMatch: copy.noMatch,
                }}
              />

              <aside className={s.aside}>
                <div className={s.subscribe}>
                  <span className={s.subscribeLattice} aria-hidden="true">
                    <GirihField id="girih-news-sub" tile={110} strokeWidth={0.9} />
                  </span>
                  <GirihStar size={22} strokeWidth={1.2} className={s.subscribeMark} />
                  <h2 className={s.subscribeTitle}>{copy.subscribeTitle}</h2>
                  <p className={s.subscribeBody}>{copy.subscribeBody}</p>
                  <a
                    href={company.telegram}
                    className="btn btn--gold btn--wide"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {copy.subscribeCta}
                  </a>
                </div>

                <div className={s.press}>
                  <h2 className={s.pressTitle}>{copy.pressTitle}</h2>
                  <p className={s.pressBody}>{copy.pressBody}</p>
                  <a href={`mailto:${company.email}`} className={s.pressLink}>
                    {company.email}
                    <ArrowMark />
                  </a>
                  <a href={`tel:${company.phoneHref}`} className={s.pressLink}>
                    {company.phone}
                    <ArrowMark />
                  </a>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
