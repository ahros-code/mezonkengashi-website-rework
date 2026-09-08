# MEZON KENGASHI — Islamic finance advisory, Uzbekistan

Next.js 16 App Router, Uzbek (default) + Russian.

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /uz
npm run build
npm start
```

## Routes

| Route | Contents |
|---|---|
| `/[locale]` | Home: hero, stats, services, council, process, FAQ, contact |
| `/[locale]/about` | Story, principles, timeline, numbers |
| `/[locale]/research` + `/[slug]` | Research and articles |
| `/[locale]/news` + `/[slug]` | Newsroom |
| `/[locale]/events` + `/[slug]` | Programme, upcoming and past |
| `/[locale]/faq` | Categorised questions |

Navigation is five items; Research, News, Events and FAQ sit under the
*Bilim markazi* dropdown. Paths are declared once in `src/lib/routes.ts`, so the
navbar, footer, sitemap and JSON-LD cannot disagree.

## Everything on the page is placeholder data

The logo, palette, typeface and contact details are the client's real ones.
Everything else is still placeholder — before launch, replace:

| What | Where |
|---|---|
| Company name, phone, email, hours (REAL values) | `src/lib/site.ts` |
| Home page copy | `src/i18n/uz.ts`, `src/i18n/ru.ts` |
| Sub-page copy (About, FAQ, listing pages) | `src/i18n/uz.pages.ts`, `src/i18n/ru.pages.ts` |
| News items | `src/content/news.ts` |
| Research and articles | `src/content/research.ts` |
| Events and training | `src/content/events.ts` |
| Council member ids + initials | `src/lib/site.ts` (`boardMembers`, `expertMembers`) |
| Council names, roles, bios, credentials | `council.members` in both dictionaries |
| Production domain | `NEXT_PUBLIC_SITE_URL` (see `.env.example`) |

`src/i18n/uz.ts` is the source of truth for the dictionary shape — `ru.ts` is typed
against it, so a missing Russian key is a build error rather than a blank spot on
the page. The same holds for `uz.pages.ts` / `ru.pages.ts`.

Content in `src/content/` keeps both locales adjacent per field
(`{ uz: "…", ru: "…" }`) rather than in parallel files, so a translation cannot be
forgotten without TypeScript noticing.

### Council portraits

Members are drawn as procedural girih medallions seeded from their id, not photos.
That is deliberate: attaching a stock photograph of a real person to a fabricated
scholar would be a fabricated record. When you have real portraits, add a `photo`
field to the member seeds and render an `<Image>` in place of `<GirihMedallion>`
inside `src/components/Council.tsx`.

## Design system

Everything comes from the brandbook (`references/Mezon_Kengashi_Brandbook.pdf`):

| Token | Value | Role |
|---|---|---|
| `--kobalt` | `#003A64` | brand navy |
| `--nil` | `#00223D` | deepest navy — hero and footer ground |
| `--zar` | `#F8B700` | brand amber |
| `--paper` / `--ganch` | `#FFFFFF` / `#EEF1F5` | light grounds |

Every other token is a tint or shade of those three — there is no fourth hue.

Type is **Montserrat**, the brandbook face, in 400–800. Its `latin` subset covers
`U+02BB–02BC`, so Uzbek `oʻ` / `gʻ` render correctly. **Prata** survives in exactly
one place — the pull-quote inside articles (`--font-accent`) — as the small amount
of secondary type the client allowed. If you drop that usage, remove the font from
`src/app/[locale]/layout.tsx` too rather than shipping an unused download.

### Logo

`scripts/build-brand-assets.js` regenerates `public/brand/` from the
supplied `references/logo horizontal svg.svg`: it splits the mark from the wordmark
and emits the horizontal lockup, an all-white monochrome lockup for dark grounds,
the mark alone, the stacked (primary) lockup rebuilt as vector, and the favicon.

The navbar and footer use `mezon-logo-dark.svg`: the navy parts go white so they
read on the navy ground, while the amber stays amber, so both brand colours are
present. The strict brandbook dark-ground variant is all-amber (`RANG VA MONOXROM`)
— swap the src to `mezon-logo-mono.svg` or regenerate an amber lockup if the client
prefers that. The *CHEKLOVLAR* page rules out gradients, re-ordering and off-palette
tints in any case.

The favicon (`src/app/icon.svg`) is the mark on a transparent ground, with a
`prefers-color-scheme` rule that flips the navy strokes to white in a dark tab strip.

The geometric spine is a khatam (8-point star) tessellation computed in
`src/components/Girih.tsx` — the same construction generates the page background
lattice, the service icons, the process nodes, the FAQ markers, the news and event
date plates, and the council medallions. Tokens and shared materials (`.glass`,
`.grain`, `.rule`, `.btn`) live in `src/app/globals.css`; everything else is a CSS
Module.

