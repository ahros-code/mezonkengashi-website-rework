import { company, serviceOrder } from "./site";
import { SITE_URL, htmlLang, type Locale } from "@/i18n/config";
import type { Dict } from "@/i18n";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

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
    taxID: company.taxId.replace(/\s/g, ""),
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: company.street,
      addressLocality: company.city,
      addressRegion: company.district,
      postalCode: company.postal,
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
