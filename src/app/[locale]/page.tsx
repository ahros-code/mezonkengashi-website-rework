import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { buildJsonLd } from "@/lib/jsonld";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import Council from "@/components/Council";
import Process from "@/components/Process";
import Faq from "@/components/Faq";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDict(locale);

  return (
    <>
      <script
        type="application/ld+json"
        // Built from the same dictionary the page renders, so the two never drift.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildJsonLd(locale, t)) }}
      />

      <a href="#main" className="skip">
        {t.nav.skip}
      </a>

      <Nav t={t} locale={locale} />

      <main id="main">
        <Hero t={t} locale={locale} />
        <Stats t={t} />
        <Services t={t} />
        <Council t={t} />
        <Process t={t} />
        <Faq t={t} />
        <Contact t={t} locale={locale} />
      </main>

      <Footer t={t} locale={locale} />
    </>
  );
}
