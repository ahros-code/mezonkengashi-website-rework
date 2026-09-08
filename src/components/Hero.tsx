import Image from "next/image";
import HeroAtmosphere from "./HeroAtmosphere";
import HeroLattice from "./HeroLattice";
import QuickForm from "./QuickForm";
import GlassCard from "./GlassCard";
import { GirihMedallion, GirihStar } from "./Girih";
import type { Dict } from "@/i18n";
import type { Locale } from "@/i18n/config";
import s from "./Hero.module.css";

const STANDARDS = ["AAOIFI", "IFSB", "CIMA Islamic Finance", "OIC Fiqh Academy"];

/** Twelve months of expertise volume — decorative but drawn from real shape. */
const SPARK = [34, 41, 38, 52, 47, 63, 58, 71, 66, 82, 78, 94];

export default function Hero({ t, locale }: { t: Dict; locale: Locale }) {
  return (
    <section className={`${s.hero} grain`} aria-labelledby="hero-title">
      <div className={s.photo}>
        <Image
          src="/img/hero-tilya-kori.jpg"
          alt=""
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={72}
        />
      </div>
      <div className={s.wash} aria-hidden="true" />
      <HeroLattice />
      <HeroAtmosphere />

      <div className={`container ${s.inner}`}>
        {/* One column, read top to bottom: who → name → promise → detail → act. */}
        <div className={s.left}>
          <p className={s.place}>
            <span className={s.placeDot} aria-hidden="true" />
            {t.hero.place}
          </p>

          <h1 className={s.title} id="hero-title">
            <span className={s.word}>{t.hero.wordmark}</span>
            <span className={s.wordSub}>KENGASHI</span>
            <span className={s.tag}>{t.hero.tagline}</span>
          </h1>

          <p className={s.lede}>{t.hero.lede}</p>

          <div className={s.actions}>
            <a href="#contact" className="btn btn--gold">
              {t.hero.primary}
            </a>
            <a href="#services" className="btn btn--ghost">
              {t.hero.secondary}
            </a>
          </div>
        </div>

        <div className={s.stack}>
          <GlassCard className={s.card}>
            <blockquote>
              <GirihStar size={20} stroke="currentColor" strokeWidth={1} className={s.quoteMark} />
              <p className={s.quote}>{t.hero.quote}</p>
            </blockquote>
            <figcaption className={s.attrib}>
              <span className={s.attribMed}>
                <GirihMedallion seed="nurmatov" scope="hero" />
              </span>
              <span>
                <span className={s.attribName}>{t.hero.quoteName}</span>
                <span className={s.attribRole}>{t.hero.quoteRole}</span>
              </span>
            </figcaption>
          </GlassCard>

          <GlassCard className={s.card}>
            <p className={s.metric}>
              <span className={s.metricValue}>{t.hero.metricValue}</span>
              <span className={s.metricUnit}>{t.hero.metricUnit}</span>
            </p>
            <p className={s.metricLabel}>{t.hero.metricLabel}</p>
            <span className={s.spark} aria-hidden="true">
              {SPARK.map((h, i) => (
                <span
                  key={i}
                  className={s.sparkBar}
                  style={{ height: `${h}%`, animationDelay: `${0.8 + i * 0.045}s` }}
                />
              ))}
            </span>
          </GlassCard>

          <GlassCard className={s.card}>
            <QuickForm t={t} locale={locale} />
          </GlassCard>
        </div>

        <div className={s.rail}>
          <p className={s.standards}>
            {STANDARDS.map((name) => (
              <span key={name} className={s.standard}>
                <GirihStar size={11} strokeWidth={1.4} />
                {name}
              </span>
            ))}
          </p>
          <span className={s.scroll}>
            {t.hero.scroll}
            <span className={s.scrollTrack} aria-hidden="true" />
          </span>
        </div>
      </div>
    </section>
  );
}
