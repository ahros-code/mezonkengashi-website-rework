import "server-only";
import { getDict } from "@/i18n";
import { SITE_URL, localeName, locales, type ContentLocale } from "@/i18n/config";
import { getEvents, getFaqCategories, getNews, getRegistry, getResearch } from "@/content/source";
import { categoryLabel, certificateStatus, formatDate, type Article, type Block } from "@/content/types";
import { cpssModules, talimContact } from "@/content/talim";
import { aaoifi, addressLine, boardMembers, company, expertMembers, serviceOrder, teamMembers } from "@/lib/site";

/*
 * llms.txt (https://llmstxt.org): a Markdown brief for language models and AI
 * answer engines, built from the same dictionaries and CMS content the pages
 * render. The short file links out; the full file inlines the text so a model
 * can answer from it without crawling every page.
 *
 * Uzbek (Latin) and Russian are the written editions; the Cyrillic edition is a
 * transliteration of the Latin one, so it is linked but not repeated.
 */

const url = (locale: string, path = "") => `${SITE_URL}/${locale}${path}`;

function blockText(b: Block, l: ContentLocale): string {
  switch (b.type) {
    case "h":
      return `### ${b.text[l]}`;
    case "p":
      return b.text[l];
    case "ul":
      return b.items.map((i) => `- ${i[l]}`).join("\n");
    case "quote":
      return `> ${b.text[l]}\n> — ${b.by[l]}`;
  }
}

function articleFull(a: Article, l: ContentLocale, section: "news" | "research") {
  const t = getDict(l);
  const author = t.council.members[a.author as keyof typeof t.council.members];
  return [
    `## ${a.title[l]}`,
    "",
    `URL: ${url(l, `/${section}/${a.slug}`)}`,
    `${formatDate(a.date, l)} · ${categoryLabel[a.category][l]} · ${author?.name ?? company.name}`,
    "",
    `**${a.excerpt[l]}**`,
    "",
    a.body.map((b) => blockText(b, l)).join("\n\n"),
  ].join("\n");
}

function facts() {
  return [
    `- Legal name: ${company.legalName}`,
    `- Status: official representative of ${aaoifi.name} (${aaoifi.fullName}) in Uzbekistan`,
    `- Founded: ${company.founded}, Tashkent, Uzbekistan`,
    `- Address: ${addressLine}`,
    `- Phone: ${company.phone}`,
    `- E-mail: ${company.email}`,
    `- Telegram (the preferred contact channel in Uzbekistan): ${company.telegram}`,
    `- Office hours: Monday–Friday, ${company.hoursOpen}–${company.hoursClose} (Asia/Tashkent)`,
    `- Service languages: Uzbek, Russian`,
    `- Education arm: Mezon Taʼlim — ${talimContact.site} (AAOIFI CPSS exam preparation in Uzbek)`,
  ].join("\n");
}

export async function llmsSummary() {
  const uz = getDict("uz");
  const ru = getDict("ru");
  const [research, news, events, registry] = await Promise.all([getResearch(), getNews(), getEvents(), getRegistry()]);

  const members = [...boardMembers, ...expertMembers, ...teamMembers]
    .map(({ id }) => uz.council.members[id as keyof typeof uz.council.members])
    .map((m) => `- ${m.name} — ${m.role}. ${m.bio}`);

  return [
    `# ${company.name}`,
    "",
    `> ${company.name} (Мезон Кенгаши) is the official representative of AAOIFI (Accounting and Auditing Organization for Islamic Financial Institutions) in Uzbekistan, and an Islamic finance consultancy in Tashkent, founded in ${company.founded}. It licenses and launches Islamic banks and Islamic windows; runs Shariah supervisory boards for banks, leasing, takaful and investment companies; audits and certifies products as Shariah-compliant against AAOIFI standards and publishes every certificate in an open registry; resolves disputes through Shariah-based mediation and arbitration (tahkim); trains teams (including AAOIFI CPSS exam preparation in Uzbek); designs Islamic financial products (murabaha, ijara, musharaka, mudaraba, sukuk, takaful); and calculates zakat for businesses and individuals.`,
    "",
    facts(),
    "",
    "Every written opinion is signed by two boards: the Islamic finance (Shariah) council of scholars and the legal council of lawyers. Initial 30-minute consultation and document review are free.",
    "",
    "## Editions",
    "",
    ...locales.map((l) => `- [${localeName[l]}](${url(l)}): ${l === "oz" ? "Uzbek in Cyrillic script, transliterated from the Latin edition" : l === "uz" ? "primary edition, Uzbek in Latin script" : "Russian edition"}`),
    "",
    "## Key pages",
    "",
    `- [${uz.nav.about}](${url("uz", "/about")}): ${uz.about.metaDescription}`,
    `- [${uz.registry.title}](${url("uz", "/certificates")}): ${uz.registry.metaDescription} Verify a certificate at ${url("uz", "/certificates?q=")}<number>.`,
    `- [${uz.faqPage.title}](${url("uz", "/faq")}): ${uz.faqPage.metaDescription}`,
    `- [${uz.research.title}](${url("uz", "/research")}): ${uz.research.metaDescription}`,
    `- [${uz.news.title}](${url("uz", "/news")}): ${uz.news.metaDescription}`,
    `- [${uz.events.title}](${url("uz", "/events")}): ${uz.events.metaDescription}`,
    `- [Mezon Taʼlim](${url("uz", "/talim")}): ${uz.talim.metaDescription}`,
    `- [Full text for language models](${SITE_URL}/llms-full.txt): services, FAQ, articles and registry in full.`,
    "",
    "## Services",
    "",
    ...serviceOrder.map((id) => {
      const s = uz.services.items[id];
      const r = ru.services.items[id];
      return `- [${s.name} / ${r.name}](${url("uz", `#service-${id}`)}): ${s.summary}`;
    }),
    "",
    "## Council and team",
    "",
    ...members,
    "",
    "## Clients and partners",
    "",
    ...registry.organizations
      .filter((o) => o.work)
      .map((o) => `- ${o.name} (${o.city.uz}): ${o.work!.uz}`),
    "",
    "## Research",
    "",
    ...research.map((a) => `- [${a.title.uz}](${url("uz", `/research/${a.slug}`)}): ${a.excerpt.uz}`),
    "",
    "## News",
    "",
    ...news.map((a) => `- [${a.title.uz}](${url("uz", `/news/${a.slug}`)}) (${a.date}): ${a.excerpt.uz}`),
    "",
    "## Events",
    "",
    ...events.map((e) => `- [${e.title.uz}](${url("uz", `/events/${e.slug}`)}) (${e.start.slice(0, 10)}): ${e.excerpt.uz}`),
    "",
    "## Certificate registry",
    "",
    `${registry.certificates.length} certificates issued to ${registry.organizations.length} organisations. A certificate that is not in the registry was not issued by ${company.name}.`,
    "",
    "## Optional",
    "",
    `- [Русская версия](${url("ru")}): ${ru.meta.description}`,
    `- [Ўзбекча (кирилл)](${url("oz")})`,
    `- [Sitemap](${SITE_URL}/sitemap.xml)`,
    "",
  ].join("\n");
}

