import { getDict } from "@/i18n";
import { ogImage, ogLocale } from "@/lib/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mezon Kengashi";
export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const locale = ogLocale((await params).locale);
  const t = getDict(locale);
  return ogImage({ locale, kicker: t.knowledge.label, title: t.research.title });
}