Sub-pages share `PageHero` (the lapis band), `Prose` (article body blocks) and
`ArticleView` (the reading layout) so they read as one site, then differentiate
below the fold: research is editorial, news is a dated broadsheet, events are
lapis cards with a date plate, FAQ is a sticky index over stacked accordions.

**Four gotchas, all load-bearing:**

1. Turbopack's CSS Modules rewrite `animation-name` even for keyframes declared in
   `globals.css`, so a module referencing `rise` gets a hashed name that resolves
   to nothing. Any keyframe a module uses is declared in that module. Don't "clean
   up" the duplication.
2. `.glass` is written as `:where(.glass)` so component modules can override
   position, radius or overflow without a specificity fight — bundle order between
   globals and modules is not stable. Because `:where()` is zero-specificity, the
   `button` reset is wrapped in `:where()` too, or it would strip the glass off the
   burger. `.btn` deliberately stays a normal class: `body { color }` is an element
   selector and would otherwise beat it.
3. The navbar contracts on scroll using `transform` on the row, not `padding` on
   the header, so scrolling never forces layout on a fixed element.
4. Anywhere a module class must beat a global one (`.cta` vs `.btn`, `.pill` vs
   `.glass`), the module rule is scoped to a parent so it wins on specificity
   rather than on bundle order, which is not stable between builds.

Motion: one orchestrated hero load sequence, slow ambient drift on the lattice,
and everything else driven by pointer, scroll position or form state. All of it
collapses under `prefers-reduced-motion`.

## SEO

- `/uz` and `/ru` are statically generated; `/` negotiates from `Accept-Language`
  via `src/proxy.ts`.
- Per-page, per-locale title, description, canonical and `hreflang` alternates
  including `x-default`.
- Titles use a short `%s | MEZON` template; pages whose own title already names the
  brand pass `titleAbsolute` to skip it and stay inside ~60 characters.
- `src/lib/jsonld.ts` builds every graph from the same content the page renders,
  so structured data cannot drift from visible copy:
  - home — Organization + ProfessionalService + LocalBusiness (address, geo,
    opening hours, 8 employees, 6-service offer catalog), WebSite, WebPage,
    FAQPage, HowTo
  - about — AboutPage; faq — FAQPage
  - index pages — CollectionPage with an ItemList of their entries
  - research — ScholarlyArticle; news — NewsArticle (author, dates, word count)
  - events — EducationEvent with attendance mode, location and a UZS offer
  - every sub-page also emits a BreadcrumbList
- `sitemap.xml` covers all 22 paths across both locales with per-URL language
  alternates; plus `robots.txt`, a generated `opengraph-image` per locale, and an
  SVG favicon.
- Both council tab panels render into the HTML (the inactive one is `hidden`), so
  all eight names are crawlable without executing JS. The same applies to the FAQ
  page: every category and answer ships in the markup.

## The contact forms

Both the hero quick-form and the main form POST to `src/app/api/lead/route.ts`,
which validates, drops honeypot submissions, and currently only logs. Wire the
CRM / Telegram bot / SMTP at the `TODO(launch)` marker.

Event "register" buttons currently point at the contact section. Give them their
own endpoint when registration is real. The seat number shown is group capacity,
not remaining places — wire it to real availability before taking bookings.

The events pages set `revalidate = 3600` because the upcoming/past split is
computed from the clock; without it a static build would keep showing finished
events as upcoming.

## Image credits

Photographs are from Unsplash (Unsplash License) in `public/img/`:
`hero-tilya-kori.jpg`, `panjara.jpg`, `registan-night.jpg`, `shahizinda.jpg`.
Swap in the client's own photography when available — each is referenced from a
single component.

## The hero's 3D field

`src/components/HeroLattice.tsx` extrudes the same khatam star used everywhere
else and scatters it on a lattice in real space, lit with an amber key against a
navy fill. It is one `InstancedMesh` — the whole field is a single draw call.

It is deliberately conservative about when it runs:

- `three` is a dynamic `import()`, so it never lands in the initial bundle.
- It does not mount at all on coarse pointers or under 900px wide.
- `prefers-reduced-motion` renders one static frame instead of starting a loop.
- An IntersectionObserver stops the loop once the hero scrolls away.
- Device pixel ratio is capped at 1.75.

The CSS lattice underneath stays as the fallback, so nothing disappears if WebGL
is unavailable. The layer is masked away from the reading column — it is depth
behind the type, not a foreground pattern.

## Section backdrops

`SectionBackdrop` gives otherwise plain sections something to sit on: a faint
khatam lattice, a soft wash in the brand colours, a hairline arc echoing the
logo, and optionally a photograph pushed almost all the way back. `placement`
(`right` / `left` / `band`) moves where the weight falls so no two sections look
alike, and `id` must be unique per page because it names the SVG pattern.

Host sections need `position: relative; isolation: isolate; overflow: clip` — the
backdrop sits at `z-index: -1` so static content stays above it without every
container having to be positioned.
