"use client";

import { cn } from "@/lib/cn";
import { services } from "@/content";
import { useActiveSection } from "./useActiveSection";

const SLUGS = services.map((service) => service.slug);

/**
 * Навигация по разделам услуг.
 *
 * До lg — залипающая горизонтальная лента чипов под шапкой.
 * От lg — колонка слева с подсветкой активного раздела.
 *
 * Родитель обязан быть высоким flex-контейнером с items-start: sticky
 * отсчитывается от containing block, и в короткой grid-ячейке (а на мобильном
 * она равна высоте самой навигации) залипание просто не работало бы.
 * Разметка одна, различается только раскладка: это обычный <nav> со ссылками,
 * поэтому работает и без JS — подсветка просто не двигается.
 */
export function ServicesNav({ className }: { className?: string }) {
  const active = useActiveSection(SLUGS);

  return (
    <nav
      aria-label="Разделы услуг"
      className={cn(
        "bg-paper/90 sticky top-[var(--header-h)] z-30 -mx-[var(--gutter)] backdrop-blur-md",
        "border-line border-b px-[var(--gutter)] py-3",
        "lg:top-[calc(var(--header-h)+3rem)] lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0 lg:backdrop-blur-none",
        className,
      )}
    >
      <ol
        className={cn(
          "no-scrollbar flex gap-2 overflow-x-auto",
          "lg:flex-col lg:gap-0 lg:overflow-visible",
        )}
      >
        {services.map((service, index) => {
          const current = active === service.slug;

          return (
            <li key={service.slug} className="shrink-0 lg:shrink">
              <a
                href={`#${service.slug}`}
                aria-current={current ? "true" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-full px-3.5 py-2 text-small transition-colors duration-200",
                  "lg:border-line lg:rounded-none lg:border-l lg:px-0 lg:py-3.5 lg:pl-5",
                  current
                    ? "border-line bg-paper-2 font-medium lg:bg-transparent"
                    : "text-fg-2 hover:text-fg",
                  current && "lg:border-transparent",
                )}
              >
                {/* Активная засечка — градиентная полоска слева, только на десктопе. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute hidden w-px origin-top bg-[image:var(--gradient-brand)] transition-transform duration-300 ease-brand",
                    "lg:relative lg:block lg:h-6 lg:-ml-5",
                    current ? "lg:scale-y-100" : "lg:scale-y-0",
                  )}
                />
                {/* shrink-0: иначе при переносе названия номер разрывался
                    на две строки. Без opacity: приглушение прозрачностью
                    давало 2.56:1 — вторичность задаёт токен --color-fg-2. */}
                <span className="text-fg-2 shrink-0 font-mono text-caption tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="whitespace-nowrap lg:whitespace-normal">
                  {service.section}
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
