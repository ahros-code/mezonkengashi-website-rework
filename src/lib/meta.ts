import type { Metadata } from "next";
import { locales, ogLocale, SITE_URL, type Locale } from "@/i18n/config";

/**
 * Canonical + hreflang + Open Graph for a sub-page. `path` is the route without
 * the locale prefix, e.g. "/news/some-slug" (empty string for the home page).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  titleAbsolute = false,
  type = "website",
  publishedTime,
  authors,
  section,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Set when the title already contains the brand, to skip the suffix. */
  titleAbsolute?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  section?: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;

  return {
    title: titleAbsolute ? { absolute: title } : title,
    description,
    alternates: {
      canonical: url,
      languages: {
        ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
        "x-default": `${SITE_URL}/uz${path}`,
      },
    },
    openGraph: {
      type,
      url,
      siteName: "MEZON",
      title,
      description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
      ...(type === "article"
        ? { publishedTime, authors, section }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
