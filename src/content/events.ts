import type { MezonEvent } from "./types";

/** Placeholder programme. Replace with the client's real calendar. */
export const events: MezonEvent[] = [
  {
    slug: "islom-moliyasi-asoslari-intensiv",
    start: "2026-10-15T09:30:00+05:00",
    end: "2026-10-16T17:00:00+05:00",
    format: "onsite",
    venue: { uz: "Mezon Kengashi oʻquv markazi", ru: "Учебный центр Mezon Kengashi" },
    city: { uz: "Toshkent", ru: "Ташкент" },
    seats: 24,
    price: 3200000,
    host: "mezon",
    title: {
      uz: "Islom moliyasi asoslari: bank jamoalari uchun ikki kunlik intensiv",
      ru: "Основы исламских финансов: двухдневный интенсив для банковских команд",
    },
    excerpt: {
      uz: "Mahsulot menejerlari, kredit mutaxassislari va ichki nazoratchilar uchun. Nazariya minimal — asosiy vaqt haqiqiy shartnomalarni tahlil qilishga ketadi.",
      ru: "Для продуктовых менеджеров, кредитных специалистов и сотрудников внутреннего контроля. Теории минимум — основное время уходит на разбор реальных договоров.",
    },
    audience: {
      uz: "Bank va lizing kompaniyalari xodimlari, moliya boʻyicha yuristlar",
      ru: "Сотрудники банков и лизинговых компаний, юристы в сфере финансов",
    },
    agenda: [
      { time: "09:30", text: { uz: "Riba, garar va maysir: uchta taqiq amaliyotda", ru: "Риба, гарар и майсир: три запрета на практике" } },
      { time: "11:15", text: { uz: "Murobaha: hujjat aylanishi va tipik xatolar", ru: "Мурабаха: документооборот и типичные ошибки" } },
      { time: "14:00", text: { uz: "Ijara va ijara muntahiya bittamlik", ru: "Иджара и иджара мунтахия биттамлик" } },
      { time: "16:00", text: { uz: "Amaliy mashgʻulot: shartnomani tekshirish", ru: "Практикум: проверка договора" } },
      { time: "09:30", text: { uz: "Ikkinchi kun — mushoraka, mudoraba va sukuk", ru: "Второй день — мушарака, мудараба и сукук" } },
      { time: "14:00", text: { uz: "Takaful asoslari va zakot hisobi", ru: "Основы такафула и расчёт закята" } },
      { time: "16:00", text: { uz: "Yakuniy test va sertifikat topshirish", ru: "Итоговый тест и вручение сертификатов" } },
    ],
    outcomes: [
      { uz: "Shartnomadagi shariat riskini mustaqil aniqlash", ru: "Самостоятельно выявлять шариатский риск в договоре" },
      { uz: "Kengashga murojaat uchun hujjatlarni toʻgʻri tayyorlash", ru: "Правильно готовить документы для обращения в совет" },
      { uz: "Mahsulot tavsifini standartlar tiliga oʻgirish", ru: "Переводить описание продукта на язык стандартов" },
    ],
  },

  {
    slug: "aaoifi-csaa-tayyorgarlik-kursi",
    start: "2026-11-06T18:30:00+05:00",
    end: "2026-12-18T20:30:00+05:00",
    format: "online",
    venue: { uz: "Onlayn, haftada ikki marta", ru: "Онлайн, два раза в неделю" },
    city: { uz: "Onlayn", ru: "Онлайн" },
    seats: 40,
    price: 4800000,
    host: "mezon",
    title: {
      uz: "AAOIFI CSAA imtihoniga tayyorgarlik kursi",
      ru: "Курс подготовки к экзамену AAOIFI CSAA",
    },
    excerpt: {
      uz: "Olti hafta, oʻn ikki mashgʻulot. Shariat standartlari va hisob standartlari boʻyicha toʻliq dastur hamda ikkita sinov imtihoni.",
      ru: "Шесть недель, двенадцать занятий. Полная программа по шариатским и учётным стандартам, а также два пробных экзамена.",
    },
    audience: {
      uz: "Ichki auditorlar, buxgalterlar va shariat kengashi kotiblari",
      ru: "Внутренние аудиторы, бухгалтеры и секретари шариатских советов",
    },
    agenda: [
      { time: "1–2", text: { uz: "Shariat standartlari tuzilishi va qoʻllash mantigʻi", ru: "Структура шариатских стандартов и логика их применения" } },
      { time: "3–5", text: { uz: "Moliyalashtirish shartnomalari boʻyicha standartlar", ru: "Стандарты по договорам финансирования" } },
      { time: "6–8", text: { uz: "FAS boʻyicha hisob va hisobot", ru: "Учёт и отчётность по FAS" } },
      { time: "9–10", text: { uz: "Shariat auditi va nazorat tartibi", ru: "Шариатский аудит и порядок надзора" } },
      { time: "11–12", text: { uz: "Ikkita sinov imtihoni va xatolar tahlili", ru: "Два пробных экзамена и разбор ошибок" } },
    ],
    outcomes: [
      { uz: "Imtihon formatiga toʻliq tayyorlik", ru: "Полная готовность к формату экзамена" },
      { uz: "Standartlar boʻyicha shaxsiy konspekt", ru: "Личный конспект по стандартам" },
      { uz: "Ikki sinov imtihoni natijasi boʻyicha tahlil", ru: "Разбор результатов двух пробных экзаменов" },
    ],
  },

  {
    slug: "sukuk-strukturalari-seminari",
    start: "2026-12-04T10:00:00+05:00",
    end: "2026-12-04T16:30:00+05:00",
    format: "hybrid",
    venue: { uz: "Toshkent xalqaro biznes markazi", ru: "Ташкентский международный бизнес-центр" },
    city: { uz: "Toshkent", ru: "Ташкент" },
    seats: 60,
    price: 1800000,
    host: "mezon",
    title: {
      uz: "Sukuk strukturalari boʻyicha amaliy seminar",
      ru: "Практический семинар по структурам сукук",
    },
    excerpt: {
      uz: "Bir kunlik seminar emitentlar, konsultantlar va investorlar uchun. Uchta model haqiqiy emissiya hujjatlari asosida tahlil qilinadi.",
      ru: "Однодневный семинар для эмитентов, консультантов и инвесторов. Три модели разбираются на документах реальных выпусков.",
    },
    audience: {
      uz: "Emitentlar, investitsiya konsultantlari, moliya direktorlari",
      ru: "Эмитенты, инвестиционные консультанты, финансовые директора",
    },
    agenda: [
      { time: "10:00", text: { uz: "Sukuk nima emas: qarz qogʻozidan farqi", ru: "Чем сукук не является: отличие от долговой бумаги" } },
      { time: "11:30", text: { uz: "Ijara modeli: aktiv toʻplamiga talablar", ru: "Модель иджара: требования к пулу активов" } },
      { time: "13:30", text: { uz: "Mushoraka va vakolat modellari", ru: "Модели мушарака и вакала" } },
      { time: "15:00", text: { uz: "Kafolat va qaytarib sotib olish masalasi", ru: "Вопрос гарантий и обратного выкупа" } },
      { time: "16:00", text: { uz: "Savol-javob kengash aʼzolari bilan", ru: "Вопросы и ответы с членами совета" } },
    ],
    outcomes: [
      { uz: "Loyihaga mos strukturani tanlash mezonlari", ru: "Критерии выбора структуры под проект" },
      { uz: "Emissiya hujjatlari roʻyxati va tayyorlash tartibi", ru: "Перечень документов выпуска и порядок подготовки" },
    ],
  },

  {
    slug: "zakot-ochiq-dars",
    start: "2026-05-21T15:00:00+05:00",
    end: "2026-05-21T17:00:00+05:00",
    format: "online",
    venue: { uz: "Onlayn", ru: "Онлайн" },
    city: { uz: "Onlayn", ru: "Онлайн" },
    seats: 300,
    price: 0,
    host: "mezon",
    title: {
      uz: "Biznes uchun zakot hisobi: ochiq dars",
      ru: "Расчёт закята для бизнеса: открытый урок",
    },
    excerpt: {
      uz: "Ikki soatlik bepul dars. Balans asosida zakot bazasini hisoblash bosqichma-bosqich koʻrsatildi.",
      ru: "Двухчасовой бесплатный урок. Пошагово показан расчёт базы закята на основе баланса.",
    },
    audience: {
      uz: "Tadbirkorlar, buxgalterlar va moliya maslahatchilari",
      ru: "Предприниматели, бухгалтеры и финансовые консультанты",
    },
    agenda: [
      { time: "15:00", text: { uz: "Nisob va zakot yili", ru: "Нисаб и закятный год" } },
      { time: "15:40", text: { uz: "Balansdan zakot bazasini ajratish", ru: "Выделение базы закята из баланса" } },
      { time: "16:20", text: { uz: "Uchta amaliy misol", ru: "Три практических примера" } },
    ],
    outcomes: [
      { uz: "Oʻz kompaniyangiz uchun bazani mustaqil hisoblash", ru: "Самостоятельный расчёт базы для своей компании" },
    ],
  },

  {
    slug: "yillik-shariat-nazorati-forumi",
    start: "2026-02-13T09:00:00+05:00",
    end: "2026-02-13T18:00:00+05:00",
    format: "onsite",
    venue: { uz: "Oʻzbekiston bankchilik assotsiatsiyasi", ru: "Ассоциация банков Узбекистана" },
    city: { uz: "Toshkent", ru: "Ташкент" },
    seats: 180,
    price: 0,
    host: "mezon",
    title: {
      uz: "Yillik shariat nazorati forumi",
      ru: "Ежегодный форум шариатского надзора",
    },
    excerpt: {
      uz: "Sohaning yillik yigʻilishi: kengashlar amaliyoti, tartibga solish istiqbollari va bozor statistikasi.",
      ru: "Ежегодная отраслевая встреча: практика советов, перспективы регулирования и статистика рынка.",
    },
    audience: {
      uz: "Kengash aʼzolari, tartibga soluvchi organ vakillari, bank rahbariyati",
      ru: "Члены советов, представители регулятора, руководство банков",
    },
    agenda: [
      { time: "09:00", text: { uz: "Yil yakunlari va bozor statistikasi", ru: "Итоги года и статистика рынка" } },
      { time: "11:00", text: { uz: "Kengashlar amaliyotidagi eng qiyin holatlar", ru: "Самые сложные случаи в практике советов" } },
      { time: "14:00", text: { uz: "Tartibga solish: nima oʻzgaradi", ru: "Регулирование: что меняется" } },
      { time: "16:00", text: { uz: "Yopiq muhokama: kengash aʼzolari uchun", ru: "Закрытая дискуссия: для членов советов" } },
    ],
    outcomes: [
      { uz: "Soha boʻyicha yillik hisobot nusxasi", ru: "Экземпляр годового отраслевого отчёта" },
    ],
  },
];
