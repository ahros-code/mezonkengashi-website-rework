import { GirihStar } from "./Girih";
import type { Dict } from "@/i18n";
import s from "./Faq.module.css";
import SectionBackdrop from "./SectionBackdrop";

export default function Faq({ t }: { t: Dict }) {
  return (
    <section className={s.section} aria-labelledby="faq-title">
      <SectionBackdrop id="faq-home" placement="right" />
      <div className={`container ${s.grid}`}>
        <h2 id="faq-title" className={s.title}>
          {t.faq.title}
        </h2>

        <div className={s.list}>
          {t.faq.items.map((item) => (
            <details key={item.q} className={s.item} name="faq">
              <summary className={s.q}>
                {item.q}
                <GirihStar size={16} strokeWidth={1.3} className={s.marker} />
              </summary>
              <p className={s.a}>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
