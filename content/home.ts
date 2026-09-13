import type {
  Advantage,
  DirectionCard,
  HeroContent,
  SectionIntro,
} from "./types";
import { LEAD_FORM_ID } from "./nav";

export const hero: HeroContent = {
  title: "Сайты и цифровые сервисы для бизнеса",
  subtitle:
    "Разрабатываем сайты, внутренние системы и ботов. Делаем так, чтобы после нас не пришлось переделывать.",
  primaryCta: { label: "Обсудить проект", href: `#${LEAD_FORM_ID}` },
  secondaryCta: { label: "Услуги", href: "/services" },
};

/** Пять направлений на главной. «Сайты» – крупная плитка. */
export const directions: readonly DirectionCard[] = [
  {
    slug: "sites",
    title: "Сайты",
    description:
      "Основное направление. Корпоративные сайты, лендинги и магазины – от структуры до запуска и поддержки.",
    featured: true,
  },
  {
    slug: "software",
    title: "ПО под задачу",
    description: "Внутренние системы и панели, которые закрывают конкретный процесс.",
  },
  {
    slug: "bots",
    title: "Боты",
    description: "Telegram и WhatsApp: заявки, записи, уведомления.",
  },
  {
    slug: "integrations",
    title: "Интеграции",
    description: "CRM, платежи, 1С, аналитика – данные ходят сами.",
  },
  {
    slug: "security",
    title: "Безопасность",
    description: "Аудит, резервные копии, мониторинг доступности.",
  },
];

export const advantages: readonly Advantage[] = [
  {
    title: "Инженерный подход",
    description:
      "Сначала разбираемся в процессе, потом пишем код. Решение документировано, его может продолжить другая команда.",
  },
  {
    title: "Безопасность по умолчанию",
    description:
      "Обновления, разделение прав, резервные копии и защита форм входят в базовую работу, а не в отдельный счёт.",
  },
  {
    title: "Поддержка после сдачи",
    description:
      "Не исчезаем после запуска: следим за доступностью, правим и развиваем проект по понятному регламенту.",
  },
];

/** Заголовочные блоки секций главной. */
export const homeIntros = {
  directions: {
    eyebrow: "Направления",
    title: "Что мы делаем",
    lead: "Пять направлений. Сайты – основное, остальное чаще всего растёт из них.",
  },
  process: {
    eyebrow: "Процесс",
    title: "Как мы работаем",
    lead: "Пять шагов от первого разговора до поддержки. Без сюрпризов в середине.",
  },
  advantages: {
    eyebrow: "Отличия",
    title: "Почему после нас не переделывают",
  },
  stack: {
    eyebrow: "Технологии",
    title: "На чём собираем",
    lead: "Проверенные инструменты без экзотики – проект переживёт смену команды.",
  },
  faq: {
    eyebrow: "Вопросы",
    title: "Коротко о главном",
  },
  cta: {
    eyebrow: "Дальше",
    title: "Расскажите о задаче",
    lead: "Ответим в течение рабочего дня. Оценка и сроки – бесплатно.",
  },
} satisfies Record<string, SectionIntro>;
