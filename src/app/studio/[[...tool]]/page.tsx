/**
 * The Sanity Studio, served from this app at /studio.
 *
 * Embedding it means editors get one URL on the site's own domain and there is
 * no second deployment to keep in step with the schema. The catch-all segment
 * lets the Studio own its own client-side routing underneath /studio.
 */
import Studio from "./Studio";

export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <Studio />;
}
