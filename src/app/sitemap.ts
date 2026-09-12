import type { MetadataRoute } from "next";
import { defaultLocale, hreflang, locales, SITE_URL } from "@/i18n/config";
import { getEvents, getNews, getRegistry, getResearch } from "@/content/source";
import { instructors } from "@/content/talim";
import { boardMembers, expertMembers } from "@/lib/site";

type Entry = {
  path: string;
  lastModified: Date;
  priority: number;
  freq: "daily" | "weekly" | "monthly" | "yearly";
  /** Extra images on the page besides its social card. */
  images?: string[];
};

const newest = (dates: string[], fallback: Date) =>
  dates.length ? new Date(dates.reduce((a, b) => (a > b ? a : b))) : fallback;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [research, news, events, registry] = await Promise.all([
    getResearch(),
    getNews(),
    getEvents(),
    getRegistry(),
  ]);

  // Lists are as fresh as their newest item; lastmod that tracks real changes is
  // the only kind search engines keep trusting.
  const newsDate = newest(news.map((a) => a.date), now);
  const researchDate = newest(research.map((a) => a.date), now);
  const eventsDate = newest(events.map((e) => e.start.slice(0, 10)), now);
  const registryDate = newest(registry.certificates.map((c) => c.issued), now);
  const siteDate = newest([news, research].flat().map((a) => a.date), now);

  const councilPhotos = [...boardMembers, ...expertMembers]
    .filter((m) => m.photo)
    .map((m) => `${SITE_URL}/img/council/${m.id}.webp`);

  const entries: Entry[] = [
    { path: "", lastModified: siteDate, priority: 1, freq: "weekly", images: councilPhotos },
    { path: "/about", lastModified: siteDate, priority: 0.8, freq: "monthly", images: councilPhotos },
    { path: "/research", lastModified: researchDate, priority: 0.9, freq: "weekly" },
    { path: "/news", lastModified: newsDate, priority: 0.9, freq: "daily" },
    { path: "/events", lastModified: eventsDate, priority: 0.9, freq: "weekly" },
    { path: "/faq", lastModified: siteDate, priority: 0.8, freq: "monthly" },
    { path: "/certificates", lastModified: registryDate, priority: 0.8, freq: "weekly" },
    {
      path: "/talim",
      lastModified: siteDate,
      priority: 0.8,
      freq: "monthly",
      images: instructors.map((p) => `${SITE_URL}${p.photo}`),
    },
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
    ...registry.certificates.map((c) => ({
      path: `/certificates/${c.number}`,
      lastModified: new Date(c.issued),
      priority: 0.5,
      freq: "monthly" as const,
    })),
  ];

  // Every URL is emitted once per edition, each carrying the full hreflang
  // cluster (all editions plus x-default), so the set is reciprocal.
  return entries.flatMap((entry) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [hreflang[l], `${SITE_URL}/${l}${entry.path}`])),
      "x-default": `${SITE_URL}/${defaultLocale}${entry.path}`,
    };
    return locales.map((locale) => {
      const url = `${SITE_URL}/${locale}${entry.path}`;
      return {
        url,
        lastModified: entry.lastModified,
        changeFrequency: entry.freq,
        priority: locale === defaultLocale ? entry.priority : Math.round((entry.priority - 0.1) * 10) / 10,
        alternates: { languages },
        images: [`${url}/opengraph-image`, ...(entry.images ?? [])],
      };
    });
  });
}
