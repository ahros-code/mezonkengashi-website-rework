import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, faqNode, graph } from "@/lib/jsonld";
import { company } from "@/lib/site";
import { paths } from "@/lib/routes";
import { getRegistry } from "@/content/source";
import {
  pick,
  certificateKindLabel,
  certificateStatus,
  formatDate,
  sectorLabel,
} from "@/content/types";
import PageHero from "@/components/PageHero";
import SectionBackdrop from "@/components/SectionBackdrop";
import OrgMark from "@/components/OrgMark";
import { GirihField, GirihStar } from "@/components/Girih";
import { ArrowMark } from "@/components/Icons";
import CertActions from "./CertActions";
import s from "./Certificate.module.css";

/* Statuses follow the calendar; refresh hourly so an expiry shows on the day. */
export const revalidate = 3600;

export async function generateStaticParams() {
  const { certificates } = await getRegistry();
  return locales.flatMap((locale) => certificates.map((c) => ({ locale, number: c.number })));
}

async function load(locale: string, number: string) {
  if (!isLocale(locale)) return null;
  const { organizations, certificates } = await getRegistry();
  const cert = certificates.find((c) => c.number.toLowerCase() === decodeURIComponent(number).toLowerCase());
  const org = cert && organizations.find((o) => o.slug === cert.org);
  if (!cert || !org) return null;
  const others = certificates.filter((c) => c.org === org.slug && c.number !== cert.number);
  return { locale: locale as Locale, cert, org, others };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}): Promise<Metadata> {
  const { locale, number } = await params;
  const data = await load(locale, number);
  if (!data) return {};
  const t = getDict(data.locale);
  return pageMetadata({
    locale: data.locale,
    path: `/certificates/${data.cert.number}`,
    title: `${data.cert.number} — ${data.org.name}`,
    description: `${t.registry.docTitle}: ${data.org.name}, ${pick(data.cert.subject, data.locale)}. ${t.registry.status[certificateStatus(data.cert)]}.`,
  });
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale: raw, number } = await params;
  const data = await load(raw, number);
  if (!data) notFound();
  const { locale, cert, org, others } = data;
  const t = getDict(locale);
  const copy = t.registry;

  const status = certificateStatus(cert);
  const verifyUrl = `${SITE_URL}/${locale}/certificates/${cert.number}`;
  const note = { valid: copy.validNote, expired: copy.expiredNote, revoked: copy.revokedNote }[status];

  const jsonLd = graph(
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: copy.title, path: "/certificates" },
      { name: cert.number, path: `/certificates/${cert.number}` },
    ]),
    // The same answers, machine-readable: search results can answer the caller first.
    faqNode(locale, `/certificates/${cert.number}`, [...copy.faq]),
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main id="main">
        <PageHero
          locale={locale}
          t={t}
          latticeId="girih-cert"
          crumbs={[{ label: copy.title, href: paths.certificates(locale) }, { label: cert.number }]}
          kicker={pick(certificateKindLabel[cert.kind], locale)}
          title={org.name}
          lede={pick(cert.subject, locale)}
          meta={[cert.number, copy.status[status]]}
        />

        <section className={s.body}>
          <SectionBackdrop id="cert-body" placement="left" />
          <div className={`container ${s.layout}`}>
            {/* ---------------- the document ---------------- */}
            <article className={s.doc} data-status={status} aria-label={copy.docTitle}>
              <span className={s.docFrame} aria-hidden="true" />
              <span className={s.docLattice} aria-hidden="true">
                <GirihField id="girih-cert-doc" tile={96} strokeWidth={0.7} />
              </span>

              <header className={s.docHead}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/brand/mezon-logo-stacked.svg" alt="Mezon Kengashi" className={s.docLogo} width={150} height={100} />
                <h2 className={s.docTitle}>{copy.docTitle}</h2>
                <p className={s.docNumber}>{cert.number}</p>
              </header>

              <div className={s.docMain}>
                <p className={s.docLabel}>{copy.docIssuedTo}</p>
                <p className={s.docOrg}>{org.name}</p>
                <p className={s.docLabel}>{copy.docSubject}</p>
                <p className={s.docSubject}>{pick(cert.subject, locale)}</p>
                <p className={s.docStatement}>{copy.docStatement}</p>
                {cert.standards.length > 0 && (
                  <p className={s.docStandards}>
                    {cert.standards.map((st) => (
                      <span key={st}>{st}</span>
                    ))}
                  </p>
                )}
              </div>

              <dl className={s.docFacts}>
                <div>
                  <dt>{copy.docNumber}</dt>
                  <dd>{cert.number}</dd>
                </div>
                <div>
                  <dt>{copy.docIssued}</dt>
                  <dd>{formatDate(cert.issued, locale)}</dd>
                </div>
                <div>
                  <dt>{copy.docUntil}</dt>
                  <dd>{formatDate(cert.validUntil, locale)}</dd>
                </div>
              </dl>

              <footer className={s.docFoot}>
                <div className={s.sign}>
                  <span className={s.signLine} />
                  <span className={s.signName}>{t.council.groups.board.name}</span>
                  <span className={s.signRole}>{copy.docChair}</span>
                </div>

                <div className={s.seal} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/mezon-mark.svg" alt="" />
                </div>

                <div className={s.sign}>
                  <span className={s.signLine} />
                  <span className={s.signName}>{t.council.groups.experts.name}</span>
                  <span className={s.signRole}>{copy.docChair}</span>
                </div>
              </footer>

              <p className={s.docVerify}>
                {copy.docVerify}: <span>{verifyUrl.replace(/^https?:\/\//, "")}</span>
              </p>

              {status !== "valid" && (
                <span className={s.stamp} data-status={status} aria-hidden="true">
                  {copy.status[status]}
                </span>
              )}
            </article>

            {/* ---------------- status, holder, actions ---------------- */}
            <aside className={s.aside}>
              <div className={s.statusCard} data-status={status}>
                <p className={s.statusLabel}>{copy.sideStatus}</p>
                <p className={s.statusValue}>
                  <span className={s.statusDot} aria-hidden="true" />
                  {copy.status[status]}
                </p>
                <p className={s.statusNote}>{note}</p>
              </div>

              <div className={s.panel}>
                <div className={s.holder}>
                  <OrgMark org={org} className={s.mark} />
                  <div>
                    <p className={s.holderName}>{org.name}</p>
                    <p className={s.holderMeta}>{pick(sectorLabel[org.sector], locale)}</p>
                  </div>
                </div>
                <dl className={s.facts}>
                  <div>
                    <dt>{copy.sideCity}</dt>
                    <dd>{pick(org.city, locale)}</dd>
                  </div>
                  {org.since && (
                    <div>
                      <dt>{copy.sideSince}</dt>
                      <dd>{t.clients.since.replace("{year}", String(org.since))}</dd>
                    </div>
                  )}
                </dl>
              </div>

              <CertActions
                labels={{ print: copy.print, copy: copy.copy, copied: copy.copied, original: copy.original }}
                file={cert.file}
              />

              {others.length > 0 && (
                <div className={s.panel}>
                  <p className={s.panelTitle}>{copy.other}</p>
                  <ul className={s.others}>
                    {others.map((c) => {
                      const st = certificateStatus(c);
                      return (
                        <li key={c.number}>
                          <a href={paths.certificate(locale, c.number)} className={s.other}>
                            <span className={s.otherNumber}>{c.number}</span>
                            <span className={s.otherSubject}>{pick(c.subject, locale)}</span>
                            <span className={s.otherStatus} data-status={st}>
                              {copy.status[st]}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              <a href={paths.certificates(locale)} className={s.back}>
                <ArrowMark />
                {copy.back}
              </a>
            </aside>
          </div>

          {/* The questions the office answers on the phone all day, answered here. */}
          <section className={`container ${s.faq}`} aria-labelledby="cert-faq-title">
            <div className={s.faqHead}>
              <h2 id="cert-faq-title" className={s.faqTitle}>
                {copy.faqTitle}
              </h2>
              <p className={s.faqLede}>{copy.faqLede}</p>
            </div>

            <div className={s.faqList}>
              {copy.faq.map((item, i) => (
                <details key={item.q} className={s.faqItem} name="cert-faq" open={i === 0}>
                  <summary className={s.faqQ}>
                    <span className={s.faqQText}>{item.q}</span>
                    {/* the same star-and-plus toggle the site's FAQ uses */}
                    <span className={s.faqToggle} aria-hidden="true">
                      <GirihStar size={30} strokeWidth={1.2} />
                      <span className={s.faqPlus} />
                    </span>
                  </summary>
                  <p className={s.faqA}>{item.a}</p>
                </details>
              ))}
            </div>

            <p className={s.faqAsk}>
              {copy.faqAsk}{" "}
              <a href={company.telegram} target="_blank" rel="noopener noreferrer">
                Telegram
              </a>
              <span aria-hidden="true"> · </span>
              <a href={`tel:${company.phoneHref}`}>{company.phone}</a>
              <span aria-hidden="true"> · </span>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </p>
          </section>
        </section>
      </main>
    </>
  );
}
