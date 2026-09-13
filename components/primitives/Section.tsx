import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Вертикальная плотность. Лента секций намеренно неоднородная. */
const DENSITY = {
  sm: "py-[var(--section-sm)]",
  md: "py-[var(--section-md)]",
  lg: "py-[var(--section-lg)]",
  none: "",
} as const;

const SURFACE = {
  paper: "bg-paper",
  /** Чередующийся светлый фон — отделяет секцию без линий и теней. */
  alt: "bg-paper-2",
  /** Тёмная зона: семантические токены переопределяются в base.css. */
  dark: "",
  none: "",
} as const;

interface SectionProps {
  id?: string;
  density?: keyof typeof DENSITY;
  surface?: keyof typeof SURFACE;
  /** Подпись секции для скринридеров, если визуального заголовка нет. */
  ariaLabel?: string;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  density = "md",
  surface = "paper",
  ariaLabel,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      data-surface={surface === "dark" ? "dark" : undefined}
      className={cn("relative", DENSITY[density], SURFACE[surface], className)}
    >
      {children}
    </section>
  );
}
