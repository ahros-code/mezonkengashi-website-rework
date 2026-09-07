/**
 * Company facts that do not change between locales.
 * All values here are placeholder data for the design review — replace before launch.
 */
export const company = {
  name: "MEZON",
  legalName: 'MEZON Islamic Finance Advisory LLC',
  founded: 2013,
  email: "info@mezon.uz",
  phone: "+998 71 200 40 40",
  phoneHref: "+998712004040",
  telegram: "https://t.me/mezon_uz",
  street: "Mustaqillik shoh koʻchasi 107B",
  district: "Mirzo Ulugʻbek",
  city: "Toshkent",
  postal: "100000",
  country: "UZ",
  lat: 41.3111,
  lng: 69.2797,
  taxId: "3 0 5 4 4 1 9 8 7",
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
