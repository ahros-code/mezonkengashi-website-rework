/**
 * The reader's recent path through the site, kept in this browser only.
 *
 * VisitTrail writes it on every page; the 404 page reads it to offer "continue
 * where you left off". Nothing here leaves the device, and every access is
 * wrapped because storage throws in private windows and locked-down browsers.
 */

export type TrailEntry = {
  /** pathname + search, no hash */
  path: string;
  title: string;
  /** epoch ms of the last visit */
  at: number;
  /** where the reader last stopped, px from the top */
  y: number;
  /** furthest share of the page read, 0–1 */
  read: number;
};

const TRAIL_KEY = "mezon:trail";
const RESUME_KEY = "mezon:resume";
const MAX = 8;

export function readTrail(): TrailEntry[] {
  try {
    const raw = JSON.parse(localStorage.getItem(TRAIL_KEY) ?? "[]");
    return Array.isArray(raw) ? raw.filter((e) => typeof e?.path === "string") : [];
  } catch {
    return [];
  }
}

/** Moves the entry for `path` to the front, merging in `patch`. */
export function touchTrail(path: string, patch: Partial<TrailEntry>) {
  try {
    const trail = readTrail();
    const prev = trail.find((e) => e.path === path);
    const next: TrailEntry = {
      path,
      title: patch.title || prev?.title || path,
      at: Date.now(),
      y: patch.y ?? prev?.y ?? 0,
      read: Math.max(prev?.read ?? 0, patch.read ?? 0),
    };
    const rest = trail.filter((e) => e.path !== path);
    localStorage.setItem(TRAIL_KEY, JSON.stringify([next, ...rest].slice(0, MAX)));
  } catch {
    /* storage unavailable — the trail is a convenience, never a requirement */
  }
}

/** Asks the next page load to scroll back to where the reader stopped. */
export function requestResume(path: string, y: number) {
  try {
    sessionStorage.setItem(RESUME_KEY, JSON.stringify({ path, y }));
  } catch {}
}

/** Returns the pending scroll target for `path`, clearing it either way. */
export function takeResume(path: string): number | null {
  try {
    const raw = sessionStorage.getItem(RESUME_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(RESUME_KEY);
    const { path: p, y } = JSON.parse(raw);
    return p === path && typeof y === "number" ? y : null;
  } catch {
    return null;
  }
}

/** "Page title | Mezon Kengashi" and "Page title — Mezon Kengashi …" → "Page title". */
export function cleanTitle(title: string) {
  const short = title.replace(/\s+[|—–]\s+MEZON\b.*$/i, "").trim();
  return short || title.trim();
}
