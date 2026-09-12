import {
  aaoifi,
  addressLine,
  boardMembers,
  brandAliases,
  brandName,
  company,
  expertMembers,
  serviceOrder,
  teamMembers,
} from "./site";
import { SITE_URL, htmlLang, locales, type Locale } from "@/i18n/config";
import { talimContact } from "@/content/talim";
import type { Dict } from "@/i18n";

/*
 * One linked entity graph per page.
 *
 * The organisation, the website, the people and the services carry stable,
 * locale-independent @ids, so every page in every edition describes the same
 * entities: search engines and AI answer engines merge them into one
 * knowledge-graph node instead of guessing whether "Mezon Kengashi" and
 * "Мезон Кенгаши" are the same company.
 */

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;
export const LOGO_ID = `${SITE_URL}/#logo`;
export const personId = (id: string) => `${SITE_URL}/#person-${id}`;
export const serviceId = (id: string) => `${SITE_URL}/#service-${id}`;

const UZBEKISTAN = { "@type": "Country", name: "Uzbekistan", identifier: "UZ" };

/**
 * What the organisation is an authority on — stated once, in English, because
 * that is the vocabulary knowledge graphs key these topics on.
 */
const KNOWS_ABOUT = [
  "Islamic finance",
  "Shariah compliance",
  "Shariah audit",
  "Shariah supervisory board",
  "Fatwa",
  "AAOIFI Shariah Standards",
  "AAOIFI accounting standards (FAS)",
  "Sukuk",
  "Murabaha",
  "Ijara",
  "Musharaka",
  "Mudaraba",
  "Salam",
  "Istisna",
  "Takaful",
  "Waqf",
  "Zakat calculation",
  "Halal investment",
  "Islamic banking in Uzbekistan",
  "Islamic dispute resolution (tahkim)",
  "CPSS exam preparation",
];

/** Selectors for text worth reading aloud (Google Assistant, voice answers). */
const SPEAKABLE = {
  "@type": "SpeakableSpecification",
  cssSelector: ["h1", "[data-speakable]"],
};

function logo() {
  return {
    "@type": "ImageObject",
    "@id": LOGO_ID,
    url: `${SITE_URL}/icon-512.png`,
    contentUrl: `${SITE_URL}/icon-512.png`,
    width: 512,
    height: 512,
    caption: company.name,
  };
}

function address() {
  return {
    "@type": "PostalAddress",
    streetAddress: company.street,
    addressLocality: company.city,
    addressRegion: company.region,
    addressCountry: company.country,
  };
}

/** The standards body the council represents in Uzbekistan. */
const AAOIFI_ID = `${SITE_URL}/#aaoifi`;

function aaoifiNode() {
  return {
    "@type": "Organization",
    "@id": AAOIFI_ID,
    name: aaoifi.name,
    legalName: aaoifi.fullName,
    url: aaoifi.url,
    address: { "@type": "PostalAddress", addressLocality: aaoifi.city, addressCountry: aaoifi.country },
  };
}

function people(t: Dict) {
  return [...boardMembers, ...expertMembers, ...teamMembers].map(({ id, photo }) => {
    const m = t.council.members[id as keyof typeof t.council.members];
    return {
      "@type": "Person",
      "@id": personId(id),
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      ...(photo ? { image: `${SITE_URL}/img/council/${id}.webp` } : {}),
      worksFor: { "@id": ORG_ID },
      knowsAbout: ["Islamic finance", "Shariah"],
      hasCredential: m.credentials.map((c) => ({
        "@type": "EducationalOccupationalCredential",
        name: c,
      })),
    };
  });
}

function services(locale: Locale, t: Dict) {
  return serviceOrder.map((id) => {
    const s = t.services.items[id];
    return {
      "@type": "Service",
      "@id": serviceId(id),
      name: s.name,
      description: s.summary,
      serviceType: s.name,
      url: `${SITE_URL}/${locale}#service-${id}`,
      provider: { "@id": ORG_ID },
      areaServed: UZBEKISTAN,
      availableLanguage: ["uz", "ru"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: s.name,
        itemListElement: s.points.map((p) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: p },
        })),
      },
    };
  });
}

