import type { Certificate, Organization } from "./types";

const TASHKENT = { uz: "Toshkent", ru: "Ташкент" };

/**
 * The roster.
 *
 * The first block is real: the clients and partners named in the company
 * brochure, with the work described there. None of them carries a certificate
 * record here — a certificate is a signed document, so the registry below only
 * ever holds what the council actually issued.
 *
 * The second block is the PLACEHOLDER sample registry the certificates were
 * written against. Those organisations are invented. Replace them in the Studio
 * (Mijozlar va sertifikatlar): the site switches to the CMS copy as soon as one
 * organisation is published there.
 */
export const organizations: Organization[] = [
  {
    slug: "infinbank",
    logo: "/img/clients/infinbank.webp",
    name: "InfinBANK",
    sector: "bank",
    city: TASHKENT,
    work: {
      uz: "Xalqaro standartlar asosida islom moliyasi vositalarini joriy etish",
      ru: "Внедрение исламских финансовых инструментов по международным стандартам",
    },
  },
  {
    slug: "brb",
    logo: "/img/clients/brb.webp",
    name: "Biznesni Rivojlantirish Banki",
    sector: "bank",
    city: TASHKENT,
    work: {
      uz: "Bank xodimlari uchun “Islom bankingi asoslari” va “AAOIFI CPSS” kurslari",
      ru: "Курсы «Основы исламского банкинга» и «AAOIFI CPSS» для сотрудников банка",
    },
  },
  {
    slug: "murad-buildings",
    logo: "/img/clients/murad-buildings.webp",
    name: "Murad Buildings",
    sector: "construction",
    city: TASHKENT,
    work: {
      uz: "Qurilish loyihalarini islom moliyasi standartlari asosida strukturalash",
      ru: "Структурирование строительных проектов по стандартам исламских финансов",
    },
  },
  {
    slug: "mbimu",
    logo: "/img/clients/mbimu.webp",
    name: "MBIMU",
    sector: "microfinance",
    city: TASHKENT,
    work: {
      uz: "Uyushma aʼzolariga islom mikromoliyasi xizmatlarini yoʻlga qoʻyishda koʻmak",
      ru: "Содействие в предоставлении услуг исламского микрофинансирования для учреждений-членов",
    },
  },
  {
    slug: "atto",
    logo: "/img/clients/atto.webp",
    name: "ATTO",
    sector: "fintech",
    city: TASHKENT,
    work: {
      uz: "Fintex sohasida investitsiya mahsulotlarini strukturalash va joriy etish",
      ru: "Структурирование и внедрение инвестиционных продуктов в сфере финтеха",
    },
  },
  {
    slug: "asaxiy-invest",
    logo: "/img/clients/asaxiy-invest.webp",
    name: "Asaxiy Invest",
    sector: "investment",
    city: TASHKENT,
    work: {
      uz: "Investitsiya platformasi doirasida shariatga muvofiq yechimlarni ishlab chiqish",
      ru: "Разработка и внедрение шариатских решений в рамках инвестиционной платформы",
    },
  },
  {
    slug: "paynet",
    logo: "/img/clients/paynet.webp",
    name: "Paynet",
    sector: "fintech",
    city: TASHKENT,
    work: {
      uz: "Tijorat banklari uchun islom moliyasi vositalari orqali mablagʻ jalb qilish",
      ru: "Мобилизация средств с исламскими финансовыми инструментами для коммерческих банков",
    },
  },
  {
    slug: "a-group",
    logo: "/img/clients/a-group.webp",
    name: "A Group",
    sector: "business",
    city: TASHKENT,
    work: {
      uz: "Avtoritet chakana va savdo tarmogʻiga islom moliyasi vositalarini integratsiya qilish",
      ru: "Интеграция исламских финансовых инструментов в розничную и торговую сеть Avtoritet",
    },
  },
  {
    slug: "mk-leasing",
    logo: "/img/clients/mk-leasing.webp",
    name: "MK Leasing",
    sector: "leasing",
    city: TASHKENT,
    work: {
      uz: "AAOIFI va Oʻzbekiston qonunchiligiga muvofiqlik; ijara va murobaha mahsulotlari",
      ru: "Соответствие стандартам AAOIFI и законодательству РУз; продукты иджара и мурабаха",
    },
  },

  /* ---- sample organisations, for the placeholder registry below ---- */
  { slug: "barqaror-moliya-bank", name: "Barqaror Moliya Bank", sector: "bank", city: TASHKENT, since: 2024 },
  { slug: "oqsaroy-invest-bank", name: "Oqsaroy Invest Bank", sector: "bank", city: TASHKENT, since: 2024 },
  { slug: "nurafshon-lizing", name: "Nurafshon Lizing", sector: "leasing", city: TASHKENT, since: 2024 },
  { slug: "chorsu-mikromoliya", name: "Chorsu Mikromoliya", sector: "microfinance", city: TASHKENT, since: 2025 },
  { slug: "bargoh-takaful", name: "Bargoh Takaful", sector: "takaful", city: TASHKENT, since: 2025 },
  { slug: "zarafshon-halol-invest", name: "Zarafshon Halol Invest", sector: "investment", city: { uz: "Samarqand", ru: "Самарканд" }, since: 2025 },
  { slug: "yangi-vodiy-bank", name: "Yangi Vodiy Bank", sector: "bank", city: { uz: "Fargʻona", ru: "Фергана" }, since: 2025 },
  { slug: "sahro-agro-lizing", name: "Sahro Agro Lizing", sector: "leasing", city: { uz: "Buxoro", ru: "Бухара" }, since: 2025 },
];

