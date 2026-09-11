import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { buildJsonLd } from "@/lib/jsonld";
import { getFaqCategories, getRegistry } from "@/content/source";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Clients from "@/components/Clients";
import Council from "@/components/Council";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";

/* Certificate statuses are date-driven; an hourly refresh flips expiries on time. */
export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);
  /* the FAQ tabs cover every section of the full FAQ page */
  const [faqCategories, registry] = await Promise.all([
    getFaqCategories(locale, t.faqPage.categories),
    getRegistry(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the same dictionary the page renders, so the two never drift.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale, t)) }}
      />

      <main id="main">
        <Hero t={t} locale={locale} />
        <Stats t={t} />
        <Services t={t} locale={locale} />
        <Clients t={t} locale={locale} registry={registry} />
        <Council t={t} />
        <Process t={t} />
        <Faq t={t} locale={locale} categories={faqCategories} />
        <Contact t={t} locale={locale} />
      </main>
    </>
  );
}
