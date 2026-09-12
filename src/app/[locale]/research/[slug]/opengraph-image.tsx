import { getDict } from "@/i18n";
import { ogImage, ogLocale } from "@/lib/og";
import { getResearch } from "@/content/source";
import { categoryLabel, pick } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mezon Kengashi";

export default async function Image({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const article = (await getResearch()).find((a) => a.slug === slug);
  if (!article) return ogImage({ locale, title: getDict(locale).research.title });
  return ogImage({
    locale,
    kicker: pick(categoryLabel[article.category], locale),
    title: pick(article.title, locale),
  });
}
