import { locales, SITE_URL } from "@/i18n/config";

/**
 * IndexNow: tells Bing (and through it Copilot and ChatGPT search), Yandex,
 * Seznam and Naver that URLs changed, instead of waiting for a recrawl.
 *
 * Needs INDEXNOW_KEY (8–128 hex characters, e.g. `openssl rand -hex 16`). The
 * key is served at /indexnow-key.txt, which is what proves the host is ours.
 * Without the key, or outside production, this does nothing.
 */
export const indexNowKey = process.env.INDEXNOW_KEY?.trim() || "";

export async function pingIndexNow(paths: string[]) {
  if (!indexNowKey || process.env.NODE_ENV !== "production" || paths.length === 0) return;

  // Every edition of every changed path.
  const urlList = [...new Set(paths.flatMap((p) => locales.map((l) => `${SITE_URL}/${l}${p}`)))];

  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: new URL(SITE_URL).host,
        key: indexNowKey,
        keyLocation: `${SITE_URL}/indexnow-key.txt`,
        urlList,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    // Best effort: a missed ping only means the engines find the change on their next crawl.
  }
}
