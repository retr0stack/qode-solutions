"use client";

import { Container, Heading, Section, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { Magnetic, Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";

/**
 * Бренды, с которыми работали.
 *
 * Список, а не карточки: перечень — это перечень, и рисовать под каждый
 * бренд плитку с плашкой значило бы раздувать шесть строк на два экрана.
 *
 * Нумерации нет намеренно — порядок здесь ничего не значит. Вместо неё
 * ритм держит код страны в левой колонке.
 *
 * Каждая строка — внешняя ссылка на сайт бренда. Чем именно мы помогали,
 * на странице не раскрывается.
 */
export function PartnersGrid() {
  const dict = useDict();

  return (
    <>
      <Section density="md">
        <Container>
          <ul className="border-line border-t">
            {dict.partners.items.map((partner, index) => (
              <Reveal
                as="li"
                key={partner.slug}
                delay={Math.min(index, 5) * 0.05}
                className="border-line border-b"
              >
                <a
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative block"
                >
                  {/* Подсветка строки и градиентная линия под ней. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-[calc(var(--gutter)*-0.5)] inset-y-0 rounded-md bg-[color:var(--color-paper-4)] opacity-0 transition-opacity duration-300 ease-brand group-hover:opacity-100"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-[-1px] left-0 h-px origin-left scale-x-0 bg-[image:var(--gradient-brand)] transition-transform duration-500 ease-brand group-hover:scale-x-100"
                  />

                  <div className="relative grid-12 items-baseline gap-y-2 py-7 md:py-8">
                    <span className="text-fg-2 col-span-4 font-mono text-caption tracking-[0.08em] md:col-span-1">
                      {partner.countryCode}
                    </span>

                    <Heading
                      level={2}
                      size="display-3"
                      className="col-span-4 transition-transform duration-400 ease-brand md:col-span-4 lg:col-span-5 motion-safe:group-hover:translate-x-1"
                    >
                      {partner.name}
                    </Heading>

                    <span className="text-fg-2 col-span-4 text-small md:col-span-3 lg:col-span-3">
                      {partner.field}
                    </span>

                    <span className="text-fg-2 col-span-4 flex items-baseline gap-3 text-small md:col-span-4 lg:col-span-3 lg:justify-end">
                      {partner.country}
                      <span
                        aria-hidden="true"
                        className="text-[color:var(--color-blue-ink)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      >
                        ↗
                      </span>
                    </span>
                  </div>
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Section density="md">
        <Container>
          <Reveal>
            <div className="sky-panel relative overflow-hidden p-8 md:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 right-0 size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.24),transparent_70%)] blur-[70px] motion-safe:animate-[aurora-drift_22s_ease-in-out_infinite]"
              />
              <div className="relative flex flex-col gap-6">
                <Heading level={2} size="display-3" className="max-w-[20ch]">
                  {dict.partners.outro.title}
                </Heading>
                <Text size="lead" className="max-w-[52ch]">
                  {dict.partners.outro.text}
                </Text>
                <Magnetic className="self-start">
                  <Button href={leadFormHref} size="lg">
                    {dict.partners.outro.cta}
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
