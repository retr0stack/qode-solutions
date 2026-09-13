import type { CaseStudy, SectionIntro } from "./types";

export const casesIntro: SectionIntro = {
  eyebrow: "Портфолио",
  title: "Наши работы",
  lead: "Что мы собирали и что из этого вышло.",
};

/**
 * ВНИМАНИЕ: данные ниже – временные, для проверки вёрстки страницы.
 * Заменить настоящими проектами до публикации; клиентов под NDA можно
 * оставить обезличенными («Интернет-магазин одежды, постсоветский рынок») –
 * без имени клиента соглашение не нарушается.
 *
 * Обложек-файлов пока нет: каждая плитка рисует абстрактную заливку по
 * своей палитре. Появится снимок – дописать cover в объект, карточка
 * подхватит его сама.
 */
export const cases: readonly CaseStudy[] = [
  {
    slug: "booz",
    client: "BOOZ",
    title: "Интернет-магазин бренда одежды",
    summary:
      "Каталог, корзина, оплата и выгрузка заказов. Собран без CMS – страницы отдаются статикой и открываются мгновенно.",
    year: 2025,
    tags: ["Сайты", "Электронная коммерция"],
    palette: ["#22d3ee", "#2b8dff"],
    ratio: "wide",
    result: "Заказ оформляется за три экрана",
  },
  {
    slug: "qalqan",
    client: "Qalqan Safety",
    title: "B2B-каталог спецодежды",
    summary: "Двуязычный сайт с каталогом на 600 позиций и заявкой на подбор.",
    year: 2026,
    tags: ["Сайты", "B2B"],
    palette: ["#2b8dff", "#7c3aed"],
    ratio: "tall",
  },
  {
    slug: "astera",
    client: "ASTERA PRIME",
    title: "Витрина объектов с фильтрами",
    summary: "Подбор по району, площади и бюджету. Заявка уходит агенту в WhatsApp.",
    year: 2024,
    tags: ["Сайты", "Интеграции"],
    palette: ["#56e2f5", "#22d3ee"],
    ratio: "square",
  },
  {
    slug: "renovation-crm",
    client: "ELEVENSTROY",
    title: "CRM под ремонтные бригады",
    summary:
      "Заявки, сметы, графики бригад и учёт материалов в одной системе вместо пяти таблиц.",
    year: 2026,
    tags: ["Системы", "CRM"],
    palette: ["#1668e3", "#0b7ea3"],
    ratio: "wide",
    result: "Смета собирается за 20 минут вместо дня",
  },
  {
    slug: "clinic-bot",
    client: "Dr. Perun",
    title: "Бот записи в WhatsApp",
    summary: "Выбор врача, времени и напоминания без участия администратора.",
    year: 2025,
    tags: ["Системы", "B2B"],
    palette: ["#7c3aed", "#2b8dff"],
    ratio: "tall",
  },
  {
    slug: "logistics-dashboard",
    client: "Tumar Logistics",
    title: "Дашборд для руководителя",
    summary: "Выручка, загрузка машин и просроченные доставки на одном экране.",
    year: 2024,
    tags: ["Системы", "Аналитика"],
    palette: ["#22d3ee", "#6229d9"],
    ratio: "square",
  },
  {
    slug: "agro-supply",
    client: "Arman Agro",
    title: "Портал поставок для дистрибьюторов",
    summary: "Заявки на поставку, остатки по складам и статусы отгрузок в одном окне.",
    year: 2026,
    tags: ["Системы", "B2B"],
    palette: ["#0b7ea3", "#22d3ee"],
    ratio: "wide",
    result: "Согласование заявки сократилось до часа",
  },
  {
    slug: "auto-parts",
    client: "Kaskad Parts",
    title: "Личный кабинет для оптовиков",
    summary: "Дилер сам видит цены, остатки и долг, оформляет заказ без звонка менеджеру.",
    year: 2024,
    tags: ["Системы", "B2B"],
    palette: ["#2b8dff", "#56e2f5"],
    ratio: "tall",
  },
  {
    slug: "industrial-training",
    client: "Beren Industrial",
    title: "Учёт допусков и аттестаций персонала",
    summary: "Сроки допусков, напоминания об аттестации и выгрузка для проверок.",
    year: 2025,
    tags: ["Системы", "Промышленность"],
    palette: ["#6229d9", "#2b8dff"],
    ratio: "square",
  },
  {
    slug: "metal-catalog",
    client: "Altyn Metal",
    title: "Каталог проката и расчёт метража",
    summary: "Сортамент, остатки и калькулятор веса по размерам прямо на странице позиции.",
    year: 2026,
    tags: ["Сайты", "Каталог"],
    palette: ["#22d3ee", "#1668e3"],
    ratio: "wide",
  },
  {
    slug: "chem-datasheets",
    client: "Zhetysu Chem",
    title: "База паспортов безопасности",
    summary: "Карточки веществ, версии документов и выдача клиенту по ссылке.",
    year: 2024,
    tags: ["Системы", "Документы"],
    palette: ["#56e2f5", "#6229d9"],
    ratio: "tall",
  },
  {
    slug: "security-audit",
    client: "Sarybai Capital",
    title: "Аудит безопасности перед запуском",
    summary: "Проверка кода подрядчика, отчёт с приоритетами и план исправлений.",
    year: 2025,
    tags: ["Безопасность", "Аудит"],
    palette: ["#1668e3", "#0b7ea3"],
    ratio: "square",
    result: "Закрыли уязвимости до релиза",
  },
  {
    slug: "farm-marketplace",
    client: "Dala Agro Union",
    title: "Маркетплейс локальных продуктов",
    summary: "Каталог хозяйств, корзина, доставка по городу и выплаты продавцам.",
    year: 2026,
    tags: ["Сайты", "Электронная коммерция"],
    palette: ["#7c3aed", "#22d3ee"],
    ratio: "wide",
  },
  {
    slug: "construction-docs",
    client: "Orda Construction",
    title: "Генерация актов и смет",
    summary: "Документы собираются из справочника работ за минуты вместо дня.",
    year: 2024,
    tags: ["Автоматизация", "Документы"],
    palette: ["#2b8dff", "#7c3aed"],
    ratio: "tall",
  },
];

export const hasCases = cases.length > 0;
