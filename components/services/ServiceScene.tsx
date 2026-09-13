"use client";

import { useId } from "react";
import { Heading, Text } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import type { DictServiceCategory } from "@/content/i18n";

interface ServiceSceneProps {
  category: DictServiceCategory;
  /** Порядковый номер направления — их действительно ровно пять. */
  index: number;
  total: number;
  servicesLabel: string;
}

/**
 * Направление услуг, поданное как разворот меню.
 *
 * Всё видно сразу: раскрывать, переключать и догадываться, что скрыто за
 * плюсом, не нужно. Человек, который зашёл выбрать услугу, должен прочитать
 * весь состав направления одним взглядом — как позиции в меню, где название
 * и описание стоят рядом, а не прячутся за аккордеоном.
 *
 * Раскладка: слева шапка направления, справа две колонки позиций. Позиции
 * разделены волосяными линиями; номер позиции набран моноширинным, поэтому
 * колонка держит вертикальный ритм независимо от длины названия.
 */
export function ServiceScene({
  category,
  index,
  total,
  servicesLabel,
}: ServiceSceneProps) {
  const baseId = useId();

  return (
    <section
      id={category.slug}
      data-service={category.slug}
      aria-labelledby={`${baseId}-title`}
      className="scroll-mt-[calc(var(--header-total)+5rem)]"
    >
      {/* Шапка направления. */}
      <Reveal className="border-line flex flex-col gap-4 border-b pb-8 md:flex-row md:items-end md:justify-between md:gap-12">
        <div className="flex flex-col gap-3">
          <p className="text-fg-2 font-mono text-caption tabular-nums">
            {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
          <Heading id={`${baseId}-title`} level={2} size="display-2">
            {category.title}
          </Heading>
        </div>

        <div className="flex flex-col gap-2 md:max-w-[34ch] md:text-right">
          <Text size="lead">{category.tagline}</Text>
          <p className="text-fg-2 text-caption tabular-nums">
            {category.items.length} {servicesLabel}
          </p>
        </div>
      </Reveal>

      {/* Позиции. Двухколоночная сетка на широких экранах, одна – на узких. */}
      <ol className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-[var(--gutter)]">
        {category.items.map((item, itemIndex) => (
          <Reveal
            as="li"
            key={item.title}
            delay={Math.min(itemIndex, 5) * 0.05}
            className="border-line group border-b"
          >
            <div className="flex gap-5 py-6 md:gap-7 md:py-7">
              <span
                aria-hidden="true"
                className="text-fg-2 shrink-0 pt-1 font-mono text-caption tabular-nums transition-colors duration-300 group-hover:text-[color:var(--color-accent)]"
              >
                {String(index).padStart(2, "0")}.{itemIndex + 1}
              </span>

              <div className="flex flex-col gap-2">
                <Heading level={3} size="title">
                  {item.title}
                </Heading>

                {/* Цена и срок сразу под названием: это первое, что
                    спрашивают, и ради этого не должно быть отдельной
                    страницы прайса. */}
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-small font-semibold text-[color:var(--color-accent)] tabular-nums">
                    {item.price}
                  </span>
                  <span className="text-fg-2 text-caption tabular-nums">{item.duration}</span>
                </p>

                <Text size="small" className="max-w-[46ch]">
                  {item.description}
                </Text>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      {category.note ? (
        <Reveal className="pt-8">
          <p className="text-fg-2 max-w-[72ch] border-l-2 border-[color:var(--color-accent)] pl-5 text-small">
            {category.note}
          </p>
        </Reveal>
      ) : null}
    </section>
  );
}
