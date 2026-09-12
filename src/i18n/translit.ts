/**
 * Uzbek Latin → Uzbek Cyrillic.
 *
 * The Cyrillic edition of the site is generated from the Latin copy rather than
 * kept as a third translation: the two scripts write the same language, the
 * 1995 alphabet maps almost letter for letter, and a generated edition can never
 * drift from the one editors actually maintain (in the dictionaries or in Sanity).
 *
 * "Almost" is where the work is. The Latin alphabet dropped letters Cyrillic
 * still has — ц after a consonant, ь, the ъ in Russian loans — so those come
 * back from the exception tables below. Anything that is not Uzbek at all
 * (URLs, codes, AAOIFI, English titles) is left in Latin, which is also how
 * Cyrillic Uzbek print handles it.
 */

/* ------------------------------------------------------------------ *
 * Exceptions
 * ------------------------------------------------------------------ */

/** Whole words (lowercase) whose Cyrillic spelling the letters cannot recover. */
const WORDS: Record<string, string> = {
  // Months keep the soft sign in the bare form.
  yanvar: "январь",
  fevral: "февраль",
  aprel: "апрель",
  iyun: "июнь",
  iyul: "июль",
  sentyabr: "сентябрь",
  sentabr: "сентябрь",
  oktyabr: "октябрь",
  oktabr: "октябрь",
  noyabr: "ноябрь",
  dekabr: "декабрь",
  portfel: "портфель",
  model: "модель",
  rubl: "рубль",
  avtomobil: "автомобиль",
  sentyabrda: "сентябрда",
  // Latin "e" after a vowel is normally э, but not in these.
  teatr: "театр",
};

/**
 * Stems (lowercase) matched at the start of a word; the rest of the word is
 * transliterated normally. Longest stem wins.
 */
const STEMS: Record<string, string> = {
  obyekt: "объект",
  subyekt: "субъект",
  inyeksiya: "инъекция",
  aksiya: "акция",
  aksion: "акцион",
  prinsip: "принцип",
  sement: "цемент",
  sirk: "цирк",
  kompyuter: "компьютер",
  konsult: "консульт",
  profitsit: "профицит",
  // Suffixed month forms: the letters give сентабр-, Cyrillic writes сентябр-.
  sentabr: "сентябр",
  oktabr: "октябр",
  rezultat: "результат",
  pulsat: "пульсат",
  intervyu: "интервью",
  medalyon: "медальон",
  moʻjiz: "мўъжиз",
  moʻtabar: "мўътабар",
  moʻtadil: "мўътадил",
  moʻmin: "мўмин",
  // "ts" before a consonant stays тс in native words, but these are ц.
  spetsifik: "специфик",
  spetsial: "специал",
};

/**
 * Words that stay in Latin even though they look transliterable: international
 * acronyms and foreign proper names. Compared case-sensitively.
 */
const KEEP = new Set([
  "AAOIFI", "IFSB", "CPSS", "CSAA", "CIMA", "IF", "SS", "FAS", "GS", "MBA", "PhD",
  "IFRS", "IAS", "ISO", "IsDB", "IDB", "IILM", "IIFM", "CIBAFI", "OIC", "ICD", "IRTI",
  "ACCA", "CFA", "CPA", "OECD", "IMF", "EBRD", "ADB", "ESG", "KPI", "NDA", "CEO",
  "CFO", "IT", "PDF", "SMS", "API", "AI", "UZS", "USD", "EUR", "LLC", "JSC", "SPV",
  "B2B", "B2C", "ENTER", "SAM", "LEX", "UNIVERSALIS", "Pte", "Ltd", "Inc",
  "Engineering", "Constant", "Oriental", "Philosophy", "Justice", "Food", "Certificate",
  "Certified", "Proficiency", "Standards", "Standard", "Adviser", "Auditor", "Finance",
  "Islamic", "Shariʼah", "Shariʼa", "Shariah", "Sharia", "of", "in", "and", "the", "for",
  "WhatsApp", "Instagram", "Facebook", "YouTube", "LinkedIn", "Google",
  // Company, product and institution names: a brand keeps its own spelling,
  // which is also how Cyrillic Uzbek print sets them.
  "InfinBANK", "Paynet", "ATTO", "Asaxiy", "MBIMU", "Enlawyer", "Constat", "MK",
  "Murad", "Buildings", "Leasing", "Invest", "Group", "Tower", "BHH", "UZCARD",
  "LSEG", "ICD", "INCEIF", "CIPA", "IMAN", "Global", "Korea", "University",
  "Istanbul", "Marmara", "Sabahattin", "Zaim", "Forum", "Mobile", "Protection",
]);

