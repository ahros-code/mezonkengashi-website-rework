import type { Locale } from "@/i18n/config";

/**
 * Company facts that do not change between locales.
 * Everything here is from the company brochure (references/Mezon Kengashi (RUS).pdf).
 */
export const company = {
  name: "Mezon Kengashi",
  shortName: "Mezon Kengashi",
  legalName: "«Mezon Kengashi» MChJ",
  founded: 2023,
  email: "info@mezonkengashi.uz",
  phone: "+998 50 700-77-99",
  phoneHref: "+998507007799",
  /* Telegram is how people here actually get in touch, so it leads the contacts.
     Links read "Telegram" rather than printing the handle. */
  telegram: "https://t.me/Mezon_adm",
  street: "BHH Tower, Sariqsuv koʻchasi 38",
  city: "Toshkent",
  region: "Olmazor tumani, Toshkent",
  country: "UZ",
  countryName: "Oʻzbekiston",
  hoursOpen: "09:00",
  hoursClose: "18:00",
} as const;

/** The full postal line, as one string. */
export const addressLine = `${company.street}, ${company.city}, ${company.countryName}`;

/**
 * The standards body the council represents in Uzbekistan. Stated on the cover
 * of the company brochure: "Официальный представитель AAOIFI в Узбекистане".
 */
export const aaoifi = {
  name: "AAOIFI",
  fullName: "Accounting and Auditing Organization for Islamic Financial Institutions",
  url: "https://aaoifi.com",
  city: "Manama",
  country: "BH",
} as const;

/**
 * The brand as each edition writes it. Russian copy keeps the Latin name; the
 * Cyrillic edition spells it in Cyrillic, which is also what people type when
 * they search in that script.
 */
export function brandName(locale: Locale) {
  return locale === "oz" ? "Мезон Кенгаши" : company.name;
}

/** Every spelling the organisation is known by, for schema.org alternateName. */
export const brandAliases = [
  "Mezon Kengashi",
  "MEZON KENGASHI",
  "Мезон Кенгаши",
  "Mezon Council",
  "Mezon Taʼlim",
  "Mezon",
] as const;

export type ServiceId =
  | "council"
  | "audit"
  | "dispute"
  | "education"
  | "consulting"
  | "zakat";

export const serviceOrder: ServiceId[] = [
  "council",
  "audit",
  "dispute",
  "education",
  "consulting",
  "zakat",
];

/** Grid footprint for the services mosaic — deliberately uneven. */
export const serviceSpan: Record<ServiceId, string> = {
  council: "feature",
  audit: "wide",
  dispute: "tall",
  education: "std",
  consulting: "std",
  zakat: "wide",
};

export type MemberSeed = {
  id: string;
  initials: string;
  /** A real portrait exists at /img/council/<id>.webp; otherwise the medallion carries the monogram. */
  photo?: boolean;
};

/** Islom moliyasi kengashi — the scholars who issue the shariah opinion. */
export const boardMembers: MemberSeed[] = [
  /* The chair leads the roster. */
  { id: "razzoqov", initials: "YR", photo: true },
  { id: "sultonxojaev", initials: "AS", photo: true },
  { id: "qosimov", initials: "MQ", photo: true },
  { id: "umarxodjayev", initials: "MU", photo: true },
  { id: "saydaraliev", initials: "SS", photo: true },
  { id: "rozaliyev", initials: "HR", photo: true },
  { id: "qurbonov", initials: "IQ", photo: true },
  { id: "akramov", initials: "MA", photo: true },
];

/** Yuridik kengash — the lawyers who make the opinion enforceable. */
export const expertMembers: MemberSeed[] = [
  { id: "usmanov", initials: "JU", photo: true },
  { id: "rajabov", initials: "NR", photo: true },
  { id: "amanbaev", initials: "DA", photo: true },
  { id: "shermatov", initials: "SS", photo: true },
  { id: "husanov", initials: "SH", photo: true },
];

/**
 * The people who run the engagements. Every one of them holds the AAOIFI
 * certification named in their credentials.
 */
export const teamMembers: MemberSeed[] = [
  { id: "xusniddinov", initials: "MX", photo: true },
  { id: "xolboboev", initials: "OX", photo: true },
  { id: "oripova", initials: "IO", photo: true },
  { id: "kaxramonov", initials: "AK", photo: true },
  { id: "nusratxojayev", initials: "XN", photo: true },
];
