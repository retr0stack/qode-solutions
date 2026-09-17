import type { LinkItem, Locale } from "./types";

/** Активная локаль. Переключатель появится вместе с i18n. */
export const defaultLocale: Locale = "ru";
export const locales: readonly Locale[] = ["ru", "kk", "en"];

/**
 * Базовый адрес сайта.
 *
 * Берётся из окружения, но только если там непустая строка. Оператор ??
 * подставляет запасное значение лишь для null и undefined, а хостинги
 * часто передают объявленную, но незаполненную переменную как "" – такая
 * строка проходила дальше и роняла сборку на new URL("") с ERR_INVALID_URL.
 *
 * Схема добавляется, если её забыли: "qode.kz" сам по себе тоже не URL.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!fromEnv) return "https://qode.kz";
  return /^https?:\/\//.test(fromEnv) ? fromEnv : `https://${fromEnv}`;
}

export const site = {
  name: "QODE SOLUTIONS",
  descriptor: "Агентство цифровых решений",
  /* TODO: подставить финальный домен и продублировать в .env (NEXT_PUBLIC_SITE_URL) */
  url: resolveSiteUrl(),
  locale: "ru_RU",
  foundingYear: 2024,
} as const;

/**
 * Телефон показывается только когда он настоящий.
 *
 * Плейсхолдер вида +7 700 000 00 00 в футере – мгновенный сигнал «сайт
 * недоделан», и он дороже, чем отсутствие телефона вовсе. Поставьте сюда
 * реальный номер и переключите флаг в true – номер появится разом в футере,
 * на странице контактов и в мобильной панели.
 */
/*
 * Номер-заглушка. Заменить на настоящий и оставить флаг включённым –
 * или выключить флаг, если телефона не будет вовсе.
 */
export const PHONE_ENABLED = true;


/**
 * Телефоны.
 *
 * Два номера, оба кликабельные: href в формате tel: с E.164 без пробелов
 * и скобок – иначе часть телефонов и десктопных звонилок обрезает номер
 * на первом же нецифровом символе. Показывается человекочитаемый вариант,
 * набирается машинный.
 */
export const phones = [
  { label: "+7 (747) 239-28-61", href: "tel:+77472392861" },
  { label: "+7 (777) 434-00-07", href: "tel:+77774340007" },
] as const;

export const contacts = {
  /** Основной номер: он же в WhatsApp. */
  phone: phones[0].label,
  phoneHref: phones[0].href,
  email: "info@qode.kz",
  emailHref: "mailto:info@qode.kz",
  /* Номер WhatsApp без плюса и пробелов – формат, который ждёт wa.me. */
  whatsapp: "77472392861",
  whatsappText: "Здравствуйте! Хочу обсудить проект.",
  /* TODO: юзернейм в Telegram */
  telegram: "qode_solutions",
  workingHours: "Пн–Пт, 10:00–19:00 (UTC+5)",
} as const;

/** Ссылка на WhatsApp с предзаполненным текстом. */
export const whatsappHref = `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(
  contacts.whatsappText,
)}`;

export const cities = [
  {
    city: "Астана",
    /* TODO: точный адрес офиса – используется в JSON-LD LocalBusiness */
    address: "Астана, ул. Достык, 00, офис 000",
    postalCode: "010000",
    primary: true,
  },
  {
    city: "Алматы",
    /* TODO: адрес или пометка «по договорённости» */
    address: "Алматы, пр. Аль-Фараби, 00",
    postalCode: "050000",
    primary: false,
  },
] as const;

/* TODO: заменить на реальные профили, лишнее удалить */
/**
 * Соцсети – единственный список на весь сайт.
 *
 * Футер, страница контактов и секция заявки берут его отсюда: раньше
 * перечень был продублирован в трёх местах и расходился между ними.
 *
 * Telegram здесь отсутствует намеренно – он остаётся каналом связи
 * (см. contacts.telegram), но не соцсетью, на которую подписываются.
 */
export const socials: readonly LinkItem[] = [
  { label: "WhatsApp", href: whatsappHref, external: true },
  /* TODO: ссылка на аккаунт в Instagram */
  { label: "Instagram", href: "https://instagram.com/", external: true },
  /* TODO: ссылки на TikTok пока нет – заглушка, заменить перед публикацией */
  { label: "TikTok", href: "#", external: true },
];
