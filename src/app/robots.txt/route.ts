import { SITE_URL } from "@/i18n/config";

/**
 * robots.txt, written by hand rather than through MetadataRoute.Robots so it
 * can carry what that type cannot: Yandex's Clean-param and comments.
 *
 * AI crawlers get an explicit welcome. Answer engines (ChatGPT search,
 * Perplexity, Claude, Gemini, Copilot) can only cite what their crawlers may
 * read, and a named group documents the decision instead of leaving it to "*".
 * To stay out of model *training* while remaining citable, move GPTBot,
 * ClaudeBot, Google-Extended, Applebot-Extended, CCBot and meta-externalagent
 * to a Disallow group; the search/user agents are what answer engines cite from.
 */
export const dynamic = "force-static";

const PRIVATE = ["/api/", "/studio"];
/* Registry filters are internal search results: endless URLs, one canonical page. */
const SEARCH = ["/*?q=", "/*&q=", "/*?org=", "/*&org="];

const AI_AGENTS = [
  // OpenAI
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google Gemini / Vertex grounding, Apple Intelligence
  "Google-Extended",
  "Applebot-Extended",
  // Microsoft Copilot rides on bingbot; Meta, Mistral, DuckDuckGo, You.com, Amazon
  "meta-externalagent",
  "MistralAI-User",
  "DuckAssistBot",
  "YouBot",
  "Amazonbot",
  // Common Crawl feeds many open models
  "CCBot",
];

function group(agents: string[], { blockSearch = true, extra = [] as string[] } = {}) {
  return [
    ...agents.map((a) => `User-agent: ${a}`),
    "Allow: /",
    ...PRIVATE.map((p) => `Disallow: ${p}`),
    ...(blockSearch ? SEARCH.map((p) => `Disallow: ${p}`) : []),
    ...extra,
  ].join("\n");
}

export function GET() {
  const body = [
    `# ${SITE_URL}`,
    "# Mezon Kengashi — Islamic finance consulting, Shariah audit and certification, Tashkent.",
    "# Editions: /uz (Oʻzbekcha, lotin), /oz (Ўзбекча, кирилл), /ru (Русский).",
    `# Plain-text summary for language models: ${SITE_URL}/llms.txt`,
    "",
    group(["*"]),
    "",
    "# Search engines",
    group(["Googlebot", "Bingbot", "Slurp", "DuckDuckBot", "Applebot", "Baiduspider"]),
    "",
    // Yandex prefers Clean-param to Disallow: it folds the filtered URLs into the clean one.
    group(["Yandex"], { blockSearch: false, extra: ["Clean-param: q&org /"] }),
    "",
    "# AI answer engines and assistants",
    group(AI_AGENTS),
    "",
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
