/**
 * One-off migration: pushes the content currently bundled in src/content and
 * src/i18n into a Sanity dataset, so editors start from the real site rather
 * than an empty Studio.
 *
 *   npm run sanity:seed              # create missing documents only
 *   npm run sanity:seed -- --force   # overwrite documents that already exist
 *   npm run sanity:seed -- --dry-run # build and report, write nothing (no token needed)
 *
 * Needs a token with write access:
 *   SANITY_WRITE_TOKEN=...  (sanity.io/manage -> API -> Tokens -> Editor)
 *
 * Ids are derived from the slug, so re-running is idempotent — it will not
 * produce a second copy of anything.
 *
 * The separator is a hyphen, not a dot. Sanity reserves dotted id prefixes for
 * its own namespaces (drafts., versions.), so an id like "newsArticle.my-slug"
 * is read as a namespaced id and rejected — silently enough that the first
 * version of this script reported success while writing almost nothing.
 */
import { createClient } from "@sanity/client";
import { config as loadEnv } from "dotenv";
import { research } from "../src/content/research";
import { news } from "../src/content/news";
import { events } from "../src/content/events";
import type { Article, Block, L, MezonEvent } from "../src/content/types";
import uzPages from "../src/i18n/uz.pages";
import ruPages from "../src/i18n/ru.pages";

loadEnv({ path: ".env.local" });
loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_WRITE_TOKEN;
const force = process.argv.includes("--force");
const dryRun = process.argv.includes("--dry-run");

if (!projectId || (!token && !dryRun)) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_WRITE_TOKEN.\n" +
      "Put them in .env.local first — see README, “Sanity CMS”."
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  // A dry run never commits, so it needs no credentials.
  apiVersion: "2026-09-01",
  useCdn: false,
});

/** Pair the two dictionaries back into the {uz, ru} objects Sanity stores. */
const pair = (uz: string, ru: string): L => ({ uz, ru });

const blockTypes: Record<Block["type"], string> = {
  p: "paragraphBlock",
  h: "headingBlock",
  ul: "listBlock",
  quote: "quoteBlock",
};

function toBlocks(body: Block[]) {
  return body.map((b, i) => {
    const base = { _key: `b${i}`, _type: blockTypes[b.type] };
    if (b.type === "ul") {
      return {
        ...base,
        items: b.items.map((item, j) => ({ _key: `i${j}`, _type: "localeString", ...item })),
      };
    }
    if (b.type === "quote") return { ...base, text: b.text, by: b.by };
    return { ...base, text: b.text };
  });
}

function articleDoc(type: string, a: Article) {
  return {
    _id: `${type}-${a.slug}`,
    _type: type,
    title: a.title,
    slug: { _type: "slug", current: a.slug },
    date: a.date,
    category: a.category,
    author: a.author,
    readingMinutes: a.readingMinutes,
    excerpt: a.excerpt,
    body: toBlocks(a.body),
  };
}

function eventDoc(e: MezonEvent) {
  return {
    _id: `event-${e.slug}`,
    _type: "event",
    title: e.title,
    slug: { _type: "slug", current: e.slug },
    start: e.start,
    end: e.end,
    format: e.format,
    venue: e.venue,
    city: e.city,
    seats: e.seats,
    price: e.price,
    host: e.host,
    excerpt: e.excerpt,
    audience: e.audience,
    agenda: e.agenda.map((row, i) => ({
      _key: `a${i}`,
      _type: "agendaItem",
      time: row.time,
      text: row.text,
    })),
    outcomes: e.outcomes.map((o, i) => ({ _key: `o${i}`, _type: "localeString", ...o })),
  };
}

/** The FAQ categories are parallel arrays in the two dictionaries. */
function faqDocs() {
  return uzPages.faqPage.categories.map((c, index) => {
    const ru = ruPages.faqPage.categories[index];
    return {
      _id: `faqCategory-${c.id}`,
      _type: "faqCategory",
      title: pair(c.name, ru.name),
      slug: { _type: "slug", current: c.id },
      order: index,
      items: c.items.map((item, i) => ({
        _key: `q${i}`,
        _type: "faqItem",
        q: pair(item.q, ru.items[i].q),
        a: pair(item.a, ru.items[i].a),
      })),
    };
  });
}

