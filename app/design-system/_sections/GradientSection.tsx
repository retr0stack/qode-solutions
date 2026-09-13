import { Text } from "@/components/primitives";
import { DsSection } from "../_components/DsSection";

const GRADIENTS = [
  {
    token: "--gradient-brand",
    label: "Яркий",
    css: "var(--gradient-brand)",
    fg: "#141824",
    rule: "Q в hero, обводки карточек, подчёркивания, свечение, текст на тёмном.",
    text: "Текст поверх – нельзя",
  },
  {
    token: "--gradient-brand-deep",
    label: "Глубокий",
    css: "var(--gradient-brand-deep)",
    fg: "#FFFFFF",
    rule: "Заливка кнопок и плашек на светлом фоне.",
    text: "Белый текст: 5.33–7.47:1",
  },
  {
    token: "--gradient-brand-bright",
    label: "Короткий",
    css: "var(--gradient-brand-bright)",
    fg: "#141824",
    rule: "Заливка кнопок внутри тёмных секций.",
    text: "Тёмный текст: 4.71–10.90:1",
  },
];

export function GradientSection() {
  return (
    <DsSection
      index="02"
      title="Градиент"
      note="Три варианта одного градиента под разные задачи. Правило простое: градиентом не заливаются фоны секций – он работает точечно, на площади не больше кнопки, рамки или знака."
    >
      <div className="grid gap-6 md:grid-cols-3">
        {GRADIENTS.map((gradient) => (
          <figure key={gradient.token} className="flex flex-col">
            <div
              className="flex h-32 items-end rounded-lg p-5"
              style={{ backgroundImage: gradient.css }}
            >
              <span
                className="font-display text-title font-semibold"
                style={{ color: gradient.fg }}
              >
                {gradient.label}
              </span>
            </div>
            <figcaption className="mt-3 flex flex-col gap-1.5">
              <code className="font-mono text-caption">{gradient.token}</code>
              <span className="text-fg-2 font-mono text-caption tabular-nums">
                {gradient.text}
              </span>
              <Text size="caption">{gradient.rule}</Text>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="border-line mt-10 rounded-lg border p-6">
        <Text size="small" tone="strong" className="mb-4 font-semibold">
          Медленное движение градиента – анимируется background-position, не размеры
        </Text>
        <div
          className="gradient-drift h-16 rounded-md"
          style={{ backgroundImage: "var(--gradient-brand)" }}
        />
        <Text size="caption" className="mt-3">
          Утилита <code className="font-mono">gradient-drift</code>: 14 секунд,
          ease-in-out-quart, бесконечный цикл. При prefers-reduced-motion градиент
          застывает.
        </Text>
      </div>
    </DsSection>
  );
}
