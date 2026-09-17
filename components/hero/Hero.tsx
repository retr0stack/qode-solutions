"use client";

import { useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { Container, Heading, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { FadeIn, Magnetic, SplitText } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";
import { HeroBackdrop } from "./HeroBackdrop";
import { HeroLogo } from "./HeroLogo";
import { ScrollHint } from "./ScrollHint";

/**
 * Первый экран. Светлая зона на всю высоту вьюпорта.
 *
 * Текст лежит в семи колонках из двенадцати, знак — справа за ними: так они
 * не пересекаются ни на одной ширине. До lg знак стоит сверху, а текст
 * начинается под ним.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const dict = useDict();

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[calc(var(--header-total)+1rem)] pb-[var(--section-sm)]"
    >
      <HeroBackdrop />

      {/* Мобильный фон: знак уходит за правый край, движение выключено –
          покачивание за текстом мешало бы читать заголовок. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-[18%] -right-[28%] z-0 w-[140%] opacity-[0.16] lg:hidden"
      >
        <Image
          src="/logo_q.webp"
          alt=""
          width={1254}
          height={1254}
          priority
          quality={90}
          className="h-auto w-full"
        />
      </div>

      <Container width="wide" className="relative z-10">
        <div className="grid-12 items-center gap-y-10">
          <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-7 lg:pr-6">
            <Heading level={1} id="hero-title" size="display-1">
              <SplitText text={dict.hero.title} delay={0.14} />
            </Heading>

            <FadeIn delay={0.5}>
              <Text size="lead" className="max-w-[46ch]">
                {dict.hero.subtitle}
              </Text>
            </FadeIn>

            {/* На телефоне обе кнопки во всю ширину и в столбик: попасть
                пальцем в кнопку по центру экрана проще, чем в узкую
                капсулу, а первая из них – сразу основное действие. */}
            <FadeIn delay={0.68} className="mt-1 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Magnetic className="w-full sm:w-auto">
                <Button href={leadFormHref} size="lg" className="w-full sm:w-auto">
                  {dict.hero.primaryCta}
                </Button>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto">
                <Button
                  href="/portfolio"
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {dict.hero.secondaryCta}
                </Button>
              </Magnetic>
            </FadeIn>

            <FadeIn delay={0.8}>
              {/*
                Жёсткая сетка, а не flex-wrap: при автоширине двухстрочная
                подпись («услуг в пяти направлениях») растягивала свою
                ячейку и сбивала весь ряд. Теперь каждая метрика стоит в
                своей колонке, а min-height подписи держит базовую линию.
              */}
              <dl className="border-line mt-2 grid grid-cols-2 items-start gap-x-5 gap-y-7 border-t pt-6 lg:grid-cols-4">
                {dict.hero.stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    {/*
                      Значение не переносится: «Европейские» в колонке
                      шириной в четверть блока рвалось по последней букве.
                      Кегль подобран clamp-ом под самое длинное значение,
                      поэтому строка держится целиком на любой ширине.
                    */}
                    <dt className="text-gradient font-display text-[clamp(1.125rem,1.5vw,1.5rem)] leading-tight font-bold whitespace-nowrap tabular-nums">
                      {stat.value}
                    </dt>
                    <dd className="text-fg-2 min-h-10 max-w-[20ch] text-caption whitespace-pre-line">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </FadeIn>

            {/* Покрытие: обычная строка под цифрами. Плашки и значки здесь
                выглядели рекламным шаблоном, а факт важнее оформления. */}
            <FadeIn delay={0.86}>
              <p className="text-fg-2 text-caption">{dict.hero.coverage}</p>
            </FadeIn>

          </div>

          {/*
            Знак. С lg – полноценный столбец справа со всей сценой движения.
            До lg он уходит в фон: висел отдельным блоком над текстом и
            забирал у оффера целый экран, из-за чего кнопки оказывались за
            сгибом. Фоном бренд присутствует, но место не отнимает.
          */}
          <div
            className={cn(
              "hidden lg:col-span-5 lg:block",
              "mx-auto w-full max-w-[36rem]",
            )}
          >
            <HeroLogo section={sectionRef} />
          </div>
        </div>
      </Container>

      {/* Индикатор прокрутки: по центру нижней кромки первого экрана,
          вне текстовой колонки – он относится ко всей странице, а не
          к последнему абзацу. */}
      <FadeIn
        delay={0.95}
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 hidden justify-center md:flex"
      >
        <ScrollHint />
      </FadeIn>
    </section>
  );
}
