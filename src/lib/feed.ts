import "server-only";
import { getDict } from "@/i18n";
import { SITE_URL, htmlLang, isLocale, locales, type Locale } from "@/i18n/config";
import { byNewestFirst, categoryLabel, pick, type Article, type Block } from "@/content/types";
import { brandName, company } from "@/lib/site";

/*
 * RSS 2.0 for the news and research sections, one feed per edition. Feed
 * readers, Yandex and Bing pick up new material from these faster than from
 * the sitemap, and the full text in content:encoded lets aggregators quote it.
 */

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function html(blocks: Block[], locale: Locale) {
  return blocks
    .map((b) => {
      switch (b.type) {
        case "h":
          return `<h3>${esc(pick(b.text, locale))}</h3>`;
        case "p":
          return `<p>${esc(pick(b.text, locale))}</p>`;
        case "ul":
          return `<ul>${b.items.map((i) => `<li>${esc(pick(i, locale))}</li>`).join("")}</ul>`;
        case "quote":
          return `<blockquote><p>${esc(pick(b.text, locale))}</p><footer>${esc(pick(b.by, locale))}</footer></blockquote>`;
      }
    })
    .join("");
}

export function feedParams() {
  return locales.map((locale) => ({ locale }));
}

export function rss({
  rawLocale,
  section,
  articles,
}: {
  rawLocale: string;
  section: "news" | "research";
  articles: Article[];
}) {
  if (!isLocale(rawLocale)) return new Response("Not found", { status: 404 });
  const locale = rawLocale;
  const t = getDict(locale);
  const copy = section === "news" ? t.news : t.research;
  const home = `${SITE_URL}/${locale}/${section}`;
  const self = `${home}/feed.xml`;
  const items = [...articles].sort(byNewestFirst);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
<title>${esc(`${copy.title} — ${brandName(locale)}`)}</title>
<link>${home}</link>
<atom:link href="${self}" rel="self" type="application/rss+xml"/>
<description>${esc(copy.metaDescription)}</description>
<language>${htmlLang[locale].toLowerCase()}</language>
<copyright>© ${company.legalName}</copyright>
<image><url>${SITE_URL}/icon-512.png</url><title>${esc(brandName(locale))}</title><link>${home}</link></image>
${items[0] ? `<lastBuildDate>${new Date(items[0].date).toUTCString()}</lastBuildDate>` : ""}
${items
  .map((a) => {
    const link = `${home}/${a.slug}`;
    const author = t.council.members[a.author as keyof typeof t.council.members];
    return `<item>
<title>${esc(pick(a.title, locale))}</title>
<link>${link}</link>
<guid isPermaLink="true">${link}</guid>
<pubDate>${new Date(a.date).toUTCString()}</pubDate>
<dc:creator>${esc(author?.name ?? brandName(locale))}</dc:creator>
<category>${esc(pick(categoryLabel[a.category], locale))}</category>
<description>${esc(pick(a.excerpt, locale))}</description>
<content:encoded><![CDATA[${html(a.body, locale).replace(/]]>/g, "]]]]><![CDATA[>")}]]></content:encoded>
<enclosure url="${link}/opengraph-image" type="image/png" length="0"/>
</item>`;
  })
  .join("\n")}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=1800, stale-while-revalidate=86400",
    },
  });
}
