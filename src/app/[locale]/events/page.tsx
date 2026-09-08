import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, collectionPage, eventNode, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { events } from "@/content/events";
import { countLabel, dayInTashkent, formatDate, formatPrice } from "@/content/types";
import PageHero from "@/components/PageHero";
import { GirihField, GirihStar } from "@/components/Girih";
import { ArrowMark } from "@/components/Icons";
import s from "./Events.module.css";
import SectionBackdrop from "@/components/SectionBackdrop";

/* The upcoming/past split is computed from the clock, so this page cannot be
   frozen at build time — revalidate hourly. */
export const revalidate = 3600;

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
    path: "/events",
    title: t.events.metaTitle,
    description: t.events.metaDescription,
    titleAbsolute: true,
  });
}

export default async function EventsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const now = Date.now();
  const upcoming = events
    .filter((e) => new Date(e.end).getTime() >= now)
    .sort((a, b) => a.start.localeCompare(b.start));
  const past = events
    .filter((e) => new Date(e.end).getTime() < now)
    .sort((a, b) => b.start.localeCompare(a.start));

  const monthShort = new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "uz-UZ", {
    month: "short",
    timeZone: "Asia/Tashkent",
  });

  const jsonLd = graph(
    collectionPage({
      locale,
      path: "/events",
      name: t.events.metaTitle,
      description: t.events.metaDescription,
      items: [...upcoming, ...past].map((e) => ({
        name: e.title[locale],
        path: `/events/${e.slug}`,
      })),
    }),
    ...upcoming.map((e) =>
      eventNode({
        locale,
        path: `/events/${e.slug}`,
        name: e.title[locale],
        description: e.excerpt[locale],
        start: e.start,
        end: e.end,
        format: e.format,
        venue: e.venue[locale],
        city: e.city[locale],
        price: e.price,
        seats: e.seats,
        hostName: t.council.members[e.host as keyof typeof t.council.members].name,
      }),
    ),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.events, path: "/events" },
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
          latticeId="girih-events"
          crumbs={[{ label: t.nav.events }]}
          kicker={t.events.kicker}
          title={t.events.title}
          lede={t.events.lede}
          meta={[
            countLabel(upcoming.length, locale, {
              uz: "yaqin tadbir",
              ru: ["ближайшее", "ближайших", "ближайших"],
            }),
            countLabel(past.length, locale, {
              uz: "oʻtgan tadbir",
              ru: ["прошедшее", "прошедших", "прошедших"],
            }),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id="events-body" placement="right" />
          <div className="container">
            <div className={s.head}>
              <h2 className={s.headTitle}>{t.events.upcoming}</h2>
              <span className={s.headRule} aria-hidden="true" />
              <span className={s.headCount}>{upcoming.length}</span>
            </div>

            {upcoming.length === 0 ? (
              <p className={s.empty}>{t.events.noUpcoming}</p>
            ) : (
              <div className={s.upcoming}>
                {upcoming.map((e) => {
                  const d = new Date(e.start);
                  const host = t.council.members[e.host as keyof typeof t.council.members];
                  return (
                    <article key={e.slug} className={s.card}>
                      <span className={s.cardLattice} aria-hidden="true">
                        <GirihField id={`girih-ev-${e.slug}`} tile={110} strokeWidth={0.9} />
                      </span>

                      <span className={s.plate} aria-hidden="true">
                        <GirihStar size={136} strokeWidth={1} className={s.plateStar} />
                        <span className={s.plateInner}>
                          <span className={s.plateDay}>{dayInTashkent(e.start)}</span>
                          <span className={s.plateMonth}>{monthShort.format(d)}</span>
                          <span className={s.plateYear}>{e.start.slice(0, 4)}</span>
                        </span>
                      </span>

                      <div className={s.cardMain}>
                        <span className={s.cardTop}>
                          <span className={s.tag}>
                            <GirihStar size={9} strokeWidth={1.8} />
                            {t.events.formats[e.format]}
                          </span>
                          {e.price === 0 && (
                            <span className={`${s.tag} ${s.tagFree}`}>
                              {formatPrice(0, locale)}
                            </span>
                          )}
                          <span>{e.city[locale]}</span>
                        </span>

                        <h3 className={s.cardTitle}>
                          <a href={paths.eventItem(locale, e.slug)}>{e.title[locale]}</a>
                        </h3>
                        <p className={s.cardExcerpt}>{e.excerpt[locale]}</p>
                      </div>

                      <div className={s.facts}>
                        <span className={s.fact}>
                          <span className={s.factLabel}>{t.events.when}</span>
                          <span className={s.factValue}>
                            <time dateTime={e.start}>{formatDate(e.start, locale, true)}</time>
                          </span>
                        </span>
                        <span className={s.fact}>
                          <span className={s.factLabel}>{t.events.host}</span>
                          <span className={s.factValue}>{host.name}</span>
                        </span>
                        <span className={s.fact}>
                          <span className={s.factLabel}>{t.events.price}</span>
                          <span className={s.factPrice}>{formatPrice(e.price, locale)}</span>
                        </span>
                        <a
                          href={paths.eventItem(locale, e.slug)}
                          className={`btn btn--gold ${s.cardCta}`}
                        >
                          {t.events.register}
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {past.length > 0 && (
              <div className={s.past}>
                <div className={s.head}>
                  <h2 className={s.headTitle}>{t.events.past}</h2>
                  <span className={s.headRule} aria-hidden="true" />
                  <span className={s.headCount}>{past.length}</span>
                </div>

                {past.map((e) => (
                  <a key={e.slug} href={paths.eventItem(locale, e.slug)} className={s.pastRow}>
                    <span className={s.pastMeta}>
                      <time className={s.pastDate} dateTime={e.start}>
                        {formatDate(e.start, locale)}
                      </time>
                      <span className={s.pastFormat}>
                        <GirihStar size={10} strokeWidth={1.6} />
                        {t.events.formats[e.format]}
                      </span>
                    </span>

                    <span>
                      <h3 className={s.pastTitle}>{e.title[locale]}</h3>
                      <p className={s.pastExcerpt}>{e.excerpt[locale]}</p>
                    </span>

                    <span className={s.pastArrow} aria-hidden="true">
                      <ArrowMark />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
