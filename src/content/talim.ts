import type { L } from "./types";

/**
 * MEZON TAʼLIM — the council's education arm.
 *
 * Confirmed (from mezon-talim.uz): the CPSS course facts, its nine modules, the
 * three instructors and the contacts. Everything flagged `sample: true` is a
 * placeholder the page labels on screen until the client supplies the real one.
 */

export const talimContact = {
  telegram: "https://t.me/mezontalim_admin",
  telegramHandle: "@mezontalim_admin",
  phone: "+998 90 109 77 99",
  phoneHref: "+998901097799",
  site: "https://mezon-talim.uz",
  siteLabel: "mezon-talim.uz",
} as const;

/** AAOIFI Shariʼah Standard numbers cited on the page, with their short names. */
export const standardName: Record<number, L> = {
  3: { uz: "Toʻlovni kechiktiruvchi qarzdor", ru: "Недобросовестный должник" },
  4: { uz: "Qarzni oʻzaro hisob", ru: "Зачёт долга" },
  5: { uz: "Kafolatlar", ru: "Гарантии" },
  6: { uz: "Anʼanaviy bankni islom bankiga aylantirish", ru: "Преобразование банка в исламский" },
  7: { uz: "Havola", ru: "Хаваля" },
  8: { uz: "Murobaha", ru: "Мурабаха" },
  9: { uz: "Ijara", ru: "Иджара" },
  10: { uz: "Salam", ru: "Салям" },
  11: { uz: "Istisnoʼ", ru: "Истисна" },
  12: { uz: "Shirkat", ru: "Ширка" },
  13: { uz: "Muzoraba", ru: "Мудараба" },
  14: { uz: "Hujjatli akkreditiv", ru: "Документарный аккредитив" },
  17: { uz: "Investitsion sukuk", ru: "Инвестиционные сукук" },
  19: { uz: "Qarz", ru: "Заём (кард)" },
  20: { uz: "Tovar birjalarida savdo", ru: "Торговля на товарных биржах" },
  21: { uz: "Aksiya va obligatsiyalar", ru: "Акции и облигации" },
  23: { uz: "Vakolat", ru: "Агентирование (вакаля)" },
  28: { uz: "Bank xizmatlari", ru: "Банковские услуги" },
  31: { uz: "Gʻarar", ru: "Гарар" },
  33: { uz: "Vaqf", ru: "Вакф" },
  35: { uz: "Zakot", ru: "Закят" },
  39: { uz: "Garov", ru: "Залог" },
  49: { uz: "Vaʼda va oʻzaro vaʼda", ru: "Обещание и взаимное обещание" },
};

export type TalimModule = {
  title: L;
  /** The subject's name in Arabic, as it appears in the standards. */
  ar: string;
  /** Representative standards, not the full list. */
  standards: number[];
};

export const cpssModules: TalimModule[] = [
  {
    title: { uz: "Islom moliyasi asoslari", ru: "Основы исламских финансов" },
    ar: "أسس المالية الإسلامية",
    standards: [31],
  },
  {
    title: { uz: "Islomiy moliyaviy shartnomalar", ru: "Исламские финансовые договоры" },
    ar: "العقود المالية الإسلامية",
    standards: [8, 9, 10, 11],
  },
  {
    title: { uz: "Xizmatlar va sherikliklar", ru: "Услуги и партнёрства" },
    ar: "الخدمات والمشاركات",
    standards: [12, 13, 23],
  },
  {
    title: { uz: "Xiyorlar va vaʼdalar", ru: "Опционы и обещания" },
    ar: "الخيارات والوعد",
    standards: [49],
  },
  {
    title: { uz: "Kafolatlar, kreditlar va garov", ru: "Гарантии, кредиты и залог" },
    ar: "الضمانات والرهون",
    standards: [5, 39],
  },
  {
    title: { uz: "Qarz munosabatlari", ru: "Долговые отношения" },
    ar: "أحكام الديون",
    standards: [3, 4, 7, 19],
  },
  {
    title: { uz: "Islomiy ijtimoiy moliya", ru: "Исламские социальные финансы" },
    ar: "المالية الاجتماعية الإسلامية",
    standards: [33, 35],
  },
  {
    title: { uz: "Islom banki", ru: "Исламский банкинг" },
    ar: "المصرفية الإسلامية",
    standards: [6, 14, 28],
  },
  {
    title: { uz: "Islomiy moliya bozorlari", ru: "Исламские финансовые рынки" },
    ar: "الأسواق المالية الإسلامية",
    standards: [17, 20, 21],
  },
];

export type TalimCourse = {
  id: string;
  /** Short code set large on the card art. */
  code: string;
  title: L;
  /** Full name of the certificate or programme, shown under the title. */
  subtitle: L;
  audience: L;
  format: L;
  length: L;
  summary: L;
  /** Placeholder until the client supplies the real programme. */
  sample?: boolean;
};

