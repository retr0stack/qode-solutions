import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge не знает про наш @theme и по умолчанию считает любое
 * незнакомое `text-*` цветом текста. Из-за этого `text-body` конфликтовал
 * с `text-[color:…]` и цвет молча выбрасывался из класса, а размеры вроде
 * `text-lead` вытеснялись цветовыми `text-fg-2`.
 *
 * Поэтому перечисляем свои шкалы явно: имена должны совпадать с токенами
 * --text-* и --color-* в app/styles/tokens.css. Добавили токен — допишите
 * его и здесь.
 */
const FONT_SIZES = [
  "display-1",
  "display-2",
  "display-3",
  "title",
  "lead",
  "body",
  "small",
  "caption",
  "label",
] as const;

const TEXT_COLORS = [
  "fg",
  "fg-2",
  "fg-soft",
  "ink",
  "ink-2",
  "ink-3",
  "ink-4",
  "paper",
  "paper-2",
  "paper-3",
  "muted",
  "cyan",
  "blue",
  "violet",
  "cyan-ink",
  "blue-ink",
  "violet-ink",
  "danger",
  "accent",
] as const;

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: [...FONT_SIZES] }],
      "text-color": [{ text: [...TEXT_COLORS] }],
    },
  },
});

/** Склейка классов с корректным разрешением конфликтов Tailwind. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
