"use client";

/**
 * The Studio config carries functions — validation rules, previews, the
 * structure resolver — so it is imported inside the client graph rather than
 * passed down from the route, which would try to serialise them.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioRoot() {
  return <NextStudio config={config} />;
}
