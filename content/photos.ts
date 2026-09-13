/**
 * Все фотографии сайта в одном месте.
 *
 * Пока это тестовые снимки с picsum.photos: сид фиксирует конкретный кадр,
 * поэтому макет не прыгает при перезагрузке. source.unsplash.com не
 * используем — сервис отключён с 2024 года и отдаёт 503.
 *
 * Заменить на реальные снимки — значит поправить только этот файл: ссылки
 * нигде больше не встречаются.
 */
export const PHOTOS = {
  homeHero: "https://picsum.photos/seed/qode-hero/1920/1080",
  problems: "https://picsum.photos/seed/qode-problems/1200/800",
  proofCase: "https://picsum.photos/seed/qode-booz/1200/900",
  process: "https://picsum.photos/seed/qode-process/1400/900",
  pricing: "https://picsum.photos/seed/qode-pricing/1600/900",
  servicesHero: "https://picsum.photos/seed/qode-services/1920/700",
  portfolioHero: "https://picsum.photos/seed/qode-works/1920/700",
  partnersHero: "https://picsum.photos/seed/qode-partners/1920/700",
  teamHero: "https://picsum.photos/seed/qode-team/1920/700",
  foundersHero: "https://picsum.photos/seed/qode-founders/1920/700",
  contactsHero: "https://picsum.photos/seed/qode-contacts/1920/700",
  astana: "https://picsum.photos/seed/qode-astana/1400/900",
  ctaFinal: "https://picsum.photos/seed/qode-cta/1920/800",
} as const;

export type PhotoKey = keyof typeof PHOTOS;

/**
 * Осмысленные подписи под каждый кадр. Лежат рядом со ссылками, чтобы
 * alt не забыли проставить при замене снимков.
 */
export const PHOTO_ALT: Record<PhotoKey, string> = {
  homeHero: "Рабочий стол разработчика с открытым кодом",
  problems: "Разбор задачи на встрече с клиентом",
  proofCase: "Витрина интернет-магазина BOOZ на экране ноутбука",
  process: "Команда обсуждает план проекта у доски",
  pricing: "Смета проекта на экране",
  servicesHero: "Рабочие сцены за ноутбуками в офисе",
  portfolioHero: "Экраны с интерфейсами проектов",
  partnersHero: "Совместная работа двух команд",
  teamHero: "Инженеры за работой в офисе",
  foundersHero: "Основатели агентства за обсуждением",
  contactsHero: "Современный интерьер офиса",
  astana: "Архитектура Астаны",
  ctaFinal: "Вечерний офис с включённым светом",
};
