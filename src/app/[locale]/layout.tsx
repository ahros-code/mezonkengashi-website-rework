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
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import VisitTrail from "@/components/VisitTrail";
import "../globals.css";

const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-prata",
});

/* The brandbook typeface. Uzbek needs U+02BB, which sits in the latin subset. */
const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext", "cyrillic"],
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

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t.meta.title,
      template: "%s | Mezon Kengashi",
    },
    description: t.meta.description,
    keywords: [...t.meta.keywords],
    applicationName: "Mezon Kengashi",
    authors: [{ name: "Mezon Kengashi" }],
    creator: "Mezon Kengashi",
    publisher: "Mezon Kengashi",
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        uz: `${SITE_URL}/uz`,
        ru: `${SITE_URL}/ru`,
        "x-default": `${SITE_URL}/uz`,
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}/${locale}`,
      siteName: "Mezon Kengashi",
      title: t.meta.title,
      description: t.meta.description,
      locale: ogLocale[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => ogLocale[l]),
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
    formatDetection: { telephone: true, address: true, email: true },
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
    <html lang={htmlLang[locale as Locale]} className={`${montserrat.variable} ${prata.variable}`}>
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
