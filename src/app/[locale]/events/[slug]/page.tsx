import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, eventNode, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { getEvents } from "@/content/source";
import { pick, countLabel, formatDate, formatPrice } from "@/content/types";
import PageHero from "@/components/PageHero";
import { GirihField, GirihStar } from "@/components/Girih";
import { ClockMark, PinMark } from "@/components/Icons";
import s from "./EventPage.module.css";
import SectionBackdrop from "@/components/SectionBackdrop";

/* The upcoming/past split is computed from the clock, so this page cannot be
   frozen at build time — revalidate hourly. */
export const revalidate = 3600;

export async function generateStaticParams() {
  const events = await getEvents();
  return locales.flatMap((locale) => events.map((e) => ({ locale, slug: e.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const event = (await getEvents()).find((e) => e.slug === slug);
  if (!event) return {};

  return pageMetadata({
    locale,
    path: `/events/${slug}`,
    title: pick(event.title, locale),
    description: pick(event.excerpt, locale),
  });
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;

  const event = (await getEvents()).find((e) => e.slug === slug);
  if (!event) notFound();

  const t = getDict(locale);
  const host = t.council.members[event.host as keyof typeof t.council.members];
  const isPast = new Date(event.end).getTime() < Date.now();

  const jsonLd = graph(
    eventNode({
      locale,
      path: `/events/${slug}`,
      name: pick(event.title, locale),
      description: pick(event.excerpt, locale),
      start: event.start,
      end: event.end,
      format: event.format,
      venue: pick(event.venue, locale),
      city: pick(event.city, locale),
      price: event.price,
      seats: event.seats,
      hostName: host.name,
    }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.events, path: "/events" },
      { name: pick(event.title, locale), path: `/events/${slug}` },
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
          latticeId={`girih-ev-hero-${slug}`}
          crumbs={[
            { label: t.nav.events, href: paths.events(locale) },
            { label: pick(event.title, locale) },
          ]}
          kicker={`${t.events.formats[event.format]}, ${pick(event.city, locale)}`}
          title={pick(event.title, locale)}
          lede={pick(event.excerpt, locale)}
          meta={[
            formatDate(event.start, locale, true),
            countLabel(event.seats, locale, {
              uz: t.events.seats,
              ru: ["место", "места", "мест"],
            }),
            formatPrice(event.price, locale),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id={`event-${slug}`} placement="right" />
          <div className={`container ${s.grid}`}>
            <div>
              <h2 className={s.sectionTitle}>{t.events.agenda}</h2>
              <ol className={s.agenda}>
                {event.agenda.map((slot, i) => (
                  <li key={`${slot.time}-${i}`} className={s.slot}>
                    <span className={s.slotTime}>{slot.time}</span>
                    <span className={s.slotText}>{pick(slot.text, locale)}</span>
                  </li>
                ))}
              </ol>

              <h2 className={s.sectionTitle}>{t.events.outcomes}</h2>
              <ul className={s.outcomes}>
                {event.outcomes.map((o) => (
                  <li key={pick(o, locale)} className={s.outcome}>
                    <GirihStar size={11} strokeWidth={1.6} />
                    <span>{pick(o, locale)}</span>
                  </li>
                ))}
              </ul>

              <div className={s.audience}>
                <p className={s.audienceLabel}>{t.events.audience}</p>
                <p className={s.audienceValue}>{pick(event.audience, locale)}</p>
              </div>
            </div>

            <aside className={s.rail}>
              <span className={s.railLattice} aria-hidden="true">
                <GirihField id={`girih-rail-${slug}`} tile={104} strokeWidth={0.9} />
              </span>
              <div className={s.railInner}>
                <div className={s.priceBlock}>
                  <span className={s.priceLabel}>{t.events.price}</span>
                  <span className={s.priceValue}>{formatPrice(event.price, locale)}</span>
                </div>

                <div className={s.rows}>
                  <div className={s.row}>
                    <span className={s.rowIcon} aria-hidden="true">
                      <ClockMark />
                    </span>
                    <span>
                      <span className={s.rowLabel}>{t.events.when}</span>
                      <span className={s.rowValue}>
                        <time dateTime={event.start}>
                          {formatDate(event.start, locale, true)}
                        </time>
                      </span>
                    </span>
                  </div>

                  <div className={s.row}>
                    <span className={s.rowIcon} aria-hidden="true">
                      <PinMark />
                    </span>
                    <span>
                      <span className={s.rowLabel}>{t.events.venue}</span>
                      <span className={s.rowValue}>
                        {pick(event.venue, locale)}
                        {/* online events name the city in the venue already */}
                        {!pick(event.venue, locale).includes(pick(event.city, locale)) && (
                          <>
                            <br />
                            {pick(event.city, locale)}
                          </>
                        )}
                      </span>
                    </span>
                  </div>

                  <div className={s.row}>
                    <span className={s.rowIcon} aria-hidden="true">
                      <GirihStar size={20} strokeWidth={1.3} />
                    </span>
                    <span>
                      <span className={s.rowLabel}>{t.events.host}</span>
                      <span className={s.rowValue}>
                        {host.name}
                        <br />
                        {host.role}
                      </span>
                    </span>
                  </div>
                </div>

                {isPast ? (
                  <p className={s.pastNote}>{t.events.past}</p>
                ) : (
                  <>
                    <p className={s.seats}>
                      <span className={s.seatsDot} aria-hidden="true" />
                      {event.seats} {t.events.capacity}
                    </p>
                    <a
                      href={paths.contact(locale)}
                      className={`btn btn--gold btn--wide ${s.railCta}`}
                    >
                      {t.events.register}
                    </a>
                    <p className={s.railNote}>{t.hero.formNote}</p>
                  </>
                )}
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
