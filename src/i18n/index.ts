import uz from "./uz";
import ru from "./ru";
import type { Locale } from "./config";

export type { Dict } from "./uz";

const dictionaries = { uz, ru };

export function getDict(locale: Locale) {
  return dictionaries[locale];
}
