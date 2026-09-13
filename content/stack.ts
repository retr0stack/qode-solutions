import type { StackGroup } from "./types";

/**
 * Сетка технологий. Только текст – иконки рисуются моноширинными
 * подписями и рамками, никаких стоковых логотипов.
 * TODO: сверить список с тем, что реально используется в работе.
 */
export const stackGroups: readonly StackGroup[] = [
  {
    title: "Фронтенд",
    items: ["TypeScript", "React", "Next.js", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Бэкенд",
    items: ["Node.js", "NestJS", "PostgreSQL", "Redis", "Prisma"],
  },
  {
    title: "Инфраструктура",
    items: ["Docker", "Nginx", "GitHub Actions", "Cloudflare", "Grafana"],
  },
  {
    title: "Интеграции",
    items: ["1С", "Bitrix24", "amoCRM", "Kaspi", "Telegram Bot API"],
  },
];
