"use client";

import { useDict } from "@/components/i18n";

/**
 * Индикатор прокрутки внизу первого экрана.
 *
 * Только знак, без подписи «листайте»: стилизованная мышь с бегущим внутри
 * колесиком читается сама по себе, а плашка с текстом занимала место и
 * выглядела инструкцией к сайту.
 *
 * Подпись остаётся для скринридеров в sr-only — знак декоративный, но
 * смысл у него есть.
 */
export function ScrollHint() {
  const dict = useDict();

  return (
    <span className="flex flex-col items-center gap-2">
      <span
        aria-hidden="true"
        className="border-line-strong/60 relative block h-9 w-[1.375rem] rounded-full border"
      >
        <span className="absolute left-1/2 top-1.5 size-1.5 rounded-full bg-[image:var(--gradient-brand)] motion-safe:animate-[scroll-hint_2.4s_var(--ease-in-out-quart)_infinite]" />
      </span>

      {/* Вторая, едва заметная стрелка-шеврон – направление движения. */}
      <span
        aria-hidden="true"
        className="text-line-strong/70 block motion-safe:animate-[scroll-chevron_2.4s_var(--ease-in-out-quart)_infinite]"
      >
        <svg viewBox="0 0 16 10" className="h-2 w-4" fill="none">
          <path
            d="M1 1l7 7 7-7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      <span className="sr-only">{dict.hero.scrollHint}</span>
    </span>
  );
}
