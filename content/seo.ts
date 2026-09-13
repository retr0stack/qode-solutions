import type { PageSeo } from "./types";
import { site } from "./site";

/** Метаданные страниц. Подхватываются через generateMetadata в app/**. */
export const pageSeo = {
  home: {
    title: `${site.name} – ${site.descriptor}`,
    description:
      "Разрабатываем сайты, внутренние системы и ботов для бизнеса в Казахстане. Астана и Алматы. Инженерный подход, безопасность по умолчанию, поддержка после сдачи.",
  },
  services: {
    title: "Услуги",
    description:
      "Сайты, программное обеспечение под задачу, боты и автоматизация общения, интеграции, безопасность и надёжность.",
  },
  team: {
    title: "Команда",
    description:
      "Команда QODE SOLUTIONS: шесть инженеров с европейским опытом и работой в крупных компаниях. Вы работаете напрямую с теми, кто делает проект.",
  },
  contacts: {
    title: "Контакты",
    description:
      "Обсудить проект: WhatsApp, Telegram, почта. Астана и Алматы. Ответим в течение рабочего дня.",
  },
  cases: {
    title: "Кейсы",
    description:
      "Проекты QODE SOLUTIONS: сайты, внутренние системы и интеграции для бизнеса в Казахстане.",
  },
} satisfies Record<string, PageSeo>;

/** Ключевые фразы для og:title и заголовка вкладки на внутренних страницах. */
export const titleTemplate = `%s – ${site.name}`;
