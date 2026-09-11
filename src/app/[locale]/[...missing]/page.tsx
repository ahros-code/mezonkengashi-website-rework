import { notFound } from "next/navigation";

/**
 * Any path under a locale that no route claims. Without this, unknown URLs fall
 * through to Next's bare default 404 instead of the localised not-found page.
 */
export default function Missing() {
  notFound();
}
