import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface FadeInProps {
  as?: ElementType;
  /** Задержка в секундах — для каскада внутри одного блока. */
  delay?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Появление при загрузке — на CSS-анимации, а не на JS.
 *
 * Почему так: обёртка от framer-motion отрендерила бы на сервере
 * opacity: 0 и показала бы содержимое только после гидратации — если JS
 * не выполнится, экран останется пустым. Здесь элемент по умолчанию
 * видимый, а анимация лишь добавляется сверху.
 *
 * Под prefers-reduced-motion (префикс motion-safe) анимации нет вовсе:
 * контент просто на месте.
 */
export function FadeIn({ as: Tag = "div", delay = 0, className, children }: FadeInProps) {
  return (
    <Tag
      className={cn(
        "motion-safe:animate-[fade-rise_0.7s_var(--ease-out-expo)_both]",
        className,
      )}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}
