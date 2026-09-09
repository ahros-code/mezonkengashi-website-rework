import { defineField, defineType } from "sanity";
import { getDict } from "@/i18n";
import { categoryLabel, type CategoryId } from "@/content/types";
import { bodyField } from "./blocks";
import { requireBothLocales } from "./locale";

/**
 * Tadqiqotlar and Yangiliklar are the same shape but live at different routes,
 * so they are two document types over one field set. Two types rather than one
 * with a `section` switch keeps slugs unique per route for free, and gives each
 * an unambiguous list in the Studio.
 */

const dict = getDict("uz");

const categoryOptions = (Object.keys(categoryLabel) as CategoryId[]).map((id) => ({
  title: categoryLabel[id].uz,
  value: id,
}));

/**
 * Bylines resolve through the council dictionary at render time, so the choice
 * here is an id, not a name — renaming a member in the dictionary must not
 * orphan every article they signed.
 */
const authorOptions = Object.entries(dict.council.members).map(([value, m]) => ({
  title: m.name,
  value,
}));

export const articleFields = [
  defineField({
    name: "title",
    title: "Sarlavha",
    type: "localeString",
    validation: (rule) => rule.custom((v) => requireBothLocales(v, "Sarlavha")),
  }),
  defineField({
    name: "slug",
    title: "Havola (slug)",
    type: "slug",
    description: "Manzildagi qism. Chop etilgandan keyin oʻzgartirmang — eski havolalar ishlamay qoladi.",
    options: { source: "title.uz", maxLength: 96 },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "date",
    title: "Sana",
    type: "date",
    description: "Eʼlon qilingan sana. Roʻyxat shu boʻyicha saralanadi.",
    options: { dateFormat: "YYYY-MM-DD" },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "category",
    title: "Boʻlim",
    type: "string",
    options: { list: categoryOptions },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "author",
    title: "Muallif",
    type: "string",
    options: { list: authorOptions },
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "readingMinutes",
    title: "Oʻqish vaqti (daqiqa)",
    type: "number",
    validation: (rule) => rule.required().integer().min(1).max(90),
  }),
  defineField({
    name: "excerpt",
    title: "Qisqacha",
    type: "localeText",
    description: "Roʻyxatda va qidiruv natijalarida koʻrinadi. 1–2 jumla.",
    validation: (rule) => rule.custom((v) => requireBothLocales(v, "Qisqacha")),
  }),
  bodyField,
];

const preview = {
  select: { title: "title.uz", date: "date", category: "category" },
  prepare: ({ title, date, category }: { title?: string; date?: string; category?: string }) => ({
    title: title || "Sarlavhasiz",
    subtitle: [date, category && categoryLabel[category as CategoryId]?.uz]
      .filter(Boolean)
      .join(" · "),
  }),
};

const orderings = [
  {
    title: "Sana boʻyicha (yangi birinchi)",
    name: "dateDesc",
    by: [{ field: "date", direction: "desc" as const }],
  },
];

export const researchArticle = defineType({
  name: "researchArticle",
  title: "Tadqiqot / maqola",
  type: "document",
  fields: articleFields,
  preview,
  orderings,
});

export const newsArticle = defineType({
  name: "newsArticle",
  title: "Yangilik",
  type: "document",
  fields: articleFields,
  preview,
  orderings,
});
