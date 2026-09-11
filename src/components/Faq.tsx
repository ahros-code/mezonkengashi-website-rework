import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { FaqCategory } from "@/content/source";
import { paths } from "@/lib/routes";
import FaqDesk from "./FaqDesk";
import SectionBackdrop from "./SectionBackdrop";
import s from "./Faq.module.css";

/**
 * Home-page FAQ: the popular questions from the home dictionary, then one tab
 * per section of the full FAQ page, so most answers are one click away.
 */
export default function Faq({
  t,
  locale,
  categories,
}: {
  t: Dict;
  locale: Locale;
  categories: FaqCategory[];
}) {
  return (
    <section className={s.section} aria-labelledby="faq-title">
      <SectionBackdrop id="faq-home" placement="right" />
      <div className="container">
        <FaqDesk
          popular={t.faq.items}
          categories={categories}
          copy={{
            kicker: t.faq.kicker,
            title: t.faq.title,
            lede: t.faq.lede,
            popular: t.faq.popular,
            askTitle: t.faq.askTitle,
            askBody: t.faq.askBody,
            askCta: t.faq.askCta,
            allLink: t.faq.allLink,
          }}
          contactHref={paths.contact(locale)}
          faqHref={paths.faq(locale)}
        />
      </div>
    </section>
  );
}
