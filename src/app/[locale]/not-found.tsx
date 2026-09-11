import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";
import { getEvents, getNews, getResearch } from "@/content/source";
import type { L } from "@/content/types";
import NotFoundView, {
  type KnownPage,
  type NotFoundCopy,
  type SectionId,
} from "@/components/NotFoundView";

export const metadata: Metadata = {
  title: "404",
  robots: { index: false, follow: true },
};

/** A dictionary label in both locales. */
function both(pick: (t: ReturnType<typeof getDict>) => string): L {
  return { uz: pick(getDict("uz")), ru: pick(getDict("ru")) };
}

/**
 * not-found receives no params, so the view reads the locale off the URL and
 * gets the copy for both. The catalogue of real pages feeds "did you mean".
 */
export default async function NotFound() {
  const copy = Object.fromEntries(
    locales.map((l) => {
      const t = getDict(l);
      const labels: Record<SectionId, string> = {
        services: t.nav.services,
        council: t.nav.council,
        about: t.nav.about,
        research: t.nav.research,
        news: t.nav.news,
        events: t.nav.events,
        faq: t.nav.faq,
        contact: t.nav.contact,
      };
      return [l, { ...t.notFound, labels } satisfies NotFoundCopy];
    }),
  ) as Record<Locale, NotFoundCopy>;

  /* A CMS outage must never turn a 404 into a 500. */
  const [research, news, events] = await Promise.all([
    getResearch().catch(() => []),
    getNews().catch(() => []),
    getEvents().catch(() => []),
  ]);

  const known: KnownPage[] = [
    { path: "/about", title: both((t) => t.nav.about) },
    { path: "/research", title: both((t) => t.nav.research) },
    { path: "/news", title: both((t) => t.nav.news) },
    { path: "/events", title: both((t) => t.nav.events) },
    { path: "/faq", title: both((t) => t.nav.faq) },
    { path: "/certificates", title: both((t) => t.registry.title) },
    ...research.map((a) => ({ path: `/research/${a.slug}`, title: a.title })),
    ...news.map((a) => ({ path: `/news/${a.slug}`, title: a.title })),
    ...events.map((e) => ({ path: `/events/${e.slug}`, title: e.title })),
  ];

  return <NotFoundView copy={copy} known={known} />;
}
