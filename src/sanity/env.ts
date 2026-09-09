/**
 * Sanity connection details.
 *
 * The site is designed to build and run with no Sanity project at all: when
 * `projectId` is missing, the content layer falls back to the files in
 * src/content. That keeps local work and CI green before the CMS is wired up,
 * and it means a broken env var degrades to the last known-good copy rather
 * than to an empty site.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

/**
 * Pinned, not floating. A moving API version would let Sanity change query
 * behaviour under a site that nobody is watching.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-01";

/** Server-only. Needed for a private dataset and for draft previews. */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const isSanityConfigured = projectId.length > 0;

/** The Studio route, kept here so the config, the structure and the nav agree. */
export const studioBasePath = "/studio";
