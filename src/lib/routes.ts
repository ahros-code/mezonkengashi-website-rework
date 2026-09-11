import type { Locale } from "@/i18n/config";

/** Single source of truth for every path, so nav, sitemap and JSON-LD agree. */
export const paths = {
  home: (l: Locale) => `/${l}`,
  about: (l: Locale) => `/${l}/about`,
  research: (l: Locale) => `/${l}/research`,
  researchItem: (l: Locale, slug: string) => `/${l}/research/${slug}`,
  news: (l: Locale) => `/${l}/news`,
  newsItem: (l: Locale, slug: string) => `/${l}/news/${slug}`,
  events: (l: Locale) => `/${l}/events`,
  eventItem: (l: Locale, slug: string) => `/${l}/events/${slug}`,
  faq: (l: Locale) => `/${l}/faq`,
  certificates: (l: Locale) => `/${l}/certificates`,
  certificate: (l: Locale, number: string) => `/${l}/certificates/${number}`,
  talim: (l: Locale) => `/${l}/talim`,
  /** Home-page sections, reachable from any page. */
  services: (l: Locale) => `/${l}#services`,
  service: (l: Locale, id: string) => `/${l}#service-${id}`,
  council: (l: Locale) => `/${l}#council`,
  process: (l: Locale) => `/${l}#process`,
  contact: (l: Locale) => `/${l}#contact`,
} as const;

/** Paths without a locale prefix, for building alternates and the sitemap. */
export const staticRoutes = ["", "/about", "/research", "/news", "/events", "/faq", "/certificates", "/talim"] as const;
