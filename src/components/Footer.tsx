import { GirihField, GirihStar } from "./Girih";
import { company, serviceOrder } from "@/lib/site";
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
              <GirihStar size={24} strokeWidth={1.1} className={s.brandMark} />
              <span className={s.brandName}>MEZON</span>
            </span>
            <p className={s.tagline}>{t.footer.tagline}</p>
            <p className={s.legalLine}>
              {company.legalName}
              <br />
              {t.footer.stir} {company.taxId}
            </p>
          </div>

          <nav aria-labelledby="foot-services">
            <h2 id="foot-services" className={s.colTitle}>
              {t.footer.servicesTitle}
            </h2>
            <ul className={s.list}>
              {serviceOrder.map((id) => (
                <li key={id}>
                  <a href="#services" className={s.link}>
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
                <a href="#council" className={s.link}>
                  {t.footer.council}
                </a>
              </li>
              <li>
                <a href="#process" className={s.link}>
                  {t.footer.process}
                </a>
              </li>
              <li>
                <a href="#services" className={s.link}>
                  {t.footer.registry}
                </a>
              </li>
              <li>
                <a href="#contact" className={s.link}>
                  {t.footer.careers}
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
                  {company.street}, {company.city}
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