/** Page copy singletons: fixed ids, matching src/sanity/schema/pages.ts. */
function pageDocs() {
  const uz = uzPages;
  const ru = ruPages;
  const copy = (key: string, uzv?: string, ruv?: string) =>
    uzv !== undefined && ruv !== undefined ? { [key]: pair(uzv, ruv) } : {};

  return [
    {
      _id: "researchPage",
      _type: "researchPage",
      ...copy("metaTitle", uz.research.metaTitle, ru.research.metaTitle),
      ...copy("metaDescription", uz.research.metaDescription, ru.research.metaDescription),
      ...copy("kicker", uz.research.kicker, ru.research.kicker),
      ...copy("title", uz.research.title, ru.research.title),
      ...copy("lede", uz.research.lede, ru.research.lede),
      ...copy("featured", uz.research.featured, ru.research.featured),
      ...copy("all", uz.research.all, ru.research.all),
    },
    {
      _id: "newsPage",
      _type: "newsPage",
      ...copy("metaTitle", uz.news.metaTitle, ru.news.metaTitle),
      ...copy("metaDescription", uz.news.metaDescription, ru.news.metaDescription),
      ...copy("kicker", uz.news.kicker, ru.news.kicker),
      ...copy("title", uz.news.title, ru.news.title),
      ...copy("lede", uz.news.lede, ru.news.lede),
      ...copy("latest", uz.news.latest, ru.news.latest),
    },
    {
      _id: "eventsPage",
      _type: "eventsPage",
      ...copy("metaTitle", uz.events.metaTitle, ru.events.metaTitle),
      ...copy("metaDescription", uz.events.metaDescription, ru.events.metaDescription),
      ...copy("kicker", uz.events.kicker, ru.events.kicker),
      ...copy("title", uz.events.title, ru.events.title),
      ...copy("lede", uz.events.lede, ru.events.lede),
      ...copy("upcoming", uz.events.upcoming, ru.events.upcoming),
      ...copy("past", uz.events.past, ru.events.past),
      ...copy("noUpcoming", uz.events.noUpcoming, ru.events.noUpcoming),
    },
    {
      _id: "faqPage",
      _type: "faqPage",
      ...copy("metaTitle", uz.faqPage.metaTitle, ru.faqPage.metaTitle),
      ...copy("metaDescription", uz.faqPage.metaDescription, ru.faqPage.metaDescription),
      ...copy("kicker", uz.faqPage.kicker, ru.faqPage.kicker),
      ...copy("title", uz.faqPage.title, ru.faqPage.title),
      ...copy("lede", uz.faqPage.lede, ru.faqPage.lede),
      ...copy("stillTitle", uz.faqPage.stillTitle, ru.faqPage.stillTitle),
      ...copy("stillBody", uz.faqPage.stillBody, ru.faqPage.stillBody),
      ...copy("stillCta", uz.faqPage.stillCta, ru.faqPage.stillCta),
    },
  ];
}

async function main() {
  const docs = [
    ...research.map((a) => articleDoc("researchArticle", a)),
    ...news.map((a) => articleDoc("newsArticle", a)),
    ...events.map(eventDoc),
    ...faqDocs(),
    ...pageDocs(),
  ];

  const counts = docs.reduce<Record<string, number>>((acc, d) => {
    acc[d._type] = (acc[d._type] ?? 0) + 1;
    return acc;
  }, {});
  console.log(
    `${dryRun ? "Would seed" : "Seeding"} ${docs.length} documents into ${projectId}/${dataset}` +
      (dryRun ? "" : force ? " (overwriting existing)" : " (skipping existing)")
  );
  for (const [type, n] of Object.entries(counts)) console.log(`  ${type}: ${n}`);

  if (dryRun) {
    // Surface the shape of one document of each type so a schema mismatch is
    // visible before anything is written.
    for (const type of Object.keys(counts)) {
      const sample = docs.find((d) => d._type === type)!;
      console.log(`
--- ${type} (${sample._id}) ---`);
      console.log(JSON.stringify(sample).slice(0, 400));
    }
    console.log("\nDry run: nothing written.");
    return;
  }

  /*
   * One transaction per type rather than one for everything.
   *
   * A single transaction looked tidier, but it makes a failure all-or-nothing
   * and — worse — hard to attribute: you get one error with no clue which
   * document caused it. Per type, a failure names the group, the other groups
   * still land, and re-running fills the gap.
   */
  const byType = new Map<string, typeof docs>();
  for (const doc of docs) {
    const list = byType.get(doc._type) ?? [];
    list.push(doc);
    byType.set(doc._type, list);
  }

  let failed = 0;
  for (const [type, group] of byType) {
    const tx = client.transaction();
    for (const doc of group) {
      if (force) tx.createOrReplace(doc);
      else tx.createIfNotExists(doc);
    }
    try {
      await tx.commit({ visibility: "sync" });
      console.log(`  ✓ ${type} (${group.length})`);
    } catch (err) {
      failed++;
      const e = err as { message?: string; statusCode?: number; details?: unknown };
      console.error(`  ✗ ${type} (${group.length}) — ${e.statusCode ?? ""} ${e.message ?? err}`);
      if (e.details) console.error(`    ${JSON.stringify(e.details).slice(0, 500)}`);
    }
  }

  /*
   * Read the dataset back rather than trusting the writes. The first version of
   * this script reported success while most of its documents were missing, so
   * "committed" is not the thing worth printing — "present" is.
   */
  console.log("\nIn the dataset now:");
  const actual = await client.fetch<Record<string, number>>(
    `{
      "researchArticle": count(*[_type == "researchArticle"]),
      "newsArticle": count(*[_type == "newsArticle"]),
      "event": count(*[_type == "event"]),
      "faqCategory": count(*[_type == "faqCategory"]),
      "researchPage": count(*[_type == "researchPage"]),
      "newsPage": count(*[_type == "newsPage"]),
      "eventsPage": count(*[_type == "eventsPage"]),
      "faqPage": count(*[_type == "faqPage"])
    }`
  );

  let short = 0;
  for (const [type, expected] of Object.entries(counts)) {
    const got = actual[type] ?? 0;
    const ok = got >= expected;
    if (!ok) short++;
    console.log(`  ${ok ? "✓" : "✗"} ${type}: ${got} (expected at least ${expected})`);
  }

  if (failed || short) {
    console.error("\nSeed incomplete — see the failures above.");
    process.exit(1);
  }
  console.log("\nDone. Open /studio to review.");
}

main().catch((err) => {
  const e = err as { message?: string; statusCode?: number; responseBody?: string };
  console.error(e.message ?? err);
  if (e.statusCode) console.error(`HTTP ${e.statusCode}`);
  if (e.responseBody) console.error(String(e.responseBody).slice(0, 800));
  process.exit(1);
});
