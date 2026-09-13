import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const PADDING = {
  md: "p-6",
  lg: "p-6 md:p-8",
  xl: "p-7 md:p-10",
} as const;

interface CardProps {
  as?: ElementType;
  padding?: keyof typeof PADDING;
  /** Градиентная рамка на hover и на фокусе внутри карточки. */
  interactive?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * Поверхность-карточка. По умолчанию — волосяная граница и никаких теней.
 * Акцент бренда появляется рамкой только при наведении.
 */
export function Card({
  as: Tag = "div",
  padding = "lg",
  interactive = false,
  className,
  children,
}: CardProps) {
  return (
    <Tag
      className={cn(
        "surface relative flex flex-col",
        PADDING[padding],
        interactive && [
          "border-gradient",
          "transition-[transform,box-shadow] duration-300 ease-brand",
          "hover:border-gradient-on focus-within:border-gradient-on",
          "motion-safe:hover:-translate-y-1",
        ],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
