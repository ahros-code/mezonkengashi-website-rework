import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, collectionPage, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { research } from "@/content/research";
import { byNewestFirst, categoryLabel, countLabel, formatDate } from "@/content/types";
import PageHero from "@/components/PageHero";
import { GirihField, GirihMedallion, GirihStar } from "@/components/Girih";
import { ArrowMark, ClockMark } from "@/components/Icons";
import s from "./Research.module.css";
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
  return pageMetadata({
    locale,
    path: "/research",
    title: t.research.metaTitle,
    description: t.research.metaDescription,
    titleAbsolute: true,
  });
}

export default async function ResearchIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const sorted = [...research].sort(byNewestFirst);
  const [featured, ...rest] = sorted;

  const jsonLd = graph(
    collectionPage({
      locale,
      path: "/research",
      name: t.research.metaTitle,
      description: t.research.metaDescription,
      items: sorted.map((a) => ({
        name: a.title[locale],
        path: `/research/${a.slug}`,
      })),
    }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.research, path: "/research" },
    ]),
  );

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
          latticeId="girih-research"
          crumbs={[{ label: t.nav.research }]}
          kicker={t.research.kicker}
          title={t.research.title}
          lede={t.research.lede}
          meta={[
            countLabel(sorted.length, locale, {
              uz: "material",
              ru: ["материал", "материала", "материалов"],
            }),
            formatDate(featured.date, locale),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id="research-body" placement="right" />
          <div className="container">
            <a href={paths.researchItem(locale, featured.slug)} className={s.feature}>
              <span className={s.featureLattice} aria-hidden="true">
                <GirihField id="girih-research-feature" tile={124} strokeWidth={0.9} />
              </span>

              <div>
                <span className={s.featureLabel}>
                  <GirihStar size={11} strokeWidth={1.6} />
                  {t.research.featured}
                </span>
                <h2 className={s.featureTitle}>{featured.title[locale]}</h2>
                <p className={s.featureExcerpt}>{featured.excerpt[locale]}</p>
                <span className={s.featureCta}>
                  {t.ui.readMore}
                  <ArrowMark />
                </span>
              </div>

              <p className={s.featureMeta}>
                <span>
                  <GirihStar size={11} strokeWidth={1.5} />
                  {categoryLabel[featured.category][locale]}
                </span>
                <span>
                  <time dateTime={featured.date}>{formatDate(featured.date, locale)}</time>
                </span>
                <span>
                  <ClockMark />
                  {featured.readingMinutes} {t.ui.minRead}
                </span>
              </p>
            </a>

            <div className={s.listHead}>
              <h2 className={s.listTitle}>{t.research.all}</h2>
              <span className={s.listRule} aria-hidden="true" />
            </div>

            <div className={s.grid}>
              {rest.map((a) => {
                const author = t.council.members[a.author as keyof typeof t.council.members];
                return (
                  <a
                    key={a.slug}
                    href={paths.researchItem(locale, a.slug)}
                    className={s.card}
                  >
                    <span className={s.cardTop}>
                      <span className={s.cardCat}>
                        <GirihStar size={10} strokeWidth={1.6} />
                        {categoryLabel[a.category][locale]}
                      </span>
                      <span className={s.cardDot} aria-hidden="true" />
                      <time dateTime={a.date}>{formatDate(a.date, locale)}</time>
                    </span>

                    <h3 className={s.cardTitle}>{a.title[locale]}</h3>
                    <p className={s.cardExcerpt}>{a.excerpt[locale]}</p>

                    <span className={s.cardFoot}>
                      <span className={s.cardAuthorMed}>
                        <GirihMedallion seed={a.author} scope="card" />
                      </span>
                      {author.name}
                      <span className={s.cardDot} aria-hidden="true" />
                      {a.readingMinutes} {t.ui.minRead}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
