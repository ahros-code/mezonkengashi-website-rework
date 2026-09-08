import uz from "./uz";
import ru from "./ru";
import uzPages from "./uz.pages";
import ruPages from "./ru.pages";
import type { Locale } from "./config";

/** The home page copy and the sub-page copy live in separate files, but the
 *  rest of the app sees one dictionary per locale. */
export type Dict = typeof uz & typeof uzPages;

const dictionaries: Record<Locale, Dict> = {
  uz: { ...uz, ...uzPages },
  ru: { ...ru, ...ruPages },
};

export function getDict(locale: Locale): Dict {
  return dictionaries[locale];
}
