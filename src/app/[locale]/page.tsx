import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDict } from "@/i18n";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";

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
      <a href="#main" className="skip">
        {t.nav.skip}
      </a>
      <Nav t={t} locale={locale} />
      <main id="main">
        <Hero t={t} locale={locale} />
      </main>
    </>
  );
}
