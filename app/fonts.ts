import localFont from "next/font/local";

/**
 * Шрифты подключены локально через next/font/local — ни одного запроса
 * на сторонние домены. Файлы лежат в app/fonts (см. scripts/sync-fonts.mjs).
 *
 * ВАЖНО про кириллицу: в Space Grotesk кириллицы нет (только latin,
 * latin-ext, vietnamese). Поэтому дисплейная гарнитура собрана из двух
 * файлов с разными unicode-range: латиницу отдаёт Space Grotesk,
 * кириллицу — Manrope (близкая геометрия, плотные апроши, высокий x-height).
 * Браузер выбирает файл по символу и лишнего не скачивает.
 *
 * Субсеты *-ext нужны только для казахской локали (ә, ғ, қ, ң, ө, ү, һ),
 * поэтому у них preload: false — на русских страницах они не грузятся.
 *
 * Значения ниже намеренно продублированы литералами: next/font разбирает
 * вызовы статически и не принимает переменные, спреды и вычисления.
 */

export const displayLatin = localFont({
  src: "./fonts/space-grotesk-latin.woff2",
  weight: "300 700",
  style: "normal",
  variable: "--font-display-latin",
  display: "swap",
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const displayCyrillic = localFont({
  src: "./fonts/manrope-cyrillic.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-display-cyrillic",
  display: "swap",
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    },
  ],
});

export const displayCyrillicExt = localFont({
  src: "./fonts/manrope-cyrillic-ext.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-display-cyrillic-ext",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F",
    },
  ],
});

export const textLatin = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-text-latin",
  display: "swap",
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value:
        "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD",
    },
  ],
});

export const textCyrillic = localFont({
  src: "./fonts/inter-cyrillic.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-text-cyrillic",
  display: "swap",
  preload: true,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116",
    },
  ],
});

export const textCyrillicExt = localFont({
  src: "./fonts/inter-cyrillic-ext.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-text-cyrillic-ext",
  display: "swap",
  preload: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0460-052F,U+1C80-1C8A,U+20B4,U+2DE0-2DFF,U+A640-A69F,U+FE2E-FE2F",
    },
  ],
});

/** Клеится на <html> — отсюда токены --font-display / --font-text в tokens.css. */
export const fontVariables = [
  displayLatin.variable,
  displayCyrillic.variable,
  displayCyrillicExt.variable,
  textLatin.variable,
  textCyrillic.variable,
  textCyrillicExt.variable,
].join(" ");

/**
 * ЗАМЕТКА О PRELOAD (не баг проекта):
 * при сборке на Windows Next не создаёт <link rel="preload"> для шрифтов —
 * плагин next-font-manifest ищет в пути модуля подстроку
 * "/next-font-loader/index.js?", а на Windows в пути обратные слэши,
 * поэтому next-font-manifest.json остаётся пустым.
 *
 * Сами файлы при этом помечены корректно (суффикс `-s.p.woff2` = preload),
 * так что на Linux — в CI, Docker и на Vercel — preload появляется сам.
 * Ничего дополнительно делать не нужно; просто не ищите здесь ошибку.
 */
