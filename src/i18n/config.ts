export const locales = ["uz", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

/** BCP-47 tags used for <html lang>, hreflang and Open Graph. */
export const htmlLang: Record<Locale, string> = { uz: "uz-UZ", ru: "ru-UZ" };
export const ogLocale: Record<Locale, string> = { uz: "uz_UZ", ru: "ru_RU" };

export const localeLabel: Record<Locale, string> = { uz: "Oʻz", ru: "Ру" };

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://mezon.uz";
