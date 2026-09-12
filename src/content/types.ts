import { intlLocale, type ContentLocale, type Locale } from "@/i18n/config";
import { toCyrillic } from "@/i18n/translit";

/** Every translatable string keeps its locales adjacent so they cannot drift. */
export type L = Record<ContentLocale, string>;

/** The string for a locale; the Cyrillic edition is read off the Latin one. */
export function pick(v: L, locale: Locale): string {
  return locale === "oz" ? toCyrillic(v.uz) : v[locale];
}

/** Same, for plain strings written in Uzbek Latin (organisation names, UI literals). */
export function script(text: string, locale: Locale): string {
  return locale === "oz" ? toCyrillic(text) : text;
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
  const tag = intlLocale[locale];
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
  if (locale !== "ru") return `${n} ${script(forms.uz, locale)}`;
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
  if (price === 0) return locale === "ru" ? "Бесплатно" : script("Bepul", locale);
  const n = new Intl.NumberFormat(intlLocale[locale]).format(price);
  return locale === "ru" ? `${n} сум` : `${n} ${script("soʻm", locale)}`;
}

/** Rough word count for the article schema — good enough for a signal. */
export function countWords(blocks: Block[], locale: Locale) {
  let n = 0;
  /* CMS content can arrive with a locale missing, and a word count is never
     worth failing a render over. */
  const add = (s: string | undefined | null) => {
    n += (s ?? "").trim().split(/\s+/).filter(Boolean).length;
  };
  // Transliteration keeps word boundaries, so the Latin count stands for Cyrillic.
  const l: ContentLocale = locale === "ru" ? "ru" : "uz";
  for (const b of blocks) {
    if (b.type === "p" || b.type === "h") add(b.text[l]);
    else if (b.type === "ul") b.items.forEach((i) => add(i[l]));
    else if (b.type === "quote") {
      add(b.text[l]);
      add(b.by[l]);
    }
  }
  return n;
}

/* ---------------------------------------------------------------------------
   Clients and the certificate registry
   --------------------------------------------------------------------------- */

export type SectorId =
  | "bank"
  | "leasing"
  | "takaful"
  | "investment"
  | "fintech"
  | "construction"
  | "microfinance"
  | "business";

export const sectorLabel: Record<SectorId, L> = {
  bank: { uz: "Bank", ru: "Банк" },
  leasing: { uz: "Lizing", ru: "Лизинг" },
  takaful: { uz: "Takaful", ru: "Такафул" },
  investment: { uz: "Investitsiya", ru: "Инвестиции" },
  fintech: { uz: "Fintex", ru: "Финтех" },
  construction: { uz: "Qurilish", ru: "Строительство" },
  microfinance: { uz: "Mikromoliya", ru: "Микрофинансы" },
  business: { uz: "Halol biznes", ru: "Халяль-бизнес" },
};

/** An organisation the council has worked with. */
export type Organization = {
  slug: string;
  name: string;
  sector: SectorId;
  city: L;
  /** Year the relationship began, where it is on record. */
  since?: number;
  /** What the council did for them, when it is worth naming. */
  work?: L;
  /** absolute URL of the logo, when the CMS has one; a monogram stands in otherwise */
  logo?: string;
};

export type CertificateKind = "product" | "operations" | "fund" | "sukuk";

export const certificateKindLabel: Record<CertificateKind, L> = {
  product: { uz: "Mahsulot sertifikati", ru: "Сертификат продукта" },
  operations: { uz: "Faoliyat sertifikati", ru: "Сертификат деятельности" },
  fund: { uz: "Fond sertifikati", ru: "Сертификат фонда" },
  sukuk: { uz: "Sukuk emissiyasi sertifikati", ru: "Сертификат выпуска сукук" },
};

export type Certificate = {
  /** public registry number, also the URL segment, e.g. MK-2026-0142 */
  number: string;
  /** Organization.slug */
  org: string;
  kind: CertificateKind;
  /** what was certified: a product, a fund, the whole operation */
  subject: L;
  /** standards the review was made against */
  standards: string[];
  /** ISO dates */
  issued: string;
  validUntil: string;
  /** withdrawn before expiry; the registry keeps the entry so the record stays honest */
  revoked?: boolean;
  /** original signed scan, when the CMS has one */
  file?: string;
};

export type CertificateStatus = "valid" | "expired" | "revoked";

/** Revocation wins; otherwise the dates decide, compared in Tashkent. */
export function certificateStatus(c: Certificate, now = new Date()): CertificateStatus {
  if (c.revoked) return "revoked";
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tashkent" }).format(now);
  return c.validUntil < today ? "expired" : "valid";
}

/** Two letters for a monogram: initials of the first two words. */
export function monogram(name: string) {
  const words = name.replace(/["«»“”]/g, "").split(/\s+/).filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? words[0]?.[1] ?? "")).toUpperCase();
}
