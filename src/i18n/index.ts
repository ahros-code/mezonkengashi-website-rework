import uz from "./uz";
import ru from "./ru";
import uzPages from "./uz.pages";
import ruPages from "./ru.pages";
import { cyrillize } from "./translit";
import type { Locale } from "./config";

/** The home page copy and the sub-page copy live in separate files, but the
 *  rest of the app sees one dictionary per locale. */
export type Dict = typeof uz & typeof uzPages;

const latin: Dict = { ...uz, ...uzPages };

const dictionaries: Record<Exclude<Locale, "oz">, Dict> = {
  uz: latin,
  ru: { ...ru, ...ruPages },
};

/** The Cyrillic dictionary is the Latin one, transliterated once on first use. */
let cyrillic: Dict | undefined;

export function getDict(locale: Locale): Dict {
  if (locale === "oz") return (cyrillic ??= cyrillize(latin));
  return dictionaries[locale];
}