/** Other programmes. Until the client lists them, every entry is a labelled sample. */
export const otherCourses: TalimCourse[] = [
  {
    id: "csaa",
    code: "CSAA",
    title: { uz: "CSAA tayyorlov kursi", ru: "Подготовка к CSAA" },
    subtitle: {
      uz: "AAOIFI Certified Shariʼa Adviser and Auditor",
      ru: "AAOIFI Certified Shariʼa Adviser and Auditor",
    },
    audience: { uz: "Shariat nazorati va ichki audit xodimlari", ru: "Сотрудники шариатского контроля и внутреннего аудита" },
    format: { uz: "Gibrid", ru: "Гибрид" },
    length: { uz: "Muddati aniqlanmoqda", ru: "Срок уточняется" },
    summary: {
      uz: "Shariat maslahatchisi va auditori sertifikatiga tayyorlov: standartlarni amaliy auditda qoʻllash.",
      ru: "Подготовка к сертификату шариатского консультанта и аудитора: применение стандартов в практическом аудите.",
    },
    sample: true,
  },
  {
    id: "cima-if",
    code: "CIMA IF",
    title: { uz: "CIMA IF tayyorlov kursi", ru: "Подготовка к CIMA IF" },
    subtitle: { uz: "CIMA Certificate in Islamic Finance", ru: "CIMA Certificate in Islamic Finance" },
    audience: { uz: "Moliyachilar va buxgalterlar", ru: "Финансисты и бухгалтеры" },
    format: { uz: "Onlayn", ru: "Онлайн" },
    length: { uz: "Muddati aniqlanmoqda", ru: "Срок уточняется" },
    summary: {
      uz: "Islom moliyasi mahsulotlari, hisobi va bozorlari boʻyicha xalqaro sertifikatga tayyorgarlik.",
      ru: "Подготовка к международному сертификату по продуктам, учёту и рынкам исламских финансов.",
    },
    sample: true,
  },
  {
    id: "basics",
    code: "101",
    title: { uz: "Islom moliyasiga kirish", ru: "Введение в исламские финансы" },
    subtitle: { uz: "Boshlovchilar uchun asosiy kurs", ru: "Базовый курс для начинающих" },
    audience: { uz: "Talabalar va sohaga yangi kelganlar", ru: "Студенты и новички в отрасли" },
    format: { uz: "Toshkentda", ru: "В Ташкенте" },
    length: { uz: "Muddati aniqlanmoqda", ru: "Срок уточняется" },
    summary: {
      uz: "Riba, gʻarar va asosiy shartnomalar: CPSS dan oldin tushunchalarni tartibga keltirish.",
      ru: "Риба, гарар и основные договоры: навести порядок в понятиях перед CPSS.",
    },
    sample: true,
  },
  {
    id: "corporate",
    code: "B2B",
    title: { uz: "Korporativ dasturlar", ru: "Корпоративные программы" },
    subtitle: { uz: "Bank va kompaniya jamoalari uchun", ru: "Для команд банков и компаний" },
    audience: { uz: "Bank, lizing va sugʻurta jamoalari", ru: "Команды банков, лизинговых и страховых компаний" },
    format: { uz: "Buyurtmachi ofisida yoki onlayn", ru: "В офисе заказчика или онлайн" },
    length: { uz: "16–72 soat", ru: "16–72 часа" },
    summary: {
      uz: "Jamoaning mahsulotlari va vazifalariga moslab tuziladigan amaliy dastur.",
      ru: "Практическая программа, собранная под продукты и задачи команды.",
    },
    sample: true,
  },
];

export type TalimInstructor = {
  id: string;
  name: L;
  role: L;
  credentials: L[];
  photo: string;
};

export const instructors: TalimInstructor[] = [
  {
    id: "nusratxojayev",
    name: { uz: "Xondamir Nusratxoʻjayev", ru: "Хондамир Нусратходжаев" },
    role: { uz: "AAOIFI Shariat kengashi aʼzosi (2016–2023)", ru: "Член Шариатского совета AAOIFI (2016–2023)" },
    credentials: [
      { uz: "Xalqaro moliya sohasida 26 yillik tajriba", ru: "26 лет опыта в международных финансах" },
    ],
    photo: "/img/talim/nusratxojayev.webp",
  },
  {
    id: "akramov",
    name: { uz: "Muxtorjon Akramov", ru: "Мухторжон Акрамов" },
    role: { uz: "Dastur direktori", ru: "Директор программы" },
    credentials: [
      { uz: "Oʻzbekiston xalqaro islom akademiyasi bitiruvchisi", ru: "Выпускник Международной исламской академии Узбекистана" },
      { uz: "Islom moliyasi va huquqida 5 yillik tajriba", ru: "5 лет опыта в исламских финансах и праве" },
    ],
    photo: "/img/talim/akramov.webp",
  },
  {
    id: "xusnidinov",
    name: { uz: "Muzaffar Xusnidinov", ru: "Музаффар Хуснидинов" },
    role: {
      uz: "CSAA — sertifikatlangan shariat maslahatchisi va auditori",
      ru: "CSAA — сертифицированный шариатский консультант и аудитор",
    },
    credentials: [
      { uz: "Vaqf amaliyotchisi", ru: "Практик вакфа" },
      { uz: "Moliya yoʻnalishida MBA", ru: "MBA в области финансов" },
    ],
    photo: "/img/talim/xusnidinov.webp",
  },
];

export type TalimPlate = {
  caption: L;
  /** Path under /public. Without one the slot renders as an empty, labelled plate. */
  src?: string;
  alt?: L;
};

/** Photographs from the courses. Drop files into /public/img/talim/ and set `src`. */
export const plates: TalimPlate[] = [
  { caption: { uz: "Toshkentdagi auditoriya", ru: "Аудитория в Ташкенте" } },
  { caption: { uz: "Onlayn dars", ru: "Онлайн-занятие" } },
  { caption: { uz: "Sinov imtihoni", ru: "Пробный экзамен" } },
  { caption: { uz: "Tinglovchilar", ru: "Слушатели" } },
  { caption: { uz: "Sertifikatlar", ru: "Сертификаты" } },
];
