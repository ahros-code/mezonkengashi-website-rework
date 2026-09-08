/**
 * Company facts that do not change between locales.
 * Contact details are the client's real ones; the rest is still placeholder.
 */
export const company = {
  name: "MEZON KENGASHI",
  shortName: "MEZON",
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

export type MemberSeed = { id: string; initials: string };

export const boardMembers: MemberSeed[] = [
  { id: "nurmatov", initials: "AN" },
  { id: "qosimov", initials: "ZQ" },
  { id: "rahmonov", initials: "IR" },
  { id: "yuldosheva", initials: "MY" },
];

export const expertMembers: MemberSeed[] = [
  { id: "ismoilov", initials: "BI" },
  { id: "sattorova", initials: "NS" },
  { id: "turayev", initials: "JT" },
  { id: "aliyev", initials: "SA" },
];
