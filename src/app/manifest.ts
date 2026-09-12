import type { MetadataRoute } from "next";
import { getDict } from "@/i18n";
import { company } from "@/lib/site";

/** Web app manifest: install metadata, and one more brand signal for crawlers. */
export default function manifest(): MetadataRoute.Manifest {
  const t = getDict("uz");
  return {
    id: "/uz",
    name: `${company.name} — ${t.footer.tagline}`,
    short_name: company.shortName,
    description: t.meta.description,
    lang: "uz-Latn",
    dir: "ltr",
    start_url: "/uz",
    scope: "/",
    display: "standalone",
    background_color: "#f1eee7",
    theme_color: "#00223d",
    categories: ["finance", "business", "education"],
    icons: [
      { src: "/icon.svg", type: "image/svg+xml", sizes: "any" },
      { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
  };
}
