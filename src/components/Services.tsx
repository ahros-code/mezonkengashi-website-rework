import Image from "next/image";
import { ServiceIcon } from "./Icons";
import { GirihField, GirihStar } from "./Girih";
import { serviceOrder, type ServiceId } from "@/lib/site";
import type { Dict } from "@/i18n";
import s from "./Services.module.css";
import SectionBackdrop from "./SectionBackdrop";

/** Footprints are uneven on purpose — a mosaic, not six identical cards. */
const SPAN: Record<ServiceId, string> = {
  council: s.feature,
  audit: s.wide,
  dispute: s.wide,
  education: s.std,
  consulting: s.std,
  zakat: s.std,
};

/** Only the tiles with room to breathe carry their detail list. */
const WITH_POINTS: ServiceId[] = ["council", "audit", "dispute"];

export default function Services({ t }: { t: Dict }) {
  return (
    <section id="services" className={s.section} aria-labelledby="services-title">
      <SectionBackdrop id="services" placement="right" />
      <div className="container">
        <header className={s.head}>
          <div>
            <p className="kicker">{t.services.kicker}</p>
            <h2 id="services-title" className="h2">
              {t.services.title}
            </h2>
          </div>
          <p className="lede">{t.services.lede}</p>
        </header>

        <div className={s.mosaic}>
          {serviceOrder.map((id) => {
            const item = t.services.items[id];
            const isFeature = id === "council";

            return (
              <article key={id} className={`${s.tile} ${SPAN[id]}`}>
                {isFeature && (
                  <>
                    <span className={s.featurePhoto}>
                      <Image
                        src="/img/registan-night.jpg"
                        alt=""
                        fill
                        sizes="(max-width: 1080px) 100vw, 58vw"
                        quality={68}
                      />
                    </span>
                    <span className={s.featureWash} aria-hidden="true" />
                    <span className={s.featureLattice} aria-hidden="true">
                      <GirihField id="girih-services" tile={132} strokeWidth={0.9} />
                    </span>
                  </>
                )}

                <span className={s.icon}>
                  <ServiceIcon id={id} />
                </span>

                <h3 className={s.name}>{item.name}</h3>
                <p className={s.summary}>{item.summary}</p>

                {WITH_POINTS.includes(id) && (
                  <ul className={s.points}>
                    {item.points.map((point) => (
                      <li key={point} className={s.point}>
                        <GirihStar size={9} strokeWidth={1.6} />
                        {point}
                      </li>
                    ))}
                  </ul>
                )}

                {isFeature && (
                  <a href="#contact" className={`btn btn--gold ${s.featureCta}`}>
                    {t.nav.cta}
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
