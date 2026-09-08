import type { Article } from "./types";

/** Placeholder research library. Replace with the client's own writing. */
export const research: Article[] = [
  {
    slug: "murobaha-va-kredit-farqi",
    date: "2026-07-30",
    category: "fiqh",
    readingMinutes: 9,
    author: "nurmatov",
    title: {
      uz: "Murobaha va oddiy kredit: farq qayerda boshlanadi",
      ru: "Мурабаха и обычный кредит: где начинается разница",
    },
    excerpt: {
      uz: "Ikkala holatda ham mijoz koʻproq toʻlaydi. Farq summada emas, bankning tovarga egalik qilgan qisqa daqiqasida — va aynan shu daqiqa koʻpincha hujjatda yoʻqoladi.",
      ru: "В обоих случаях клиент платит больше. Разница не в сумме, а в коротком моменте владения товаром со стороны банка — и именно этот момент чаще всего теряется в документах.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Murobaha tanqidining eng keng tarqalgani sodda: agar mijoz baribir koʻproq toʻlasa, bu foizdan nimasi bilan farq qiladi? Savol oʻrinli va unga hujjatlar bilan javob berish kerak, umumiy soʻzlar bilan emas.",
          ru: "Самая распространённая критика мурабахи проста: если клиент всё равно платит больше, чем это отличается от процента? Вопрос справедливый, и отвечать на него нужно документами, а не общими словами.",
        },
      },
      {
        type: "h",
        text: { uz: "Egalik va risk", ru: "Владение и риск" },
      },
      {
        type: "p",
        text: {
          uz: "Farq bankning tovarni sotib olishi va uni mijozga sotishi oʻrtasidagi oraliqda. Shu oraliqda tovar bankning mulki boʻladi va uning yoʻqolishi yoki shikastlanishi riski ham bankka tegishli. Kredit bunday oraliqni bilmaydi — u faqat pulni beradi.",
          ru: "Разница — в промежутке между покупкой товара банком и его продажей клиенту. В этом промежутке товар является собственностью банка, и риск его утраты или повреждения также лежит на банке. Кредит такого промежутка не знает — он просто выдаёт деньги.",
        },
      },
      {
        type: "p",
        text: {
          uz: "Ekspertizada biz aynan shu oraliqni izlaymiz. Agar hujjatlarda bank tovarni hech qachon qabul qilmagan boʻlsa, mijoz esa uni yetkazib beruvchidan bevosita olgan boʻlsa, murobahadan faqat nom qoladi.",
          ru: "При экспертизе мы ищем именно этот промежуток. Если по документам банк никогда не принимал товар, а клиент получил его напрямую от поставщика, от мурабахи остаётся только название.",
        },
      },
      {
        type: "h",
        text: { uz: "Amaliyotdagi uchta xato", ru: "Три ошибки на практике" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Sotib olish va sotish bir kunda, bir hujjat bilan rasmiylashtiriladi — egalik oraligʻi hujjatda koʻrinmaydi",
            ru: "Покупка и продажа оформляются одним днём и одним документом — промежуток владения не виден в документах",
          },
          {
            uz: "Mijoz bankning vakili sifatida tovarni oʻzi sotib oladi, lekin vakolat hujjati rasmiylashtirilmaydi",
            ru: "Клиент сам покупает товар как представитель банка, но доверенность не оформляется",
          },
          {
            uz: "Kechiktirilgan toʻlov uchun jarima bank daromadi sifatida tan olinadi",
            ru: "Штраф за просрочку признаётся доходом банка",
          },
        ],
      },
      {
        type: "quote",
        text: {
          uz: "Shakl mohiyatni tashiydi. Agar shakl boʻsh boʻlsa, mohiyat ham qolmaydi.",
          ru: "Форма несёт в себе суть. Если форма пуста, сути тоже не остаётся.",
        },
        by: { uz: "Shayx Abdulaziz Nurmatov", ru: "Шейх Абдулазиз Нурматов" },
      },
      {
        type: "p",
        text: {
          uz: "Uchala xato ham tuzatiladi va odatda mahsulotni qayta loyihalashni talab qilmaydi — faqat hujjat aylanishini tartibga solish kerak boʻladi.",
          ru: "Все три ошибки исправимы и обычно не требуют перепроектирования продукта — достаточно навести порядок в документообороте.",
        },
      },
    ],
  },

  {
    slug: "sukuk-strukturalari-taqqoslash",
    date: "2026-06-11",
    category: "market",
    readingMinutes: 12,
    author: "qosimov",
    title: {
      uz: "Sukuk strukturalari: ijara, mushoraka va vakolat modellari",
      ru: "Структуры сукук: модели иджара, мушарака и вакала",
    },
    excerpt: {
      uz: "Uchta model uchta xil risk taqsimotini beradi. Emitent uchun eng qulayi koʻpincha investor uchun eng tushunarsizi boʻlib chiqadi.",
      ru: "Три модели дают три разных распределения риска. Самая удобная для эмитента часто оказывается наименее понятной для инвестора.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Sukuk — qarz qogʻozi emas, aktivdagi ulush. Bu taʼrif oddiy koʻrinadi, lekin strukturani tanlashda aynan shu yerda kelishmovchilik boshlanadi.",
          ru: "Сукук — это не долговая бумага, а доля в активе. Определение выглядит простым, но именно здесь начинаются расхождения при выборе структуры.",
        },
      },
      {
        type: "h",
        text: { uz: "Ijara sukuk", ru: "Сукук иджара" },
      },
      {
        type: "p",
        text: {
          uz: "Eng koʻp qoʻllaniladigan model. Aktiv ijaraga beriladi, ijara toʻlovi investorlarga taqsimlanadi. Pul oqimi bashorat qilinadigan boʻlgani uchun investorlar buni yaxshi tushunadi. Sharti: aktiv real, aniqlangan va ijaraga yaroqli boʻlishi kerak.",
          ru: "Наиболее применяемая модель. Актив передаётся в аренду, арендные платежи распределяются между инвесторами. Денежный поток предсказуем, поэтому инвесторы понимают эту схему лучше всего. Условие: актив должен быть реальным, идентифицированным и пригодным для аренды.",
        },
      },
      {
        type: "h",
        text: { uz: "Mushoraka sukuk", ru: "Сукук мушарака" },
      },
      {
        type: "p",
        text: {
          uz: "Investorlar loyihaga sherik boʻladi va foyda kelishilgan nisbatda taqsimlanadi, zarar esa ulushga proportsional. Bu model mohiyatan eng toza, ammo daromad kafolatlanmagani uchun mahalliy bozorda talab pastroq.",
          ru: "Инвесторы становятся партнёрами в проекте: прибыль распределяется в согласованной пропорции, убыток — пропорционально доле. Эта модель по сути наиболее чистая, но из-за отсутствия гарантии дохода спрос на локальном рынке ниже.",
        },
      },
      {
        type: "h",
        text: { uz: "Vakolat sukuk", ru: "Сукук вакала" },
      },
      {
        type: "p",
        text: {
          uz: "Vakil investorlar nomidan aktivlar portfelini boshqaradi. Moslashuvchan, lekin portfel tarkibi va kutilayotgan daromad boʻyicha shaffoflik talablari eng qattiq shu yerda.",
          ru: "Агент управляет портфелем активов от имени инвесторов. Модель гибкая, но именно здесь предъявляются самые жёсткие требования к прозрачности состава портфеля и ожидаемой доходности.",
        },
      },
      {
        type: "h",
        text: { uz: "Qaysi birini tanlash kerak", ru: "Какую выбрать" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Aniq aktiv va barqaror ijara toʻlovi bor — ijara modeli",
            ru: "Есть конкретный актив и стабильный арендный поток — модель иджара",
          },
          {
            uz: "Loyiha yangi va daromad notoʻgʻri taqsimlangan — mushoraka",
            ru: "Проект новый и доход распределён неравномерно — мушарака",
          },
          {
            uz: "Aralash portfel va faol boshqaruv kerak — vakolat",
            ru: "Нужен смешанный портфель и активное управление — вакала",
          },
        ],
      },
    ],
  },

  {
    slug: "takaful-zaxiralari-aaoifi-fas",
    date: "2026-04-24",
    category: "accounting",
    readingMinutes: 8,
    author: "sattorova",
    title: {
      uz: "Takaful zaxiralarini AAOIFI FAS boʻyicha hisobga olish",
      ru: "Учёт резервов такафул по стандартам AAOIFI FAS",
    },
    excerpt: {
      uz: "Ishtirokchilar fondi va operator fondi alohida yuritiladi. Amaliyotda ularni ajratish eng koʻp savol tugʻdiradigan bosqich.",
      ru: "Фонд участников и фонд оператора ведутся раздельно. На практике именно их разделение вызывает больше всего вопросов.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Takafulning odatiy sugʻurtadan asosiy farqi — badallar operator daromadi emas, ishtirokchilarning umumiy fondi hisoblanadi. Operator bu fondni boshqargani uchun haq oladi.",
          ru: "Ключевое отличие такафула от обычного страхования: взносы не являются доходом оператора, а формируют общий фонд участников. Оператор получает вознаграждение за управление этим фондом.",
        },
      },
      {
        type: "h",
        text: { uz: "Ikki fond, ikki hisobot", ru: "Два фонда, две отчётности" },
      },
      {
        type: "p",
        text: {
          uz: "Ishtirokchilar fondi boʻyicha alohida moliyaviy natija shakllantiriladi. Fondda profitsit yuzaga kelsa, u operator foydasiga oʻtkazilmaydi — ishtirokchilarga qaytariladi yoki zaxirada saqlanadi.",
          ru: "По фонду участников формируется отдельный финансовый результат. При возникновении профицита он не переводится в прибыль оператора, а возвращается участникам либо остаётся в резерве.",
        },
      },
      {
        type: "h",
        text: { uz: "Tez-tez uchraydigan nomuvofiqliklar", ru: "Частые несоответствия" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Badallar toʻliq daromad sifatida tan olinadi",
            ru: "Взносы признаются доходом в полном объёме",
          },
          {
            uz: "Fond profitsiti operator hisobotiga koʻchiriladi",
            ru: "Профицит фонда переносится в отчётность оператора",
          },
          {
            uz: "Qarz shaklidagi qoʻllab-quvvatlash qaytarilishi shartsiz beriladi",
            ru: "Поддержка в форме займа предоставляется без условия возврата",
          },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Uchinchi holat alohida eʼtibor talab qiladi: operator fondga vaqtincha mablagʻ bersa, bu foizsiz qarz boʻlishi va qaytarish tartibi hujjatda belgilanishi kerak.",
          ru: "Третий случай требует особого внимания: если оператор временно предоставляет фонду средства, это должен быть беспроцентный заём с закреплённым в документах порядком возврата.",
        },
      },
    ],
  },

  {
    slug: "zakot-aylanma-mablaglar",
    date: "2026-02-18",
    category: "zakat",
    readingMinutes: 7,
    author: "yuldosheva",
    title: {
      uz: "Zakot bazasida aylanma mablagʻlar masalasi",
      ru: "Вопрос оборотных средств в базе закята",
    },
    excerpt: {
      uz: "Balansdagi har bir aktiv ham zakotga tortilmaydi. Asosiy mezon — aktiv savdo uchun saqlanadimi yoki foydalanish uchunmi.",
      ru: "Не каждый актив на балансе облагается закятом. Основной критерий — удерживается ли актив для продажи или для использования.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Zakot oʻsuvchi mol-mulkdan olinadi. Shuning uchun ishlab chiqarish uskunasi, ofis binosi va xizmat avtomobili zakot bazasiga kirmaydi — ular daromad vositasi, savdo obyekti emas.",
          ru: "Закят взимается с растущего имущества. Поэтому производственное оборудование, офисное здание и служебный автомобиль не входят в базу закята — они являются средством получения дохода, а не предметом торговли.",
        },
      },
      {
        type: "h",
        text: { uz: "Bazaga nima kiradi", ru: "Что входит в базу" },
      },
      {
        type: "ul",
        items: [
          { uz: "Savdo uchun tovar zaxirasi — bozor qiymati boʻyicha", ru: "Товарные запасы для продажи — по рыночной стоимости" },
          { uz: "Pul mablagʻlari va bank hisobvaraqlaridagi qoldiq", ru: "Денежные средства и остатки на банковских счетах" },
          { uz: "Qaytarilishi kutilayotgan debitorlik qarzi", ru: "Дебиторская задолженность, возврат которой ожидается" },
          { uz: "Savdo uchun saqlanayotgan qimmatli qogʻozlar", ru: "Ценные бумаги, удерживаемые для продажи" },
        ],
      },
      {
        type: "h",
        text: { uz: "Debitorlik qarzi", ru: "Дебиторская задолженность" },
      },
      {
        type: "p",
        text: {
          uz: "Qaytarilishi ehtimoldan yiroq boʻlgan qarz bazadan chiqariladi. Agar keyinchalik u qaytarilsa, oʻsha yil uchun zakot hisoblanadi. Amaliyotda kompaniyalar koʻpincha butun debitorlik qarzini bazaga kiritadi va ortiqcha toʻlaydi.",
          ru: "Задолженность, возврат которой маловероятен, исключается из базы. Если впоследствии она будет погашена, закят рассчитывается за тот год. На практике компании часто включают в базу всю дебиторскую задолженность и переплачивают.",
        },
      },
    ],
  },

  {
    slug: "shariat-auditi-tanlab-tekshirish",
    date: "2025-12-09",
    category: "audit",
    readingMinutes: 6,
    author: "ismoilov",
    title: {
      uz: "Shariat auditida tanlab tekshirish hajmini belgilash",
      ru: "Определение объёма выборки в шариатском аудите",
    },
    excerpt: {
      uz: "Barcha shartnomani tekshirish imkonsiz, tasodifiy tanlov esa yetarli emas. Tanlov risk boʻyicha tuzilishi kerak.",
      ru: "Проверить все договоры невозможно, а случайная выборка недостаточна. Выборка должна строиться по риску.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Yirik bankda yiliga oʻn minglab shartnoma tuziladi. Ularning barchasini koʻrib chiqish real emas. Shu sababli tanlov hajmi va tarkibi auditning eng muhim qarori boʻlib qoladi.",
          ru: "В крупном банке за год заключаются десятки тысяч договоров. Рассмотреть их все нереально. Поэтому объём и состав выборки остаются важнейшим решением аудита.",
        },
      },
      {
        type: "h",
        text: { uz: "Uch qatlamli tanlov", ru: "Трёхслойная выборка" },
      },
      {
        type: "ul",
        items: [
          {
            uz: "Yangi mahsulotlar — birinchi yilda barcha turlar boʻyicha kamida bittadan",
            ru: "Новые продукты — в первый год минимум по одному на каждый тип",
          },
          {
            uz: "Yirik summalar — belgilangan chegaradan yuqori barcha bitimlar",
            ru: "Крупные суммы — все сделки выше установленного порога",
          },
          {
            uz: "Qolganlari — tasodifiy tanlov, hajmi oʻtgan yilgi xatolar soniga bogʻliq",
            ru: "Остальные — случайная выборка, объём которой зависит от числа ошибок прошлого года",
          },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Uchinchi qatlam muhim: agar oʻtgan yil tanlovda xato topilmagan boʻlsa, hajm kamayadi. Topilgan boʻlsa — oshadi. Bu tashkilotni sifatga ragʻbatlantiradi.",
          ru: "Третий слой важен: если в прошлогодней выборке ошибок не найдено, её объём сокращается. Если найдены — увеличивается. Это мотивирует организацию к качеству.",
        },
      },
    ],
  },

  {
    slug: "tahkim-bandi-shartnomada",
    date: "2025-10-16",
    category: "law",
    readingMinutes: 5,
    author: "turayev",
    title: {
      uz: "Tahkim bandini shartnomaga qanday kiritish kerak",
      ru: "Как правильно включить арбитражную оговорку в договор",
    },
    excerpt: {
      uz: "Nizo kelib chiqqach, tahkim haqida kelishish deyarli imkonsiz. Band shartnoma imzolanayotgan paytda yozilishi kerak — va u toʻrtta savolga javob berishi shart.",
      ru: "После возникновения спора договориться об арбитраже почти невозможно. Оговорка должна быть написана в момент подписания договора — и отвечать на четыре вопроса.",
    },
    body: [
      {
        type: "p",
        text: {
          uz: "Shariat asosidagi nizolarni sudda koʻrib chiqish qiyin: sud fiqh masalalarini baholash uchun mos organ emas. Shuning uchun shartnomada tahkim bandi boʻlishi amaliy zarurat.",
          ru: "Рассматривать споры на основе шариата в суде сложно: суд не является органом, приспособленным для оценки вопросов фикха. Поэтому арбитражная оговорка в договоре — практическая необходимость.",
        },
      },
      {
        type: "h",
        text: { uz: "Band javob berishi kerak boʻlgan savollar", ru: "Вопросы, на которые должна отвечать оговорка" },
      },
      {
        type: "ul",
        items: [
          { uz: "Nizoni kim koʻrib chiqadi va hakamlar qanday tayinlanadi", ru: "Кто рассматривает спор и как назначаются арбитры" },
          { uz: "Qaysi qoidalar qoʻllaniladi", ru: "Какие правила применяются" },
          { uz: "Ish qaysi tilda va qayerda olib boriladi", ru: "На каком языке и где ведётся разбирательство" },
          { uz: "Qaror yakuniymi va u qanday ijro etiladi", ru: "Является ли решение окончательным и как оно исполняется" },
        ],
      },
      {
        type: "p",
        text: {
          uz: "Toʻrtinchi savol koʻpincha eʼtibordan chetda qoladi. Ijro tartibi belgilanmagan qaror qogʻozda qolib ketishi mumkin.",
          ru: "Четвёртый вопрос чаще всего упускают. Решение без закреплённого порядка исполнения может остаться на бумаге.",
        },
      },
    ],
  },
];
