# MEZON — Islamic finance advisory, Tashkent

One-page site, Next.js 16 App Router, Uzbek (default) + Russian.

```bash
npm install
npm run dev     # http://localhost:3000 → redirects to /uz
npm run build
npm start
```

## Everything on the page is placeholder data

Nothing here is real. Before launch, replace:

| What | Where |
|---|---|
| Company name, address, phone, email, tax ID | `src/lib/site.ts` |
| All Uzbek copy | `src/i18n/uz.ts` |
| All Russian copy | `src/i18n/ru.ts` |
| Council member ids + initials | `src/lib/site.ts` (`boardMembers`, `expertMembers`) |
| Council names, roles, bios, credentials | `council.members` in both dictionaries |
| Production domain | `NEXT_PUBLIC_SITE_URL` (see `.env.example`) |

`src/i18n/uz.ts` is the source of truth for the dictionary shape — `ru.ts` is typed
against it, so a missing Russian key is a build error rather than a blank spot on
the page.

### Council portraits

Members are drawn as procedural girih medallions seeded from their id, not photos.
That is deliberate: attaching a stock photograph of a real person to a fabricated
scholar would be a fabricated record. When you have real portraits, add a `photo`
field to the member seeds and render an `<Image>` in place of `<GirihMedallion>`
inside `src/components/Council.tsx`.

## Design system

Palette is taken from Samarkand majolica rather than the usual green-and-gold
Islamic-finance template: lapis ground (`--nil`, `--kobalt`), a single turquoise
accent (`--firuza`), saffron gold for hairlines and marks only (`--zar`), and
ganch lime-plaster for the light sections (`--ganch`).

Type is **Prata** (display, Didone) + **Golos Text** (body). Both carry Cyrillic;
Prata's `latin` subset includes `U+02BB–02BC`, so Uzbek `oʻ` / `gʻ` render in the
display face without falling back.

The geometric spine is a khatam (8-point star) tessellation computed in
`src/components/Girih.tsx` — the same construction generates the page background
lattice, the service icons, the process nodes, the FAQ markers and the council
medallions. Tokens and shared materials (`.glass`, `.grain`, `.rule`, `.btn`) live
in `src/app/globals.css`; everything else is a CSS Module.

**Gotcha:** Turbopack's CSS Modules rewrite `animation-name` even for keyframes
declared in `globals.css`, so a module referencing `rise` gets a hashed name that
resolves to nothing. Any keyframe a module uses is therefore declared in that
module. Don't "clean up" the duplication.

Motion: one orchestrated hero load sequence, slow ambient drift on the lattice,
and everything else driven by pointer, scroll position or form state. All of it
collapses under `prefers-reduced-motion`.

## SEO

- `/uz` and `/ru` are statically generated; `/` negotiates from `Accept-Language`
  via `src/proxy.ts`.
- Per-locale title, description, keywords, canonical, and `hreflang` alternates
  including `x-default`.
- `src/lib/jsonld.ts` emits one `@graph`: Organization + ProfessionalService +
  LocalBusiness (with address, geo, opening hours, 8 employees, 6-service offer
  catalog), WebSite, WebPage, FAQPage, HowTo. It is built from the same dictionary
  the page renders, so structured data cannot drift from visible copy.
- `sitemap.xml` with per-URL language alternates, `robots.txt`, generated
  `opengraph-image` per locale, SVG favicon.
- Both council tab panels render into the HTML (the inactive one is `hidden`), so
  all eight names are crawlable without executing JS.

## The contact forms

Both the hero quick-form and the main form POST to `src/app/api/lead/route.ts`,
which validates, drops honeypot submissions, and currently only logs. Wire the
CRM / Telegram bot / SMTP at the `TODO(launch)` marker.

## Image credits

Photographs are from Unsplash (Unsplash License) in `public/img/`:
`hero-tilya-kori.jpg`, `panjara.jpg`, `registan-night.jpg`, `shahizinda.jpg`.
Swap in the client's own photography when available — each is referenced from a
single component.
