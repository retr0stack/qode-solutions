"use client";

import { Container, Section, SectionIntroBlock } from "@/components/primitives";
import { Button } from "@/components/ui";
import { useDict } from "@/components/i18n";
import { contacts } from "@/content";
import { FaqAccordion } from "./FaqAccordion";

/** Вопросы и ответы. Те же данные уходят в разметку FAQPage (lib/schema.ts). */
export function FaqSection() {
  const dict = useDict();

  return (
    <Section id="faq" density="lg">
      <Container>
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-8 lg:col-span-4">
            <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-total)+2rem)]">
              <SectionIntroBlock intro={dict.faq.intro} />
              <Button href={contacts.emailHref} variant="ghost">
                {dict.faq.notFound}
              </Button>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-6">
            <FaqAccordion items={dict.faq.items} />
          </div>
        </div>
      </Container>
    </Section>
  );
}
