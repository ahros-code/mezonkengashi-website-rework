import InView from "./InView";
import { GirihStar } from "./Girih";
import type { Dict } from "@/i18n";
import s from "./Process.module.css";

export default function Process({ t }: { t: Dict }) {
  return (
    <section id="process" className={s.section} aria-labelledby="process-title">
      <div className="container">
        <header className={s.head}>
          <div>
            <p className="kicker">{t.process.kicker}</p>
            <h2 id="process-title" className="h2">
              {t.process.title}
            </h2>
          </div>
          <p className="lede">{t.process.lede}</p>
        </header>

        {/* Numbered because this genuinely is a sequence. */}
        <InView as="ol" className={s.steps} threshold={0.25}>
          {t.process.steps.map((step, i) => (
            <li key={step.name} className={s.step}>
              <span className={s.node} aria-hidden="true">
                <GirihStar size={31} strokeWidth={1.1} fill="currentColor" />
                <span className={s.nodeNum}>{i + 1}</span>
              </span>
              <span className={s.time}>{step.time}</span>
              <h3 className={s.name}>{step.name}</h3>
              <p className={s.body}>{step.body}</p>
            </li>
          ))}
        </InView>

        <div className={s.trust} aria-label={t.trust.title}>
          {t.trust.items.map((item) => (
            <div key={item.name} className={s.trustItem}>
              <GirihStar size={18} strokeWidth={1.2} className={s.trustMark} />
              <h3 className={s.trustName}>{item.name}</h3>
              <p className={s.trustBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
