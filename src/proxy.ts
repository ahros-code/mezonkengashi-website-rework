import { NextResponse, type NextRequest } from "next/server";
import { locales, defaultLocale, htmlLang, hreflang, isLocale, SITE_URL, type Locale } from "@/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Picks an edition from Accept-Language, falling back to Latin Uzbek.
 * Only an explicit Cyrillic tag (uz-Cyrl) selects the Cyrillic edition: a bare
 * "uz" means the official Latin script.
 */
function negotiate(header: string | null): Locale {
  if (!header) return defaultLocale;
  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const primary = tag.split("-")[0];
    if (primary === "ru") return "ru";
    if (primary === "uz") return tag.includes("cyrl") ? "oz" : "uz";
  }
  return defaultLocale;
}

/**
 * The same alternates the <head> carries, repeated as an HTTP Link header.
 * Crawlers that read headers before HTML (Bing, Yandex) get the language map
 * without parsing the page.
 */
function linkHeader(rest: string) {
  const entries = locales.map((l) => `<${SITE_URL}/${l}${rest}>; rel="alternate"; hreflang="${hreflang[l]}"`);
  entries.push(`<${SITE_URL}/${defaultLocale}${rest}>; rel="alternate"; hreflang="x-default"`);
  return entries.join(", ");
}

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    // The Sanity Studio is not a localised page and must not be redirected.
    pathname.startsWith("/studio") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) {
    const response = NextResponse.next();
    response.headers.set("Content-Language", htmlLang[first]);
    response.headers.set("Link", linkHeader(pathname.slice(first.length + 1)));
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${negotiate(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
  const redirect = NextResponse.redirect(url);
  // The target depends on the language header; caches must not share it.
  redirect.headers.set("Vary", "Accept-Language");
  return redirect;
}

export const config = {
  matcher: ["/((?!_next|api|studio|.*\\..*).*)"],
};
