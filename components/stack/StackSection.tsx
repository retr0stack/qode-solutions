"use client";

import { Container, Section } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";

/**
 * Стек технологий, поданный как спецификация, а не как облако значков.
 *
 * Раньше здесь были круглые плашки — тот самый набор «пилюль», по которому
 * страницу сразу опознают как шаблонную. Теперь это таблица: слева группа,
 * справа состав, между строками волосяная линия. Так же выглядит техзадание
 * или спека железа, и читается это как инженерный документ.
 *
 * Единственное движение — тонкая градиентная линия, которая раскрывается
 * слева направо при появлении строки. Ничего не мигает и не пульсирует.
 */
export function StackSection() {
  const dict = useDict();

  return (
    <Section id="stack" surface="alt" density="md">
      <Container className="flex flex-col gap-8">
        {/*
          Список технологий спрятан под раскрытие и живёт на странице услуг,
          а не на главной. Владельцу бизнеса перечень «TypeScript / Docker /
          Prisma» не говорит ничего — но тем, кто специально ищет стек
          (технический директор, будущий подрядчик), он нужен целиком.
        */}
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center gap-3">
            <span className="font-display text-title font-bold">{dict.stack.intro.title}</span>
            <span
              aria-hidden="true"
              className="border-line relative flex size-7 shrink-0 items-center justify-center rounded-full border"
            >
              <span className="bg-fg absolute h-px w-3" />
              <span className="bg-fg h-3 w-px transition-transform duration-300 ease-brand group-open:scale-y-0" />
            </span>
          </summary>

          <div className="border-line mt-8 border-t">
          {dict.stack.groups.map((group, index) => (
            <Reveal
              key={group.title}
              delay={index * 0.05}
              className="border-line group relative border-b"
            >
              {/* Линия проявляется под строкой при наведении — единственный отклик. */}
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-[-1px] left-0 h-px origin-left scale-x-0 bg-[image:var(--gradient-brand)] transition-transform duration-500 ease-brand group-hover:scale-x-100"
              />

              <div className="flex flex-col gap-3 py-6 md:flex-row md:items-baseline md:gap-10 md:py-7">
                <p className="text-fg-2 shrink-0 text-caption font-semibold tracking-[0.04em] uppercase md:w-52">
                  {group.title}
                </p>

                {/* Состав группы: моноширинный текст через разделители.
                    Список остаётся списком для скринридера. */}
                <ul className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  {group.items.map((item, itemIndex) => (
                    <li key={item} className="flex items-baseline gap-2 font-mono text-small">
                      {itemIndex > 0 ? (
                        <span aria-hidden="true" className="text-line-strong">
                          /
                        </span>
                      ) : null}
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
          </div>
        </details>
      </Container>
    </Section>
  );
}