const AAOIFI = "AAOIFI SS";

export const certificates: Certificate[] = [
  {
    number: "MK-2026-0148",
    org: "barqaror-moliya-bank",
    kind: "product",
    subject: { uz: "“Halol Avto” ijara asosidagi avtomobil moliyalashtirish", ru: "«Халяль Авто» — автофинансирование на основе иджары" },
    standards: [`${AAOIFI} 9`, `${AAOIFI} 5`],
    issued: "2026-07-22",
    validUntil: "2027-07-21",
  },
  {
    number: "MK-2026-0141",
    org: "zarafshon-halol-invest",
    kind: "sukuk",
    subject: { uz: "Ijara sukuk emissiyasi, 1-seriya", ru: "Выпуск иджара-сукук, серия 1" },
    standards: [`${AAOIFI} 17`, `${AAOIFI} 9`],
    issued: "2026-06-03",
    validUntil: "2031-06-02",
  },
  {
    number: "MK-2026-0133",
    org: "bargoh-takaful",
    kind: "operations",
    subject: { uz: "Oilaviy takaful faoliyati", ru: "Деятельность семейного такафула" },
    standards: [`${AAOIFI} 26`, "IFSB-8"],
    issued: "2026-04-15",
    validUntil: "2027-04-14",
  },
  {
    number: "MK-2026-0127",
    org: "oqsaroy-invest-bank",
    kind: "product",
    subject: { uz: "Murobaha asosidagi savdo moliyalashtirish", ru: "Торговое финансирование на основе мурабахи" },
    standards: [`${AAOIFI} 8`],
    issued: "2026-03-02",
    validUntil: "2027-03-01",
  },
  {
    number: "MK-2025-0091",
    org: "yangi-vodiy-bank",
    kind: "product",
    subject: { uz: "Mudoraba omonat hisobi", ru: "Депозитный счёт мудараба" },
    standards: [`${AAOIFI} 13`],
    issued: "2025-10-06",
    validUntil: "2026-10-05",
  },
  {
    number: "MK-2025-0084",
    org: "sahro-agro-lizing",
    kind: "product",
    subject: { uz: "Qishloq xoʻjaligi texnikasi ijarasi", ru: "Лизинг сельхозтехники" },
    standards: [`${AAOIFI} 9`],
    issued: "2025-08-18",
    validUntil: "2026-08-17",
  },
  {
    number: "MK-2025-0077",
    org: "zarafshon-halol-invest",
    kind: "fund",
    subject: { uz: "“Zarafshon Halol” aksiyalar fondi", ru: "Фонд акций «Зарафшан Халяль»" },
    standards: [`${AAOIFI} 21`, `${AAOIFI} 12`],
    issued: "2025-07-01",
    validUntil: "2026-12-31",
  },
  {
    number: "MK-2025-0055",
    org: "nurafshon-lizing",
    kind: "operations",
    subject: { uz: "Ijara muntahiya bittamlik faoliyati", ru: "Деятельность иджара мунтахия биттамлик" },
    standards: [`${AAOIFI} 9`],
    issued: "2025-03-20",
    validUntil: "2026-03-19",
    revoked: true,
  },
  {
    number: "MK-2025-0041",
    org: "chorsu-mikromoliya",
    kind: "product",
    subject: { uz: "Kichik biznes uchun murobaha mikromoliyasi", ru: "Микрофинансирование мурабаха для малого бизнеса" },
    standards: [`${AAOIFI} 8`],
    issued: "2025-02-03",
    validUntil: "2027-02-02",
  },
  {
    number: "MK-2024-0036",
    org: "barqaror-moliya-bank",
    kind: "operations",
    subject: { uz: "Islom oynasi faoliyati", ru: "Деятельность исламского окна" },
    standards: [`${AAOIFI} 1`, `${AAOIFI} 8`, `${AAOIFI} 9`],
    issued: "2024-12-09",
    validUntil: "2026-12-08",
  },
  {
    number: "MK-2024-0022",
    org: "oqsaroy-invest-bank",
    kind: "product",
    subject: { uz: "Mushoraka asosidagi ipoteka", ru: "Ипотека на основе мушараки" },
    standards: [`${AAOIFI} 12`],
    issued: "2024-06-17",
    validUntil: "2025-06-16",
  },
  {
    number: "MK-2024-0014",
    org: "nurafshon-lizing",
    kind: "product",
    subject: { uz: "Uskuna ijarasi", ru: "Лизинг оборудования" },
    standards: [`${AAOIFI} 9`],
    issued: "2024-03-04",
    validUntil: "2025-03-03",
  },
];
