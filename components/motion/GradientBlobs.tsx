import { cn } from "@/lib/cn";

interface GradientBlobsProps {
  /** `light` — для белых секций, `rich` — насыщеннее, для первого экрана. */
  tone?: "light" | "rich";
  className?: string;
}

/**
 * Размытые градиентные пятна — единственная фактура фона на сайте.
 *
 * Чистый CSS: blur + анимация transform. Никакого canvas и WebGL — это
 * дешевле по кадрам и не блокирует главный поток. Движение бесконечное
 * и не зависит от действий пользователя: фон живёт сам по себе.
 *
 * Каждое пятно на своём слое с will-change: transform, чтобы браузер
 * держал их в отдельных композитных слоях и не перерисовывал фон.
 */
export function GradientBlobs({ tone = "light", className }: GradientBlobsProps) {
  const rich = tone === "rich";

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute -top-[22%] -left-[12%] h-[52vmax] w-[52vmax] rounded-full",
          rich
            ? "bg-[radial-gradient(circle,rgb(34_211_238/0.42),transparent_66%)]"
            : "bg-[radial-gradient(circle,rgb(34_211_238/0.24),transparent_68%)]",
          "blur-[90px] will-change-transform",
          "motion-safe:animate-[aurora-drift_19s_ease-in-out_infinite]",
        )}
      />
      <div
        className={cn(
          "absolute top-[8%] -right-[16%] h-[56vmax] w-[56vmax] rounded-full",
          rich
            ? "bg-[radial-gradient(circle,rgb(43_141_255/0.38),transparent_66%)]"
            : "bg-[radial-gradient(circle,rgb(43_141_255/0.22),transparent_68%)]",
          "blur-[100px] will-change-transform",
          "motion-safe:animate-[blob-float_26s_ease-in-out_infinite_reverse]",
        )}
      />
      {/* Фиолетовое пятно намеренно самое слабое: акцент, а не фон. */}
      <div
        className={cn(
          "absolute -bottom-[26%] left-[28%] h-[42vmax] w-[42vmax] rounded-full",
          rich
            ? "bg-[radial-gradient(circle,rgb(124_58_237/0.24),transparent_70%)]"
            : "bg-[radial-gradient(circle,rgb(124_58_237/0.14),transparent_72%)]",
          "blur-[80px] will-change-transform",
          "motion-safe:animate-[aurora-drift_24s_ease-in-out_infinite]",
        )}
      />
    </div>
  );
}
