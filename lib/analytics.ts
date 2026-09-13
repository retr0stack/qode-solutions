/**
 * Тонкая обёртка над Яндекс.Метрикой.
 *
 * Для казахстанского трафика Метрика информативнее GA4: есть вебвизор и
 * карта скроллинга, а именно записи сессий покажут, где отваливается заявка.
 *
 * Счётчик подключается переменной NEXT_PUBLIC_YM_ID. Пока её нет, скрипт не
 * грузится вовсе, а track() молча ничего не делает — на локальной разработке
 * статистика не засоряется, и код не падает.
 */

/** Цели, которые считаем. Строки должны совпадать с целями в интерфейсе Метрики. */
export type Goal =
  | "lead_form"
  | "whatsapp_click"
  | "telegram_click"
  | "email_click"
  | "phone_click"
  | "pricing_view"
  | "scroll_75";

export const YM_ID = process.env.NEXT_PUBLIC_YM_ID;

type YmFunction = (id: string, action: string, goal?: string) => void;

/** Отправляет достижение цели. Безопасно вызывать до загрузки счётчика. */
export function track(goal: Goal) {
  if (!YM_ID) return;
  const ym = (window as unknown as { ym?: YmFunction }).ym;
  ym?.(YM_ID, "reachGoal", goal);
}
