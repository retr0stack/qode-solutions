"use client";

import { Heading, Text } from "@/components/primitives";
import { Card } from "@/components/ui";
import { Reveal, SplitText, Stagger, StaggerItem } from "@/components/motion";
import { DsSection } from "../_components/DsSection";

const EASINGS = [
  { token: "--ease-brand", value: "0.22, 1, 0.36, 1", use: "Интерфейс: hover, раскрытие, кнопки", path: "M0,100 C22,0 36,0 100,0" },
  { token: "--ease-out-expo", value: "0.16, 1, 0.3, 1", use: "Появление секций и сцены скролла", path: "M0,100 C16,0 30,0 100,0" },
  { token: "--ease-in-out-quart", value: "0.76, 0, 0.24, 1", use: "Циклы: движение градиента, пятна", path: "M0,100 C76,100 24,0 100,0" },
];

const DURATIONS = [
  { token: "--duration-fast", value: "150ms", use: "Смена цвета, фокус" },
  { token: "--duration-base", value: "250ms", use: "Hover, сдвиги" },
  { token: "--duration-slow", value: "420ms", use: "Раскрытие аккордеона" },
  { token: "--duration-scene", value: "720ms", use: "Появление секции" },
];

export function MotionSection() {
  return (
    <DsSection
      index="06"
      title="Движение"
      note="Три кривые и четыре длительности на весь сайт – движение должно узнаваться. Анимируются только transform и opacity, ни одно свойство не вызывает reflow. При prefers-reduced-motion компоненты рендерят контент сразу видимым, а не прячут его."
    >
      {/* Один градиент на секцию: дубли id в SVG ломают заливку. */}
      <svg width="0" height="0" aria-hidden="true" className="absolute">
        <defs>
          <linearGradient id="ds-ease" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#00E0F0" />
            <stop offset="100%" stopColor="#6B3BF5" />
          </linearGradient>
        </defs>
      </svg>

      <div className="mb-12 grid gap-6 md:grid-cols-3">
        {EASINGS.map((easing) => (
          <figure key={easing.token} className="border-line rounded-lg border p-6">
            <svg viewBox="-4 -4 108 108" className="h-28 w-full" aria-hidden="true">
              <path d="M0,100 L100,100 M0,100 L0,0" stroke="var(--color-line)" strokeWidth="1" fill="none" />
              <path d={easing.path} fill="none" stroke="url(#ds-ease)" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <figcaption className="mt-4 flex flex-col gap-1">
              <code className="font-mono text-caption">{easing.token}</code>
              <span className="text-fg-2 font-mono text-caption tabular-nums">
                cubic-bezier({easing.value})
              </span>
              <Text size="caption" className="mt-1">
                {easing.use}
              </Text>
            </figcaption>
          </figure>
        ))}
      </div>

      <dl className="mb-12 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {DURATIONS.map((duration) => (
          <div key={duration.token} className="border-line flex flex-col gap-1 border-t py-4">
            <dt className="font-mono text-caption">{duration.token}</dt>
            <dd className="text-small font-semibold tabular-nums">{duration.value}</dd>
            <dd className="text-fg-2 text-caption">{duration.use}</dd>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <Text size="caption" tone="strong" className="mb-4 font-semibold">
            SplitText – посимвольное появление, строка целиком уходит скринридеру
          </Text>
          <Heading level={3} size="display-3">
            <SplitText text="Сайты и цифровые сервисы" />
          </Heading>
        </Card>

        <Card>
          <Text size="caption" tone="strong" className="mb-4 font-semibold">
            Reveal и Stagger – каскад при попадании в вьюпорт
          </Text>
          <Stagger className="flex flex-col gap-3">
            {["Разбор задачи", "Смета и сроки", "Дизайн", "Разработка"].map((step) => (
              <StaggerItem key={step}>
                <div className="border-line rounded-md border px-4 py-3 text-small">
                  {step}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <Reveal delay={0.2} className="mt-4">
            <Text size="caption">Этот абзац появился отдельным Reveal с задержкой.</Text>
          </Reveal>
        </Card>
      </div>
    </DsSection>
  );
}
