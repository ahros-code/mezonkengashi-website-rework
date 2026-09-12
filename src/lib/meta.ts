import type { Metadata } from "next";
import { defaultLocale, hreflang, locales, ogLocale, SITE_URL, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { brandName } from "@/lib/site";

/** Absolute URL of a route in one edition; `path` has no locale prefix ("" is home). */
export function localeUrl(locale: Locale, path: string) {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * Canonical, the hreflang set (every edition plus x-default) and the feed links.
 *
 * Next merges `alternates` shallowly, so a page that sets any of it replaces all
 * of it: every page goes through here to keep the language map and the RSS
 * autodiscovery links on every URL.
 */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const t = getDict(locale);
  return {
    canonical: localeUrl(locale, path),
    languages: {
      ...Object.fromEntries(locales.map((l) => [hreflang[l], localeUrl(l, path)])),
      "x-default": localeUrl(defaultLocale, path),
    },
    types: {
      "application/rss+xml": [
        { url: `${SITE_URL}/${locale}/news/feed.xml`, title: `${t.news.title} — ${brandName(locale)}` },
        { url: `${SITE_URL}/${locale}/research/feed.xml`, title: `${t.research.title} — ${brandName(locale)}` },
      ],
    },
  };
}

/** og:locale:alternate, without repeating the current tag (both Uzbek editions are uz_UZ). */
export function alternateOgLocales(locale: Locale) {
  return [...new Set(locales.map((l) => ogLocale[l]))].filter((tag) => tag !== ogLocale[locale]);
}

/**
 * Canonical + hreflang + Open Graph for a sub-page. `path` is the route without
 * the locale prefix, e.g. "/news/some-slug" (empty string for the home page).
 *
 * og:image is deliberately left out: each segment's opengraph-image file fills
 * it in, and setting `images` here would stop Next from doing so.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  titleAbsolute = false,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
  keywords,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Set when the title already contains the brand, to skip the suffix. */
  titleAbsolute?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  keywords?: string[];
}): Metadata {
  const url = localeUrl(locale, path);

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    ...(keywords?.length ? { keywords } : {}),
    alternates: alternatesFor(locale, path),
    openGraph: {
      type,
      url,
      siteName: brandName(locale),
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: alternateOgLocales(locale),
      ...(type === "article"
        ? { publishedTime, modifiedTime: modifiedTime ?? publishedTime, authors, section, tags }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
