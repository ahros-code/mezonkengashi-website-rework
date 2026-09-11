import type { SchemaTypeDefinition } from "sanity";
import { localeString, localeText } from "./locale";
import { headingBlock, listBlock, paragraphBlock, quoteBlock } from "./blocks";
import { newsArticle, researchArticle } from "./article";
import { agendaItem, mezonEvent } from "./event";
import { faqCategory, faqItem } from "./faq";
import { certificate, organization } from "./clients";
import { eventsPage, faqPage, newsPage, researchPage } from "./pages";

export const schemaTypes: SchemaTypeDefinition[] = [
  // building blocks
  localeString,
  localeText,
  paragraphBlock,
  headingBlock,
  listBlock,
  quoteBlock,
  agendaItem,
  faqItem,
  // documents
  researchArticle,
  newsArticle,
  mezonEvent,
  faqCategory,
  organization,
  certificate,
  researchPage,
  newsPage,
  eventsPage,
  faqPage,
];
