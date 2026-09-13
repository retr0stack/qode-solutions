import type { SectionIntro, TeamMember } from "./types";
import { contacts } from "./site";

export const teamIntro: SectionIntro = {
  eyebrow: "Команда",
  title: "Двое, с которыми вы будете работать",
  lead: "Без прослойки менеджеров: вы общаетесь с теми, кто принимает решения и пишет код.",
};

/**
 * Основатели. Чтобы добавить человека – допишите объект в массив,
 * сетка карточек и разметка Person в JSON-LD подхватят его сами.
 * Фото: 800×1000, WebP, в /public/team. Подробнее в content/README.md.
 */
export const team: readonly TeamMember[] = [
  {
    slug: "cto",
    /* TODO: реальные имя и фамилия */
    name: "Имя Фамилия",
    role: "Технический директор",
    bio: [
      "Отвечает за архитектуру, разработку и безопасность проектов.",
      "TODO: 2–3 строки бэкграунда – сколько лет в разработке, ключевые проекты, специализация.",
    ],
    photo: {
      /* TODO: положить фото в /public/team/cto.webp и указать путь здесь.
         Пока src пустой, в карточке показывается фирменная заглушка. */
      src: "",
      alt: "Технический директор QODE SOLUTIONS",
    },
    links: [
      { label: "Telegram", href: `https://t.me/${contacts.telegram}`, external: true },
      /* TODO: GitHub, LinkedIn – или удалить лишнее */
      { label: "GitHub", href: "https://github.com/", external: true },
    ],
  },
  {
    slug: "managing-partner",
    /* TODO: реальные имя и фамилия */
    name: "Имя Фамилия",
    role: "Управляющий партнёр",
    bio: [
      "Ведёт клиентов и проекты: разбор задач, смета, сроки, приёмка.",
      "TODO: 2–3 строки бэкграунда – опыт в управлении проектами, отрасли, подход к работе.",
    ],
    photo: {
      /* TODO: положить фото в /public/team/managing-partner.webp и указать путь.
         Пока src пустой, в карточке показывается фирменная заглушка. */
      src: "",
      alt: "Управляющий партнёр QODE SOLUTIONS",
    },
    links: [
      { label: "WhatsApp", href: "#", external: true },
      { label: "LinkedIn", href: "https://linkedin.com/in/", external: true },
    ],
  },
];

/** Заготовка под расширение: место под вакансию в конце сетки. */
export const teamOpenRole = {
  enabled: false,
  title: "Ищем разработчика",
  description: "Если вам близок наш подход – напишите, обсудим.",
  href: "/contacts",
} as const;
