"use client";

import { useMemo } from "react";
import { cn } from "@/lib/cn";
import { useActiveSection } from "./useActiveSection";

interface ServicesRailProps {
  categories: readonly { readonly slug: string; readonly title: string }[];
  /** На мобильном тап по чипу ещё и раскрывает нужное направление. */
  onPick?: (slug: string) => void;
  className?: string;
}

/**
 * Горизонтальный рельс направлений. Залипает под шапкой и подсвечивает
 * раздел, который человек сейчас читает.
 *
 * Почему горизонтально, а не колонкой слева: разделов всего пять, а страница
 * стала сценовой — вертикальная колонка отбирала бы у сцен треть ширины.
 * На узких экранах рельс просто прокручивается пальцем.
 */
export function ServicesRail({ categories, onPick, className }: ServicesRailProps) {
  const ids = useMemo(() => categories.map((category) => category.slug), [categories]);
  const active = useActiveSection(ids);

  return (
    <nav
      aria-label="Направления"
      className={cn(
        "sticky top-[calc(var(--header-total))] z-30 -mx-[var(--gutter)] px-[var(--gutter)] py-3",
        className,
      )}
    >
      {/* Перенос вместо прокрутки: пять направлений умещаются в две
          строки даже на 390px, и ни одно не остаётся за краем экрана. */}
      <ul className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const current = active === category.slug;

          return (
            <li key={category.slug}>
              <button
                type="button"
                onClick={() => {
                  onPick?.(category.slug);
                  /* Раскладок две — мобильная и десктопная, — поэтому ищем
                     ту, что сейчас отрисована, а не якорь по id: два
                     одинаковых id в документе были бы ошибкой разметки. */
                  const nodes = document.querySelectorAll<HTMLElement>(
                    `[data-service="${category.slug}"]`,
                  );
                  const visible = Array.from(nodes).find(
                    (node) => node.offsetParent !== null,
                  );
                  visible?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "border-gradient inline-flex items-center rounded-full border px-4 py-2 text-caption font-semibold whitespace-nowrap backdrop-blur-md",
                  "transition-colors duration-300 ease-brand",
                  current
                    ? "border-transparent bg-white text-[color:var(--color-accent)] shadow-card border-gradient-on"
                    : "border-line text-fg-2 bg-white/70 hover:text-fg",
                )}
              >
                {category.title}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
