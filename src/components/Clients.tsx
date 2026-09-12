import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { Registry } from "@/content/source";
import { pick, certificateStatus, countLabel, sectorLabel, type Organization } from "@/content/types";
import { paths } from "@/lib/routes";
import { GirihField, GirihStar } from "./Girih";
import { ArrowMark } from "./Icons";
import OrgMark from "./OrgMark";
import SectionBackdrop from "./SectionBackdrop";
import s from "./Clients.module.css";

/**
 * The roster: every organisation the council has worked with, as two slow
 * counter-scrolling rows, then a one-field check against the public registry.
 */
export default function Clients({
  t,
  locale,
  registry,
}: {
  t: Dict;
  locale: Locale;
  registry: Registry;
}) {
  const { organizations, certificates } = registry;
  const valid = certificates.filter((c) => certificateStatus(c) === "valid");
  const certified = new Set(valid.map((c) => c.org));

  /* Two rows, alternating, so neighbours in the list never sit side by side. */
  const rows = [
    organizations.filter((_, i) => i % 2 === 0),
    organizations.filter((_, i) => i % 2 === 1),
  ].filter((r) => r.length);

  const tile = (org: Organization, hidden: boolean) => {
    const isCertified = certified.has(org.slug);
    /* Only a holder of a certificate has something to open in the registry;
       a partner without one would land on an empty result. */
    const Tag = isCertified ? "a" : "span";
    return (
      <Tag
        key={`${org.slug}${hidden ? "-dup" : ""}`}
        {...(isCertified
          ? { href: `${paths.certificates(locale)}?org=${org.slug}`, tabIndex: hidden ? -1 : undefined }
          : {})}
        className={s.tile}
        title={org.work ? pick(org.work, locale) : undefined}
        aria-hidden={hidden || undefined}
      >
        <OrgMark org={org} className={s.mark} />
        <span className={s.tileText}>
          <span className={s.name}>{org.name}</span>
          <span className={s.meta}>
            {pick(sectorLabel[org.sector], locale)}
            {org.since ? ` · ${t.clients.since.replace("{year}", String(org.since))}` : ""}
          </span>
        </span>
        {isCertified && (
          <span className={s.badge} title={t.clients.certified}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 6.2 5 8.6l4.5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={s.badgeText}>{t.clients.certified}</span>
          </span>
        )}
      </Tag>
    );
  };

  return (
    <section id="clients" className={s.section} aria-labelledby="clients-title">
      <SectionBackdrop id="clients" placement="band" arc={false} />

      <div className={`container ${s.head}`}>
        <div>
          <p className="kicker">{t.clients.kicker}</p>
          <h2 id="clients-title" className="h2">
            {t.clients.title}
          </h2>
        </div>
        <div className={s.headAside}>
          <p className="lede">{t.clients.lede}</p>
          <div className={s.figures}>
            <div>
              <p className={s.figure}>{organizations.length}</p>
              <p className={s.figureLabel}>
                {countLabel(organizations.length, locale, {
                  uz: "tashkilot",
                  ru: ["организация", "организации", "организаций"],
                }).replace(/^\d+\s/, "")}
              </p>
            </div>
            <div>
              <p className={s.figure}>{valid.length}</p>
              <p className={s.figureLabel}>
                {countLabel(valid.length, locale, {
                  uz: "amaldagi sertifikat",
                  ru: ["действующий сертификат", "действующих сертификата", "действующих сертификатов"],
                }).replace(/^\d+\s/, "")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- the roster ---- */}
      <div className={s.marquee}>
        {rows.map((row, i) => (
          <div key={i} className={s.row} data-reverse={i % 2 === 1}>
            <div className={s.track}>
              {row.map((org) => tile(org, false))}
              {/* the copy that makes the loop seamless; hidden from assistive tech and tab order */}
              {row.map((org) => tile(org, true))}
            </div>
          </div>
        ))}
      </div>

      {/* ---- verify a certificate ---- */}
      <div className="container">
        <form className={s.verify} action={paths.certificates(locale)} method="get" role="search">
          <span className={s.verifyLattice} aria-hidden="true">
            <GirihField id="girih-verify" tile={120} strokeWidth={0.9} />
          </span>
          <div className={s.verifyText}>
            <p className={s.verifyTitle}>
              <GirihStar size={18} strokeWidth={1.3} />
              {t.clients.verifyTitle}
            </p>
            <p className={s.verifyBody}>{t.clients.verifyBody}</p>
          </div>
          <div className={s.verifyField}>
            <input
              type="search"
              name="q"
              className={s.verifyInput}
              placeholder="MK-2026-0148"
              aria-label={t.clients.verifyLabel}
              autoComplete="off"
              spellCheck={false}
            />
            <button type="submit" className="btn btn--gold">
              {t.clients.verifyCta}
            </button>
          </div>
          <a href={paths.certificates(locale)} className={s.registryLink}>
            {t.clients.registryCta}
            <ArrowMark />
          </a>
        </form>
      </div>
    </section>
  );
}
