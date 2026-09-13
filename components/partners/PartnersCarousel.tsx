"use client";

import { useEffect, useRef, useState } from "react";
import { Container, Section } from "@/components/primitives";
import { useDict } from "@/components/i18n";

/**
 * Карусель партнёров.
 *
 * Движение — не скролл, а непрерывный цикл: массив плиток продублирован,
 * трек едет ровно на половину своей ширины, поэтому на стыке нет рывка и
 * не нужен ни JavaScript, ни вычисление ширин.
 *
 * Логотипов у партнёров пока нет, поэтому плитка показывает название
 * крупным шрифтом. Когда логотипы появятся, сюда встанет next/image —
 * размер плитки менять не придётся.
 *
 * Наведение останавливает движение: иначе прочитать подпись можно только
 * успев за ней. На узких экранах автопрокрутка выключена и остаётся
 * обычный свайп со snap — перехватывать жест на телефоне незачем.
 */
export function PartnersCarousel() {
  const dict = useDict();
  const items = dict.partners.items;

  const viewportRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  /* Активная точка считается от позиции свайпа. Слушатель вешается на
     сам трек, а не на окно: вертикальная прокрутка страницы к нему
     отношения не имеет. */
  useEffect(() => {
    const node = viewportRef.current;
    if (!node) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = node.scrollWidth - node.clientWidth;
        const progress = max > 0 ? node.scrollLeft / max : 0;
        setActive(Math.min(items.length - 1, Math.max(0, Math.round(progress * (items.length - 1)))));
      });
    };

    node.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      node.removeEventListener("scroll", onScroll);
    };
  }, [items.length]);

  return (
    <Section density="md">
      {/* Туман по краям: плитки уезжают, а не обрезаются линией. */}
      <div className="marquee-pausable relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div
          ref={viewportRef}
          className="partners-track flex w-max gap-4 px-[var(--gutter)] max-lg:no-scrollbar max-lg:w-auto max-lg:snap-x max-lg:snap-mandatory max-lg:overflow-x-auto lg:gap-6">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              // Вторая копия дублирует первую: она нужна циклу, но не читалке.
              aria-hidden={copy === 1 ? "true" : undefined}
              className="flex shrink-0 gap-4 lg:gap-6"
            >
              {items.map((partner) => (
                <li
                  key={`${copy}-${partner.slug}`}
                  className="flex w-[72vw] shrink-0 snap-center flex-col gap-4 sm:w-[17.5rem] lg:w-[17.5rem] lg:snap-align-none"
                >
                  <div className="sky-panel flex aspect-square w-full items-center justify-center p-6 text-center">
                    <span className="font-display text-[clamp(1.5rem,4vw,2rem)] leading-tight font-bold">
                      {partner.name}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="font-display text-title font-bold">{partner.name}</h3>
                    <p className="text-fg-2 text-caption">{partner.field}</p>
                    <p className="text-fg-2 text-caption">{partner.country}</p>
                  </div>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* Индикаторы: сколько плиток и где мы сейчас. Нужны только там, где
          лента листается пальцем, – на десктопе она едет сама. */}
      <Container className="mt-6 lg:hidden">
        <ul className="flex justify-center gap-2" aria-hidden="true">
          {items.map((partner, index) => (
            <li
              key={partner.slug}
              className={
                index === active
                  ? "h-1.5 w-6 rounded-full bg-[image:var(--gradient-brand)] transition-all duration-300"
                  : "bg-line h-1.5 w-1.5 rounded-full transition-all duration-300"
              }
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
