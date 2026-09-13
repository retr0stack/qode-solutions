import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

const SIZES = {
  lead: "text-lead",
  body: "text-body",
  small: "text-small",
  caption: "text-caption",
} as const;

const TONES = {
  /** Основной текст. */
  strong: "text-fg",
  /** Вторичный. На светлом — #5B6478, на тёмном — #8B92A8 (оба ≥ 5.7:1). */
  soft: "text-fg-2",
} as const;

interface TextProps {
  as?: ElementType;
  size?: keyof typeof SIZES;
  tone?: keyof typeof TONES;
  /** Ограничить меру строки — читаемость важнее ширины контейнера. */
  measure?: boolean;
  className?: string;
  children: ReactNode;
}

export function Text({
  as: Tag = "p",
  size = "body",
  tone = "soft",
  measure = false,
  className,
  children,
}: TextProps) {
  return (
    <Tag
      className={cn(
        SIZES[size],
        TONES[tone],
        measure && "max-w-[62ch]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
