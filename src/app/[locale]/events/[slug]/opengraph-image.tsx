import { getDict } from "@/i18n";
import { ogImage, ogLocale } from "@/lib/og";
import { getEvents } from "@/content/source";
import { formatDate, pick } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mezon Kengashi";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const event = (await getEvents()).find((e) => e.slug === slug);
  if (!event) return ogImage({ locale, title: getDict(locale).events.title });
  return ogImage({
    locale,
    kicker: `${formatDate(event.start, locale)} · ${pick(event.city, locale)}`,
    title: pick(event.title, locale),
  });
}
