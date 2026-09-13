"use client";

import { Container, Heading, Section, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { InkBackdrop, Magnetic, Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { contacts } from "@/content";
import { track } from "@/lib/analytics";

/**
 * Закрывающая плашка портфолио.
 *
 * Тёмная зона в конце светлой страницы: здесь объясняется, почему работ на
 * странице меньше, чем их есть, и предлагается способ увидеть остальные.
 *
 * Раскладка развёрнута в два ряда вместо прежней строки с кнопкой справа:
 * заголовок крупнее, текст шире, кнопка стоит под ними и не жмётся к краю.
 * Так блок читается как обращение, а не как баннер.
 *
 * Текст в WhatsApp предзаполнен под этот сценарий: человек приходит в
 * переписку с готовым запросом, а не с пустым «Здравствуйте».
 */
export function PortfolioNda() {
  const dict = useDict();

  const href = `https://wa.me/${contacts.whatsapp}?text=${encodeURIComponent(
    dict.portfolioNda.whatsappText,
  )}`;

  return (
    <Section surface="dark" density="lg" className="relative overflow-hidden">
      <InkBackdrop />

      <Container className="relative">
        <Reveal className="flex flex-col gap-7">
          <span
            aria-hidden="true"
            className="h-1 w-16 rounded-full bg-[image:var(--gradient-brand)]"
          />

          <Heading level={2} size="display-2" className="max-w-[14ch]">
            {dict.portfolioNda.title}
          </Heading>

          <Text size="lead" className="max-w-[62ch]">
            {dict.portfolioNda.text}
          </Text>

          <Magnetic className="self-start max-sm:w-full">
            <Button
              href={href}
              size="lg"
              onClick={() => track("whatsapp_click")}
              className="max-sm:w-full"
            >
              {dict.portfolioNda.cta}
            </Button>
          </Magnetic>
        </Reveal>
      </Container>
    </Section>
  );
}
