import { defineField, defineType } from "sanity";
import { locales } from "@/i18n/config";

/**
 * Field-level localisation.
 *
 * Every translatable value is one object with a field per locale, mirroring the
 * `L` type the site already uses. The alternative — one document per language —
 * lets translations drift apart and doubles the editing surface; here an editor
 * sees both languages side by side and a missing translation is visible in the
 * same form rather than in another document.
 */
const localeFields = (rows?: number) =>
  locales.map((locale) =>
    defineField({
      name: locale,
      title: locale === "uz" ? "Oʻzbekcha" : "Русский",
      type: rows ? "text" : "string",
      ...(rows ? { rows } : {}),
    })
  );

/** Uzbek is the primary language, so it is what the preview subtitle shows. */
export const localeString = defineType({
  name: "localeString",
  title: "Matn",
  type: "object",
  options: { columns: 2 },
  fields: localeFields(),
});

export const localeText = defineType({
  name: "localeText",
  title: "Matn",
  type: "object",
  options: { columns: 2 },
  fields: localeFields(4),
});

/**
 * Both locales must be filled before a document can be published — a half
 * translated page is worse than an untranslated one, because the reader only
 * discovers the gap after clicking through.
 */
export function requireBothLocales(value: unknown, label: string) {
  const v = (value ?? {}) as Record<string, unknown>;
  const missing = locales.filter((l) => !String(v[l] ?? "").trim());
  if (missing.length === 0) return true;
  return `${label}: ${missing.map((l) => l.toUpperCase()).join(", ")} toʻldirilmagan`;
}
