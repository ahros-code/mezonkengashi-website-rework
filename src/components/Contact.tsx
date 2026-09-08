import Image from "next/image";
import ContactForm from "./ContactForm";
import { GirihField } from "./Girih";
import { ClockMark, PhoneMark, PinMark } from "./Icons";
import { company } from "@/lib/site";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./Contact.module.css";
import SectionBackdrop from "./SectionBackdrop";

export default function Contact({ t, locale }: { t: Dict; locale: Locale }) {
  const mapQuery = encodeURIComponent(
    `${company.city}, ${company.countryName}`,
  );

  return (
    <section id="contact" className={s.section} aria-labelledby="contact-title">
      <SectionBackdrop id="contact" placement="band" />
      <div className="container">
        <div className={s.shell}>
          <div className={s.aside}>
            <div className={s.asidePhoto} aria-hidden="true">
              <Image
                src="/img/shahizinda.jpg"
                alt=""
                fill
                sizes="(max-width: 980px) 100vw, 42vw"
                quality={62}
              />
            </div>
            <span className={s.asideWash} aria-hidden="true" />
            <span className={s.asideLattice} aria-hidden="true">
              <GirihField id="girih-contact" tile={126} strokeWidth={0.9} />
            </span>

            <div>
              <p className={s.kicker}>{t.contact.kicker}</p>
              <h2 id="contact-title" className={s.title}>
                {t.contact.title}
              </h2>
              <p className={s.lede}>{t.contact.lede}</p>
            </div>

            <div className={s.blocks}>
              <div className={s.block}>
                <span className={s.blockIcon} aria-hidden="true">
                  <PinMark />
                </span>
                <span>
                  <span className={s.blockLabel}>{t.contact.officeTitle}</span>
                  <a
                    className={s.blockValue}
                    href={`https://www.google.com/maps/search/?api=1&query=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {company.countryName}
                    <br />
                    {company.city}
                  </a>
                  <span className={s.blockNote}>{t.contact.mapLabel}</span>
                </span>
              </div>

              <div className={s.block}>
                <span className={s.blockIcon} aria-hidden="true">
                  <ClockMark />
                </span>
                <span>
                  <span className={s.blockLabel}>{t.contact.hoursTitle}</span>
                  <span className={s.blockValue}>{t.contact.hours}</span>
                  <span className={s.blockNote}>{t.contact.hoursNote}</span>
                </span>
              </div>

              <div className={s.block}>
                <span className={s.blockIcon} aria-hidden="true">
                  <PhoneMark />
                </span>
                <span>
                  <span className={s.blockLabel}>{t.contact.directTitle}</span>
                  <a className={s.blockValue} href={`tel:${company.phoneHref}`}>
                    {company.phone}
                  </a>
                  <a className={s.blockValue} href={`mailto:${company.email}`}>
                    {company.email}
                  </a>
                </span>
              </div>
            </div>
          </div>

          <div className={s.panel}>
            <ContactForm t={t} locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
