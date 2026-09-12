import { Fragment } from "react";
import type { Metadata } from "next";
import { Reem_Kufi } from "next/font/google";
import { notFound } from "next/navigation";
import { locales, isLocale, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbs, graph, ORG_ID } from "@/lib/jsonld";
import {
  cpssModules,
  instructors,
  otherCourses,
  plates,
  standardName,
  talimContact,
} from "@/content/talim";
import { pick } from "@/content/types";
import { TalimLeaf, TalimLeaves, TalimWordmark } from "@/components/TalimMark";
import { GirihField, GirihStar } from "@/components/Girih";
import { ArrowMark, PhoneMark, PlaneMark } from "@/components/Icons";
import TalimFx from "./TalimFx";
import Embers from "./Embers";
import Journey from "./Journey";
import s from "./Talim.module.css";

/* Kufic for the Arabic that the page sets as architecture: marquee, module
   watermarks. Montserrat, the family face, carries everything else. */
const kufi = Reem_Kufi({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-kufi",
});

const ROOT_ID = "talim";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return pageMetadata({
    locale,
    path: "/talim",
    title: t.talim.metaTitle,
    description: t.talim.metaDescription,
    titleAbsolute: true,
  });
}

export default async function TalimPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw as Locale;
  const t = getDict(locale);
  const c = t.talim;

  const standardsMarquee = Object.values(standardName).map((n) => pick(n, locale));
  const arabicMarquee = cpssModules.map((m) => m.ar);
  const statementWords = c.statement.split(" ");

  const url = `${SITE_URL}/${locale}/talim`;
  const jsonLd = graph(
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#talim`,
      name: "Mezon Taʼlim",
      url: talimContact.site,
      telephone: talimContact.phone,
      sameAs: [talimContact.site, talimContact.telegram],
      parentOrganization: { "@id": ORG_ID },
    },
    {
      "@type": "Course",
      "@id": `${url}#cpss`,
      name: c.cpssTitle,
      description: c.metaDescription,
      url,
      inLanguage: "uz",
      provider: { "@id": `${SITE_URL}/#talim` },
      educationalCredentialAwarded: "AAOIFI Certificate of Proficiency in Shariʼah Standards (CPSS)",
      syllabusSections: cpssModules.map((m, i) => ({ "@type": "Syllabus", name: `${i + 1}. ${pick(m.title, locale)}` })),
      hasCourseInstance: {
        "@type": "CourseInstance",
        courseMode: "Blended",
        courseWorkload: "PT90H",
        courseSchedule: {
          "@type": "Schedule",
          repeatFrequency: "P1W",
          byDay: ["https://schema.org/Saturday", "https://schema.org/Sunday"],
          duration: "PT3H",
        },
        location: {
          "@type": "Place",
          name: c.city,
          address: { "@type": "PostalAddress", addressLocality: c.city, addressCountry: "UZ" },
        },
        instructor: instructors.map((p) => ({ "@type": "Person", name: pick(p.name, locale), jobTitle: pick(p.role, locale) })),
      },
    },
    breadcrumbs(locale, [
      { name: t.ui.home, path: "" },
      { name: t.nav.talim, path: "/talim" },
    ]),
  );

  const tg = { href: talimContact.telegram, target: "_blank", rel: "noopener noreferrer" } as const;

  return (
    <div id={ROOT_ID} className={`${kufi.variable} ${s.page}`}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <TalimFx rootId={ROOT_ID} />

      <main id="main">
        {/* ============================================================ HERO */}
        <section className={s.hero} data-hero aria-labelledby="talim-title">
          <div className={s.heroBg} aria-hidden="true">
            <img src="/img/talim/registan-night.webp" alt="" width={1600} height={1051} fetchPriority="high" />
          </div>
          <div className={s.heroShade} aria-hidden="true" />
          <Embers className={s.embers} />

          <div className={`container ${s.heroInner}`}>
            <div className={s.book} aria-hidden="true">
              <span className={s.halo} />
              <span className={s.beam} />
              <span className={s.leafL}>
                <TalimLeaf side="left" fill="#ffffff" />
              </span>
              <span className={s.leafR}>
                <TalimLeaf side="right" fill="#f8b700" />
              </span>
            </div>

            <h1 id="talim-title" className={s.heroTitle}>
              {[c.titleBefore, c.titleAccent, c.titleAfter]
                .flatMap((part, pi) =>
                  part ? part.split(" ").map((w, wi) => ({ w, accent: pi === 1, key: `${pi}-${wi}` })) : [],
                )
                .map((word, i) => (
                  <Fragment key={word.key}>
                    {i > 0 && " "}
                    <span
                      className={`${s.word} ${word.accent ? s.accent : ""}`}
                      style={{ "--i": i } as React.CSSProperties}
                    >
                      {word.w}
                    </span>
                  </Fragment>
                ))}
            </h1>

            <p className={s.heroLede}>{c.lede}</p>

            <div className={s.heroCtas}>
              <a {...tg} className={s.goldBtn}>
                <PlaneMark />
                {c.enrol}
              </a>
              <a href="#journey" className={s.glassBtn}>
                {c.explore}
                <ArrowMark />
              </a>
            </div>

            <p className={s.heroMeta}>
              <GirihStar size={14} strokeWidth={1.4} />
              {c.badge}
            </p>
          </div>

          <ul className={`container ${s.statsRail}`}>
            {c.stats.map((st) => (
              <li key={st.u} className={s.stat}>
                <span className={s.statN} data-count={st.n}>
                  {st.n}
                </span>
                <span className={s.statU}>{st.u}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ============================================================ MARQUEE */}
        <div className={s.marquee} aria-hidden="true">
          <div className={s.marqueeRow}>
            {[0, 1].map((k) => (
              <span key={k} className={s.marqueeSet}>
                {standardsMarquee.map((n) => (
                  <span key={n} className={s.marqueeItem}>
                    {n}
                    <GirihStar size={18} strokeWidth={1.3} />
                  </span>
                ))}
              </span>
            ))}
          </div>
          <div className={`${s.marqueeRow} ${s.marqueeReverse}`}>
            {[0, 1].map((k) => (
              <span key={k} className={s.marqueeSet}>
                {[...arabicMarquee, ...arabicMarquee].map((n, i) => (
                  <span key={`${n}-${i}`} className={s.marqueeAr} lang="ar" dir="rtl">
                    {n}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ============================================================ ABOUT */}
        <section id="about" className={s.about} aria-label={c.pillars.map((p) => p.t).join(", ")}>
          <div className={`container ${s.aboutGrid}`}>
            <div>
              <p className={s.statement} data-words>
                {statementWords.map((w, i) => (
                  <span key={i} data-w>
                    {w}{" "}
                  </span>
                ))}
              </p>

              <ul className={s.pillars}>
                {c.pillars.map((p, i) => (
                  <li key={p.t} className={s.pillar} data-reveal data-spot style={{ "--d": i } as React.CSSProperties}>
                    <span className={s.pillarIcon}>
                      <Glyph id={(["book", "scale", "seal"] as const)[i]} />
                    </span>
                    <h3 className={s.pillarT}>{p.t}</h3>
                    <p className={s.pillarD}>{p.d}</p>
                  </li>
                ))}
              </ul>
            </div>

            <figure className={s.archFigure} data-reveal>
              <span className={s.archGlow} aria-hidden="true" />
              <div className={s.arch}>
                <img src="/img/talim/shahizinda.webp" alt="" width={1400} height={788} loading="lazy" decoding="async" />
              </div>
              <span className={s.archOutline} aria-hidden="true">
                <svg viewBox="0 0 100 140" preserveAspectRatio="none">
                  <path d="M1 139V58C1 30 26 12 50 1c24 11 49 29 49 57v81z" pathLength={1} />
                </svg>
              </span>
            </figure>
          </div>
        </section>

        {/* ============================================================ CPSS FLAGSHIP */}
        <section id="cpss" className={s.cpss} aria-labelledby="cpss-title">
          <div className={s.cpssLattice} aria-hidden="true">
            <GirihField id="girih-cpss" tile={150} strokeWidth={0.7} />
          </div>
          <div className={`container ${s.cpssGrid}`}>
            <article className={s.flagCard} data-tilt="4" data-spot data-reveal>
              <div className={s.flagInner}>
                <p className={s.flagChip}>
                  <span className={s.pulse} aria-hidden="true" />
                  {c.flagship}
                </p>
                <h2 id="cpss-title" className={s.flagTitle}>
                  {c.cpssTitle}
                </h2>
                <p className={s.flagSub}>{c.cpssSub}</p>

                <dl className={s.flagFacts}>
                  {c.facts.map((f, i) => (
                    <div key={f.k} className={s.flagFact}>
                      <dt>
                        <Glyph id={(["clock", "calendar", "globe", "voice"] as const)[i]} />
                        {f.k}
                      </dt>
                      <dd>{f.v}</dd>
                    </div>
                  ))}
                </dl>

                <p className={s.flagIntake}>{c.intake}</p>

                <div className={s.flagCtas}>
                  <a {...tg} className={s.goldBtn}>
                    <PlaneMark />
                    {c.enrol}
                  </a>
                  <a href={`tel:${talimContact.phoneHref}`} className={s.inlinePhone}>
                    <PhoneMark />
                    {talimContact.phone}
                  </a>
                </div>
              </div>
            </article>

            <figure className={s.cpssPhoto} data-reveal>
              <div className={s.archTall}>
                <img src="/img/talim/instructors.webp" alt={instructors.map((p) => pick(p.name, locale)).join(", ")} width={1080} height={1080} loading="lazy" decoding="async" />
              </div>
              <span className={`${s.floatTag} ${s.floatA}`}>
                <b>61</b> {c.stats[3].u}
              </span>
              <span className={`${s.floatTag} ${s.floatB}`}>
                <b>9</b> {c.stats[4].u}
              </span>
              <span className={`${s.floatTag} ${s.floatC}`}>
                <b>AAOIFI</b> CPSS
              </span>
            </figure>
          </div>
        </section>

        {/* ============================================================ JOURNEY */}
        <Journey
          title={c.journeyTitle}
          lede={c.journeyLede}
          moduleLabel={c.moduleLabel}
          modules={cpssModules.map((m) => ({
            title: pick(m.title, locale),
            ar: m.ar,
            standards: m.standards.map((n) => ({ n, name: standardName[n] ? pick(standardName[n], locale) : "" })),
          }))}
        />

        {/* ============================================================ INCLUDED */}
        <section className={s.included} aria-labelledby="included-title">
          <div className="container">
            <h2 id="included-title" className={s.h2} data-reveal>
              {c.includedTitle}
            </h2>
            <ul className={s.bento}>
              {c.included.map((it, i) => (
                <li
                  key={it.id}
                  className={`${s.tile} ${it.id === "cert" ? s.tileCert : ""}`}
                  data-spot
                  data-reveal
                  style={{ "--d": i } as React.CSSProperties}
                >
                  {it.id === "cert" && (
                    <div className={s.certArt} aria-hidden="true" data-tilt="10">
                      <div className={s.certPaper}>
                        <TalimWordmark left="#00223d" right="#c78f00" className={s.certMark} />
                        <span className={s.certLine} style={{ width: "70%" }} />
                        <span className={s.certName}>CPSS</span>
                        <span className={s.certLine} style={{ width: "54%" }} />
                        <span className={s.certLine} style={{ width: "62%" }} />
                        <span className={s.certSeal}>
                          <GirihStar size={40} strokeWidth={1.4} />
                        </span>
                      </div>
                    </div>
                  )}
                  <span className={s.tileIcon}>
                    <Glyph id={it.id as GlyphId} />
                  </span>
                  <h3 className={s.tileT}>{it.t}</h3>
                  <p className={s.tileD}>{it.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================ FACULTY */}
        <section id="faculty" className={s.faculty} aria-labelledby="faculty-title">
          <div className="container">
            <div className={s.sectionHead} data-reveal>
              <h2 id="faculty-title" className={s.h2}>
                {c.facultyTitle}
              </h2>
              <p className={s.sectionLede}>{c.facultyLede}</p>
            </div>
            <ul className={s.people}>
              {instructors.map((p, i) => (
                <li key={p.id} className={s.person} data-tilt="6" data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <div className={s.personFrame}>
                    <img src={p.photo} alt={pick(p.name, locale)} width={480} height={480} loading="lazy" decoding="async" />
                    <span className={s.personRing} aria-hidden="true">
                      <svg viewBox="0 0 100 120" preserveAspectRatio="none">
                        <path d="M1 119V48C1 24 24 9 50 1c26 8 49 23 49 47v71z" pathLength={1} />
                      </svg>
                    </span>
                  </div>
                  <div className={s.personText}>
                    <h3 className={s.personName}>{pick(p.name, locale)}</h3>
                    <p className={s.personRole}>{pick(p.role, locale)}</p>
                    <ul className={s.personCreds}>
                      {p.credentials.map((cr) => (
                        <li key={cr.uz}>{pick(cr, locale)}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================ OTHER COURSES */}
        <section id="courses" className={s.courses} aria-labelledby="courses-title">
          <div className="container">
            <div className={s.sectionHead} data-reveal>
              <h2 id="courses-title" className={s.h2}>
                {c.coursesTitle}
              </h2>
              <p className={s.sectionLede}>{c.coursesLede}</p>
            </div>
            <ul className={s.courseGrid}>
              {otherCourses.map((course, i) => (
                <li key={course.id} className={s.course} data-spot data-tilt="5" data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <div className={s.courseArt} aria-hidden="true">
                    <GirihField id={`girih-course-${course.id}`} tile={[90, 120, 70, 140][i % 4]} strokeWidth={0.8} />
                    <span className={s.courseCode}>{course.code}</span>
                  </div>
                  <div className={s.courseBody}>
                    <div className={s.courseTop}>
                      <h3 className={s.courseTitle}>{pick(course.title, locale)}</h3>
                      {course.sample && (
                        <span className={s.sample} title={c.sampleNote}>
                          {c.sample}
                        </span>
                      )}
                    </div>
                    <p className={s.courseSub}>{pick(course.subtitle, locale)}</p>
                    <p className={s.courseText}>{pick(course.summary, locale)}</p>
                    <dl className={s.courseFacts}>
                      <div>
                        <dt>{c.audience}</dt>
                        <dd>{pick(course.audience, locale)}</dd>
                      </div>
                      <div>
                        <dt>{c.format}</dt>
                        <dd>{pick(course.format, locale)}</dd>
                      </div>
                      <div>
                        <dt>{c.length}</dt>
                        <dd>{pick(course.length, locale)}</dd>
                      </div>
                    </dl>
                    <a {...tg} className={s.courseLink}>
                      {c.ask}
                      <ArrowMark />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className={s.sampleFoot}>{c.sampleNote}</p>
          </div>
        </section>

        {/* ============================================================ GALLERY */}
        <section className={s.gallery} aria-labelledby="gallery-title">
          <div className="container">
            <div className={s.sectionHead} data-reveal>
              <h2 id="gallery-title" className={s.h2}>
                {c.galleryTitle}
              </h2>
              <p className={s.sectionLede}>{c.galleryLede}</p>
            </div>
            <ul className={s.galleryGrid}>
              {plates.map((pl, i) => (
                <li key={pl.caption.uz} className={s.shot} data-reveal data-spot style={{ "--d": i } as React.CSSProperties}>
                  {pl.src ? (
                    <img src={pl.src} alt={pick(pl.alt ?? pl.caption, locale)} loading="lazy" decoding="async" />
                  ) : (
                    <div className={s.shotPending}>
                      <GirihField id={`girih-shot-${i}`} tile={[110, 80, 130, 95, 70][i % 5]} strokeWidth={0.7} />
                      <TalimLeaves left="currentColor" right="currentColor" className={s.shotMark} />
                      <span className={s.shotSoon}>{c.pending}</span>
                    </div>
                  )}
                  <p className={s.shotCaption}>{pick(pl.caption, locale)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ============================================================ FAQ */}
        <section className={s.faq} aria-labelledby="faq-title">
          <div className={`container ${s.faqGrid}`}>
            <h2 id="faq-title" className={s.h2} data-reveal>
              {c.faqTitle}
            </h2>
            <div className={s.faqList}>
              {c.notes.map((n, i) => (
                <details key={n.q} className={s.qa} data-reveal style={{ "--d": i } as React.CSSProperties}>
                  <summary>
                    {n.q}
                    <span className={s.qaIcon} aria-hidden="true" />
                  </summary>
                  <p>{n.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ FINALE */}
        <section className={s.finale} data-finale aria-labelledby="finale-title">
          <div className={s.finaleBg} aria-hidden="true">
            <img src="/img/talim/tilya-kori.webp" alt="" width={1400} height={788} loading="lazy" decoding="async" />
          </div>
          <div className={`container ${s.finaleInner}`}>
            <TalimLeaves left="#ffffff" right="#f8b700" className={s.finaleMark} />
            <h2 id="finale-title" className={s.finaleTitle} data-reveal>
              {c.finalTitle}
            </h2>
            <p className={s.finaleLede} data-reveal>
              {c.finalLede}
            </p>
            <div className={s.finaleCtas} data-reveal>
              <a {...tg} className={`${s.goldBtn} ${s.goldBtnXl}`}>
                <span className={s.rings} aria-hidden="true" />
                <PlaneMark />
                {talimContact.telegramHandle}
              </a>
              <a href={`tel:${talimContact.phoneHref}`} className={s.glassBtn}>
                <PhoneMark />
                {talimContact.phone}
              </a>
            </div>
            <a href={talimContact.site} target="_blank" rel="noopener noreferrer" className={s.siteLink}>
              {c.site}: {talimContact.siteLabel}
            </a>
          </div>
        </section>
      </main>

      <a {...tg} className={s.sticky} data-sticky data-show="false">
        <PlaneMark />
        {c.stickyCta}
      </a>
    </div>
  );
}

/* ---- the page's own line icons: one 32-unit grid, one stroke ---- */

type GlyphId =
  | "book"
  | "scale"
  | "seal"
  | "clock"
  | "calendar"
  | "globe"
  | "voice"
  | "exam"
  | "video"
  | "cert"
  | "community";

const GLYPHS: Record<GlyphId, React.ReactNode> = {
  book: (
    <>
      <path d="M16 9c-3-2.5-7-3.5-11-3v19c4-.5 8 .5 11 3 3-2.5 7-3.5 11-3V6c-4-.5-8 .5-11 3z" />
      <path d="M16 9v19" />
    </>
  ),
  scale: (
    <>
      <path d="M16 5v22M9 27h14M6 9h20" />
      <path d="M6 9l-3.5 8a3.5 3.5 0 007 0zM26 9l-3.5 8a3.5 3.5 0 007 0z" />
    </>
  ),
  seal: (
    <>
      <circle cx="16" cy="13" r="8" />
      <path d="M12 20l-2 8 6-3 6 3-2-8M13 13l2 2 4-4" />
    </>
  ),
  clock: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M16 10v6l4 3" />
    </>
  ),
  calendar: (
    <>
      <rect x="5" y="7" width="22" height="20" rx="3" />
      <path d="M5 13h22M11 4v6M21 4v6" />
    </>
  ),
  globe: (
    <>
      <circle cx="16" cy="16" r="11" />
      <path d="M5 16h22M16 5c3.5 3 5 7 5 11s-1.5 8-5 11c-3.5-3-5-7-5-11s1.5-8 5-11z" />
    </>
  ),
  voice: (
    <>
      <path d="M6 8h20v13H14l-6 5v-5H6z" />
      <path d="M11 13h10M11 17h6" />
    </>
  ),
  exam: (
    <>
      <rect x="7" y="4" width="18" height="24" rx="2.5" />
      <path d="M11 11l1.5 1.5L15 10M11 18l1.5 1.5L15 17M18 11h3M18 18h3" />
    </>
  ),
  video: (
    <>
      <rect x="4" y="7" width="24" height="18" rx="3" />
      <path d="M14 12v8l6-4z" />
    </>
  ),
  cert: (
    <>
      <rect x="4" y="6" width="24" height="16" rx="2" />
      <path d="M9 11h14M9 15h8" />
      <circle cx="22" cy="21" r="3.5" />
      <path d="M20 24l-1 4 3-1.5 3 1.5-1-4" />
    </>
  ),
  community: (
    <>
      <path d="M4 8h15v10H10l-4 3.5V18H4z" />
      <path d="M22 12h6v10h-2v3.5L22 22h-7v-2" />
    </>
  ),
};

function Glyph({ id }: { id: GlyphId }) {
  return (
    <svg
      viewBox="0 0 32 32"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {GLYPHS[id]}
    </svg>
  );
}
