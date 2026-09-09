import { defineArrayMember, defineField, defineType } from "sanity";
import { requireBothLocales } from "./locale";

export const faqItem = defineType({
  name: "faqItem",
  title: "Savol",
  type: "object",
  fields: [
    defineField({
      name: "q",
      title: "Savol",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Savol")),
    }),
    defineField({
      name: "a",
      title: "Javob",
      type: "localeText",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Javob")),
    }),
  ],
  preview: {
    select: { uz: "q.uz" },
    prepare: ({ uz }) => ({ title: uz || "Savol" }),
  },
});

/**
 * One document per category rather than one giant FAQ document: categories are
 * what the page groups by, and separate documents let two editors work on
 * different sections without colliding.
 */
export const faqCategory = defineType({
  name: "faqCategory",
  title: "Savol-javob boʻlimi",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Boʻlim nomi",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Boʻlim nomi")),
    }),
    defineField({
      name: "slug",
      title: "Identifikator",
      type: "slug",
      description: "Sahifadagi boʻlim havolasi uchun ishlatiladi.",
      options: { source: "title.uz", maxLength: 40 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Tartib raqami",
      type: "number",
      description: "Sahifada boʻlimlar shu raqam boʻyicha, kichikdan kattaga qarab chiqadi.",
      validation: (rule) => rule.required().integer().min(0),
    }),
    defineField({
      name: "items",
      title: "Savollar",
      type: "array",
      of: [defineArrayMember({ type: "faqItem" })],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "title.uz", order: "order", items: "items" },
    prepare: ({ title, order, items }) => ({
      title: title || "Boʻlim",
      subtitle: `${order ?? "—"} · ${items?.length ?? 0} savol`,
    }),
  },
  orderings: [
    { title: "Tartib boʻyicha", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
});
