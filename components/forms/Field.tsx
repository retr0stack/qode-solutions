import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: (props: {
    id: string;
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
    className: string;
  }) => ReactNode;
}

/** Классы контрола. Граница --color-line-strong держит 3:1 (WCAG 1.4.11). */
/*
 * Цвета контрола заданы явно, а не через семантические токены.
 *
 * Секция заявки стоит в тёмной зоне, где --color-fg переопределён в белый.
 * Поле при этом остаётся белым — и текст, который человек печатает,
 * оказывался белым на белом. Плейсхолдер по той же причине сливался с
 * фоном. Внутри поля фон всегда светлый, поэтому и текст всегда тёмный:
 * ink на белом — 16.6:1, плейсхолдер fg-soft — 4.8:1.
 */
export const CONTROL_CLASS = cn(
  "w-full rounded-md border border-[color:var(--color-paper-3)] bg-[color:var(--color-paper)]",
  "text-[color:var(--color-ink)] placeholder:text-[color:var(--color-fg-soft)]",
  /* Высота фиксированная: одноколоночные и двухколоночные поля обязаны
     совпадать по высоте, иначе строка расползается. Textarea переопределяет
     min-height у себя. 16px шрифта – иначе iOS зумит страницу при фокусе. */
  "min-h-[52px] px-4 py-3 text-[1rem]",
  "transition-[border-color,box-shadow] duration-200 ease-brand",
  "hover:border-[color:var(--color-line-strong)]",
  "focus:border-[color:var(--color-accent)] focus:outline-none",
  "focus:shadow-[0_0_0_4px_rgb(22_104_227/0.12)]",
  "aria-[invalid=true]:border-danger",
);

/**
 * Обёртка для <select>: системная стрелка выбивается из набора полей,
 * поэтому прячем её и рисуем свой шеврон. Обычный SVG, а не фоновый
 * data-URI: в произвольном классе Tailwind такая строка не переживает
 * экранирование кавычек и молча не применяется.
 */
export function SelectShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 12 8"
        fill="none"
        className="text-fg-2 pointer-events-none absolute top-1/2 right-4 h-2 w-3 -translate-y-1/2"
      >
        <path
          d="M1 1.5 6 6.5l5-5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/**
 * Обёртка поля: подпись, подсказка и ошибка связаны с контролом
 * через aria-describedby, ошибка объявляется как role="alert".
 * Сам контрол рендерит вызывающий — так поле не знает про react-hook-form.
 */
export function Field({ id, label, hint, error, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [errorId, hintId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-small font-medium">
        {label}
      </label>

      {children({
        id,
        "aria-invalid": Boolean(error),
        "aria-describedby": describedBy,
        className: CONTROL_CLASS,
      })}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-danger text-caption"
        >
          {error}
        </p>
      ) : null}

      {hint && !error ? (
        <p id={hintId} className="text-fg-2 text-caption">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
