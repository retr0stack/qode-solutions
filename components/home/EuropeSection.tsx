"use client";

import {
  Container,
  Eyebrow,
  Heading,
  Section,
  Text,
} from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { GradientBlobs } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { TeamPreview } from "./TeamPreview";

/**
 * «Разработку ведут инженеры с европейским опытом».
 *
 * Стоит сразу после первого экрана и выбивается из ленты одной светло-голубой
 * полосой: аргумент про инженерную дисциплину — главное отличие агентства на
 * местном рынке, поэтому он получает отдельную сцену, а не пункт в списке.
 *
 * Ни плашек с точкой, ни бегущей строки здесь нет намеренно: такие элементы
 * читаются как рекламный шаблон и обесценивают сам довод.
 */
export function EuropeSection() {
  const dict = useDict();



  return (
    <Section
      id="europe"
      density="lg"
      surface="none"
      className="overflow-hidden"
      ariaLabel={dict.europe.title}
    >
      <div data-surface="sky" className="absolute inset-0 -z-10">
        <GradientBlobs />
      </div>

      <Container className="relative flex flex-col gap-14">
        <div className="grid-12 items-start gap-y-12">
          <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-7">
            <Reveal>
              <Eyebrow>{dict.europe.eyebrow}</Eyebrow>
            </Reveal>

            <Reveal delay={0.06}>
              {/* text-balance разводит строки поровну, max-w держит их в двух. */}
              <Heading level={2} size="display-2" className="max-w-[18ch] text-balance">
                {dict.europe.title}
              </Heading>
            </Reveal>

            <Reveal delay={0.12}>
              <Text size="lead" className="max-w-[48ch]">
                {dict.europe.lead}
              </Text>
            </Reveal>

          </div>

          {/* Лица вместо абзацев о качестве: довод «работают конкретные
              инженеры, вы пишете им напрямую» доказывается людьми. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-12">
            <TeamPreview />
          </div>
        </div>
      </Container>

    </Section>
  );
}