/** The organisation, fully described. Only the home and about pages carry it whole. */
export function organizationNode(locale: Locale, t: Dict) {
  const url = `${SITE_URL}/${locale}`;
  return {
    "@type": ["Organization", "ProfessionalService"],
    "@id": ORG_ID,
    name: brandName(locale),
    alternateName: brandAliases.filter((a) => a !== brandName(locale)),
    legalName: company.legalName,
    url,
    logo: logo(),
    image: [`${SITE_URL}/${locale}/opengraph-image`, `${SITE_URL}/icon-512.png`],
    description: t.meta.description,
    slogan: t.hero.tagline,
    foundingDate: String(company.founded),
    foundingLocation: { "@type": "Place", name: company.city, address: address() },
    email: company.email,
    telephone: company.phone,
    priceRange: "$$$",
    currenciesAccepted: "UZS",
    address: address(),
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressLine)}`,
    // The standing stated on the company brochure, as a machine-readable claim.
    hasCredential: {
      "@type": "EducationalOccupationalCredential",
      name: `Official representative of ${aaoifi.name} in Uzbekistan`,
      credentialCategory: "Official representation",
      recognizedBy: { "@id": AAOIFI_ID },
    },
    areaServed: [UZBEKISTAN, { "@type": "City", name: "Tashkent" }],
    knowsAbout: KNOWS_ABOUT,
    knowsLanguage: locales.map((l) => htmlLang[l]),
    sameAs: [company.telegram, talimContact.site, talimContact.telegram],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: company.phone,
        email: company.email,
        url: `${url}#contact`,
        areaServed: "UZ",
        availableLanguage: ["Uzbek", "Russian"],
        hoursAvailable: {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: company.hoursOpen,
          closes: company.hoursClose,
        },
      },
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        name: "Telegram",
        url: company.telegram,
        areaServed: "UZ",
        availableLanguage: ["Uzbek", "Russian"],
      },
      {
        "@type": "ContactPoint",
        contactType: "admissions",
        name: "Mezon Taʼlim",
        telephone: talimContact.phone,
        url: talimContact.telegram,
        availableLanguage: ["Uzbek"],
      },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: company.hoursOpen,
        closes: company.hoursClose,
      },
    ],
    // Only the seated council members and the staff are real people; the
    // editorial byline is not.
    employee: [...boardMembers, ...expertMembers, ...teamMembers].map(({ id }) => ({ "@id": personId(id) })),
    subOrganization: { "@id": `${SITE_URL}/#talim` },
    makesOffer: serviceOrder.map((id) => ({
      "@type": "Offer",
      itemOffered: { "@id": serviceId(id) },
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: serviceOrder.map((id, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: { "@id": serviceId(id) },
      })),
    },
  };
}

/** The site itself, with the registry search as its SearchAction. */
export function websiteNode(locale: Locale) {
  return {
    "@type": "WebSite",
    "@id": SITE_ID,
    url: `${SITE_URL}/${locale}`,
    name: brandName(locale),
    alternateName: brandAliases.filter((a) => a !== brandName(locale)),
    inLanguage: locales.map((l) => htmlLang[l]),
    publisher: { "@id": ORG_ID },
    copyrightHolder: { "@id": ORG_ID },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/${locale}/certificates?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildJsonLd(locale: Locale, t: Dict) {
  const url = `${SITE_URL}/${locale}`;

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    mainEntity: { "@id": ORG_ID },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    speakable: SPEAKABLE,
    significantLink: [
      `${url}/about`,
      `${url}/certificates`,
      `${url}/research`,
      `${url}/faq`,
      `${url}/talim`,
    ],
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const howTo = {
    "@type": "HowTo",
    "@id": `${url}#process`,
    name: t.process.title,
    description: t.process.lede,
    inLanguage: htmlLang[locale],
    step: t.process.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.body,
      url: `${url}#process`,
    })),
  };

  return graph(
    organizationNode(locale, t),
    aaoifiNode(),
    websiteNode(locale),
    webPage,
    ...services(locale, t),
    ...people(t),
    faq,
    howTo,
  );
}

/* ------------------------------------------------------------------ *
 * Sub-page graphs. Each is built from the same content the page shows.
 * Every sub-page also carries a slim organisation + website node so the
 * page is self-describing even when crawled in isolation.
 * ------------------------------------------------------------------ */

export function breadcrumbs(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  const last = trail[trail.length - 1];
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}/${locale}${last?.path ?? ""}#breadcrumb`,
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}/${locale}${t.path}`,
    })),
  };
}

/** Wraps nodes in a graph, adding the brand entities every page references. */
export function graph(...nodes: object[]) {
  const ids = new Set(nodes.map((n) => (n as { "@id"?: string })["@id"]));
  const base: object[] = [];
  if (!ids.has(ORG_ID)) {
    base.push({
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: company.name,
      alternateName: [...brandAliases],
      url: SITE_URL,
      logo: logo(),
      sameAs: [company.telegram, talimContact.site],
    });
  }
  if (!ids.has(SITE_ID)) {
    base.push({ "@type": "WebSite", "@id": SITE_ID, url: SITE_URL, name: company.name, publisher: { "@id": ORG_ID } });
  }
  return { "@context": "https://schema.org", "@graph": [...nodes, ...base] };
}

/** Index pages: a CollectionPage plus an ItemList of what it links to. */
export function collectionPage({
  locale,
  path,
  name,
  description,
  items,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  items: { name: string; path: string }[];
}) {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    "@type": "CollectionPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": SITE_ID },
    publisher: { "@id": ORG_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${url}/opengraph-image`, width: 1200, height: 630 },
    speakable: SPEAKABLE,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        url: `${SITE_URL}/${locale}${it.path}`,
      })),
    },
  };
}

