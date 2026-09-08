import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { isLocale, defaultLocale, type Locale } from "@/i18n/config";
import { getDict } from "@/i18n";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "MEZON";

/** The same 8-point star used across the site, drawn once for the card. */
function starPoints(cx: number, cy: number, r: number) {
  const inner = r * 0.76537;
  return Array.from({ length: 16 }, (_, i) => {
    const a = (i * 22.5 * Math.PI) / 180;
    const rad = i % 2 === 0 ? r : inner;
    return `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
  }).join(" ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : defaultLocale;
  const t = getDict(locale);

  const brandFont = await readFile(
    path.join(process.cwd(), "src/assets/Montserrat-Bold.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #00223d 0%, #003a64 62%, #002d51 100%)",
          position: "relative",
        }}
      >
        <svg
          width="640"
          height="640"
          viewBox="0 0 640 640"
          style={{ position: "absolute", top: -150, right: -120 }}
        >
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#7e91a8",
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          <svg width="22" height="22" viewBox="0 0 22 22">
            <polygon
              points={starPoints(11, 11, 10)}
              fill="none"
              stroke="#f8b700"
              strokeWidth="1.4"
            />
          </svg>
          TOSHKENT, UZBEKISTAN
        </div>

        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: 150,
            color: "#ffffff",
            lineHeight: 1,
            marginTop: 26,
            letterSpacing: 5,
          }}
        >
          MEZON
        </div>
        <div
          style={{
            fontFamily: "Montserrat",
            fontSize: 47,
            color: "#f8b700",
            lineHeight: 1,
            marginTop: 12,
            letterSpacing: 33,
          }}
        >
          KENGASHI
        </div>

        <div
          style={{
            fontSize: 36,
            color: "#e8eef4",
            marginTop: 22,
            maxWidth: 900,
            lineHeight: 1.3,
          }}
        >
          {t.hero.tagline}
        </div>

        <div
          style={{
            height: 2,
            width: "100%",
            marginTop: 40,
            background: "linear-gradient(90deg, #f8b700, rgba(248, 183, 0,0))",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Montserrat", data: brandFont, style: "normal", weight: 700 }],
    },
  );
}
