import type { StructureResolver } from "sanity/structure";
import { singletonTypes } from "./schema/pages";

const singletonTitles: Record<string, string> = {
  researchPage: "Tadqiqotlar sahifasi",
  newsPage: "Yangiliklar sahifasi",
  eventsPage: "Tadbirlar sahifasi",
  faqPage: "Savol-javob sahifasi",
};

/**
 * The Studio sidebar mirrors the site's own navigation, so an editor looking
 * for the page they can see in the browser finds it in the same place here.
 * Everything the CMS owns sits under Bilim markazi; nothing else does yet.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Mezon Kengashi")
    .items([
      S.listItem()
        .title("Bilim markazi")
        .child(
          S.list()
            .title("Bilim markazi")
            .items([
              S.documentTypeListItem("researchArticle").title("Tadqiqotlar va maqolalar"),
              S.documentTypeListItem("newsArticle").title("Yangiliklar"),
              S.documentTypeListItem("event").title("Tadbirlar"),
              S.documentTypeListItem("faqCategory").title("Savol-javob boʻlimlari"),
            ])
        ),
      S.divider(),
      S.listItem()
        .title("Sahifa matnlari")
        .child(
          S.list()
            .title("Sahifa matnlari")
            .items(
              // Singletons: one fixed document id each, opened directly rather
              // than through a list an editor could add a second row to.
              singletonTypes.map((type) =>
                S.listItem()
                  .title(singletonTitles[type])
                  .id(type)
                  .child(S.document().schemaType(type).documentId(type).title(singletonTitles[type]))
              )
            )
        ),
    ]);
