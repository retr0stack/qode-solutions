import type { LinkItem } from "./types";

/** Верхнее меню. Кейсы появятся, когда наполнится content/cases.ts. */
export const mainNav: readonly LinkItem[] = [
  { label: "Услуги", href: "/services" },
  { label: "Команда", href: "/team" },
  { label: "Контакты", href: "/contacts" },
];

export const footerNav: readonly { title: string; links: readonly LinkItem[] }[] = [
  {
    title: "Компания",
    links: [
      { label: "Услуги", href: "/services" },
      { label: "Команда", href: "/team" },
      { label: "Контакты", href: "/contacts" },
    ],
  },
  {
    title: "Направления",
    links: [
      { label: "Сайты", href: "/services#sites" },
      { label: "ПО под задачу", href: "/services#software" },
      { label: "Боты", href: "/services#bots" },
      { label: "Интеграции", href: "/services#integrations" },
      { label: "Безопасность", href: "/services#security" },
    ],
  },
];

/** Куда ведёт кнопка «Обсудить проект» на всех страницах. */
export const LEAD_FORM_ID = "lead-form";
export const leadFormHref = `/contacts#${LEAD_FORM_ID}`;
