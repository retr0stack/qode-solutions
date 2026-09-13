import { GradientBlobs } from "@/components/motion";

/**
 * Фон первого экрана.
 *
 * Светлая сцена: белый лист, поверх — насыщенные градиентные пятна и одна
 * широкая горизонтальная «заря» у верхней кромки. Сеточных фактур на сайте
 * нет ни здесь, ни где-либо ещё.
 *
 * Все слои декоративные и не перехватывают указатель, поэтому герой остаётся
 * кликабельным целиком. Движение бесконечное и не зависит от пользователя.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <GradientBlobs tone="rich" />

      {/* Заря у верхней кромки: мягко подсвечивает область под шапкой. */}
      <div className="absolute inset-x-0 -top-[30%] h-[70%] bg-[radial-gradient(60%_100%_at_50%_100%,rgb(86_226_245/0.35),transparent_70%)] blur-[60px] motion-safe:animate-[aurora-drift_21s_ease-in-out_infinite]" />

      {/* Нижняя растушёвка – герой переходит в белую секцию без стыка. */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--color-paper))]" />
    </div>
  );
}
