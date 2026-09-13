import { cn } from "@/lib/cn";
import type { ProcessStepItem } from "./types";

interface ProcessProgressProps {
  steps: readonly ProcessStepItem[];
  className?: string;
}

/**
 * Прогресс-линия с градиентом бренда.
 *
 * Заполнение — scaleX от переменной --process-progress, которую обновляет
 * ProcessTrack. Это transform, поэтому кадры дешёвые и reflow нет.
 */
export function ProcessProgress({ steps, className }: ProcessProgressProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div
        aria-hidden="true"
        className="bg-line relative h-px w-full overflow-hidden rounded-full"
      >
        <span
          className="absolute inset-0 origin-left bg-[image:var(--gradient-brand)]"
          style={{ transform: "scaleX(var(--process-progress, 0))" }}
        />
      </div>

      <ol className="flex justify-between gap-2">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="text-fg-2 text-caption tabular-nums first:text-left last:text-right"
          >
            <span className="hidden md:inline">{step.title}</span>
            <span className="md:hidden">{String(index + 1).padStart(2, "0")}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
