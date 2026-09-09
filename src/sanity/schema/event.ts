import { defineArrayMember, defineField, defineType } from "sanity";
import { getDict } from "@/i18n";
import { requireBothLocales } from "./locale";

const dict = getDict("uz");

const hostOptions = Object.entries(dict.council.members).map(([value, m]) => ({
  title: m.name,
  value,
}));

export const agendaItem = defineType({
  name: "agendaItem",
  title: "Dastur bandi",
  type: "object",
  fields: [
    defineField({
      name: "time",
      title: "Vaqt",
      type: "string",
      description: "24 soatlik format, masalan 09:30",
      validation: (rule) =>
        rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "SS:DD" }),
    }),
    defineField({ name: "text", title: "Mavzu", type: "localeString" }),
  ],
  preview: {
    select: { time: "time", uz: "text.uz" },
    prepare: ({ time, uz }) => ({ title: uz || "Band", subtitle: time }),
  },
});

export const mezonEvent = defineType({
  name: "event",
  title: "Tadbir",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nomi",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Nomi")),
    }),
    defineField({
      name: "slug",
      title: "Havola (slug)",
      type: "slug",
      options: { source: "title.uz", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "start",
      title: "Boshlanishi",
      type: "datetime",
      description: "Toshkent vaqti bilan kiriting.",
      options: { timeStep: 15 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "Tugashi",
      type: "datetime",
      options: { timeStep: 15 },
      validation: (rule) =>
        rule.required().custom((end, ctx) => {
          const start = (ctx.document as { start?: string } | undefined)?.start;
          if (!start || !end || end > start) return true;
          return "Tugash vaqti boshlanish vaqtidan keyin boʻlishi kerak";
        }),
    }),
    defineField({
      name: "format",
      title: "Format",
      type: "string",
      options: {
        list: [
          { title: "Oflayn", value: "onsite" },
          { title: "Onlayn", value: "online" },
          { title: "Aralash", value: "hybrid" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "venue", title: "Manzil", type: "localeString" }),
    defineField({ name: "city", title: "Shahar", type: "localeString" }),
    defineField({
      name: "seats",
      title: "Joylar soni",
      type: "number",
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "price",
      title: "Narx (soʻm)",
      type: "number",
      description: "Bepul tadbir uchun 0 kiriting.",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "host",
      title: "Olib boradi",
      type: "string",
      options: { list: hostOptions },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Qisqacha",
      type: "localeText",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Qisqacha")),
    }),
    defineField({ name: "audience", title: "Kim uchun", type: "localeText" }),
    defineField({
      name: "agenda",
      title: "Dastur",
      type: "array",
      of: [defineArrayMember({ type: "agendaItem" })],
    }),
    defineField({
      name: "outcomes",
      title: "Natijada nima olasiz",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
    }),
  ],
  preview: {
    select: { title: "title.uz", start: "start", format: "format" },
    prepare: ({ title, start, format }) => ({
      title: title || "Nomsiz tadbir",
      subtitle: [start?.slice(0, 10), format].filter(Boolean).join(" · "),
    }),
  },
  orderings: [
    {
      title: "Boshlanish sanasi (yangi birinchi)",
      name: "startDesc",
      by: [{ field: "start", direction: "desc" }],
    },
  ],
});
