import "server-only";
import { createClient, type SanityClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId, readToken } from "./env";

/**
 * How long a published edit takes to reach the site. The pages are statically
 * rendered, so this is the revalidation window rather than a request cache —
 * an editor hitting Publish sees the change within a minute without a redeploy.
 * Wire a Sanity webhook to an on-demand revalidate route if that is too slow.
 */
export const REVALIDATE_SECONDS = 60;

let client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (!isSanityConfigured) return null;
  client ??= createClient({
    projectId,
    dataset,
    apiVersion,
    // The CDN serves published content; the token path is only needed for a
    // private dataset, and a token disables the CDN anyway.
    useCdn: !readToken,
    perspective: "published",
    token: readToken || undefined,
  });
  return client;
}

/**
 * Runs a query, or returns `fallback` when Sanity is not configured.
 *
 * A network or permission failure returns the fallback too, and logs. A CMS
 * outage should degrade the site to its last bundled copy, not 500 the page —
 * these are marketing pages, and stale beats gone.
 */
export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown>,
  fallback: T,
  tag: string
): Promise<T> {
  const c = getClient();
  if (!c) return fallback;
  try {
    return await c.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
    });
  } catch (err) {
    console.error(`[sanity] query "${tag}" failed, serving bundled content`, err);
    return fallback;
  }
}
