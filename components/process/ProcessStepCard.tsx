import { Heading, Text } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { ProcessStepItem } from "./types";

interface ProcessStepCardProps {
  step: ProcessStepItem;
  index: number;
  total: number;
}

/*
 * Свой оттенок на каждый шаг.
 *
 * Пять одинаковых белых карточек в ряд читались как один длинный
 * прямоугольник: понять, сколько шагов проехало и сколько осталось, можно
 * было только по цифрам в углу. Цвет здесь работает как метка позиции,
 * а не как украшение, поэтому оттенки идут по порядку — от голубого к
 * фиолетовому, ровно по фирменному градиенту.
 */
const ACCENTS = ["#22d3ee", "#2b8dff", "#1668e3", "#6229d9", "#7c3aed"] as const;

/** Шаг процесса. Ширина задана карточке, а не треку — так проще считать сцену. */
export function ProcessStepCard({ step, index, total }: ProcessStepCardProps) {
  const accent = ACCENTS[(index - 1) % ACCENTS.length];
  return (
    <article
      style={{ ["--accent" as string]: accent }}
      className={cn(
        "surface group relative flex shrink-0 snap-center flex-col justify-between gap-10 overflow-hidden p-6 md:p-8",
        "w-[78vw] sm:w-[58vw] md:w-[40vw] lg:w-[24rem] lg:snap-align-none",
      )}
    >
      {/* Цветная полоса сверху – метка шага, видна всегда. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: "var(--accent)" }}
      />

      {/* Заливка из угла проявляется при наведении. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-48 rounded-full opacity-0 blur-[46px] transition-opacity duration-500 ease-brand group-hover:opacity-70"
        style={{ backgroundColor: "var(--accent)" }}
      />

      <header className="relative flex flex-col gap-4">
        <p className="text-fg-2 font-mono text-caption tabular-nums">
          {String(index).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <Heading level={3} size="title">
          {step.title}
        </Heading>
      </header>

      <div className="relative flex flex-col gap-4">
        <Text size="small">{step.description}</Text>
        {/* Сроки шагов убраны: они противоречили обещанию «до 7 дней»
            на странице услуг и в ответах на вопросы. Конкретный срок
            называется в смете, а не в описании процесса. */}
        <span
          aria-hidden="true"
          className="mt-1 block h-px w-full"
          style={{ backgroundColor: "var(--accent)" }}
        />
      </div>
    </article>
  );
}
