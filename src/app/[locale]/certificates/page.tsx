import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, collectionPage, graph } from "@/lib/jsonld";
import { paths } from "@/lib/routes";
import { company } from "@/lib/site";
import { getRegistry } from "@/content/source";
import {
  certificateKindLabel,
  certificateStatus,
  countLabel,
  formatDate,
  sectorLabel,
  type SectorId,
} from "@/content/types";
import PageHero from "@/components/PageHero";
import SectionBackdrop from "@/components/SectionBackdrop";
import { GirihStar } from "@/components/Girih";
import RegistryTable, { RegistryFromUrl, type RegistryRow } from "./RegistryTable";
import s from "./Registry.module.css";

/* Statuses follow the calendar; refresh hourly so expiries show on the day. */
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
    path: "/certificates",
    title: t.registry.metaTitle,
    description: t.registry.metaDescription,
    titleAbsolute: true,
  });
}

export default async function CertificatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const copy = t.registry;

  const { organizations, certificates } = await getRegistry();
  const bySlug = new Map(organizations.map((o) => [o.slug, o]));

  const rows: RegistryRow[] = certificates
    .filter((c) => bySlug.has(c.org))
    .sort((a, b) => b.issued.localeCompare(a.issued))
    .map((c) => {
      const org = bySlug.get(c.org)!;
      return {
        number: c.number,
        href: paths.certificate(locale, c.number),
        org,
        sectorLabel: sectorLabel[org.sector][locale],
        subject: c.subject[locale],
        kindLabel: certificateKindLabel[c.kind][locale],
        standards: c.standards,
        issued: formatDate(c.issued, locale),
        until: formatDate(c.validUntil, locale),
        status: certificateStatus(c),
      };
    });

  const sectors = [...new Set(organizations.map((o) => o.sector))].map((id) => ({
    id,
    label: sectorLabel[id as SectorId][locale],
  }));

  const tableCopy = {
    searchLabel: copy.searchLabel,
    searchPh: copy.searchPh,
    all: copy.all,
    allSectors: copy.allSectors,
    status: copy.status,
    colNumber: copy.colNumber,
    colHolder: copy.colHolder,
    colIssued: copy.colIssued,
    colUntil: copy.colUntil,
    colStatus: copy.colStatus,
    found: copy.found,
    noResults: copy.noResults,
    reset: copy.reset,
  };

  const jsonLd = graph(
    collectionPage({
      locale,
      path: "/certificates",
      name: copy.metaTitle,
      description: copy.metaDescription,
      items: rows.map((r) => ({ name: `${r.number} — ${r.org.name}`, path: `/certificates/${r.number}` })),
    }),
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: copy.title, path: "/certificates" },
    ]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
        <PageHero
          locale={locale}
          t={t}
          latticeId="girih-registry"
          crumbs={[{ label: copy.title }]}
          kicker={copy.kicker}
          title={copy.title}
          lede={copy.lede}
          meta={[
            countLabel(rows.length, locale, { uz: "ta sertifikat", ru: ["сертификат", "сертификата", "сертификатов"] }),
            countLabel(organizations.length, locale, { uz: "ta tashkilot", ru: ["организация", "организации", "организаций"] }),
          ]}
        />

        <section className={s.body}>
          <SectionBackdrop id="registry-body" placement="right" />
          <div className="container">
            {/* The server renders the full register; the URL-aware copy takes over
                in the browser, so ?q= from the home page lands pre-filtered. */}
            <Suspense fallback={<RegistryTable rows={rows} sectors={sectors} copy={tableCopy} />}>
              <RegistryFromUrl rows={rows} sectors={sectors} copy={tableCopy} />
            </Suspense>

            <p className={s.note}>
              <GirihStar size={16} strokeWidth={1.3} />
              <span>
                {copy.note}{" "}
                <a href={`mailto:${company.email}`} className={s.noteLink}>
                  {company.email}
                </a>
              </span>
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
