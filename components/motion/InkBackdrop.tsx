import { cn } from "@/lib/cn";

/**
 * Тёмно-синий фон глубокой зоны.
 *
 * Пришёл на смену стоковым снимкам: фотография под заголовком и формой
 * всё время спорила с текстом, а контраст зависел от того, насколько
 * светлым оказался конкретный кадр. Здесь плоскость ровная, и читаемость
 * не зависит от содержимого.
 *
 * Три слоя: базовая заливка --color-ink, два медленно дрейфующих пятна
 * из фирменного диапазона и лёгкое затемнение к низу, чтобы нижняя кромка
 * не спорила со следующей секцией.
 *
 * Контраст: белый текст (--color-paper) на --color-ink даёт около 15:1,
 * вторичный --color-muted — около 7:1. Пятна светлее фона не больше чем
 * на 12% альфы, поэтому даже под ними текст остаётся выше 4.5:1.
 */
export function InkBackdrop({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("absolute inset-0 overflow-hidden bg-[color:var(--color-ink)]", className)}
    >
      <span className="absolute -top-1/3 -left-[10%] size-[38rem] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.12),transparent_68%)] blur-[70px] motion-safe:animate-[aurora-drift_26s_ease-in-out_infinite]" />
      <span className="absolute -right-[12%] -bottom-1/3 size-[42rem] rounded-full bg-[radial-gradient(circle,rgb(43_141_255/0.14),transparent_70%)] blur-[80px] motion-safe:animate-[blob-float_32s_ease-in-out_infinite]" />
      <span className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,transparent,rgb(10_22_40/0.6))]" />
    </div>
  );
}
