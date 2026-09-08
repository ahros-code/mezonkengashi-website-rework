import { GirihField, GirihStar } from "./Girih";
import { company, serviceOrder } from "@/lib/site";
import { paths } from "@/lib/routes";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./Footer.module.css";

export default function Footer({ t, locale }: { t: Dict; locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className={s.footer}>
      <div className={s.lattice} aria-hidden="true">
        <GirihField id="girih-footer" tile={150} strokeWidth={0.85} />
      </div>

      <div className="container">
        <div className={s.top}>
          <div className={s.brandBlock}>
            <span className={s.brandRow}>
              <img
                src="/brand/mezon-logo-dark.svg"
                alt="MEZON KENGASHI"
                className={s.brandLogo}
                width={210}
                height={50}
              />
            </span>
            <p className={s.tagline}>{t.footer.tagline}</p>
            <p className={s.legalLine}>{company.legalName}</p>
          </div>

          <nav aria-labelledby="foot-services">
            <h2 id="foot-services" className={s.colTitle}>
              {t.footer.servicesTitle}
            </h2>
            <ul className={s.list}>
              {serviceOrder.map((id) => (
                <li key={id}>
                  <a href={paths.services(locale)} className={s.link}>
                    {t.services.items[id].name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="foot-company">
            <h2 id="foot-company" className={s.colTitle}>
              {t.footer.companyTitle}
            </h2>
            <ul className={s.list}>
              <li>
                <a href={paths.about(locale)} className={s.link}>
                  {t.footer.about}
                </a>
              </li>
              <li>
                <a href={paths.council(locale)} className={s.link}>
                  {t.footer.council}
                </a>
              </li>
              <li>
                <a href={paths.process(locale)} className={s.link}>
                  {t.footer.process}
                </a>
              </li>
              <li>
                <a href={paths.faq(locale)} className={s.link}>
                  {t.nav.faq}
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={s.colTitle}>{t.footer.contactTitle}</h2>
            <ul className={s.list}>
              <li>
                <a href={`tel:${company.phoneHref}`} className={s.link}>
                  {company.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${company.email}`} className={s.link}>
                  {company.email}
                </a>
              </li>
              <li>
                <a
                  href={company.telegram}
                  className={s.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
              <li>
                <span className={s.link}>
                  {company.countryName}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className={s.markRow}>
          <span className={s.bigmark} aria-hidden="true">
            MEZON
          </span>
        </div>

        <div className={s.base}>
          <span>
            © {year} {company.legalName}. {t.footer.rights}
          </span>
          <span className={s.disclaimer}>{t.footer.disclaimer}</span>
          <span lang={locale === "uz" ? "uz" : "ru"}>{t.footer.credits}</span>
        </div>
      </div>
    </footer>
  );
}
