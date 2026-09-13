"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  getDict,
  isLocale,
  type Dict,
  type Locale,
} from "@/content/i18n";

interface LanguageContextValue {
  locale: Locale;
  dict: Dict;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Провайдер языка интерфейса.
 *
 * Сервер всегда рендерит русский — это язык по умолчанию, и так разметка
 * на сервере и на клиенте совпадает, гидратация не ругается. Сохранённый
 * выбор читается в первом эффекте, уже после монтирования.
 *
 * Выбор хранится в localStorage, а не в адресе: у сайта нет локализованных
 * маршрутов, и заводить /kk/... ради переключателя не нужно — контент
 * целиком приходит из словарей (content/i18n).
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (isLocale(saved)) {
        setLocaleState(saved);
        return;
      }
    } catch {
      // Приватный режим может запрещать localStorage — молча остаёмся на ru.
    }

    // Ничего не сохранено: если система просит казахский, предлагаем его.
    const preferred = navigator.languages?.find((tag) =>
      tag.toLowerCase().startsWith("kk"),
    );
    if (preferred) setLocaleState("kk");
  }, []);

  // Атрибут lang нужен скринридерам и правилам трекинга в base.css.
  useEffect(() => {
    document.documentElement.lang = getDict(locale).meta.htmlLang;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      // Не смогли сохранить — язык всё равно переключится на эту сессию.
    }
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({ locale, dict: getDict(locale), setLocale }),
    [locale, setLocale],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function useLanguageContext(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    // Провайдер стоит в корневом layout — сюда можно попасть только по ошибке.
    throw new Error("useDict должен использоваться внутри <LanguageProvider>");
  }
  return context;
}

/** Словарь текущего языка. Основной способ получить текст в компоненте. */
export function useDict(): Dict {
  return useLanguageContext().dict;
}

/** Текущая локаль и переключатель — нужны только самому переключателю. */
export function useLocale(): { locale: Locale; setLocale: (locale: Locale) => void } {
  const { locale, setLocale } = useLanguageContext();
  return { locale, setLocale };
}
