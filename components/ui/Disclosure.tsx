"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DisclosureProps {
  title: string;
  /** Подпись справа от заголовка: счётчик, вилка цены, что угодно короткое. */
  meta?: string;
  defaultOpen?: boolean;
  /** Управляемый режим — когда открытым должен быть ровно один блок. */
  open?: boolean;
  onToggle?: (open: boolean) => void;
  id?: string;
  /** Метка для навигации: по ней рельс находит нужный блок. */
  dataService?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Раскрывающийся блок.
 *
 * Высота анимируется через grid-template-rows 0fr → 1fr: содержимое не
 * нужно измерять, скачка на первом кадре нет, и работает это одинаково
 * для списка из трёх строк и из двадцати.
 *
 * Начальное состояние — видимое содержимое, скрытое атрибутом hidden
 * только после гидратации. Важно, что контент лежит в разметке всегда:
 * при отключённом JS и для поисковика он остаётся на месте.
 *
 * Работает и как самостоятельный компонент (defaultOpen), и как
 * управляемый (open + onToggle) — второй режим нужен там, где открытым
 * может быть ровно один раздел.
 */
export function Disclosure({
  title,
  meta,
  defaultOpen = false,
  open,
  onToggle,
  id,
  dataService,
  className,
  children,
}: DisclosureProps) {
  const generatedId = useId();
  const panelId = `${id ?? generatedId}-panel`;
  const buttonId = `${id ?? generatedId}-button`;

  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = open ?? uncontrolled;

  const toggle = () => {
    const next = !isOpen;
    if (open === undefined) setUncontrolled(next);
    onToggle?.(next);
  };

  return (
    <div data-service={dataService} className={cn("border-line border-b", className)}>
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={toggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left"
        >
          <span className="flex flex-col gap-1">
            <span className="font-display text-title font-bold">{title}</span>
            {meta ? <span className="text-fg-2 text-caption">{meta}</span> : null}
          </span>

          {/* Плюс поворачивается в крестик – состояние читается без текста. */}
          <span
            aria-hidden="true"
            className={cn(
              "border-line relative flex size-8 shrink-0 items-center justify-center rounded-full border",
              "transition-transform duration-240 ease-brand",
              isOpen && "rotate-45 border-[color:var(--color-accent)]",
            )}
          >
            <span className="bg-fg absolute h-px w-3.5" />
            <span className="bg-fg absolute h-3.5 w-px" />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={cn(
          "grid transition-[grid-template-rows] duration-240 ease-brand",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="pb-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