/** KEEP entries that can carry an Uzbek suffix: "AAOIFIning" → "AAOIFIнинг". */
const KEEP_STEMS = [...KEEP].filter((k) => k.length >= 3 && k !== k.toLowerCase());

/* ------------------------------------------------------------------ *
 * Letters
 * ------------------------------------------------------------------ */

const SINGLE: Record<string, string> = {
  a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и", j: "ж",
  k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ", r: "р", s: "с",
  t: "т", u: "у", v: "в", x: "х", y: "й", z: "з",
  // Letters Uzbek Latin does not use, for the odd foreign word that slips through.
  c: "к", w: "в",
};

/** Apostrophes that turn o/g into ў/ғ. U+02BC is kept for the tutuq belgisi. */
const TURNED = new Set(["ʻ", "‘", "`", "'", "’"]);
/** Everything that can stand for the tutuq belgisi (ъ) between letters. */
const MARKS = new Set(["ʻ", "ʼ", "‘", "’", "'", "`"]);

const VOWEL = /[aeiouAEIOUўЎ]/;

function isLetter(ch: string | undefined) {
  return !!ch && /[A-Za-z]/.test(ch);
}

function caseLike(src: string, out: string, allCaps: boolean) {
  if (allCaps) return out.toUpperCase();
  if (src[0] === src[0].toUpperCase() && src[0] !== src[0].toLowerCase()) {
    return out[0].toUpperCase() + out.slice(1);
  }
  return out;
}

