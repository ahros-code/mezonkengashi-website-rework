import type { MetadataRoute } from "next";
import { locales, SITE_URL } from "@/i18n/config";
import { news } from "@/content/news";
import { research } from "@/content/research";
import { events } from "@/content/events";

type Entry = { path: string; lastModified: Date; priority: number; freq: "daily" | "weekly" | "monthly" | "yearly" };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entries: Entry[] = [
    { path: "", lastModified: now, priority: 1, freq: "monthly" },
    { path: "/about", lastModified: now, priority: 0.8, freq: "yearly" },
    { path: "/research", lastModified: now, priority: 0.9, freq: "weekly" },
    { path: "/news", lastModified: now, priority: 0.9, freq: "weekly" },
    { path: "/events", lastModified: now, priority: 0.9, freq: "weekly" },
    { path: "/faq", lastModified: now, priority: 0.8, freq: "monthly" },
    ...research.map((a) => ({
      path: `/research/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.7,
      freq: "yearly" as const,
    })),
    ...news.map((a) => ({
      path: `/news/${a.slug}`,
      lastModified: new Date(a.date),
      priority: 0.6,
      freq: "yearly" as const,
    })),
    ...events.map((e) => ({
      path: `/events/${e.slug}`,
      lastModified: new Date(e.start),
      priority: 0.7,
      freq: "monthly" as const,
    })),
  ];

  // Every URL is emitted once per locale, each carrying the full alternate set.
  return entries.flatMap((entry) =>
    locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${entry.path}`,
      lastModified: entry.lastModified,
      changeFrequency: entry.freq,
      priority: locale === "uz" ? entry.priority : entry.priority - 0.1,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${SITE_URL}/${l}${entry.path}`]),
        ),
      },
    })),
  );
}
