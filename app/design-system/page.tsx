import type { Metadata } from "next";
import { Container, Heading, Text } from "@/components/primitives";
import { Logo } from "@/components/brand";
import { PaletteSection } from "./_sections/PaletteSection";
import { GradientSection } from "./_sections/GradientSection";
import { TypographySection } from "./_sections/TypographySection";
import { GridSection } from "./_sections/GridSection";
import { ComponentsSection } from "./_sections/ComponentsSection";
import { MotionSection } from "./_sections/MotionSection";
import { BrandSection } from "./_sections/BrandSection";

export const metadata: Metadata = {
  title: "Дизайн-система",
  description: "Токены, типографика, сетка и движение сайта QODE SOLUTIONS.",
  robots: { index: false, follow: false },
};

const CONTENTS = [
  { id: "01", label: "Цвет" },
  { id: "02", label: "Градиент" },
  { id: "03", label: "Типографика" },
  { id: "04", label: "Сетка и ритм" },
  { id: "05", label: "Компоненты" },
  { id: "06", label: "Движение" },
  { id: "07", label: "Знак" },
];

/**
 * Служебная страница: живая документация дизайн-системы.
 * Не индексируется (см. app/robots.ts) и не ссылается из навигации.
 */
export default function DesignSystemPage() {
  return (
    <main>
      <header data-surface="dark" className="pt-16 pb-[var(--section-md)]">
        <Container className="flex flex-col gap-8">
          <Logo />
          <div className="flex flex-col gap-5">
            <Heading level={1} size="display-2" className="max-w-[24ch]">
              Дизайн-система
            </Heading>
            <Text size="lead" className="max-w-[54ch]">
              Токены, типографика, сетка и движение. Всё, что ниже, – единственный
              источник правды: страницы собираются из этих значений и не заводят
              своих.
            </Text>
          </div>

          <nav aria-label="Разделы" className="flex flex-wrap gap-x-6 gap-y-2">
            {CONTENTS.map((item) => (
              <span key={item.id} className="flex items-baseline gap-2">
                <span className="text-fg-2 font-mono text-caption tabular-nums">
                  {item.id}
                </span>
                <span className="text-small">{item.label}</span>
              </span>
            ))}
          </nav>
        </Container>
      </header>

      <PaletteSection />
      <GradientSection />
      <TypographySection />
      <GridSection />
      <ComponentsSection />
      <MotionSection />
      <BrandSection />
    </main>
  );
}