/** Transliterates one word made only of Latin letters and apostrophes. */
function word(w: string): string {
  if (KEEP.has(w)) return w;
  for (const k of KEEP_STEMS) {
    if (w.startsWith(k) && /^[a-zʻʼ']+$/.test(w.slice(k.length))) {
      return k + letterRun(w.slice(k.length), 0, false, true);
    }
  }

  const letters = w.replace(/[^A-Za-z]/g, "");
  const allCaps = letters.length > 1 && letters === letters.toUpperCase();
  // Roman numerals (XXI asr) stay Latin in Cyrillic text too.
  if (allCaps && /^[IVXLCDM]+$/.test(w)) return w;

  const lower = w.toLowerCase().replace(/[‘`'’]/g, "ʻ");

  const whole = WORDS[lower];
  if (whole) return caseLike(w, whole, allCaps);

  let prefix = "";
  let start = 0;
  let best = "";
  for (const stem of Object.keys(STEMS)) {
    if (lower.startsWith(stem) && stem.length > best.length) best = stem;
  }
  if (best) {
    prefix = caseLike(w, STEMS[best], allCaps);
    // Advance past the stem in the original word (apostrophes count as one char).
    start = best.length;
  }

  return prefix + letterRun(w, start, allCaps, prefix.length > 0);
}

function letterRun(w: string, from: number, allCaps: boolean, afterStem: boolean): string {
  let out = "";
  const n = w.length;

  const emit = (src: string, cyr: string) => {
    if (allCaps) out += cyr.toUpperCase();
    else if (src[0] !== src[0].toLowerCase()) out += cyr[0].toUpperCase() + cyr.slice(1);
    else out += cyr;
  };

  for (let i = from; i < n; i++) {
    const c = w[i];
    const lc = c.toLowerCase();
    const next = w[i + 1];
    const nl = next?.toLowerCase();
    const prev = i > 0 ? w[i - 1] : undefined;
    const atStart = i === 0 && !afterStem;

    // Apostrophes that survive to here are the tutuq belgisi, or a separator.
    if (MARKS.has(c)) {
      const before = w[i - 1]?.toLowerCase();
      // Is'hoq: the mark only keeps s and h apart.
      if ((before === "s" || before === "c") && nl === "h") continue;
      if (isLetter(prev)) out += allCaps ? "Ъ" : "ъ";
      continue;
    }

    // oʻ, gʻ
    if ((lc === "o" || lc === "g") && next && TURNED.has(next)) {
      emit(c, lc === "o" ? "ў" : "ғ");
      i++;
      continue;
    }

    // sh, ch
    if ((lc === "s" || lc === "c") && nl === "h") {
      emit(c, lc === "s" ? "ш" : "ч");
      i++;
      continue;
    }

    // yo, yu, ya, ye — but y + oʻ is й + ў.
    if (lc === "y" && nl && "ouae".includes(nl)) {
      if (nl === "o" && w[i + 2] && TURNED.has(w[i + 2])) {
        emit(c, "й");
        continue;
      }
      const map: Record<string, string> = { o: "ё", u: "ю", a: "я", e: "е" };
      emit(c, map[nl]);
      i++;
      continue;
    }

    // ts → ц in loans: at the start of a word, and before e / iya / ion / iy.
    if (lc === "t" && nl === "s") {
      const rest = w.slice(i + 2).toLowerCase();
      if (atStart || /^(e|iy|io|ia)/.test(rest)) {
        emit(c, "ц");
        i++;
        continue;
      }
    }

    // e → э at the start of a word and after a vowel (poeziya, aeroport),
    // except in Russian-style surnames (-aev, -oev).
    if (lc === "e") {
      const afterVowel = prev !== undefined && VOWEL.test(prev) && prev.toLowerCase() !== "i";
      const surname = /^v(a|ich|na)?$/i.test(w.slice(i + 1));
      if (atStart || (afterVowel && !surname)) {
        emit(c, "э");
        continue;
      }
    }

    const cyr = SINGLE[lc];
    if (cyr) emit(c, cyr);
    else out += c;
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Text
 * ------------------------------------------------------------------ */

/**
 * Spans copied verbatim: URLs, e-mail, domains, @handles, {placeholders},
 * and codes that mix capitals with digits (MK-2026-0148, IFSB-8, B2B).
 */
const PROTECTED = new RegExp(
  [
    String.raw`https?:\/\/\S+`,
    String.raw`[\w.+-]+@[\w-]+(?:\.[\w-]+)+`,
    String.raw`@[A-Za-z0-9_]+`,
    String.raw`\{[^}]*\}`,
    String.raw`\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:uz|com|org|net|io|ru)\b`,
    String.raw`\b(?=[A-Z0-9-]*\d)(?=[A-Z0-9-]*[A-Z])[A-Z0-9]+(?:-[A-Z0-9]+)*\b`,
  ].join("|"),
  "g",
);

/** A word: Latin letters, with apostrophes allowed inside and after o/g or as a final tutuq. */
const WORD = /[A-Za-z](?:[A-Za-z]|[ʻʼ‘’'`](?=[A-Za-z])|(?<=[oOgG])[ʻ‘`'’]|ʼ)*/g;

function plain(text: string) {
  return text.replace(WORD, word);
}

const cache = new Map<string, string>();

export function toCyrillic(text: string): string {
  if (!text || !/[A-Za-z]/.test(text)) return text;
  const hit = cache.get(text);
  if (hit !== undefined) return hit;

  let out = "";
  let last = 0;
  for (const m of text.matchAll(PROTECTED)) {
    out += plain(text.slice(last, m.index)) + m[0];
    last = m.index! + m[0].length;
  }
  out += plain(text.slice(last));

  if (cache.size > 5000) cache.clear();
  cache.set(text, out);
  return out;
}

/**
 * Keys whose values are identifiers or addresses, never prose — and the
 * wordmark, which is the Latin logotype in every edition.
 */
const SKIP_KEYS = new Set(["id", "slug", "href", "src", "url", "photo", "file", "logo", "number", "org", "code", "ar", "wordmark"]);

/** Deep-transliterates every string in a value, preserving its shape. */
export function cyrillize<T>(value: T, key?: string): T {
  if (typeof value === "string") {
    return (key && SKIP_KEYS.has(key) ? value : toCyrillic(value)) as T;
  }
  if (Array.isArray(value)) return value.map((v) => cyrillize(v, key)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[k] = cyrillize(v, k);
    return out as T;
  }
  return value;
}

/* ------------------------------------------------------------------ *
 * Script folding, for search that should not care which script was typed.
 * ------------------------------------------------------------------ */

const FOLD: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", ғ: "g", д: "d", е: "e", ё: "yo", ж: "j", з: "z",
  и: "i", й: "y", к: "k", қ: "q", л: "l", м: "m", н: "n", о: "o", ў: "o", п: "p",
  р: "r", с: "s", т: "t", у: "u", ф: "f", х: "x", ҳ: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sh", ъ: "", ы: "i", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Lowercased Latin skeleton of Uzbek or Russian text: "Ўзбекистон" and "Oʻzbekiston" both fold to "ozbekiston". */
export function foldScript(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ʻʼ‘’'`]/g, "")
    .replace(/[а-яёўқғҳ]/g, (ch) => FOLD[ch] ?? ch);
}
