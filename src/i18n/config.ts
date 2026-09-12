/**
 * Three editions: Uzbek in Latin script (the primary one), Uzbek in Cyrillic,
 * and Russian. The Cyrillic edition's segment is `oz`, the convention Uzbek
 * sites use for it (gov.uz, lex.uz); search engines read the script from the
 * hreflang and <html lang> tags, not from the URL.
 */
export const locales = ["uz", "oz", "ru"] as const;
export type Locale = (typeof locales)[number];

/**
 * The languages content is actually written in. The Cyrillic edition is
 * generated from the Latin copy (see ./translit), so neither the dictionaries
 * nor the CMS carry a third field.
 */
export const contentLocales = ["uz", "ru"] as const;
export type ContentLocale = (typeof contentLocales)[number];

export const defaultLocale: Locale = "uz";

/** BCP-47 tags for <html lang>, JSON-LD inLanguage and Content-Language. */
export const htmlLang: Record<Locale, string> = { uz: "uz-Latn-UZ", oz: "uz-Cyrl-UZ", ru: "ru-UZ" };

/**
 * hreflang values. Plain "uz" points generic Uzbek searches at the Latin
 * edition, which is the official script; Cyrillic is marked by its script tag.
 */
export const hreflang: Record<Locale, string> = { uz: "uz", oz: "uz-Cyrl", ru: "ru" };

/** Tags handed to Intl for dates and numbers. */
export const intlLocale: Record<Locale, string> = { uz: "uz-Latn-UZ", oz: "uz-Cyrl-UZ", ru: "ru-RU" };

/** Open Graph has no script subtag, so both Uzbek editions are uz_UZ. */
export const ogLocale: Record<Locale, string> = { uz: "uz_UZ", oz: "uz_UZ", ru: "ru_RU" };

export const localeLabel: Record<Locale, string> = { uz: "Oʻz", oz: "Ўз", ru: "Ру" };

/** Full names, for the switcher's accessible labels and for llms.txt. */
export const localeName: Record<Locale, string> = {
  uz: "Oʻzbekcha (lotin)",
  oz: "Ўзбекча (кирилл)",
  ru: "Русский",
};

export function isLocale(v: string): v is Locale {
  return (locales as readonly string[]).includes(v);
}

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://mezonkengashi.uz";
