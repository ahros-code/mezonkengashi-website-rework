import InView from "./InView";
import { GirihField } from "./Girih";
import type { Dict } from "@/i18n";
import s from "./Stats.module.css";

export default function Stats({ t }: { t: Dict }) {
  return (
    <section className={s.band} aria-label={t.stats.title}>
      <div className={s.watermark} aria-hidden="true">
        <GirihField id="girih-stats" tile={120} strokeWidth={1} />
      </div>
      <div className="container">
        <InView as="ul" className={s.grid} threshold={0.3}>
          {t.stats.items.map((item) => (
            <li key={item.value + item.label} className={s.item}>
              <span className={s.value}>{item.value}</span>
              <span className={s.label}>{item.label}</span>
            </li>
          ))}
        </InView>
      </div>
    </section>
  );
}
