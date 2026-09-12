import type { Metadata, Viewport } from "next";
import { Prata, Montserrat } from "next/font/google";
import { notFound } from "next/navigation";
import {
  locales,
  isLocale,
  htmlLang,
  ogLocale,
  SITE_URL,
  type Locale,
} from "@/i18n/config";
import { getDict } from "@/i18n";
import { alternatesFor, alternateOgLocales } from "@/lib/meta";
import { brandName, company } from "@/lib/site";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VisitTrail from "@/components/VisitTrail";
import "../globals.css";

/* cyrillic-ext carries the Uzbek-only letters ў қ ғ ҳ. */
const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-prata",
});

/* The brandbook typeface. Uzbek needs U+02BB, which sits in the latin subset. */
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  variable: "--font-montserrat",
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f1eee7" },
    { media: "(prefers-color-scheme: dark)", color: "#00223d" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  const brand = brandName(locale);

  /* Search-console ownership tags, set per deployment. */
  const verification: Metadata["verification"] = {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION || undefined,
    other: {
      ...(process.env.NEXT_PUBLIC_BING_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_VERIFICATION }
        : {}),
    },
  };

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.meta.title,
      template: `%s | ${brand}`,
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    applicationName: brand,
    authors: [{ name: brand, url: `${SITE_URL}/${locale}/about` }],
    creator: brand,
    publisher: brand,
    category: "finance",
    classification: "Islamic finance consulting, Shariah audit and certification",
    alternates: alternatesFor(locale, ""),
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      siteName: brand,
      title: t.meta.title,
      description: t.meta.description,
      locale: ogLocale[locale],
      alternateLocale: alternateOgLocales(locale),
      emails: [company.email],
      phoneNumbers: [company.phone],
      countryName: company.countryName,
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    verification,
    formatDetection: { telephone: true, address: true, email: true },
    /* Regional signals some engines (Yandex, Bing) still read. No geo.position:
       the office coordinates are not published, and a guessed pin is worse than none. */
    other: {
      "geo.region": "UZ-TK",
      "geo.placename": locale === "ru" ? "Ташкент" : locale === "oz" ? "Тошкент" : "Toshkent",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = getDict(locale);

  return (
    <html lang={htmlLang[locale as Locale]} dir="ltr" className={`${montserrat.variable} ${prata.variable}`}>
      <body>
        <a href="#main" className="skip">
          {t.nav.skip}
        </a>
        <Nav t={t} locale={locale} />
        {children}
        <Footer t={t} locale={locale} />
        <VisitTrail />
      </body>
    </html>
  );
}