export function articleNode({
  locale,
  path,
  type,
  headline,
  description,
  datePublished,
  dateModified,
  authorId,
  authorName,
  section,
  wordCount,
  readingMinutes,
  keywords,
}: {
  locale: Locale;
  path: string;
  type: "NewsArticle" | "ScholarlyArticle";
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  /** Key into the council roster; "mezon" is the in-house editorial group. */
  authorId: string;
  authorName: string;
  section: string;
  wordCount: number;
  readingMinutes?: number;
  keywords?: string[];
}) {
  const url = `${SITE_URL}/${locale}${path}`;
  const isPerson = authorId !== "mezon";
  return {
    "@type": type,
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url, url, breadcrumb: { "@id": `${url}#breadcrumb` } },
    headline: headline.slice(0, 110),
    name: headline,
    description,
    abstract: description,
    inLanguage: htmlLang[locale],
    datePublished,
    dateModified: dateModified ?? datePublished,
    wordCount,
    ...(readingMinutes ? { timeRequired: `PT${readingMinutes}M` } : {}),
    articleSection: section,
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
    image: {
      "@type": "ImageObject",
      url: `${url}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    author: isPerson
      ? { "@type": "Person", "@id": personId(authorId), name: authorName, worksFor: { "@id": ORG_ID } }
      : { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    copyrightHolder: { "@id": ORG_ID },
    copyrightYear: Number(datePublished.slice(0, 4)),
    isAccessibleForFree: true,
    isPartOf: { "@id": SITE_ID },
    about: { "@type": "Thing", name: "Islamic finance" },
    speakable: SPEAKABLE,
  };
}

export function eventNode({
  locale,
  path,
  name,
  description,
  start,
  end,
  format,
  venue,
  city,
  price,
  seats,
  hostName,
}: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  start: string;
  end: string;
  format: "onsite" | "online" | "hybrid";
  venue: string;
  city: string;
  price: number;
  seats: number;
  hostName: string;
}) {
  const url = `${SITE_URL}/${locale}${path}`;
  const mode =
    format === "online"
      ? "https://schema.org/OnlineEventAttendanceMode"
      : format === "hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode";

  const physical = {
    "@type": "Place",
    name: venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressCountry: company.country,
    },
  };
  const virtual = { "@type": "VirtualLocation", url };
  const location = format === "online" ? virtual : format === "hybrid" ? [physical, virtual] : physical;

  return {
    "@type": "EducationEvent",
    "@id": `${url}#event`,
    url,
    name,
    description,
    inLanguage: htmlLang[locale],
    startDate: start,
    endDate: end,
    eventAttendanceMode: mode,
    eventStatus: "https://schema.org/EventScheduled",
    maximumAttendeeCapacity: seats,
    location,
    image: [`${url}/opengraph-image`],
    organizer: { "@id": ORG_ID, "@type": "Organization", name: company.name, url: SITE_URL },
    performer: { "@type": "Person", name: hostName },
    isAccessibleForFree: price === 0,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "UZS",
      availability: "https://schema.org/InStock",
      url,
      validFrom: new Date().toISOString().slice(0, 10),
    },
  };
}

export function faqNode(
  locale: Locale,
  path: string,
  items: { q: string; a: string }[],
) {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    url,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    speakable: SPEAKABLE,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function aboutNode({
  locale,
  name,
  description,
}: {
  locale: Locale;
  name: string;
  description: string;
}) {
  const url = `${SITE_URL}/${locale}/about`;
  return {
    "@type": "AboutPage",
    "@id": `${url}#page`,
    url,
    name,
    description,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": SITE_ID },
    mainEntity: { "@id": ORG_ID },
    breadcrumb: { "@id": `${url}#breadcrumb` },
    speakable: SPEAKABLE,
  };
}

/** Council members, for the about page: the people behind the signatures. */
export function peopleNodes(t: Dict) {
  return people(t);
}
