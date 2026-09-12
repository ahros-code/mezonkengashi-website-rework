import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocale, defaultLocale, SITE_URL, type Locale } from "@/i18n/config";
import { script } from "@/content/types";

/**
 * Social cards. Every page segment has an opengraph-image file that calls this,
 * because Next only attaches a file-based image to the segment it lives in: a
 * page that sets its own `openGraph` would otherwise ship without og:image.
 *
 * The fonts are the full Montserrat builds (latin-ext + cyrillic-ext), so ў, қ,
 * ғ, ҳ and Russian render in the brand face rather than as missing glyphs.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const PLACE: Record<Locale, string> = {
  uz: "TOSHKENT, OʻZBEKISTON",
  oz: script("TOSHKENT, OʻZBEKISTON", "oz"),
  ru: "ТАШКЕНТ, УЗБЕКИСТАН",
};

const HOST = new URL(SITE_URL).host.toUpperCase();

let fonts: Promise<{ bold: Buffer; semi: Buffer }> | undefined;
function loadFonts() {
  return (fonts ??= Promise.all([
    readFile(path.join(process.cwd(), "src/assets/Montserrat-Bold.ttf")),
    readFile(path.join(process.cwd(), "src/assets/Montserrat-SemiBold.ttf")),
  ]).then(([bold, semi]) => ({ bold, semi })));
}

/** The same 8-point star used across the site. */
function starPoints(cx: number, cy: number, r: number) {
  const inner = r * 0.76537;
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    const rad = i % 2 === 0 ? r : inner;
    return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  }).join(" ");
}

function clip(text: string, max: number) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,:;—–-]\s*$/, "") + "…";
}

export function ogLocale(raw: string): Locale {
  return isLocale(raw) ? raw : defaultLocale;
}

/**
 * `title` absent: the brand card (big wordmark + tagline), used for the home page.
 * `title` present: the page card — small wordmark, kicker, and the page title set large.
 */
export async function ogImage({
  locale,
  title,
  kicker,
  tagline,
}: {
  locale: Locale;
  title?: string;
  kicker?: string;
  tagline?: string;
}) {
  const { bold, semi } = await loadFonts();
  const heading = title ? clip(title, 120) : "";
  const headingSize = heading.length <= 42 ? 72 : heading.length <= 78 ? 60 : 50;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "68px 80px",
          background: "linear-gradient(135deg, #00223d 0%, #003a64 62%, #002d51 100%)",
          position: "relative",
          fontFamily: "Montserrat",
        }}
      >
        <svg width="640" height="640" viewBox="0 0 640 640" style={{ position: "absolute", top: -150, right: -120 }}>
          {[300, 232, 164, 96].map((r, i) => (
            <polygon
              key={r}
              points={starPoints(320, 320, r)}
              fill="none"
              stroke="#f8b700"
              strokeWidth="2"
              opacity={0.18 - i * 0.025}
            />
          ))}
        </svg>

        {title ? (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flexGrow: 1, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="30" height="30" viewBox="0 0 22 22">
                <polygon points={starPoints(11, 11, 10)} fill="none" stroke="#f8b700" strokeWidth="1.6" />
              </svg>
              <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color: "#ffffff", letterSpacing: 3 }}>
                MEZON
                <span style={{ color: "#f8b700", marginLeft: 12, fontSize: 22, letterSpacing: 8, alignSelf: "center" }}>
                  KENGASHI
                </span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", maxWidth: 1000 }}>
              {kicker && (
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: "#f8b700",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 22,
                  }}
                >
                  {clip(kicker, 60)}
                </div>
              )}
              <div style={{ fontSize: headingSize, fontWeight: 700, color: "#ffffff", lineHeight: 1.12 }}>
                {heading}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  height: 2,
                  width: "100%",
                  background: "linear-gradient(90deg, #f8b700, rgba(248, 183, 0, 0))",
                }}
              />
              <div style={{ fontSize: 22, fontWeight: 600, color: "#7e91a8", letterSpacing: 2, marginTop: 20 }}>
                {`${PLACE[locale]} · ${HOST}`}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", flexGrow: 1, width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, color: "#7e91a8", fontSize: 26, fontWeight: 600, letterSpacing: 2 }}>
              <svg width="22" height="22" viewBox="0 0 22 22">
                <polygon points={starPoints(11, 11, 10)} fill="none" stroke="#f8b700" strokeWidth="1.4" />
              </svg>
              {PLACE[locale]}
            </div>
            <div style={{ fontSize: 150, fontWeight: 700, color: "#ffffff", lineHeight: 1, marginTop: 26, letterSpacing: 5 }}>
              MEZON
            </div>
            <div style={{ fontSize: 47, fontWeight: 700, color: "#f8b700", lineHeight: 1, marginTop: 12, letterSpacing: 33 }}>
              KENGASHI
            </div>
            {tagline && (
              <div style={{ fontSize: 36, fontWeight: 600, color: "#e8eef4", marginTop: 22, maxWidth: 900, lineHeight: 1.3 }}>
                {tagline}
              </div>
            )}
            <div
              style={{
                height: 2,
                width: "100%",
                marginTop: 40,
                background: "linear-gradient(90deg, #f8b700, rgba(248, 183, 0, 0))",
              }}
            />
          </div>
        )}
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Montserrat", data: bold, style: "normal", weight: 700 },
        { name: "Montserrat", data: semi, style: "normal", weight: 600 },
      ],
    },
  );
}
