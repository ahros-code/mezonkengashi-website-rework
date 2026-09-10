import { defineArrayMember, defineField, defineType } from "sanity";
import { requireBothLocales } from "./locale";

/**
 * The article body.
 *
 * These four block types are exactly what ArticleView knows how to render, so
 * the editor cannot compose something the design has no answer for. That is why
 * this is a typed array rather than Portable Text: rich text would let an
 * editor paste headings six levels deep, tables and images that the article
 * layout would silently drop.
 */

export const paragraphBlock = defineType({
  name: "paragraphBlock",
  title: "Xatboshi",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Matn",
      type: "localeText",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Xatboshi")),
    }),
  ],
  preview: {
    select: { uz: "text.uz" },
    prepare: ({ uz }) => ({ title: uz || "Xatboshi", subtitle: "Xatboshi" }),
  },
});

export const headingBlock = defineType({
  name: "headingBlock",
  title: "Sarlavha",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Matn",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Sarlavha")),
    }),
  ],
  preview: {
    select: { uz: "text.uz" },
    prepare: ({ uz }) => ({ title: uz || "Sarlavha", subtitle: "Sarlavha" }),
  },
});

export const listBlock = defineType({
  name: "listBlock",
  title: "Roʻyxat",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Bandlar",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
      validation: (rule) =>
        rule.min(1).custom((items) => {
          const bad = (items ?? []).findIndex((i) => requireBothLocales(i, "Band") !== true);
          return bad === -1 ? true : `${bad + 1}-band ikkala tilda toʻldirilmagan`;
        }),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items }) => ({
      title: (items?.[0]?.uz as string) || "Roʻyxat",
      subtitle: `Roʻyxat — ${items?.length ?? 0} band`,
    }),
  },
});

export const quoteBlock = defineType({
  name: "quoteBlock",
  title: "Iqtibos",
  type: "object",
  fields: [
    defineField({
      name: "text",
      title: "Iqtibos",
      type: "localeText",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Iqtibos")),
    }),
    defineField({
      name: "by",
      title: "Kim aytgan",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Kim aytgan")),
    }),
  ],
  preview: {
    select: { uz: "text.uz", by: "by.uz" },
    prepare: ({ uz, by }) => ({ title: uz || "Iqtibos", subtitle: by ? `Iqtibos — ${by}` : "Iqtibos" }),
  },
});

export const bodyField = defineField({
  name: "body",
  title: "Matn",
  type: "array",
  of: [
    defineArrayMember({ type: "paragraphBlock" }),
    defineArrayMember({ type: "headingBlock" }),
    defineArrayMember({ type: "listBlock" }),
    defineArrayMember({ type: "quoteBlock" }),
  ],
  validation: (rule) => rule.min(1).error("Maqola matni boʻsh boʻlmasligi kerak"),
});
