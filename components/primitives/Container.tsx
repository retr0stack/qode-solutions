import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const WIDTHS = {
  /** 1280 — основная колонка контента. */
  content: "max-w-content",
  /** 1440 — широкие сцены: hero, горизонтальный скролл. */
  wide: "max-w-wide",
  /** 736 — комфортная мера для длинного текста. */
  text: "max-w-text",
  /** Без ограничения, только боковые отступы. */
  full: "max-w-none",
} as const;

interface ContainerProps {
  as?: ElementType;
  width?: keyof typeof WIDTHS;
  className?: string;
  children: ReactNode;
}

/** Горизонтальные рамки страницы. Отступы берутся из токена --gutter. */
export function Container({
  as: Tag = "div",
  width = "content",
  className,
  children,
}: ContainerProps) {
  return (
    <Tag className={cn("gutter-x mx-auto w-full", WIDTHS[width], className)}>
      {children}
    </Tag>
  );
}
