import { GirihField, GirihStar } from "./Girih";
import { pick, type Block } from "@/content/types";
import type { Locale } from "@/i18n/config";
import s from "./Prose.module.css";

export default function Prose({
  blocks,
  locale,
  latticeId,
}: {
  blocks: Block[];
  locale: Locale;
  latticeId: string;
}) {
  return (
    <div className={s.prose}>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return (
              <p key={i} className={s.p}>
                {pick(block.text, locale)}
              </p>
            );

          case "h":
            return (
              <h2 key={i} className={s.h}>
                <GirihStar size={13} strokeWidth={1.5} />
                {pick(block.text, locale)}
              </h2>
            );

          case "ul":
            return (
              <ul key={i} className={s.ul}>
                {block.items.map((item) => (
                  <li key={pick(item, locale)} className={s.li}>
                    <GirihStar size={10} strokeWidth={1.6} />
                    <span>{pick(item, locale)}</span>
                  </li>
                ))}
              </ul>
            );

          case "quote":
            return (
              <figure key={i} className={s.quote}>
                <span className={s.quoteLattice} aria-hidden="true">
                  <GirihField id={`${latticeId}-q${i}`} tile={104} strokeWidth={0.9} />
                </span>
                <blockquote className={s.quoteText}>{pick(block.text, locale)}</blockquote>
                <figcaption className={s.quoteBy}>{pick(block.by, locale)}</figcaption>
              </figure>
            );
        }
      })}
    </div>
  );
}
