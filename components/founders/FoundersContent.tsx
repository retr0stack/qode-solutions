"use client";

import {
  Container,
  Heading,
  Section,
  SectionIntroBlock,
  Text,
} from "@/components/primitives";
import { Button } from "@/components/ui";
import { GradientBlobs, Magnetic, Reveal } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";
import { FounderPanel } from "./FounderPanel";
import { StoryDeck } from "./StoryDeck";

/**
 * Страница основателей: сверху две биографии, ниже — история агентства,
 * которую читают прокруткой.
 *
 * Порядок намеренный: сначала люди, потом причина, по которой они собрались.
 * Так страница читается как рассказ, а не как раздел «о нас».
 */
export function FoundersContent() {
  const dict = useDict();

  return (
    <>
      {/* Две половины экрана: Александр слева, Мухаммад справа. На узких
          экранах колонки встают друг под друга, порядок сохраняется. */}
      <section
        aria-label={dict.founders.intro.title}
        className="relative grid lg:grid-cols-2"
      >
        {dict.founders.people.map((founder, index) => (
          <FounderPanel key={founder.slug} founder={founder} index={index} />
        ))}

        {/*
          Указатель прокрутки принадлежит секции, а не отдельному портрету.
          Внутри панели он вставал по центру своей половины: на десктопе
          оказывался сбоку, а на телефоне ложился прямо на подпись. Здесь
          он стоит по центру всей ширины и ровно у нижней кромки первого
          экрана – отсчёт от 100svh минус собственная высота.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[calc(100svh-3.5rem)] left-1/2 z-[3] -translate-x-1/2"
        >
          <span className="flex flex-col items-center gap-1.5 text-caption text-[color:var(--color-muted)]">
            {dict.hero.scrollHint}
            <svg
              viewBox="0 0 24 24"
              className="size-4 motion-safe:animate-[scroll-nudge_1.8s_ease-in-out_infinite]"
            >
              <path
                d="M12 5v14M5 13l7 7 7-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </section>

      {/* История. overflow здесь нельзя: ScrollTrigger пинит сцену через
          position: fixed, и предок с overflow обрезал бы её. */}
      <Section density="md" surface="none" className="relative">
        <div data-surface="sky" className="absolute inset-0 -z-10 overflow-hidden">
          <GradientBlobs />
        </div>

        <Container className="relative mb-10">
          <SectionIntroBlock intro={dict.founders.storyIntro} />
        </Container>

        <Container className="relative">
          <StoryDeck chapters={dict.founders.chapters} />
        </Container>
      </Section>

      <Section density="md">
        <Container>
          <Reveal>
            <div className="sky-panel relative overflow-hidden p-8 md:p-12">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 -left-[8%] size-[28rem] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.24),transparent_70%)] blur-[70px] motion-safe:animate-[aurora-drift_23s_ease-in-out_infinite]"
              />
              <div className="relative flex flex-col gap-6">
                <Heading level={2} size="display-3" className="max-w-[18ch]">
                  {dict.founders.outro.title}
                </Heading>
                <Text size="lead" className="max-w-[52ch]">
                  {dict.founders.outro.text}
                </Text>
                <Magnetic className="self-start">
                  <Button href={leadFormHref} size="lg">
                    {dict.founders.outro.cta}
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
