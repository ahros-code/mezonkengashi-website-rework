import type { MetadataRoute } from "next";
import { locales, SITE_URL } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified,
    changeFrequency: "monthly",
    priority: locale === "uz" ? 1 : 0.9,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}`])),
    },
  }));
}