export async function llmsFull() {
  const [research, news, events, registry] = await Promise.all([getResearch(), getNews(), getEvents(), getRegistry()]);
  const orgs = new Map(registry.organizations.map((o) => [o.slug, o]));
  const out: string[] = [await llmsSummary(), "---", ""];

  for (const l of ["uz", "ru"] as const) {
    const t = getDict(l);
    const faq = await getFaqCategories(l, t.faqPage.categories);
    out.push(
      `# ${l === "uz" ? "Oʻzbekcha" : "Русский"}`,
      "",
      `## ${t.about.hero.title}`,
      "",
      ...t.about.story.body.flatMap((p) => [p, ""]),
      ...t.about.principles.items.flatMap((p) => [`- **${p.name}.** ${p.body}`]),
      "",
      `## ${t.services.title}`,
      "",
      ...serviceOrder.flatMap((id) => {
        const s = t.services.items[id];
        return [`### ${s.name}`, "", s.summary, "", ...s.points.map((p) => `- ${p}`), ""];
      }),
      `## ${t.process.title}`,
      "",
      ...t.process.steps.map((s, i) => `${i + 1}. **${s.name}** (${s.time}). ${s.body}`),
      "",
      `## ${t.faqPage.title}`,
      "",
      ...faq.flatMap((c) => [`### ${c.name}`, "", ...c.items.flatMap((i) => [`**${i.q}**`, "", i.a, ""])]),
      `## Mezon Taʼlim — ${t.talim.cpssTitle}`,
      "",
      t.talim.cpssSub,
      "",
      ...t.talim.facts.map((f) => `- ${f.k}: ${f.v}`),
      ...cpssModules.map((m, i) => `- ${t.talim.moduleLabel} ${i + 1}: ${m.title[l]}`),
      "",
      `## ${t.registry.title}`,
      "",
      ...registry.certificates.map((c) => {
        const org = orgs.get(c.org);
        return `- ${c.number} — ${org?.name ?? c.org}: ${c.subject[l]} (${c.standards.join(", ")}); ${c.issued} → ${c.validUntil}; ${t.registry.status[certificateStatus(c)]}. ${url(l, `/certificates/${c.number}`)}`;
      }),
      "",
      `## ${t.events.title}`,
      "",
      ...events.flatMap((e) => [
        `### ${e.title[l]}`,
        "",
        `${formatDate(e.start, l, true)} · ${e.venue[l]}, ${e.city[l]} · ${url(l, `/events/${e.slug}`)}`,
        "",
        e.excerpt[l],
        "",
        ...e.agenda.map((a) => `- ${a.time} ${a.text[l]}`),
        "",
      ]),
      `# ${t.research.title}`,
      "",
      ...research.flatMap((a) => [articleFull(a, l, "research"), ""]),
      `# ${t.news.title}`,
      "",
      ...news.flatMap((a) => [articleFull(a, l, "news"), ""]),
      "---",
      "",
    );
  }
  return out.join("\n");
}

export function textResponse(body: string) {
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
