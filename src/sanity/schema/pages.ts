import { defineField, defineType, type FieldDefinition } from "sanity";
import { requireBothLocales } from "./locale";

/**
 * Page copy — the headings, ledes and search-engine text wrapped around each
 * Bilim markazi listing.
 *
 * Only editorial copy lives here. Interface chrome that repeats across the site
 * (button words, "N daqiqalik oʻqish", the format names) stays in src/i18n:
 * those are part of the design, they change when the design changes, and
 * putting them in front of an editor invites a half-translated interface.
 */

const seoGroup = { name: "seo", title: "Qidiruv tizimlari" };
const copyGroup = { name: "copy", title: "Sahifa matni", default: true };

const shared: FieldDefinition[] = [
  defineField({
    name: "metaTitle",
    title: "Meta sarlavha",
    type: "localeString",
    description: "Brauzer yorligʻida va Google natijalarida koʻrinadi.",
    group: "seo",
    validation: (rule) => rule.custom((v) => requireBothLocales(v, "Meta sarlavha")),
  }),
  defineField({
    name: "metaDescription",
    title: "Meta tavsif",
    type: "localeText",
    description: "Google natijalaridagi izoh. 150–160 belgi.",
    group: "seo",
    validation: (rule) => rule.custom((v) => requireBothLocales(v, "Meta tavsif")),
  }),
  defineField({ name: "kicker", title: "Yuqoridagi kichik yozuv", type: "localeString", group: "copy" }),
  defineField({
    name: "title",
    title: "Sahifa sarlavhasi",
    type: "localeString",
    group: "copy",
    validation: (rule) => rule.custom((v) => requireBothLocales(v, "Sahifa sarlavhasi")),
  }),
  defineField({ name: "lede", title: "Kirish matni", type: "localeText", group: "copy" }),
];

/** Singletons: one document each, so the title is the document name. */
function pageType(name: string, title: string, extra: FieldDefinition[] = []) {
  return defineType({
    name,
    title,
    type: "document",
    groups: [copyGroup, seoGroup],
    fields: [...shared, ...extra],
    preview: { prepare: () => ({ title }) },
  });
}

export const researchPage = pageType("researchPage", "Tadqiqotlar sahifasi", [
  defineField({ name: "featured", title: "“Tanlangan material” yozuvi", type: "localeString", group: "copy" }),
  defineField({ name: "all", title: "“Barcha materiallar” yozuvi", type: "localeString", group: "copy" }),
]);

export const newsPage = pageType("newsPage", "Yangiliklar sahifasi", [
  defineField({ name: "latest", title: "“Soʻnggi xabar” yozuvi", type: "localeString", group: "copy" }),
]);

export const eventsPage = pageType("eventsPage", "Tadbirlar sahifasi", [
  defineField({ name: "upcoming", title: "“Yaqin tadbirlar” yozuvi", type: "localeString", group: "copy" }),
  defineField({ name: "past", title: "“Oʻtgan tadbirlar” yozuvi", type: "localeString", group: "copy" }),
  defineField({
    name: "noUpcoming",
    title: "Tadbir yoʻq boʻlgandagi matn",
    type: "localeText",
    group: "copy",
  }),
]);

export const faqPage = pageType("faqPage", "Savol-javob sahifasi", [
  defineField({ name: "stillTitle", title: "Pastdagi blok sarlavhasi", type: "localeString", group: "copy" }),
  defineField({ name: "stillBody", title: "Pastdagi blok matni", type: "localeText", group: "copy" }),
  defineField({ name: "stillCta", title: "Pastdagi tugma yozuvi", type: "localeString", group: "copy" }),
]);

/** Every singleton id, so the Studio structure and the seed script agree. */
export const singletonTypes = ["researchPage", "newsPage", "eventsPage", "faqPage"] as const;
export type SingletonType = (typeof singletonTypes)[number];
