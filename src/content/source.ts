import "server-only";
import type { Locale } from "@/i18n/config";
import { sanityFetch } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import type { SingletonType } from "@/sanity/schema/pages";
import {
  eventsQuery,
  faqQuery,
  newsQuery,
  pageCopyQuery,
  researchQuery,
} from "@/sanity/queries";
import { news as bundledNews } from "./news";
import { research as bundledResearch } from "./research";
import { events as bundledEvents } from "./events";
import type { Article, Block, L, MezonEvent } from "./types";

/**
 * The single door between the pages and their content.
 *
 * With no Sanity project configured every getter returns the files in
 * src/content, so the site builds and runs exactly as it did before the CMS
 * existed. Once NEXT_PUBLIC_SANITY_PROJECT_ID is set, the same getters read
 * from Sanity and the bundled files become the outage fallback only.
 */

/**
 * Guarantees both locales are strings.
 *
 * The Studio asks for both languages and validates the important fields, but
 * content arrives from people, not from the type system: a half-filled block
 * reaches the site as `{uz: "…"}` with no `ru` at all. Rendering the other
 * language is a visible imperfection; reading `.trim()` off undefined takes the
 * whole build down, which is what it did.
 */
function text(value: unknown): L {
  const v = (value ?? {}) as Partial<L>;
  const uz = v.uz?.trim() ?? "";
  const ru = v.ru?.trim() ?? "";
  return { uz: uz || ru, ru: ru || uz };
}

/** GROQ leaves the unused half of a block's fields as null; drop them. */
function cleanBlock(raw: Record<string, unknown>): Block | null {
  const type = raw.type as Block["type"] | null;
  if (!type) return null;
  if (type === "ul") {
    const items = ((raw.items as unknown[] | null) ?? []).map(text).filter((i) => i.uz);
    return items.length ? { type, items } : null;
  }
  const body = text(raw.text);
  if (!body.uz) return null;
  if (type === "quote") return { type, text: body, by: text(raw.by) };
  return { type, text: body };
}

function cleanArticle(raw: Record<string, unknown>): Article {
  return {
    ...(raw as unknown as Article),
    title: text(raw.title),
    excerpt: text(raw.excerpt),
    body: (((raw.body as Record<string, unknown>[] | null) ?? [])
      .map(cleanBlock)
      .filter(Boolean) as Block[]),
  };
}

export async function getResearch(): Promise<Article[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(
    researchQuery,
    {},
    bundledResearch as unknown as Record<string, unknown>[],
    "research"
  );
  return isSanityConfigured ? raw.map(cleanArticle) : bundledResearch;
}

export async function getNews(): Promise<Article[]> {
  const raw = await sanityFetch<Record<string, unknown>[]>(
    newsQuery,
    {},
    bundledNews as unknown as Record<string, unknown>[],
    "news"
  );
  return isSanityConfigured ? raw.map(cleanArticle) : bundledNews;
}

export async function getEvents(): Promise<MezonEvent[]> {
  const raw = await sanityFetch<MezonEvent[]>(
    eventsQuery,
    {},
    bundledEvents,
    "events"
  );
  return raw.map((e) => ({
    ...e,
    title: text(e.title),
    excerpt: text(e.excerpt),
    venue: text(e.venue),
    city: text(e.city),
    audience: text(e.audience),
    agenda: (e.agenda ?? []).map((row) => ({ time: row.time, text: text(row.text) })),
    outcomes: (e.outcomes ?? []).map(text),
  }));
}

export type FaqCategory = { id: string; name: string; items: { q: string; a: string }[] };

/**
 * Resolved to one locale, because that is the shape the FAQ page already
 * renders and there is no reason for it to learn about `L` objects.
 */
export async function getFaqCategories(
  locale: Locale,
  fallback: readonly FaqCategory[]
): Promise<FaqCategory[]> {
  type Row = { id: string; title: L; items: { q: L; a: L }[] | null };
  const rows = await sanityFetch<Row[] | null>(faqQuery, {}, null, "faq");
  if (!rows?.length) return [...fallback];
  return rows.map((c) => ({
    id: c.id,
    name: text(c.title)[locale],
    items: (c.items ?? []).map((i) => ({ q: text(i.q)[locale], a: text(i.a)[locale] })),
  }));
}

/**
 * Page copy, overlaid on the dictionary.
 *
 * Only keys the dictionary already defines are taken from Sanity, and only when
 * the editor actually filled them in. So an unpopulated CMS renders the shipped
 * copy, and a page can be moved into the CMS one field at a time.
 */
export async function getPageCopy<T extends Record<string, unknown>>(
  id: SingletonType,
  locale: Locale,
  base: T
): Promise<T> {
  const doc = await sanityFetch<Record<string, L | null> | null>(
    pageCopyQuery,
    { id },
    null,
    `page:${id}`
  );
  if (!doc) return base;

  const merged: Record<string, unknown> = { ...base };
  for (const [key, value] of Object.entries(doc)) {
    if (typeof base[key] !== "string") continue;
    const text = value?.[locale]?.trim();
    if (text) merged[key] = text;
  }
  return merged as T;
}
