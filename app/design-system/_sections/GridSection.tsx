import { Text } from "@/components/primitives";
import { DsSection } from "../_components/DsSection";

const BREAKPOINTS = [
  { width: "360px", cols: "4 колонки", gutter: "20px", note: "Своя раскладка, не сжатый десктоп" },
  { width: "768px", cols: "8 колонок", gutter: "32px", note: "Карточки в 2 ряда, шаги процесса свайпом" },
  { width: "1280px", cols: "12 колонок", gutter: "48px", note: "Основная сетка, контент до 1280px" },
  { width: "1920px", cols: "12 колонок", gutter: "48px", note: "Контейнер не растёт, воздух по краям" },
];

const RHYTHM = [
  { token: "--section-sm", value: "48 → 80px", use: "Плотные блоки: стек, футер" },
  { token: "--section-md", value: "72 → 128px", use: "Основной ритм секций" },
  { token: "--section-lg", value: "96 → 176px", use: "Смысловые паузы: отличия, финальный CTA" },
];

export function GridSection() {
  return (
    <DsSection
      index="04"
      title="Сетка и ритм"
      note="12 колонок на десктопе, 8 на планшете, 4 на мобильном. Боковые отступы – один токен --gutter, от него зависят и контейнер, и sticky-навигация, и hero. Вертикальный ритм намеренно неоднородный: три плотности вместо одной."
    >
      <div className="border-line relative mb-12 overflow-hidden rounded-lg border p-4">
        <div className="grid-12">
          {Array.from({ length: 12 }, (_, index) => (
            <div
              key={index}
              className={[
                "bg-paper-2 border-line flex h-24 items-end justify-center rounded-sm border pb-2",
                index >= 4 && index < 8 && "hidden md:flex",
                index >= 8 && "hidden lg:flex",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="text-fg-2 font-mono text-caption tabular-nums">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
        <Text size="caption" className="mt-4">
          Меняйте ширину окна: 4 → 8 → 12 колонок.
        </Text>
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <Text size="small" tone="strong" className="mb-4 font-semibold">
            Контрольные ширины
          </Text>
          <dl className="flex flex-col">
            {BREAKPOINTS.map((point) => (
              <div
                key={point.width}
                className="border-line grid grid-cols-[5rem_1fr] items-baseline gap-4 border-t py-4"
              >
                <dt className="font-mono text-caption tabular-nums">{point.width}</dt>
                <dd className="flex flex-col gap-1">
                  <span className="text-small font-semibold">
                    {point.cols} · gutter {point.gutter}
                  </span>
                  <span className="text-fg-2 text-caption">{point.note}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <Text size="small" tone="strong" className="mb-4 font-semibold">
            Вертикальный ритм
          </Text>
          <dl className="flex flex-col">
            {RHYTHM.map((step) => (
              <div
                key={step.token}
                className="border-line grid grid-cols-[9rem_1fr] items-baseline gap-4 border-t py-4"
              >
                <dt className="font-mono text-caption">{step.token}</dt>
                <dd className="flex flex-col gap-1">
                  <span className="text-small font-semibold tabular-nums">
                    {step.value}
                  </span>
                  <span className="text-fg-2 text-caption">{step.use}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </DsSection>
  );
}
