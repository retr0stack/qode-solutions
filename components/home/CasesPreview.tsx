"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Container, Heading, Section, SectionIntroBlock, Text } from "@/components/primitives";
import { DriftWall } from "@/components/reactbits";

import { useIsDesktop } from "@/lib/hooks";
import { useCases, useDict } from "@/components/i18n";

/**
 * Превью кейсов на главной.
 *
 * Стена плиток дрейфует сама, а описание живёт отдельной панелью рядом:
 * подписать каждую движущуюся плитку невозможно — текст на ней не
 * прочитать, пока она едет. Наведение или фокус на плитке подменяет
 * содержимое панели, и в ней уже нормальная типографика.
 *
 * Пока плитка не выбрана, панель показывает первый проект: пустая панель
 * рядом с живой стеной выглядит как незагрузившийся блок.
 *
 * На телефоне стена ниже и колонок меньше — иначе плитки становятся
 * нечитаемыми полосками, а панель уезжает за пределы экрана. Раскладка
 * вертикальная: сначала стена, под ней описание.
 */
export function CasesPreview() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const isDesktop = useIsDesktop();
  const dict = useDict();
  const cases = useCases();

  /* Подсказка разная для курсора и пальца: «наведите» на телефоне
     звучит как издёвка. */
  const hint = isDesktop
    ? { title: dict.portfolioHint.hoverTitle, text: dict.portfolioHint.hoverText }
    : { title: dict.portfolioHint.tapTitle, text: dict.portfolioHint.tapText };

  const items = useMemo(
    () =>
      cases.map((project) => ({
        id: project.slug,
        image: project.cover,
        /* Заливка остаётся подложкой: пока файла обложки нет, плитка
           показывает фирменный градиент, а не пустой прямоугольник. */
        fallback: tileDataUri(project.palette[0], project.palette[1], project.client),
        title: project.title,
      })),
    [cases],
  );

  /* Ничего не выбрано при входе: подсвечивать первый проект значит
     подсказывать, будто он важнее остальных. Пока выбора нет, панель
     показывает подсказку – как со стеной взаимодействовать. */
  const active = cases.find((project) => project.slug === activeId) ?? null;

  return (
    <Section density="md">
      <Container className="flex flex-col gap-10">
        {/* Без заголовка стена читалась как непонятная декорация: человек
            не понимал, что перед ним работы, а не фоновая анимация. */}
        <SectionIntroBlock intro={dict.cases.intro} />

        <div className="grid-12 items-center gap-y-10">
          {/*
            Стена вылезает за левый край контейнера отрицательным отступом:
            плоскость повёрнута в 3D, её левая часть уходит в перспективу
            и в габаритах всё равно не читается. Так сцена становится
            заметно крупнее, а справа остаётся место под текст.
          */}
          <div className="col-span-4 md:col-span-8 lg:col-span-7">
            <div className="-mx-[var(--gutter)] h-[30rem] sm:h-[34rem] lg:mr-0 lg:-ml-[10%] lg:h-[46rem] lg:w-[110%]">
              <DriftWall
                items={items}
                columns={3}
                tileWidth={168}
                tileHeight={112}
                speed={30}
                tilt={12}
                turn={-10}
                onActiveChange={setActiveId}
                label={dict.cases.intro.eyebrow}
                className="lg:[--dw-tile-h:150px] lg:[--dw-tile-w:240px]"
              />
            </div>
          </div>

          {/* Панель описания. Высота не прыгает при смене проекта:
              строки текста ограничены, а блок стоит по центру колонки. */}
          {/* Колонка шире прежнего и заголовок на ступень мельче: в четырёх
              колонках display-3 разбивался на пять-шесть строк и скакал
              по высоте при каждом наведении. */}
          <div className="col-span-4 md:col-span-8 lg:col-span-5 lg:col-start-8">
            <div className="flex min-h-[15rem] flex-col gap-3" aria-live="polite">
              {active ? (
                <>
                  <p className="text-fg-2 text-caption font-medium tracking-[0.02em] tabular-nums">
                    {active.year} · {active.client} · {active.industry}
                  </p>

                  <Heading level={2} size="title" className="max-w-[24ch]">
                    {active.title}
                  </Heading>

                  <Text size="small" className="max-w-[52ch]">
                    {active.summary}
                  </Text>

                  {/* Первая метрика – на плитке: цифра убеждает быстрее,
                      чем ещё одна строка описания. */}
                  {active.metrics[0] ? (
                    <p className="text-gradient font-display pt-1 text-small font-semibold">
                      {active.metrics[0].value} – {active.metrics[0].label}
                    </p>
                  ) : null}
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1 w-12 rounded-full bg-[image:var(--gradient-brand)]"
                  />
                  <Heading level={2} size="title" className="max-w-[20ch]">
                    {hint.title}
                  </Heading>
                  <Text size="small" className="max-w-[44ch]">
                    {hint.text}
                  </Text>
                </div>
              )}
              <Link
                href="/portfolio"
                className="mt-2 text-small font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
              >
                {dict.cases.allLink}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

/**
 * Обложка плитки как data-URI.
 *
 * Настоящих снимков нет, а серые заглушки убили бы стену: она держится
 * на цвете. SVG собирается из палитры самого проекта, поэтому плитки
 * различимы между собой и остаются в фирменном диапазоне. Data-URI, а не
 * файл, чтобы не плодить в /public шесть картинок, которые всё равно
 * заменят на реальные.
 */
function tileDataUri(from: string, to: string, label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${from}"/>
        <stop offset="1" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="600" height="400" fill="url(#g)"/>
    <circle cx="470" cy="330" r="150" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="26"/>
    <text x="36" y="356" font-family="system-ui,sans-serif" font-size="52" font-weight="700" fill="rgba(255,255,255,0.94)">${label}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
