import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { aboutNode, breadcrumbs, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { company } from "@/lib/site";
import PageHero from "@/components/PageHero";
import InView from "@/components/InView";
import { GirihField, GirihStar } from "@/components/Girih";
import s from "./About.module.css";
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
    path: "/about",
    title: t.about.metaTitle,
    description: t.about.metaDescription,
    titleAbsolute: true,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);

  const jsonLd = graph(
    aboutNode({ locale, name: t.about.metaTitle, description: t.about.metaDescription }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.about, path: "/about" },
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
          latticeId="girih-about"
          crumbs={[{ label: t.nav.about }]}
          kicker={t.about.hero.kicker}
          title={t.about.hero.title}
          lede={t.about.hero.lede}
          meta={[
            `${company.founded}`,
            t.about.numbers.items[0].value + " " + t.about.numbers.items[0].label,
            company.city,
          ]}
        />

        <section className={s.story} aria-labelledby="story-title">
          <SectionBackdrop id="about-story" placement="right" photo="/img/shahizinda.jpg" />
          <div className={`container ${s.storyGrid}`}>
            <h2 id="story-title" className={s.storyTitle}>
              {t.about.story.title}
            </h2>
            <div className={s.storyBody}>
              {t.about.story.body.map((para) => (
                <p key={para.slice(0, 24)}>{para}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={`${s.principles} grain`} aria-labelledby="principles-title">
          <div className={s.principlesLattice} aria-hidden="true">
            <GirihField id="girih-principles" tile={140} strokeWidth={0.9} />
          </div>
          <div className="container">
            <h2 id="principles-title" className={s.sectionTitle}>
              {t.about.principles.title}
            </h2>
            <ul className={s.principleGrid}>
              {t.about.principles.items.map((item) => (
                <li key={item.name} className={s.principle}>
                  <GirihStar size={17} strokeWidth={1.3} className={s.principleMark} />
                  <h3 className={s.principleName}>{item.name}</h3>
                  <p className={s.principleBody}>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.timeline} aria-labelledby="timeline-title">
          <div className="container">
            <h2 id="timeline-title" className={s.timelineTitle}>
              {t.about.timeline.title}
            </h2>
            {/* Numbered by year because this genuinely is a sequence. */}
            <InView as="ol" className={s.track} threshold={0.15}>
              {t.about.timeline.items.map((item) => (
                <li key={item.year} className={s.entry}>
                  <span className={s.node} aria-hidden="true">
                    <GirihStar size={23} strokeWidth={1.1} fill="currentColor" />
                  </span>
                  <span className={s.year}>{item.year}</span>
                  <span>
                    <h3 className={s.entryName}>{item.name}</h3>
                    <p className={s.entryBody}>{item.body}</p>
                  </span>
                </li>
              ))}
            </InView>
          </div>
        </section>

        <section className={s.close} aria-labelledby="numbers-title">
          <SectionBackdrop id="about-close" placement="left" />
          <div className="container">
            <h2 id="numbers-title" className="kicker">
              {t.about.numbers.title}
            </h2>
            <ul className={s.numbers}>
              {t.about.numbers.items.map((n) => (
                <li key={n.label} className={s.number}>
                  <span className={s.numberValue}>{n.value}</span>
                  <span className={s.numberLabel}>{n.label}</span>
                </li>
              ))}
            </ul>

            <div className={s.pointers}>
              <article className={`${s.pointer} ${s.pointerDark}`}>
                <span className={s.pointerLattice} aria-hidden="true">
                  <GirihField id="girih-about-council" tile={112} strokeWidth={0.9} />
                </span>
                <h3 className={s.pointerTitle}>{t.about.team.title}</h3>
                <p className={s.pointerBody}>{t.about.team.body}</p>
                <a href={paths.council(locale)} className={`btn btn--ghost ${s.pointerCta}`}>
                  {t.about.team.cta}
                </a>
              </article>

              <article className={s.pointer}>
                <h3 className={s.pointerTitle}>{t.about.cta.title}</h3>
                <p className={s.pointerBody}>{t.about.cta.body}</p>
                <a href={paths.contact(locale)} className={`btn ${s.pointerCta}`}>
                  {t.about.cta.button}
                </a>
              </article>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
