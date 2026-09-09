import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, faqNode, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { countLabel } from "@/content/types";
import { getFaqCategories, getPageCopy } from "@/content/source";
import PageHero from "@/components/PageHero";
import { GirihField, GirihStar } from "@/components/Girih";
import s from "./FaqPage.module.css";
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
  const copy = await getPageCopy("faqPage", locale, t.faqPage);
  return pageMetadata({
    locale,
    path: "/faq",
    title: copy.metaTitle,
    description: copy.metaDescription,
    titleAbsolute: true,
  });
}

export default async function FaqRoute({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const copy = await getPageCopy("faqPage", locale, t.faqPage);
  const categories = await getFaqCategories(locale, t.faqPage.categories);

  const all = categories.flatMap((c) => c.items);

  const jsonLd = graph(
    faqNode(locale, "/faq", all),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.faq, path: "/faq" },
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
          latticeId="girih-faq"
          crumbs={[{ label: t.nav.faq }]}
          kicker={copy.kicker}
          title={copy.title}
          lede={copy.lede}
          meta={[
            countLabel(all.length, locale, {
              uz: "savol",
              ru: ["вопрос", "вопроса", "вопросов"],
            }),
            countLabel(categories.length, locale, {
              uz: "boʻlim",
              ru: ["раздел", "раздела", "разделов"],
            }),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id="faq-page" placement="left" photo="/img/panjara.jpg" />
          <div className={`container ${s.grid}`}>
            <nav className={s.index} aria-label={copy.title}>
              {categories.map((c) => (
                <a key={c.id} href={`#${c.id}`} className={s.indexLink}>
                  <GirihStar size={11} strokeWidth={1.6} />
                  <span>
                    {c.name} <span className={s.indexCount}>{c.items.length}</span>
                  </span>
                </a>
              ))}
            </nav>

            <div className={s.cats}>
              {categories.map((c) => (
                <section key={c.id} id={c.id} className={s.cat} aria-labelledby={`${c.id}-h`}>
                  <div className={s.catHead}>
                    <h2 id={`${c.id}-h`} className={s.catName}>
                      {c.name}
                    </h2>
                    <span className={s.catRule} aria-hidden="true" />
                  </div>

                  {c.items.map((item) => (
                    <details key={item.q} className={s.item} name={`faq-${c.id}`}>
                      <summary className={s.q}>
                        {item.q}
                        <GirihStar size={16} strokeWidth={1.3} className={s.marker} />
                      </summary>
                      <p className={s.a}>{item.a}</p>
                    </details>
                  ))}
                </section>
              ))}

              <aside className={s.still}>
                <span className={s.stillLattice} aria-hidden="true">
                  <GirihField id="girih-faq-still" tile={116} strokeWidth={0.9} />
                </span>
                <h2 className={s.stillTitle}>{copy.stillTitle}</h2>
                <p className={s.stillBody}>{copy.stillBody}</p>
                <a href={paths.contact(locale)} className={`btn btn--gold ${s.stillCta}`}>
                  {copy.stillCta}
                </a>
              </aside>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
