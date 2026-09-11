# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Organisations and their boards** (banks, takaful operators, leasing and investment firms, halal-certification seekers in Uzbekistan) looking for a shariah board, audit, certification or advisory. They arrive to judge credibility and make contact.
- **Learners** (bank staff, lawyers, accountants, students, and people entering Islamic finance) who want recognised Islamic finance training in Uzbek. They come to the Mezon Ta'lim section to choose a course and enrol.

The site is bilingual: Uzbek (default) and Russian.

## Product Purpose

The marketing and reference site for **Mezon Kengashi**, an Islamic finance advisory in Tashkent. It covers the shariah council, audit, dispute resolution, education, consulting and zakat services. It also carries a public certificate registry and a knowledge centre (research, news, events, FAQ). Success means an organisation requests a consultation or checks a certificate, or a learner enrols in a Mezon Ta'lim course.

## Positioning

Mezon Kengashi has a seated shariah board of named scholars plus a separate legal council, so a shariah opinion is both religiously grounded and legally enforceable. **Mezon Ta'lim** is its education sub-brand and the only provider of AAOIFI CPSS exam preparation taught in Uzbek. It is taught by practitioners, including a former AAOIFI Shariah Board member.

## Operating Context

- Enquiries go by phone and Telegram. The main site's lead form posts to `/api/lead`.
- Mezon Ta'lim enrolment goes through Telegram **@mezontalim_admin** and phone **+998 90 109 77 99**. Its standalone site is https://mezon-talim.uz.
- Editorial content is managed in Sanity at `/studio` and falls back to the bundled content in `src/content/`.

## Capabilities and Constraints

- Next.js 16 App Router with CSS Modules, statically generated per locale. Every translatable string exists in both `uz` and `ru`.
- Mezon Ta'lim confirmed course: **AAOIFI CPSS preparation in Uzbek**. 15 weeks, 30 lessons, about 90 hours, weekends (Sat/Sun, 3 h). Hybrid: online plus in person in Tashkent. 61 shariah standards across 9 modules. Includes a practice exam, recordings of every lesson, a completion certificate and an online Q&A community. The start date listed on mezon-talim.uz is 8 August 2026.
- CPSS modules: Islamic finance fundamentals; Islamic financial contracts; services and partnerships; options and promises; guarantees, credits and mortgages; debt relations; Islamic social finance; Islamic banking; Islamic financial markets.
- **Open:** Mezon Ta'lim runs more courses than CPSS, but they are not yet listed. Any other course shown is a labelled placeholder until the client supplies the real ones.

## Brand Commitments

- Mezon Kengashi: navy `#003A64`, amber `#F8B700` and white (brandbook in `references/`). Montserrat.
- Mezon Ta'lim: an open-book mark with a navy left leaf and an amber right leaf, and the wordmark "MEZON" in navy with "TA'LIM" in amber. The sub-brand's section should feel premium and distinct from the main site while still visibly belonging to the Mezon family.

## Evidence on Hand

- Mezon Ta'lim instructors (real, from mezon-talim.uz):
  - Khondamir Nusratkhodjaev: AAOIFI Shariah Board member 2016–2023, 26 years in international finance.
  - Mukhtorjon Akramov: programme director, graduate of the International Islamic Academy of Uzbekistan, 5 years in Islamic finance and law.
  - Muzaffar Khusnidinov: CSAA (Certified Shariah Advisor and Auditor), waqf practitioner, MBA in Finance.
- Graduates report the course helped them pass the CPSS exam. No quotable testimonial text or pass rates are on hand, so none may be invented.
- **Absent:** course photos, graduate counts, prices, and course titles other than CPSS. Show labelled placeholder slots and never fabricate these.

## Product Principles

1. Credibility is shown through named people, standards and documents, never through adjectives.
2. Both languages are first-class. A half-translated surface is a defect.
3. Placeholder content is always labelled as such and lives in one swappable place.
4. Every path leads to a human contact: Telegram or phone.
