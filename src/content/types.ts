import type { Locale } from "@/i18n/config";

/** Every translatable string keeps its locales adjacent so they cannot drift. */
export type L = Record<Locale, string>;

export function pick(v: L, locale: Locale) {
  return v[locale];
}

export type Block =
  | { type: "p"; text: L }
  | { type: "h"; text: L }
  | { type: "ul"; items: L[] }
  | { type: "quote"; text: L; by: L };

export type CategoryId =
  | "fiqh"
  | "market"
  | "accounting"
  | "zakat"
  | "audit"
  | "law"
  | "company"
  | "partnership"
  | "regulation"
  | "method";

export const categoryLabel: Record<CategoryId, L> = {
  fiqh: { uz: "Fiqh", ru: "Фикх" },
  market: { uz: "Bozor", ru: "Рынок" },
  accounting: { uz: "Hisob", ru: "Учёт" },
  zakat: { uz: "Zakot", ru: "Закят" },
  audit: { uz: "Audit", ru: "Аудит" },
  law: { uz: "Huquq", ru: "Право" },
  company: { uz: "Kompaniya", ru: "Компания" },
  partnership: { uz: "Hamkorlik", ru: "Партнёрство" },
  regulation: { uz: "Tartibga solish", ru: "Регулирование" },
  method: { uz: "Uslubiyat", ru: "Методология" },
};

export type Article = {
  slug: string;
  /** ISO date, used for datePublished and for sorting. */
  date: string;
  category: CategoryId;
  readingMinutes: number;
  /** Key into t.council.members — the byline resolves through the dictionary. */
  author: string;
  title: L;
  excerpt: L;
  body: Block[];
};

export type EventFormat = "onsite" | "online" | "hybrid";

export type MezonEvent = {
  slug: string;
  /** ISO start, in Asia/Tashkent. */
  start: string;
  end: string;
  format: EventFormat;
  venue: L;
  city: L;
  seats: number;
  /** UZS, or 0 for a free event. */
  price: number;
  host: string;
  title: L;
  excerpt: L;
  audience: L;
  agenda: { time: string; text: L }[];
  outcomes: L[];
};

export function byNewestFirst<T extends { date?: string; start?: string }>(a: T, b: T) {
  const av = a.date ?? a.start ?? "";
  const bv = b.date ?? b.start ?? "";
  return bv.localeCompare(av);
}

/** Locale-correct long date, without pulling in a formatting library. */
export function formatDate(iso: string, locale: Locale, withTime = false) {
  const d = new Date(iso);
  const tag = locale === "ru" ? "ru-RU" : "uz-UZ";
  const opts: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tashkent",
  };
  if (withTime) {
    opts.hour = "2-digit";
    opts.minute = "2-digit";
  }
  return new Intl.DateTimeFormat(tag, opts).format(d);
}

/**
 * Day of the month as it falls in Tashkent. The date plates previously read this
 * off getUTCDate(), which disagrees with the Tashkent month label rendered beside
 * it for anything scheduled before 05:00 local.
 */
export function dayInTashkent(iso: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: "Asia/Tashkent",
  }).format(new Date(iso));
}

export type PluralForms = {
  uz: string;
  /** Russian needs three forms: 1 place, 2 places, 5 places. */
  ru: [one: string, few: string, many: string];
};

/**
 * "N thing", agreeing with the numeral. Uzbek takes no plural after a numeral;
 * Russian picks a form from the last digit, with 11–14 always taking `many`.
 */
export function countLabel(n: number, locale: Locale, forms: PluralForms) {
  if (locale !== "ru") return `${n} ${forms.uz}`;
  const mod100 = n % 100;
  const mod10 = n % 10;
  const form =
    mod100 >= 11 && mod100 <= 14
      ? forms.ru[2]
      : mod10 === 1
        ? forms.ru[0]
        : mod10 >= 2 && mod10 <= 4
          ? forms.ru[1]
          : forms.ru[2];
  return `${n} ${form}`;
}

export function formatPrice(price: number, locale: Locale) {
  if (price === 0) return locale === "ru" ? "Бесплатно" : "Bepul";
  const tag = locale === "ru" ? "ru-RU" : "uz-UZ";
  const n = new Intl.NumberFormat(tag).format(price);
  return locale === "ru" ? `${n} сум` : `${n} soʻm`;
}

/** Rough word count for the article schema — good enough for a signal. */
export function countWords(blocks: Block[], locale: Locale) {
  let n = 0;
  const add = (s: string) => {
    n += s.trim().split(/\s+/).filter(Boolean).length;
  };
  for (const b of blocks) {
    if (b.type === "p" || b.type === "h") add(b.text[locale]);
    else if (b.type === "ul") b.items.forEach((i) => add(i[locale]));
    else if (b.type === "quote") {
      add(b.text[locale]);
      add(b.by[locale]);
    }
  }
  return n;
}
