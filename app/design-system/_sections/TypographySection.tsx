import { Text } from "@/components/primitives";
import { DsSection, DsMeta } from "../_components/DsSection";

const SCALE = [
  {
    token: "--text-display-1",
    value: "clamp(44px → 96px) · 0.94 · −0.042em",
    sample: "Сайты и цифровые сервисы",
    className: "text-display-1 font-display font-bold",
  },
  {
    token: "--text-display-2",
    value: "clamp(36px → 72px) · 0.98 · −0.035em",
    sample: "Как мы работаем",
    className: "text-display-2 font-display font-bold",
  },
  {
    token: "--text-display-3",
    value: "clamp(30px → 52px) · 1.04 · −0.03em",
    sample: "Безопасность по умолчанию",
    className: "text-display-3 font-display font-semibold",
  },
  {
    token: "--text-title",
    value: "clamp(22px → 28px) · 1.22 · −0.02em",
    sample: "Интернет-магазин с выгрузкой в 1С",
    className: "text-title font-display font-semibold",
  },
  {
    token: "--text-lead",
    value: "clamp(17px → 22px) · 1.5",
    sample:
      "Разрабатываем сайты, внутренние системы и ботов. Делаем так, чтобы после нас не пришлось переделывать.",
    className: "text-lead",
  },
  {
    token: "--text-body",
    value: "17px · 1.65",
    sample:
      "Сначала разбираемся в процессе, потом пишем код. Решение документировано, его может продолжить другая команда.",
    className: "text-body",
  },
  {
    token: "--text-small",
    value: "15px · 1.55",
    sample: "Ответим в течение рабочего дня. Оценка и сроки – бесплатно.",
    className: "text-small",
  },
  {
    token: "--text-label",
    value: "12px · 1 · +0.14em · uppercase",
    sample: "Направления",
    className: "text-label font-semibold uppercase",
  },
];

export function TypographySection() {
  return (
    <DsSection
      index="03"
      title="Типографика"
      note="Две гарнитуры, три языка. В Space Grotesk нет кириллицы – поэтому дисплейная гарнитура собрана из двух файлов с разными unicode-range: латиницу отдаёт Space Grotesk, кириллицу – Manrope. Браузер переключается по символу, лишнего не скачивает."
    >
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <div className="border-line rounded-lg border p-6">
          <p className="font-display text-display-3 font-bold">QODE SOLUTIONS</p>
          <DsMeta token="Space Grotesk Variable" value="300–700 · latin · 22 КБ" />
        </div>
        <div className="border-line rounded-lg border p-6">
          <p className="font-display text-display-3 font-bold">Агентство</p>
          <DsMeta token="Manrope Variable" value="200–800 · cyrillic · 14 КБ" />
        </div>
        <div className="border-line rounded-lg border p-6">
          <p className="text-display-3">Текст Text</p>
          <DsMeta token="Inter Variable" value="100–900 · lat + cyr · 65 КБ" />
        </div>
      </div>

      <div className="flex flex-col">
        {SCALE.map((step) => (
          <div
            key={step.token}
            className="border-line grid gap-4 border-t py-8 lg:grid-cols-[16rem_1fr] lg:gap-10"
          >
            <div className="flex flex-col gap-1">
              <code className="font-mono text-caption">{step.token}</code>
              <span className="text-fg-2 font-mono text-caption tabular-nums">
                {step.value}
              </span>
            </div>
            <p className={step.className}>{step.sample}</p>
          </div>
        ))}
      </div>

      <Text size="caption" className="mt-8">
        Размеры текучие через clamp – между 360px и 1920px нет ни одного скачка и ни
        одного медиазапроса на типографику.
      </Text>
    </DsSection>
  );
}
