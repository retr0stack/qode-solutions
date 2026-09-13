"use client";

import { Container, Eyebrow, Heading, Section, Text } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";

/**
 * Блок отличий. Три пункта в крупной типографике, без карточек и рамок —
 * после плотной горизонтальной сцены нужна пауза, а не ещё одна сетка.
 */
export function AdvantagesSection() {
  const dict = useDict();

  return (
    <Section id="advantages" density="lg">
      <Container>
        <div className="grid-12 gap-y-14">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-total)+2rem)]">
              <Eyebrow>{dict.advantages.intro.eyebrow}</Eyebrow>
              <Heading level={2} size="display-2" className="max-w-[16ch]">
                {dict.advantages.intro.title}
              </Heading>
            </div>
          </div>

          <ol className="col-span-4 flex flex-col md:col-span-8 lg:col-span-7 lg:col-start-6">
            {dict.advantages.items.map((advantage, index) => (
              <Reveal
                as="li"
                key={advantage.title}
                delay={index * 0.06}
                className="border-line border-t py-8 first:border-t-0 first:pt-0 md:py-10"
              >
                <div className="flex flex-col gap-4 md:flex-row md:gap-10">
                  <span
                    aria-hidden="true"
                    className="text-gradient font-display text-title font-bold tabular-nums md:w-16"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex flex-col gap-3">
                    <Heading level={3} size="display-3">
                      {advantage.title}
                    </Heading>
                    <Text size="lead" className="max-w-[46ch]">
                      {advantage.description}
                    </Text>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
