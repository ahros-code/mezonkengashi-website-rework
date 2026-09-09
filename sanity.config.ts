import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioBasePath } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schema";
import { singletonTypes } from "@/sanity/schema/pages";
import { structure } from "@/sanity/structure";

const singletons = new Set<string>(singletonTypes);

export default defineConfig({
  name: "mezon",
  title: "Mezon Kengashi — Bilim markazi",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
    /**
     * Page-copy singletons are not creatable from the global "new document"
     * button — there is exactly one Tadqiqotlar sahifasi, and a second one
     * would be invisible to the site while looking perfectly valid here.
     */
    templates: (prev) => prev.filter((t) => !singletons.has(t.schemaType)),
  },
  document: {
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType)
        ? prev.filter(({ action }) => action !== "delete" && action !== "duplicate")
        : prev,
  },
  plugins: [
    structureTool({ structure }),
    // Vision runs GROQ queries against the dataset. Administrators use it to
    // debug content; it is read-only, so it is safe to leave enabled.
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
