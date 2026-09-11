import type { Article } from "./types";

/** Placeholder newsroom. Replace with the client's real releases before launch. */
export const news: Article[] = [
  {
    slug: "2026-yarim-yillik-sertifikatlash",
    date: "2026-08-14",
    category: "company",
    readingMinutes: 3,
    author: "mezon",
    title: {
      uz: "2026-yilning birinchi yarmida 47 ta mahsulot sertifikatlandi",
      ru: "За первое полугодие 2026 года сертифицированы 47 продуктов",
    },
    excerpt: {
      uz: "Yarim yillik hisobot: eng koʻp murojaat ijara va murobaha asosidagi mahsulotlarga tegishli boʻldi, sukuk boʻyicha ekspertiza soni esa ikki barobarga oshdi.",
      ru: "Полугодовой отчёт: больше всего обращений пришлось на продукты на основе иджары и мурабахи, а число экспертиз по сукук выросло вдвое.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "2026-yilning yanvar–iyun oylarida kengash 47 ta mahsulot va shartnoma boʻyicha yakuniy qaror chiqardi. Bu 2025-yilning shu davriga nisbatan 31 foizga koʻp. Murojaatlarning yarmidan koʻpi banklarning chakana boʻlimlaridan keldi.",
          ru: "С января по июнь 2026 года совет вынес окончательные решения по 47 продуктам и договорам — на 31% больше, чем за тот же период 2025 года. Более половины обращений поступило от розничных подразделений банков.",
        },
      },
      {
        type: "h",
        text: { uz: "Qaysi mahsulotlar koʻproq", ru: "Какие продукты чаще" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Ijara asosidagi avtomobil va uskuna moliyalashtirish — 18 ta",
            ru: "Финансирование авто и оборудования на основе иджары — 18",
          },
          {
            uz: "Murobaha boʻyicha savdo moliyalashtirish — 14 ta",
            ru: "Торговое финансирование по мурабахе — 14",
          },
          {
            uz: "Takaful mahsulotlari — 7 ta",
            ru: "Продукты такафул — 7",
          },
          {
            uz: "Sukuk emissiyalari va investitsiya fondlari — 8 ta",
            ru: "Выпуски сукук и инвестиционные фонды — 8",
          },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Oʻn bir holatda kengash birinchi murojaatda ijobiy qaror chiqarmadi va tuzatish roʻyxatini berdi. Ularning toʻqqiztasi tuzatishlardan soʻng tasdiqlandi, ikkitasi hali koʻrib chiqilmoqda.",
          ru: "В одиннадцати случаях совет не вынес положительного решения с первого обращения и выдал перечень исправлений. Девять из них были утверждены после доработки, два ещё рассматриваются.",
        },
      },
      {
        type: "quote",
        text: {
          uz: "Tuzatish roʻyxati — rad javob emas. Koʻpincha muammo shartnoma mohiyatida emas, uning yozilishida boʻladi.",
          ru: "Перечень исправлений — это не отказ. Чаще всего проблема не в сути договора, а в его формулировках.",
        },
        by: { uz: "Bekzod Ismoilov", ru: "Бекзод Исмоилов" },
      },
      {
        type: "p",
        text: {
          uz: "Toʻliq yarim yillik hisobot sertifikatlar reyestri bilan birga oktabr oyida eʼlon qilinadi.",
          ru: "Полный полугодовой отчёт вместе с реестром сертификатов будет опубликован в октябре.",
        },
      },
    ],
  },

  {
    slug: "markaziy-bank-qollanma-muhokamasi",
    date: "2026-06-27",
    category: "regulation",
    readingMinutes: 4,
    author: "mezon",
    title: {
      uz: "Islom moliyasi boʻyicha yangi uslubiy qoʻllanma muhokamaga qoʻyildi",
      ru: "Новое методическое руководство по исламским финансам вынесено на обсуждение",
    },
    excerpt: {
      uz: "Hujjat loyihasi hisob yuritish va hisobot shakllarini belgilaydi. Mezon Kengashi oʻz izohlarini yubordi — asosiy eʼtiroz zaxiralarni tan olish tartibiga qaratilgan.",
      ru: "Проект документа определяет порядок учёта и формы отчётности. Mezon Kengashi направил свои комментарии — основное замечание касается порядка признания резервов.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Loyiha islom moliyasi mahsulotlarini buxgalteriya hisobida aks ettirish qoidalarini va choraklik hisobot shakllarini oʻz ichiga oladi. Ommaviy muhokama 45 kun davom etadi.",
          ru: "Проект включает правила отражения продуктов исламских финансов в бухгалтерском учёте и формы квартальной отчётности. Публичное обсуждение продлится 45 дней.",
        },
      },
      {
        type: "h",
        text: { uz: "Bizning izohlarimiz", ru: "Наши комментарии" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Mushoraka boʻyicha zaxiralarni tan olish vaqti AAOIFI FAS talablariga toʻliq mos kelmaydi",
            ru: "Момент признания резервов по мушараке не полностью соответствует требованиям AAOIFI FAS",
          },
          {
            uz: "Ijara muntahiya bittamlik boʻyicha aktivning qoldiq qiymatini baholash usuli aniqlashtirilishi kerak",
            ru: "Требует уточнения метод оценки остаточной стоимости актива по иджара мунтахия биттамлик",
          },
          {
            uz: "Takaful zaxiralari uchun alohida hisobot shakli zarur",
            ru: "Для резервов такафул необходима отдельная форма отчётности",
          },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Izohlar toʻliq matni bilan sayt orqali tanishish mumkin. Yakuniy tahrir kuzda kutilmoqda va u kuchga kirgach, biz mijozlar uchun oʻtish boʻyicha qisqa qoʻllanma tayyorlaymiz.",
          ru: "С полным текстом комментариев можно ознакомиться через сайт. Финальная редакция ожидается осенью; после её вступления в силу мы подготовим для клиентов краткое руководство по переходу.",
        },
      },
    ],
  },

  {
    slug: "toshkent-islom-instituti-hamkorlik",
    date: "2026-05-19",
    category: "partnership",
    readingMinutes: 2,
    author: "mezon",
    title: {
      uz: "Toshkent islom instituti bilan qoʻshma oʻquv dasturi",
      ru: "Совместная учебная программа с Ташкентским исламским институтом",
    },
    excerpt: {
      uz: "Bir semestrlik amaliy modul: talabalar haqiqiy shartnomalar asosida shariat ekspertizasini oʻrganadi. Birinchi guruh sentabrda oʻqishni boshlaydi.",
      ru: "Практический модуль на один семестр: студенты изучают шариатскую экспертизу на реальных договорах. Первая группа приступает к занятиям в сентябре.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Modul 72 soatga moʻljallangan. Talabalar shaxsiy maʼlumotlardan tozalangan haqiqiy shartnomalar bilan ishlaydi va har bir mashgʻulot yozma xulosa tayyorlash bilan yakunlanadi.",
          ru: "Модуль рассчитан на 72 часа. Студенты работают с реальными договорами, очищенными от персональных данных, и каждое занятие завершается подготовкой письменного заключения.",
        },
      },
      {
        type: "ul",
        items: [
          { uz: "Fiqh al-muomalot asoslarini amaliyotga bogʻlash", ru: "Связь основ фикх аль-муамалят с практикой" },
          { uz: "Shartnomani standartlar boʻyicha tekshirish", ru: "Проверка договора по стандартам" },
          { uz: "Xulosa yozish va uni himoya qilish", ru: "Написание заключения и его защита" },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Eng yaxshi natija koʻrsatgan uch talaba Mezon Kengashida amaliyot oʻtash imkoniyatini oladi.",
          ru: "Три студента с лучшими результатами получат возможность пройти стажировку в Mezon Kengashi.",
        },
      },
    ],
  },

  {
    slug: "birinchi-mahalliy-sukuk-ekspertizasi",
    date: "2026-03-05",
    category: "market",
    readingMinutes: 3,
    author: "mezon",
    title: {
      uz: "Mahalliy sukuk emissiyasi shariat ekspertizasidan oʻtdi",
      ru: "Локальный выпуск сукук прошёл шариатскую экспертизу",
    },
    excerpt: {
      uz: "Ijara modeliga asoslangan besh yillik emissiya. Ekspertiza toʻrt hafta davom etdi, aktivlar toʻplami va pul oqimi tuzilmasi ikki marta qayta koʻrildi.",
      ru: "Пятилетний выпуск на основе модели иджара. Экспертиза заняла четыре недели, пул активов и структура денежных потоков пересматривались дважды.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Emissiya asosida ijaraga berilgan sanoat uskunalari toʻplami turadi. Kengash aktivlarning haqiqatda mavjudligini, ijara shartnomalarining amal qilish muddatini va pul oqimining sukuk egalariga yetib borish yoʻlini tekshirdi.",
          ru: "В основе выпуска — пул промышленного оборудования, переданного в аренду. Совет проверил фактическое наличие активов, сроки действия договоров аренды и путь движения денежного потока к держателям сукук.",
        },
      },
      {
        type: "h",
        text: { uz: "Nima oʻzgartirildi", ru: "Что было изменено" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Aktivlar toʻplamidan hali ishga tushirilmagan uskunalar chiqarildi",
            ru: "Из пула активов исключено оборудование, ещё не введённое в эксплуатацию",
          },
          {
            uz: "Kafolatli qaytarish bandi bozor qiymati boʻyicha sotib olish bilan almashtirildi",
            ru: "Условие гарантированного выкупа заменено выкупом по рыночной стоимости",
          },
          {
            uz: "Kechiktirilgan toʻlov uchun jarima xayriyaga yoʻnaltirilishi belgilandi",
            ru: "Штраф за просрочку направлен на благотворительность",
          },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Kafolatli qaytarish bandi eng koʻp muhokamaga sabab boʻldi: u investorga risksiz daromad bergani uchun ijara mohiyatiga zid edi.",
          ru: "Больше всего обсуждений вызвало условие гарантированного выкупа: оно давало инвестору безрисковый доход и противоречило сути иджары.",
        },
      },
    ],
  },

  {
    slug: "zakot-uslubiy-qollanma-2026",
    date: "2026-01-22",
    category: "method",
    readingMinutes: 2,
    author: "mezon",
    title: {
      uz: "Zakot hisobi boʻyicha uslubiy qoʻllanma yangilandi",
      ru: "Обновлено методическое руководство по расчёту закята",
    },
    excerpt: {
      uz: "Yangi tahrirda aylanma mablagʻlarni aniqlash tartibi va debitorlik qarzini baholash boʻyicha boʻlim kengaytirildi.",
      ru: "В новой редакции расширены разделы о порядке определения оборотных средств и оценке дебиторской задолженности.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Qoʻllanma biznes uchun zakot bazasini balans asosida hisoblash tartibini bosqichma-bosqich tavsiflaydi. Yangi tahrirga uchta amaliy misol qoʻshildi: savdo kompaniyasi, ishlab chiqarish korxonasi va xizmat koʻrsatuvchi tashkilot.",
          ru: "Руководство пошагово описывает порядок расчёта базы закята для бизнеса на основе баланса. В новую редакцию добавлены три практических примера: торговая компания, производственное предприятие и организация сферы услуг.",
        },
      },
      {
        type: "p",
        text: {
          uz: "Alohida boʻlim umidsiz debitorlik qarziga ajratilgan — amaliyotda eng koʻp xato shu yerda uchraydi.",
          ru: "Отдельный раздел посвящён безнадёжной дебиторской задолженности — на практике именно здесь встречается больше всего ошибок.",
        },
      },
    ],
  },
];
