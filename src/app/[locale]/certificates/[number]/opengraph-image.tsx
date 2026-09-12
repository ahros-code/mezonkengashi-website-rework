import { getDict } from "@/i18n";
import { ogImage, ogLocale } from "@/lib/og";
import { getRegistry } from "@/content/source";
import { certificateStatus, pick } from "@/content/types";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Mezon Kengashi";

export default async function Image({ params }: { params: Promise<{ locale: string; number: string }> }) {
  const { locale: raw, number } = await params;
  const locale = ogLocale(raw);
  const t = getDict(locale);
  const { organizations, certificates } = await getRegistry();
  const cert = certificates.find((c) => c.number.toLowerCase() === decodeURIComponent(number).toLowerCase());
  const org = cert && organizations.find((o) => o.slug === cert.org);
  if (!cert || !org) return ogImage({ locale, title: t.registry.title });
  return ogImage({
    locale,
    kicker: `${cert.number} · ${t.registry.status[certificateStatus(cert)]}`,
    title: `${org.name}: ${pick(cert.subject, locale)}`,
  });
}
