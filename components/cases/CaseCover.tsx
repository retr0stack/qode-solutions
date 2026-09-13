import { cn } from "@/lib/cn";
import type { CaseStudy } from "@/content";

const RATIO = {
  wide: "aspect-[16/10]",
  tall: "aspect-[3/4]",
  square: "aspect-square",
} as const;

/**
 * Обложка кейса.
 *
 * Настоящих снимков пока нет, а серая заглушка с иконкой убила бы страницу
 * сильнее, чем её отсутствие. Поэтому обложка собирается из палитры самого
 * кейса: две градиентные плоскости, кольцо и диагональная полоса. Композиция
 * детерминирована — один и тот же кейс всегда выглядит одинаково, случайности
 * между рендерами нет.
 *
 * Когда появится файл, сюда встанет next/image с тем же соотношением сторон,
 * а этот компонент останется фолбэком.
 */
export function CaseCover({ caseStudy }: { caseStudy: CaseStudy }) {
  const [from, to] = caseStudy.palette;

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-[var(--radius-lg)]",
        RATIO[caseStudy.ratio],
      )}
      style={{ background: `linear-gradient(135deg, ${from} 0%, ${to} 100%)` }}
    >
      {/* Мягкое пятно — оживляет плоскую заливку. */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_28%_22%,rgb(255_255_255/0.45),transparent_58%)] blur-[26px]"
      />

      {/* Кольцо и полоса: геометрия из знака бренда, не стоковый паттерн. */}
      <span
        aria-hidden="true"
        className="absolute -right-[12%] -bottom-[22%] aspect-square w-[62%] rounded-full border-[3vw] border-white/25"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 -left-[10%] h-[18%] w-[70%] -translate-y-1/2 rotate-[38deg] rounded-full bg-white/20 blur-[2px]"
      />

      {/* Название клиента крупно — плитка читается даже без описания. */}
      <span className="font-display absolute inset-x-0 bottom-0 p-6 text-[clamp(1.5rem,3.4vw,2.75rem)] leading-none font-bold text-white/95 md:p-8">
        {caseStudy.client}
      </span>
    </div>
  );
}
