const uz = {
  meta: {
    title: "Mezon Kengashi — AAOIFI ning Oʻzbekistondagi rasmiy vakili | Islom moliyasi",
    description:
      "Mezon Kengashi — AAOIFI ning Oʻzbekistondagi rasmiy vakili. Toshkentda islom moliyasi boʻyicha shariat nazorat kengashi, audit va sertifikatlash, islom banki litsenziyasi, nizolarni hal qilish, taʼlim va zakot hisobi.",
    keywords: [
      "islom moliyasi",
      "AAOIFI Oʻzbekiston",
      "AAOIFI rasmiy vakili",
      "shariat auditi",
      "shariat kengashi",
      "islom banki litsenziyasi",
      "halol moliya Oʻzbekiston",
      "sukuk",
      "murobaha",
      "ijara",
      "takaful",
      "zakot hisoblash",
      "islom banki Toshkent",
      "AAOIFI standartlari",
    ],
  },

  nav: {
    services: "Xizmatlar",
    council: "Kengash",
    process: "Jarayon",
    contact: "Aloqa",
    about: "Biz haqimizda",
    research: "Tadqiqotlar",
    news: "Yangiliklar",
    events: "Tadbirlar",
    faq: "Savol-javob",
    talim: "Mezon Taʼlim",
    cta: "Konsultatsiya olish",
    openMenu: "Menyuni ochish",
    closeMenu: "Menyuni yopish",
    langLabel: "Sayt tili",
    skip: "Asosiy kontentga oʻtish",
  },

  hero: {
    place: "Toshkent shahri, 2023-yildan buyon",
    wordmark: "MEZON",
    tagline: "Har bir shartnoma shariat mezonida oʻlchanadi",
    lede:
      "Biz banklar, lizing, fintex va halol biznes uchun mahsulotlarni AAOIFI standartlari asosida quramiz, tekshiramiz va sertifikatlaymiz.",
    primary: "Konsultatsiya olish",
    secondary: "Xizmatlarni koʻrish",
    statusKicker: "Rasmiy maqom",
    status:
      "Mezon Kengashi — AAOIFI ning Oʻzbekistondagi rasmiy vakili. Mutaxassislarni tayyorlash va sertifikatlash boʻyicha kelishuvlar imzolangan.",
    statusName: "AAOIFI",
    statusRole: "Islom moliyasi standartlari tashkiloti, Bahrayn",
    metricValue: "5,98 trln",
    metricUnit: "$",
    metricLabel: "jahon islom moliyasi aktivlari hajmi, 2024-yil",
    metricNote: "2029-yilga borib 9,7 trln dollarga yetishi kutilmoqda · ICD–LSEG, 2025",
    /* What we actually work to, and the certificates the team holds. */
    standards: [
      "AAOIFI rasmiy vakili",
      "61 shariat standarti",
      "AAOIFI FAS hisob standartlari",
      "CSAA · CPSS · CIPA",
    ],
    formTitle: "Qoʻngʻiroqni buyurtma qiling",
    formNote: "Ish kunlari 30 daqiqa ichida javob beramiz.",
    scroll: "Pastga",
  },

  form: {
    name: "Ism va familiya",
    namePh: "Bekzod Ismoilov",
    phone: "Telefon",
    phonePh: "+998 __ ___ __ __",
    email: "Elektron pochta",
    emailPh: "siz@kompaniya.uz",
    org: "Tashkilot",
    orgPh: "Kompaniya yoki bank nomi",
    topic: "Murojaat mavzusi",
    message: "Xabar",
    messagePh: "Qanday masala boʻyicha murojaat qilyapsiz?",
    submit: "Murojaatni yuborish",
    submitShort: "Yuborish",
    sending: "Yuborilmoqda",
    sentTitle: "Murojaat qabul qilindi",
    sentBody: "Rahmat. Ish kunlari davomida 30 daqiqa ichida siz bilan bogʻlanamiz.",
    again: "Yana bitta murojaat yuborish",
    errName: "Ismingizni kiriting",
    errPhone: "Telefon raqamini toʻliq kiriting",
    errEmail: "Toʻgʻri elektron pochta manzilini kiriting",
    errMessage: "Kamida bir necha soʻz yozing",
    privacy:
      "Yuborish orqali siz maʼlumotlaringiz faqat murojaatga javob berish uchun ishlatilishiga rozilik bildirasiz.",
    topics: [
      { id: "consult", label: "Konsultatsiya" },
      { id: "audit", label: "Audit va sertifikatlash" },
      { id: "council", label: "Shariat kengashi" },
      { id: "dispute", label: "Nizoni hal qilish" },
      { id: "education", label: "Taʼlim" },
      { id: "zakat", label: "Zakot hisobi" },
      { id: "other", label: "Boshqa masala" },
    ],
  },

  /* The step-by-step consultation form at the foot of the home page.
     Which options appear on each step is decided in ContactForm.tsx. */
  wizard: {
    intro: "4 ta qisqa savol — taxminan bir daqiqa",
    progress: "{n}-savol, jami {total}",
    back: "Orqaga",
    next: "Davom etish",
    restart: "Boshidan boshlash",
    editHint: "Javobni oʻzgartirish",
    who: {
      q: "Kim nomidan murojaat qilyapsiz?",
      note: "Dastlabki 30 daqiqalik suhbat va hujjatlarni koʻrib chiqish bepul.",
      options: {
        bank: { label: "Bank yoki moliya instituti", hint: "Bank, lizing, takaful, investitsiya fondi" },
        business: { label: "Kompaniya yoki tadbirkor", hint: "Halol biznes, savdo, ishlab chiqarish" },
        person: { label: "Shaxsiy savol", hint: "Zakot, shartnoma, shaxsiy moliya" },
        learner: { label: "Oʻqish va malaka oshirish", hint: "Kurslar va CPSS imtihoniga tayyorgarlik" },
      },
    },
    need: {
      q: "Sizga qanday yordam kerak?",
      note: "Murojaatingizni shu yoʻnalish mutaxassisiga yoʻnaltiramiz.",
      options: {
        council: { label: "Shariat nazorat kengashi", hint: "Doimiy nazorat va yozma fatvolar" },
        audit: { label: "Audit va sertifikatlash", hint: "Muvofiqlikni tekshirish, sertifikat" },
        consulting: { label: "Yangi mahsulot yaratish", hint: "Murobaha, ijara, sukuk, takaful" },
        advice: { label: "Shariat boʻyicha maslahat", hint: "Bitim yoki qaror shariatga mosmi" },
        dispute: { label: "Nizoni hal qilish", hint: "Vositachilik va arbitraj" },
        education: { label: "Jamoani oʻqitish", hint: "Korporativ kurslar" },
        zakat: { label: "Zakot hisobi", hint: "Biznes yoki shaxsiy aktivlar" },
        other: { label: "Boshqa masala", hint: "Oʻzim yozib beraman" },
      },
    },
    detail: {
      note: "Dastlabki tahlil bepul va odatda 2–5 kun davom etadi.",
      questions: {
        council: {
          q: "Hozir shariat kengashingiz bormi?",
          options: {
            none: "Yoʻq, noldan tuzamiz",
            strengthen: "Bor, kuchaytirmoqchimiz",
            regulator: "Regulyator talab qilmoqda",
          },
        },
        audit: {
          q: "Mahsulot qaysi bosqichda?",
          options: {
            planning: "Hali ishga tushmagan",
            live: "Allaqachon ishlamoqda",
            renewal: "Sertifikatni yangilash",
          },
        },
        consulting: {
          q: "Qaysi mahsulot haqida gap ketyapti?",
          options: {
            murabaha: "Murobaha yoki ijara",
            partnership: "Mushoraka yoki mudoraba",
            sukuk: "Sukuk",
            takaful: "Takaful yoki fond",
            unsure: "Hali aniq emas",
          },
        },
        advice: {
          q: "Savol nimaga oid?",
          options: {
            deal: "Bitim yoki shartnoma",
            invest: "Investitsiya yoki jamgʻarma",
            finance: "Kredit, ipoteka yoki lizing",
            other: "Boshqa narsa",
          },
        },
        dispute: {
          q: "Nizo qaysi bosqichda?",
          options: {
            pre: "Hali sudga chiqmagan",
            court: "Sud jarayoni ketmoqda",
            clause: "Shartnomaga arbitraj bandi kerak",
          },
        },
        education: {
          q: "Nechta xodimni oʻqitish kerak?",
          options: {
            small: "1–5 kishi",
            medium: "6–20 kishi",
            large: "20 kishidan ortiq",
          },
        },
        learn: {
          q: "Nima qiziqtiradi?",
          options: {
            cpss: "AAOIFI CPSS imtihoniga tayyorgarlik",
            other: "Boshqa kurslar",
            unsure: "Maslahat kerak",
          },
        },
        zakat: {
          q: "Zakot kim uchun hisoblanadi?",
          options: {
            business: "Biznes uchun",
            personal: "Shaxsan oʻzim uchun",
          },
        },
      },
      when: {
        q: "Qachon kerak?",
        options: {
          now: "Shoshilinch, shu hafta",
          month: "Shu oy ichida",
          later: "Hozircha oʻrganyapman",
        },
      },
    },
    talim: {
      kicker: "Mezon Taʼlim",
      title: "AAOIFI CPSS imtihoniga oʻzbek tilida tayyorgarlik",
      facts: ["15 hafta · 30 dars", "Shanba–yakshanba", "Onlayn va Toshkentda"],
      more: "Kurs haqida",
      telegram: "Telegramda yozish",
    },
    contact: {
      q: "Qanday bogʻlanaylik?",
      note: "Ish kunlari 30 daqiqa ichida javob beramiz.",
      noteClosed: "Hozir ish vaqtidan tashqari — keyingi ish kuni 09:00 dan keyin bogʻlanamiz.",
      channel: "Qulay aloqa usuli",
      channels: { call: "Qoʻngʻiroq", telegram: "Telegram", email: "Elektron pochta" },
      telegram: "Telegram: raqam yoki @username",
      telegramPh: "@username yoki +998 …",
      errTelegram: "Telegram raqami yoki @username kiriting",
      errEmailRequired: "Elektron pochta manzilini kiriting",
      addNote: "Izoh qoʻshish (ixtiyoriy)",
      noteLabel: "Vaziyatni qisqacha yozing",
      submit: "Konsultatsiyaga yozilish",
      failed:
        "Murojaatni yuborib boʻlmadi. Qayta urinib koʻring yoki bizga toʻgʻridan-toʻgʻri qoʻngʻiroq qiling.",
    },
    done: {
      title: "Rahmat, {name}!",
      body: "Murojaatingiz qabul qilindi va «{need}» mutaxassisiga yuborildi.",
      bodyGeneric: "Murojaatingiz qabul qilindi va tegishli mutaxassisga yuborildi.",
      nextTitle: "Keyingi qadamlar",
      via: {
        call: "Mutaxassis sizga qoʻngʻiroq qiladi",
        telegram: "Mutaxassis Telegramda yozadi",
        email: "Mutaxassis pochtangizga yozadi",
      },
      soon: "30 daqiqa ichida",
      nextDay: "keyingi ish kuni",
      faster: "Kutishni istamaysizmi?",
      telegramCta: "Telegramda yozish",
      callCta: "Qoʻngʻiroq qilish",
    },
  },

  stats: {
    title: "Raqamlarda",
    items: [
      { value: "2023", label: "yildan buyon Toshkentda faoliyat yuritamiz" },
      { value: "30+", label: "hamkorlik doirasida AAOIFI imtihonlarini topshirgan mutaxassis" },
      { value: "13", label: "kengash aʼzosi: shariat olimlari va yuristlar" },
      { value: "9", label: "hamkor bank, fintex va kompaniya" },
    ],
  },

  services: {
    kicker: "Nima qilamiz",
    title: "Oltita yoʻnalish, bitta mezon",
    lede:
      "Har bir xizmat bir xil metodologiyaga tayanadi: AAOIFI shariat standartlari, Oʻzbekiston qonunchiligi va Markaziy bank talablari hamda kengashning yozma qarori.",
    items: {
      council: {
        name: "Shariat nazorat kengashi",
        summary:
          "Tashkilotingiz uchun doimiy shariat nazorati: mahsulotlarni tasdiqlash, yillik fatvo va kengash yigʻilishlari.",
        points: [
          "Kengash aʼzolarini tayinlash va uning ishini tashkil etish",
          "Mahsulot va shartnomalar boʻyicha yozma fatvolar",
          "Yillik shariat hisoboti va aksiyadorlarga taqdimot",
        ],
      },
      audit: {
        name: "Audit va sertifikatlash",
        summary:
          "Amaldagi operatsiyalarni tekshiramiz va shariatga muvofiqlik sertifikatini beramiz.",
        points: [
          "Shartnomalar va pul oqimlarini tanlab tekshirish",
          "Nomuvofiqliklarni tuzatish rejasi",
          "Sertifikat va ommaviy reyestrda eʼlon",
        ],
      },
      dispute: {
        name: "Nizolarni hal qilish",
        summary:
          "Shariat asosidagi vositachilik va arbitraj — sudgacha, tez va yopiq tartibda.",
        points: [
          "Vositachilik (sulh) va tahkim",
          "Ekspert xulosasi sud uchun",
          "Shartnomaga arbitraj bandini kiritish",
        ],
      },
      education: {
        name: "Taʼlim va malaka oshirish",
        summary:
          "Bank va kompaniya jamoalari uchun amaliy dasturlar hamda xalqaro sertifikatlarga tayyorgarlik.",
        points: [
          "AAOIFI boʻyicha treninglar va korporativ kurslar",
          "CPSS va CSAA xalqaro imtihonlariga tayyorgarlik",
          "Xorijiy hamkorlar bilan tajriba almashish safarlari",
        ],
      },
      consulting: {
        name: "Konsalting va mahsulot dizayni",
        summary:
          "Islom banki litsenziyasidan tortib yangi mahsulotgacha: struktura, hujjatlar, buxgalteriya va ishga tushirish.",
        points: [
          "Islom banki litsenziyasini olish va ishga tushirishni toʻliq qoʻllab-quvvatlash",
          "Islom oynasi va islom moliyasi boʻlimini tashkil etish",
          "Murobaha, ijara, mushoraka, mudoraba, sukuk, takaful",
        ],
      },
      zakat: {
        name: "Zakot hisobi",
        summary:
          "Biznes va shaxsiy aktivlar boʻyicha zakot bazasini hisoblaymiz va hujjatlashtiramiz.",
        points: [
          "Balans asosida zakot bazasi",
          "Nisob va sana boʻyicha xulosalar",
          "Toʻlov va taqsimot boʻyicha hisobot",
        ],
      },
    },
  },

  council: {
    kicker: "Kim javob beradi",
    prev: "Oldingi aʼzo",
    next: "Keyingi aʼzo",
    title: "Ikki kengash, bitta imzo",
    lede:
      "Shariat masalasini olimlar hal qiladi, uning qonuniy va shartnomaviy ijrosini esa yuristlar tayyorlaydi. Hujjat ikkala kengash imzosisiz chiqmaydi.",
    groups: {
      board: {
        name: "Islom moliyasi kengashi",
        short: "Islom moliyasi",
        role: "Fatvo va shariat xulosalari",
      },
      experts: {
        name: "Yuridik kengash",
        short: "Yuridik kengash",
        role: "Qonunchilik va huquqiy ekspertiza",
      },
      team: {
        name: "Rahbariyat va loyiha menejerlari",
        short: "Jamoa",
        role: "AAOIFI sertifikatiga ega amaliyotchilar",
      },
    },
    members: {
      sultonxojaev: {
        name: "Alisher Sultonxoʻjaev",
        role: "Kengash aʼzosi",
        bio: "Toshkent islom instituti oʻqituvchisi, kitoblar muallifi. Islomshunos, imom-xatib va arab tili oʻqituvchisi.",
        credentials: [
          "Toshkent islom instituti",
          "TDShI, magistratura",
          "Arab, rus, ingliz, turk tillari",
        ],
      },
      razzoqov: {
        name: "Yahyobek Razzoqov",
        role: "Kengash raisi",
        bio: "Islomshunos, iqtisodchi va arabshunos. Muhammad Taqi Usmoniyning “Fiqhul buyuʼ” asarini arab tilidan oʻzbek tiliga tarjima qilgan.",
        credentials: [
          "Toshkent moliya instituti",
          "Toshkent islom instituti",
          "Ikkita oliy maʼlumot",
        ],
      },
      qosimov: {
        name: "Mirjalol Qosimov",
        role: "Kengash aʼzosi",
        bio: "Islomshunoslik fanlari boʻyicha falsafa doktori (PhD). Oʻzbekiston musulmonlari idorasi huzuridagi “Vaqf” jamgʻarmasining xalqaro aloqalar boʻlimi boshligʻi.",
        credentials: [
          "Oʻzbekiston xalqaro islom akademiyasi, PhD",
          "Toshkent islom universiteti, magistratura",
          "Islom tarixi va manbashunosligi",
        ],
      },
      umarxodjayev: {
        name: "Murod Umarxodjayev",
        role: "Kengash aʼzosi",
        bio: "Islomshunos va iqtisodchi, Toshkent islom institutida fiqh fanidan dars beradi. 2011-yildan buyon buxgalteriya hisobi sohasida faoliyat yuritadi.",
        credentials: [
          "Toshkent islom instituti",
          "Toshkent kimyo-texnologiya instituti",
          "“Koʻkaldosh” islom bilim yurti",
        ],
      },
      saydaraliev: {
        name: "Saidaxmadxon Saydaraliev",
        role: "Kengash aʼzosi",
        bio: "Islomshunos va imom-xatib, Oʻzbekiston musulmonlari idorasi Fatvo markazi mutaxassisi. Islom bilim yurtlarida aqoid va arab tili fanlaridan 14 yil dars bergan.",
        credentials: [
          "Toshkent islom instituti (bakalavr)",
          "Fatvo markazi mutaxassisi",
          "Fiqh va matematika oʻqituvchisi",
        ],
      },
      rozaliyev: {
        name: "Hikmatulloh Roʻzaliyev",
        role: "Kengash aʼzosi",
        bio: "Islomshunos, arab tili oʻqituvchisi va filolog (tadqiqotchi-pedagog). Oʻzbekiston musulmonlari idorasi Fatvo markazi mutaxassisi.",
        credentials: [
          "Toshkent islom instituti (bakalavr)",
          "TDShU, magistratura",
          "CPSS",
        ],
      },
      qurbonov: {
        name: "Ismoiljon Qurbonov",
        role: "Kengash aʼzosi",
        bio: "Islomshunos, imom-xatib va arab tili oʻqituvchisi. Toshkent shahridagi “Hazrati Imom” jome masjidida imom noibi.",
        credentials: [
          "Toshkent islom instituti (bakalavr)",
          "“Oriental” universiteti, magistratura",
          "Imom-noiblikda 5+ yil",
        ],
      },
      akramov: {
        name: "Muxtor Akramov",
        role: "Kengash aʼzosi",
        bio: "Islomshunos, islom iqtisodi va moliyasi mutaxassisi. Tadqiqotchi va pedagog, malaka oshirish markazida dars bergan.",
        credentials: [
          "Toshkent islom instituti (bakalavr)",
          "Oʻzbekiston xalqaro islom akademiyasi, magistratura",
          "CPSS",
        ],
      },
      usmanov: {
        name: "Jamshid Usmanov",
        role: "“Constat” advokatlik firmasi direktori",
        bio: "Tadbirkorlik subyektlariga kompleks huquqiy xizmat koʻrsatadi. Bank sohasida 6 yillik tajribaga ega, AAOIFI CPSS sertifikati sohibi.",
        credentials: [
          "“Constat” advokatlik firmasi, direktor",
          "Bank huquqi boʻyicha 6 yil tajriba",
          "AAOIFI CPSS",
        ],
      },
      rajabov: {
        name: "Nodir Rajabov",
        role: "“Philosophy of Justice” xalqaro arbitraj sudi arbitri",
        bio: "Xalqaro arbitraj sudi arbitri. Tijorat va pudrat nizolarini shariat hamda Oʻzbekiston qonunchiligi asosida koʻrib chiqadi.",
        credentials: [
          "“Philosophy of Justice” xalqaro arbitraj sudi",
          "Tijorat nizolari boʻyicha arbitr",
        ],
      },
      amanbaev: {
        name: "Damir Amanbaev",
        role: "“Enlawyer” yuridik firmasining boshqaruvchi sherigi",
        bio: "Korporativ va moliyaviy huquq boʻyicha amaliyotchi. Islom moliyasi bitimlarini Oʻzbekiston qonunchiligiga muvofiq rasmiylashtirish bilan shugʻullanadi.",
        credentials: ["“Enlawyer” yuridik firmasi", "Korporativ va moliyaviy huquq"],
      },
      shermatov: {
        name: "Sherzod Shermatov",
        role: "“Constat” advokatlik firmasining boshqaruvchi sherigi",
        bio: "Advokat va boshqaruvchi sherik. Bitimlarni huquqiy tekshirish va shartnomaviy hujjatlarni tayyorlash yoʻnalishida ishlaydi.",
        credentials: ["“Constat” advokatlik firmasi", "Bitimlarni huquqiy tekshirish"],
      },
      husanov: {
        name: "Shohruh Husanov",
        role: "“Philosophy of Justice” xalqaro arbitraj sudi rahbari",
        bio: "Xalqaro arbitraj sudi rahbari. Nizolarni sudgacha, yopiq va tez tartibda hal qilish amaliyotiga ixtisoslashgan.",
        credentials: [
          "“Philosophy of Justice” xalqaro arbitraj sudi, rahbar",
          "Xalqaro arbitraj amaliyoti",
        ],
      },
      xusniddinov: {
        name: "Muzaffar Xusniddinov",
        role: "Mezon Kengashi direktori",
        bio: "AAOIFI sertifikatlangan shariat maslahatchisi va auditori (CSAA). Audit va islom moliyasi sohasida keng tajribaga ega.",
        credentials: [
          "CSAA — AAOIFI sertifikatlangan shariat auditori",
          "Korea University (Janubiy Koreya), MBA",
          "Audit va islom moliyasi",
        ],
      },
      xolboboev: {
        name: "Olmos Xolboboev",
        role: "Loyihalar menejeri",
        bio: "AAOIFI sertifikatlangan shariat maslahatchisi va auditori (CSAA). Markaziy bank va tijorat banklarida koʻp yillik tajribaga ega.",
        credentials: [
          "CSAA — AAOIFI sertifikatlangan shariat auditori",
          "Sabahattin Zaim universiteti (Turkiya), islom moliyasi magistri",
          "Markaziy bank va tijorat banklari tajribasi",
        ],
      },
      oripova: {
        name: "Irodaxon Oripova",
        role: "Loyihalar menejeri",
        bio: "AAOIFI sertifikatlangan shariat maslahatchisi va auditori (CSAA). Islom moliya institutlarida 5 yillik amaliy tajriba.",
        credentials: [
          "CSAA — AAOIFI sertifikatlangan shariat auditori",
          "INCEIF (Malayziya), magistratura",
          "IMAN Global Ltd tajribasi",
        ],
      },
      kaxramonov: {
        name: "Abdurashid Kaxramonov",
        role: "Loyihalar menejeri",
        bio: "AAOIFI sertifikatlangan shariat standartlari boʻyicha mutaxassis (CPSS). Murobaha va ijara mahsulotlari boʻyicha ekspert.",
        credentials: [
          "CPSS — AAOIFI shariat standartlari sertifikati",
          "Istanbul Marmara universiteti, islom moliyasi magistraturasi",
          "Murobaha va ijara mahsulotlari",
        ],
      },
      nusratxojayev: {
        name: "Xondamir Nusratxoʻjaev",
        role: "Mustaqil ekspert, strategik maslahatchi",
        bio: "AAOIFI sertifikatlangan shariat auditori (CSAA) va islom moliyasi boʻyicha professional buxgalter (CIPA). Islom taraqqiyot banki (Saudiya Arabistoni) moliya menejeri.",
        credentials: [
          "CSAA va CIPA — AAOIFI",
          "Islom taraqqiyot banki (IsDB), moliya menejeri",
          "AAOIFI shariat kengashi aʼzosi (2016–2023)",
        ],
      },
      mezon: {
        name: "MEZON KENGASHI",
        role: "Tahlil va metodologiya guruhi",
        bio: "Kengash materiallarini tayyorlovchi ichki tahliliy guruh.",
        credentials: ["Metodologiya", "Shariat ekspertizasi", "Huquqiy tahlil"],
      },
    },
  },

  process: {
    kicker: "Qanday ishlaymiz",
    title: "Murojaatdan sertifikatgacha",
    lede: "Oʻrtacha muddat — 3 haftadan 2 oygacha, loyihaning hajmiga qarab.",
    steps: [
      {
        name: "Murojaat va dastlabki tahlil",
        body: "Hujjatlarni koʻrib chiqamiz, ish hajmi va muddatni belgilaymiz. Bu bosqich bepul.",
        time: "2–5 kun",
      },
      {
        name: "Shariat ekspertizasi",
        body: "Shartnoma, pul oqimi va buxgalteriya yozuvlarini standartlar bilan solishtiramiz.",
        time: "1–3 hafta",
      },
      {
        name: "Kengash qarori va fatvo",
        body: "Kengash yigʻilib qaror qabul qiladi. Nomuvofiqliklar boʻlsa — tuzatish roʻyxati beriladi.",
        time: "1 hafta",
      },
      {
        name: "Sertifikatlash va nazorat",
        body: "Sertifikat beriladi va yillik nazorat jadvali ishga tushadi.",
        time: "Doimiy",
      },
    ],
  },

  trust: {
    title: "Nega bizga ishonishadi",
    items: [
      {
        name: "Yozma javobgarlik",
        body: "Har bir xulosa imzolangan hujjat shaklida beriladi — ogʻzaki maslahat emas.",
      },
      {
        name: "Ochiq reyestr",
        body: "Berilgan sertifikatlar ommaviy reyestrda, mijoz istagan paytda tekshirishi mumkin.",
      },
      {
        name: "Manfaatlar toʻqnashuvi yoʻq",
        body: "Kengash aʼzolari tekshirilayotgan tashkilotlarda ulushga ega emas.",
      },
    ],
  },

  contact: {
    kicker: "Aloqa",
    title: "Savolingizni yozing",
    lede:
      "Bir necha savolga javob bering — murojaatingizni darhol kerakli mutaxassisga yoʻnaltiramiz. Dastlabki suhbat bepul.",
    officeTitle: "Manzil",
    hoursTitle: "Ish vaqti",
    hours: "Dushanba–Juma, 09:00–18:00",
    hoursNote: "Juma kuni 12:30–14:00 tanaffus",
    directTitle: "Toʻgʻridan-toʻgʻri",
    mapLabel: "Xaritada koʻrish",
    telegramTitle: "Tezkor aloqa",
    telegramCta: "Telegramda yozish",
  },

  footer: {
    tagline: "Islom moliyasi boʻyicha konsalting markazi",
    servicesTitle: "Xizmatlar",
    companyTitle: "Kompaniya",
    contactTitle: "Aloqa",
    about: "Biz haqimizda",
    council: "Kengash",
    process: "Jarayon",
    rights: "Barcha huquqlar himoyalangan.",
    disclaimer:
      "Saytdagi maʼlumot umumiy xarakterga ega va moliyaviy yoki huquqiy maslahat oʻrnini bosmaydi.",
    credits: "Fotosuratlar: Samarqand meʼmoriy yodgorliklari",
  },

  clients: {
    kicker: "Ishonch",
    title: "Hamkorlarimiz va mijozlarimiz",
    lede: "Banklar, fintex platformalari, lizing, qurilish va savdo kompaniyalari — mahsulot strukturasi, audit, sertifikatlash yoki jamoani oʻqitish boʻyicha birga ishlaymiz.",
    since: "{year}-yildan",
    certified: "Sertifikatlangan",
    registryCta: "Sertifikatlar reyestri",
    verifyTitle: "Sertifikatni tekshiring",
    verifyBody: "Reyestr raqamini yoki tashkilot nomini kiriting — sertifikat amaldami, darhol koʻrasiz.",
    verifyLabel: "Sertifikat raqami yoki tashkilot",
    verifyCta: "Tekshirish",
  },

  faq: {
    title: "Tez-tez beriladigan savollar",
    kicker: "Savol-javob",
    lede: "Mijozlarimiz eng koʻp soʻraydigan savollar. Mavzuni tanlang — javoblar shu yerda.",
    popular: "Eng koʻp soʻralgan",
    askTitle: "Javob topilmadimi?",
    askBody: "Savolingizni yozing — tegishli mutaxassis ish kuni davomida javob beradi.",
    askCta: "Savol berish",
    allLink: "Barcha savollar",
    items: [
      {
        q: "Shariat auditi qancha vaqt oladi?",
        a: "Bitta mahsulot boʻyicha odatda 1–3 hafta. Bankning butun portfeli boʻyicha toʻliq audit 6–8 haftagacha davom etadi.",
      },
      {
        q: "Fatvo va sertifikat oʻrtasida qanday farq bor?",
        a: "Fatvo — kengashning muayyan mahsulot yoki shartnoma boʻyicha shariat qarori. Sertifikat esa amaldagi operatsiyalar shu qarorga muvofiq bajarilayotganini tasdiqlaydi va har yili yangilanadi.",
      },
      {
        q: "Kichik biznes uchun ham ishlaysizmi?",
        a: "Ha. Zakot hisobi, bitta shartnoma ekspertizasi yoki qisqa konsultatsiya kabi alohida xizmatlar kichik kompaniyalar uchun ham mavjud.",
      },
      {
        q: "Zakot hisobini qanday tasdiqlaysiz?",
        a: "Balans va aylanma mablagʻlar asosida zakot bazasini hisoblaymiz, nisob sanasini belgilaymiz va yozma xulosa beramiz. Xulosani auditor yoki soliq maslahatchisi ishlatishi mumkin.",
      },
      {
        q: "Konsultatsiya pullikmi?",
        a: "Dastlabki 30 daqiqalik suhbat va hujjatlarni koʻrib chiqish bepul. Keyingi ishlar hajmi kelishilgandan soʻng baholanadi.",
      },
    ],
  },
};

export default uz;
export type Dict = typeof uz;
