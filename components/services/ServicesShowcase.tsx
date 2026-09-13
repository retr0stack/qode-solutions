"use client";

import { useState } from "react";
import { Container, Heading, Section, Text } from "@/components/primitives";
import { Button, Disclosure } from "@/components/ui";
import { Magnetic, Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";
import { ServiceScene } from "./ServiceScene";

/**
 * Страница услуг.
 *
 * Две раскладки, одни и те же данные:
 *
 *   десктоп  — пять сцен подряд, все позиции видны сразу. Места хватает,
 *              и прятать состав направления за раскрытием незачем.
 *
 *   мобильный — пять свёрнутых аккордеонов. Двадцать пять услуг подряд
 *              крупным текстом на 390px — это восемь экранов прокрутки,
 *              по которым невозможно сориентироваться. В свёрнутом виде
 *              вся страница умещается примерно в полтора экрана, и человек
 *              сам решает, куда углубляться.
 *
 * Открытым может быть одно направление за раз: два раскрытых списка на
 * узком экране возвращают ту же бесконечную ленту.
 */
export function ServicesShowcase() {
  const dict = useDict();
  const { categories } = dict.services;

  /* Все направления свёрнуты изначально: страница услуг — это выбор, а не
     чтение. Открытая по умолчанию вкладка навязывает первый пункт списка. */
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <>
      {/* Мобильная раскладка. */}
      <Section density="sm" className="lg:hidden">
        <Container>
          <div className="border-line border-t">
            {categories.map((category) => (
              <Disclosure
                key={category.slug}
                id={`svc-${category.slug}`}
                dataService={category.slug}
                title={category.title}
                meta={`${category.items.length} ${dict.services.servicesLabel}`}
                open={openSlug === category.slug}
                onToggle={(next) => setOpenSlug(next ? category.slug : null)}
                className="scroll-mt-[calc(var(--header-total)+4rem)]"
              >
                <ul className="flex flex-col gap-5">
                  {category.items.map((item) => (
                    <li key={item.title} className="flex flex-col gap-1">
                      <h4 className="text-[1.0625rem] font-semibold">{item.title}</h4>
                      <p className="flex flex-wrap items-baseline gap-x-3">
                        <span className="text-small font-semibold text-[color:var(--color-accent)] tabular-nums">
                          {item.price}
                        </span>
                        <span className="text-fg-2 text-caption tabular-nums">{item.duration}</span>
                      </p>
                      <Text size="small" className="line-clamp-2">
                        {item.description}
                      </Text>
                    </li>
                  ))}
                </ul>

                {category.note ? (
                  <p className="text-fg-2 mt-5 border-l-2 border-[color:var(--color-accent)] pl-4 text-small">
                    {category.note}
                  </p>
                ) : null}

                <Button href={leadFormHref} variant="secondary" className="mt-6 w-full">
                  {dict.services.closing.cta}
                </Button>
              </Disclosure>
            ))}
          </div>
        </Container>
      </Section>

      {/* Десктопная раскладка. */}
      <Section density="md" className="max-lg:hidden">
        <Container className="flex flex-col gap-[var(--section-md)]">
          {categories.map((category, index) => (
            <ServiceScene
              key={category.slug}
              category={category}
              index={index + 1}
              total={categories.length}
              servicesLabel={dict.services.servicesLabel}
            />
          ))}
        </Container>
      </Section>

      {/* Плашка идёт сразу за последней сценой: отдельная секция с полным
          вертикальным отступом оставляла над ней пустой экран. */}
      <Section density="sm" className="pt-0">
        <Container>
          <Reveal>
            <div className="sky-panel relative overflow-hidden p-8 md:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -right-[10%] -bottom-1/2 size-[30rem] rounded-full bg-[radial-gradient(circle,rgb(124_58_237/0.2),transparent_70%)] blur-[70px] motion-safe:animate-[blob-float_24s_ease-in-out_infinite]"
              />
              <div className="relative flex flex-col gap-6">
                <Heading level={2} size="display-3" className="max-w-[18ch]">
                  {dict.services.closing.title}
                </Heading>
                <Text size="lead" className="max-w-[52ch]">
                  {dict.services.closing.text}
                </Text>
                <Magnetic className="self-start max-sm:w-full">
                  <Button href={leadFormHref} size="lg" className="max-sm:w-full">
                    {dict.services.closing.cta}
                  </Button>
                </Magnetic>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
