import { Text } from "@/components/primitives";
import { DsSection } from "../_components/DsSection";
import { Swatch } from "../_components/Swatch";

const BRAND = [
  {
    name: "Cyan",
    token: "--color-cyan",
    hex: "#00E0F0",
    contrast: "1.63:1 на белом",
    status: "decorative" as const,
    usage: "Градиент, свечение, акценты на тёмном. Как текст на белом – нельзя.",
  },
  {
    name: "Blue",
    token: "--color-blue",
    hex: "#2B7FFF",
    contrast: "3.76:1 на белом",
    status: "large-only" as const,
    usage: "Середина градиента, рамки, крупные акценты.",
  },
  {
    name: "Violet",
    token: "--color-violet",
    hex: "#6B3BF5",
    contrast: "5.88:1 на белом",
    status: "ok" as const,
    usage: "Конец градиента, акцентный текст на светлом.",
  },
];

const BRAND_INK = [
  {
    name: "Cyan Ink",
    token: "--color-cyan-ink",
    hex: "#0B6E96",
    contrast: "5.70:1 на белом",
    status: "ok" as const,
    usage: "Тёмная замена cyan там, где нужен читаемый текст или заливка.",
  },
  {
    name: "Blue Ink",
    token: "--color-blue-ink",
    hex: "#1A64E0",
    contrast: "5.33:1 на белом",
    status: "ok" as const,
    usage: "Ссылки, фокусное кольцо, акцент на светлом фоне.",
  },
  {
    name: "Violet Ink",
    token: "--color-violet-ink",
    hex: "#5A2FD6",
    contrast: "7.47:1 на белом",
    status: "ok" as const,
    usage: "Конец глубокого градиента для заливок под белый текст.",
  },
];

const NEUTRAL = [
  {
    name: "Ink",
    token: "--color-ink",
    hex: "#141824",
    contrast: "17.71:1 на белом",
    status: "ok" as const,
    usage: "Основной текст, фон hero и футера.",
  },
  {
    name: "Ink 2",
    token: "--color-ink-2",
    hex: "#1E2334",
    usage: "Поверхности внутри тёмных секций.",
  },
  {
    name: "Fg Soft",
    token: "--color-fg-soft",
    hex: "#5B6478",
    contrast: "5.93:1 на белом",
    status: "ok" as const,
    usage: "Вторичный текст на светлом фоне.",
  },
  {
    name: "Muted",
    token: "--color-muted",
    hex: "#8B92A8",
    contrast: "5.71:1 на ink · 3.10:1 на белом",
    status: "large-only" as const,
    usage: "Вторичный текст на тёмном. На светлом – только рамки полей.",
  },
  {
    name: "Paper 2",
    token: "--color-paper-2",
    hex: "#F6F7F9",
    usage: "Фон чередующихся секций – отделяет без линий и теней.",
  },
  {
    name: "Paper 3",
    token: "--color-paper-3",
    hex: "#ECEEF3",
    usage: "Волосяные границы и разделители на светлом.",
  },
];

export function PaletteSection() {
  return (
    <DsSection
      index="01"
      title="Цвет"
      note="Палитра из логотипа плюс затемнённые варианты: яркие cyan и blue не проходят AA как текст на белом. Каждый контраст измерен, а не подобран на глаз. Порог для текста – 4.5:1, для границ полей – 3:1."
    >
      <div className="flex flex-col gap-12">
        <div>
          <Text size="small" tone="strong" className="mb-5 font-semibold">
            Бренд – как есть из логотипа
          </Text>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {BRAND.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>

        <div>
          <Text size="small" tone="strong" className="mb-5 font-semibold">
            Бренд – затемнённые, для текста и заливок на светлом
          </Text>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {BRAND_INK.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>

        <div>
          <Text size="small" tone="strong" className="mb-5 font-semibold">
            Нейтрали
          </Text>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
            {NEUTRAL.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>
      </div>
    </DsSection>
  );
}
