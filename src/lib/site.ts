/**
 * Company facts that do not change between locales.
 * Contact details are the client's real ones; the rest is still placeholder.
 */
export const company = {
  name: "Mezon Kengashi",
  shortName: "Mezon Kengashi",
  legalName: "MEZON KENGASHI",
  founded: 2013,
  email: "info@mezonkengashi.uz",
  phone: "+998 50 700-77-99",
  phoneHref: "+998507007799",
  telegram: "https://t.me/mezonkengashi",
  city: "Toshkent",
  country: "UZ",
  countryName: "Oʻzbekiston",
  lat: 41.3111,
  lng: 69.2797,
  hoursOpen: "09:00",
  hoursClose: "18:00",
} as const;

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
  { id: "sultonxojaev", initials: "AS", photo: true },
  { id: "razzoqov", initials: "YR", photo: true },
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
  { id: "husanov", initials: "SH", photo: true },
];
