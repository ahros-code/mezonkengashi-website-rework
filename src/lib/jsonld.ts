import { company, serviceOrder } from "./site";
import { SITE_URL, htmlLang, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

export const ORG_ID = `${SITE_URL}/#organization`;
export const SITE_ID = `${SITE_URL}/#website`;

export function buildJsonLd(locale: Locale, t: Dict) {
  const url = `${SITE_URL}/${locale}`;

  const organization = {
    "@type": ["Organization", "ProfessionalService", "LocalBusiness"],
    "@id": ORG_ID,
    name: company.name,
    legalName: company.legalName,
    url,
    logo: `${SITE_URL}/icon.svg`,
    image: `${SITE_URL}/opengraph-image`,
    description: t.meta.description,
    slogan: t.hero.tagline,
    foundingDate: String(company.founded),
    email: company.email,
    telephone: company.phone,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.city,
      addressCountry: company.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: company.lat, longitude: company.lng },
    areaServed: { "@type": "Country", name: "Uzbekistan" },
    knowsLanguage: ["uz", "ru"],
    sameAs: [company.telegram],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    employee: [
      ...Object.values(t.council.members).map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: m.role,
        description: m.bio,
      })),
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: t.services.title,
      itemListElement: serviceOrder.map((id, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: t.services.items[id].name,
          description: t.services.items[id].summary,
          serviceType: t.services.items[id].name,
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "Country", name: "Uzbekistan" },
        },
      })),
    },
  };

  const website = {
    "@type": "WebSite",
    "@id": SITE_ID,
    url,
    name: company.name,
    inLanguage: htmlLang[locale],
    publisher: { "@id": ORG_ID },
  };

  const webPage = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: t.meta.title,
    description: t.meta.description,
    inLanguage: htmlLang[locale],
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    primaryImageOfPage: `${SITE_URL}/opengraph-image`,
  };

  const faq = {
    "@type": "FAQPage",
    "@id": `${url}#faq`,
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
    step: t.process.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.body,
    })),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [organization, website, webPage, faq, howTo],
  };
}

/* ------------------------------------------------------------------ *
 * Sub-page graphs. Each is built from the same content the page shows.
 * ------------------------------------------------------------------ */

export function breadcrumbs(
  locale: Locale,
  trail: { name: string; path: string }[],
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE_URL}/${locale}${t.path}`,
    })),
  };
}

export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
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
  authorName,
  section,
  wordCount,
}: {
  locale: Locale;
  path: string;
  type: "NewsArticle" | "ScholarlyArticle";
  headline: string;
  description: string;
  datePublished: string;
  authorName: string;
  section: string;
  wordCount: number;
}) {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    "@type": type,
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline,
    description,
    inLanguage: htmlLang[locale],
    datePublished,
    dateModified: datePublished,
    wordCount,
    articleSection: section,
    image: `${SITE_URL}/${locale}/opengraph-image`,
    author: { "@type": "Person", name: authorName, worksFor: { "@id": ORG_ID } },
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": SITE_ID },
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

  const place =
    format === "online"
      ? { "@type": "VirtualLocation", url }
      : {
          "@type": "Place",
          name: venue,
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressCountry: company.country,
          },
        };

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
    location: place,
    organizer: { "@id": ORG_ID },
    performer: { "@type": "Person", name: hostName },
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: "UZS",
      availability: "https://schema.org/InStock",
      url: `${SITE_URL}/${locale}${path}`,
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
  };
}
