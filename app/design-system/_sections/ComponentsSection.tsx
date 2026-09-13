import { Eyebrow, Heading, Text } from "@/components/primitives";
import { Button, Card } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { DsSection } from "../_components/DsSection";

function ButtonRow({ label }: { label: string }) {
  return (
    <div className="flex flex-col gap-4">
      <Text size="caption" tone="strong" className="font-semibold">
        {label}
      </Text>
      <div className="flex flex-wrap items-center gap-4">
        <Magnetic>
          <Button size="lg">Обсудить проект</Button>
        </Magnetic>
        <Magnetic>
          <Button variant="secondary" size="lg">
            Услуги
          </Button>
        </Magnetic>
        <Button variant="ghost">Смотреть все кейсы</Button>
      </div>
    </div>
  );
}

export function ComponentsSection() {
  return (
    <DsSection
      index="05"
      title="Компоненты"
      note="Кнопки, карточки и шапки секций знают о поверхности, на которой стоят: внутри data-surface=«dark» семантические токены переопределяются, а сам компонент не меняется. Магнитный эффект – отдельная обёртка <Magnetic>, чтобы кнопка оставалась серверной там, где анимация не нужна."
    >
      <div className="flex flex-col gap-10">
        <div className="border-line rounded-lg border p-6 md:p-8">
          <ButtonRow label="На светлой поверхности – заливка глубоким градиентом, белый текст" />
        </div>

        <div
          data-surface="dark"
          className="rounded-lg p-6 md:p-8"
        >
          <ButtonRow label="На тёмной – яркий cyan→blue, тёмный текст" />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card interactive>
            <Eyebrow className="mb-4">Направление</Eyebrow>
            <Heading level={3} size="title" className="mb-2">
              Сайты
            </Heading>
            <Text size="small">
              Наведите курсор: волосяная граница сменяется градиентной рамкой в 1px,
              карточка поднимается на 4px. Тени нет.
            </Text>
          </Card>

          <Card>
            <Heading level={3} size="title" className="mb-2">
              Статичная карточка
            </Heading>
            <Text size="small">
              По умолчанию – только граница --color-line. Никаких теней и лишних
              подложек.
            </Text>
          </Card>

          {/* Поверхность задаёт родитель: сама Card про тему ничего не знает. */}
          <div data-surface="dark" className="rounded-lg">
            <Card interactive className="h-full border-transparent">
              <Eyebrow className="mb-4">На тёмном</Eyebrow>
              <Heading level={3} size="title" className="mb-2">
                Та же карточка
              </Heading>
              <Text size="small">
                Компонент тот же, поменялась только поверхность-родитель.
              </Text>
            </Card>
          </div>
        </div>
      </div>
    </DsSection>
  );
}
