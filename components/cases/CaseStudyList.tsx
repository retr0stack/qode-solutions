"use client";

import Image from "next/image";

import { Container, Heading, Section, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { Magnetic, Reveal } from "@/components/motion";
import { useCases, useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";
import { cn } from "@/lib/cn";

/**
 * Подробный разбор кейсов.
 *
 * Каждый проект разложен на четыре части: с чем пришёл клиент, что мы
 * предложили, что конкретно построили и что изменилось в цифрах. Скриншот
 * сам по себе разработчика не продаёт – продаёт разница между «до» и
 * «после», и порядок блоков повторяет ровно этот сюжет.
 *
 * Обложки-заглушки собираются из палитры кейса: серый прямоугольник хуже
 * отсутствия картинки, а настоящих снимков пока нет.
 */
export function CaseStudyList() {
  const dict = useDict();
  const cases = useCases();

  return (
    <Section density="md">
      <Container className="flex flex-col gap-[var(--section-sm)]">
        {cases.map((caseStudy, index) => (
          <Reveal key={caseStudy.slug}>
            <article className="border-line grid-12 items-start gap-y-8 border-t pt-10">
              {/* Шапка кейса и обложка. */}
              <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-5">
                <p className="text-fg-2 text-caption font-medium tracking-[0.02em] tabular-nums">
                  {caseStudy.year} · {caseStudy.industry}
                </p>

                <Heading level={2} size="display-3" className="max-w-[18ch]">
                  {caseStudy.title}
                </Heading>

                <p className="text-small font-semibold text-[color:var(--color-accent)]">
                  {caseStudy.client}
                </p>

                {/* Обложка проекта – квадрат: логотипы клиентов на подложке
                    сидят в квадрате ровнее, чем в широком кадре, где они
                    висят в центре с пустыми полями по бокам.

                    Под картинкой – заливка из палитры кейса: пока файла
                    нет, видно её, а не пустой прямоугольник. */}
                <div
                  className="relative mt-2 aspect-square w-full overflow-hidden rounded-[var(--radius-lg)]"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${caseStudy.palette[0]}, ${caseStudy.palette[1]})`,
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -right-[18%] -bottom-[42%] size-[18rem] rounded-full border-[22px] border-white/20"
                  />
                  <span
                    aria-hidden="true"
                    className="font-display absolute bottom-5 left-6 text-[2rem] font-bold text-white/90"
                  >
                    {caseStudy.client}
                  </span>

                  <Image
                    src={caseStudy.cover}
                    alt={`${caseStudy.client} – ${caseStudy.title}`}
                    fill
                    sizes="(min-width: 1024px) 34vw, 92vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Разбор. */}
              <div className="col-span-4 flex flex-col gap-7 md:col-span-8 lg:col-span-6 lg:col-start-7">
                <div className="flex flex-col gap-5">
                  {(
                    [
                      ["problem", caseStudy.problem],
                      ["solution", caseStudy.solution],
                    ] as const
                  ).map(([key, text]) => (
                    <div key={key} className="flex flex-col gap-1.5">
                      <h3 className="text-label font-semibold text-[color:var(--color-accent)]">
                        {key === "problem" ? dict.cases.problemLabel : dict.cases.solutionLabel}
                      </h3>
                      <Text size="small" className="max-w-[58ch]">
                        {text}
                      </Text>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-label text-fg-2 font-semibold">
                    {dict.cases.deliveredLabel}
                  </h3>
                  <ul className="flex flex-col gap-1.5">
                    {caseStudy.delivered.map((item) => (
                      <li key={item} className="flex gap-3 text-small">
                        <span
                          aria-hidden="true"
                          className="mt-[0.55em] h-px w-3 shrink-0 bg-[color:var(--color-accent)]"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Результат. Цифры убеждают быстрее любого абзаца. */}
                <dl
                  className={cn(
                    "grid gap-x-6 gap-y-5 rounded-[var(--radius-lg)] bg-[color:var(--color-paper-4)] p-6",
                    "sm:grid-cols-3",
                  )}
                >
                  {caseStudy.metrics.map((metric) => (
                    <div key={metric.label} className="flex flex-col gap-1">
                      <dt className="text-gradient font-display text-title leading-tight font-bold tabular-nums">
                        {metric.value}
                      </dt>
                      <dd className="text-fg-2 text-caption">{metric.label}</dd>
                    </div>
                  ))}
                </dl>

                {/* Следующий шаг после каждого третьего кейса: читать десять
                    разборов подряд и не встретить ни одной кнопки – верный
                    способ потерять того, кто уже всё решил. */}
                {index % 3 === 2 ? (
                  <Magnetic className="self-start max-sm:w-full">
                    <Button href={leadFormHref} variant="secondary" className="max-sm:w-full">
                      {dict.cases.ctaLabel}
                    </Button>
                  </Magnetic>
                ) : null}
              </div>
            </article>
          </Reveal>
        ))}
      </Container>
    </Section>
  );
}
