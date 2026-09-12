import { defineArrayMember, defineField, defineType } from "sanity";
import { certificateKindLabel, sectorLabel } from "@/content/types";
import { requireBothLocales } from "./locale";

const sectorOptions = Object.entries(sectorLabel).map(([value, l]) => ({ title: l.uz, value }));
const kindOptions = Object.entries(certificateKindLabel).map(([value, l]) => ({ title: l.uz, value }));

export const organization = defineType({
  name: "organization",
  title: "Tashkilot",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Nomi",
      type: "string",
      description: "Rasmiy nomi, har ikki tilda bir xil yoziladi.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Havola (slug)",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sector",
      title: "Soha",
      type: "string",
      options: { list: sectorOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "Shahar",
      type: "localeString",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Shahar")),
    }),
    defineField({
      name: "since",
      title: "Hamkorlik boshlangan yil",
      type: "number",
      description: "Ixtiyoriy. Aniq yil maʼlum boʻlmasa, boʻsh qoldiring.",
      validation: (rule) => rule.integer().min(2023).max(2100),
    }),
    defineField({
      name: "work",
      title: "Qanday ish qilingan",
      type: "localeString",
      description: "Ixtiyoriy. Bir gap: shu tashkilot uchun nima qilinganini yozing.",
    }),
    defineField({
      name: "logo",
      title: "Logotip",
      type: "image",
      description: "Ixtiyoriy. Shaffof fonli SVG yoki PNG. Boʻlmasa, bosh harflar koʻrsatiladi.",
    }),
  ],
  orderings: [{ title: "Nomi", name: "name", by: [{ field: "name", direction: "asc" }] }],
  preview: {
    select: { title: "name", sector: "sector", media: "logo" },
    prepare: ({ title, sector, media }) => ({
      title,
      subtitle: sectorLabel[sector as keyof typeof sectorLabel]?.uz,
      media,
    }),
  },
});

export const certificate = defineType({
  name: "certificate",
  title: "Sertifikat",
  type: "document",
  fields: [
    defineField({
      name: "number",
      title: "Reyestr raqami",
      type: "string",
      description: "Masalan MK-2026-0142. Sahifa manzili ham shu raqamdan tuziladi.",
      validation: (rule) =>
        rule.required().regex(/^[A-Z]{2}-\d{4}-\d{4}$/, { name: "MK-YYYY-NNNN" }),
    }),
    defineField({
      name: "organization",
      title: "Tashkilot",
      type: "reference",
      to: [{ type: "organization" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "kind",
      title: "Turi",
      type: "string",
      options: { list: kindOptions, layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subject",
      title: "Nima sertifikatlandi",
      type: "localeString",
      description: "Mahsulot, fond yoki faoliyat nomi.",
      validation: (rule) => rule.custom((v) => requireBothLocales(v, "Nima sertifikatlandi")),
    }),
    defineField({
      name: "standards",
      title: "Standartlar",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
      description: "Masalan: AAOIFI SS 8, IFSB-8",
    }),
    defineField({
      name: "issued",
      title: "Berilgan sana",
      type: "date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "validUntil",
      title: "Amal qilish muddati",
      type: "date",
      validation: (rule) =>
        rule.required().custom((until, ctx) => {
          const issued = (ctx.document as { issued?: string } | undefined)?.issued;
          if (!issued || !until || until > issued) return true;
          return "Muddat berilgan sanadan keyin boʻlishi kerak";
        }),
    }),
    defineField({
      name: "revoked",
      title: "Bekor qilingan",
      type: "boolean",
      initialValue: false,
      description: "Muddatidan oldin bekor qilingan boʻlsa belgilang. Yozuv reyestrda qoladi.",
    }),
    defineField({
      name: "file",
      title: "Imzolangan asl nusxa (PDF)",
      type: "file",
      options: { accept: "application/pdf,image/*" },
    }),
  ],
  orderings: [{ title: "Berilgan sana", name: "issued", by: [{ field: "issued", direction: "desc" }] }],
  preview: {
    select: { number: "number", org: "organization.name", subject: "subject.uz", revoked: "revoked" },
    prepare: ({ number, org, subject, revoked }) => ({
      title: `${number}${revoked ? " · bekor qilingan" : ""}`,
      subtitle: [org, subject].filter(Boolean).join(" — "),
    }),
  },
});
