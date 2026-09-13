import type { Dict, Locale } from "./types";
import { ru } from "./ru";
import { kk } from "./kk";

export type { Dict, Locale } from "./types";
export type {
  DictLink,
  DictIntro,
  DictServiceItem,
  DictServiceCategory,
  DictTeamMember,
  DictFounder,
  DictStoryChapter,
} from "./types";
export { ru } from "./ru";
export { kk } from "./kk";

/** Язык по умолчанию. Русский – основной язык интерфейса. */
export const DEFAULT_LOCALE: Locale = "ru";

/** Все словари. Порядок задаёт порядок кнопок в переключателе языка. */
export const dictionaries: Record<Locale, Dict> = { ru, kk };

export const LOCALES: readonly Locale[] = ["ru", "kk"];

/** Ключ в localStorage. Один на весь сайт. */
export const LOCALE_STORAGE_KEY = "qode-locale";

export function isLocale(value: unknown): value is Locale {
  return value === "ru" || value === "kk";
}

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? ru;
}
