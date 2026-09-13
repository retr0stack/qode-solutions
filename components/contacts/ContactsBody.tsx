"use client";

import { Container, Heading, Section, Text } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import { LeadForm } from "@/components/forms";
import { useDict } from "@/components/i18n";
import { ContactChannels } from "./ContactChannels";

/**
 * Контакты.
 *
 * Заголовок вынесен над сеткой на всю ширину, поэтому обе колонки
 * начинаются с одной линии. Раньше он жил внутри левой колонки, а правая
 * стартовала сразу с кнопки — и колонки выглядели сдвинутыми по вертикали.
 *
 * На телефоне порядок другой: кнопка WhatsApp идёт первой, потом форма,
 * потом свёрнутые справочные блоки. Самое быстрое действие — выше всего.
 */
export function ContactsBody() {
  const dict = useDict();

  return (
    <Section density="lg">
      <Container>
        {/* Заголовок внутри левой колонки: правая должна начинаться от той
            же верхней кромки, а не от первого поля формы. */}
        <div className="grid-12 items-start gap-y-12">
          {/*
            Порядок в разметке: форма, затем каналы. На телефоне каналы
            поднимаются наверх через order, на десктопе обе колонки жёстко
            стоят в первой строке сетки – без row-start авторазмещение
            сбрасывало форму на следующую строку и оставляло между
            заголовком и первым полем пустой экран.
          */}
          <div className="col-span-4 flex flex-col gap-10 md:col-span-8 lg:col-span-7 lg:row-start-1">
            <header className="flex flex-col gap-3">
              <Heading level={2} size="display-3">
                {dict.form.title}
              </Heading>
              <Text size="lead" className="max-w-[48ch]">
                {dict.form.lead}
              </Text>
            </header>

            <Reveal>
              <LeadForm variant="full" />
            </Reveal>
          </div>

          {/*
            Каналы связи идут одним блоком в той же строке сетки, что и
            форма. Раньше они были разрезаны на две ячейки, и вторая
            попадала во вторую строку – а та начинается только после
            высокой формы. Из-за этого почта, соцсети и география
            оказывались в самом низу страницы.
          */}
          <Reveal
            delay={0.1}
            className="col-span-4 -order-1 md:col-span-8 lg:order-none lg:col-span-4 lg:col-start-9 lg:row-start-1"
          >
            <ContactChannels />
          </Reveal>

        </div>
      </Container>
    </Section>
  );
}
