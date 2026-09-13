"use client";

import { Container, Section, SectionIntroBlock } from "@/components/primitives";
import { Stagger, StaggerItem } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { DirectionCard } from "./DirectionCard";

/**
 * Направления. «Сайты» занимает половину сетки и обе строки — это основное
 * направление, и композиция говорит об этом раньше, чем текст.
 */
export function DirectionsSection() {
  const dict = useDict();

  return (
    <Section id="directions" density="lg">
      <Container className="flex flex-col gap-14">
        <SectionIntroBlock intro={dict.directions.intro} />

        {/* Все направления равны по весу: выделять «Сайты» крупной плиткой
            значит подсказывать клиенту ответ до того, как он описал задачу. */}
        <Stagger step={0.07} className="grid-12 gap-y-[var(--gutter)]">
          {dict.directions.items.map((card, index) => (
            <StaggerItem key={card.slug} className="col-span-4 md:col-span-4 lg:col-span-4">
              <DirectionCard
                card={card}
                moreLabel={dict.common.more}
                index={index}
                className="h-full"
              />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </Section>
  );
}
