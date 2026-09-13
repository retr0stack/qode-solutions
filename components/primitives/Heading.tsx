import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Размер отвязан от уровня: h2 может быть display-1, а h1 — display-2.
 * Уровень выбирается по структуре документа, размер — по композиции.
 */
const SIZES = {
  "display-1": "text-display-1",
  "display-2": "text-display-2",
  "display-3": "text-display-3",
  title: "text-title",
} as const;

type Level = 1 | 2 | 3 | 4 | 5 | 6;

interface HeadingProps {
  level?: Level;
  size?: keyof typeof SIZES;
  id?: string;
  className?: string;
  children: ReactNode;
}

export function Heading({
  level = 2,
  size = "display-2",
  id,
  className,
  children,
}: HeadingProps) {
  const Tag = `h${level}` as const;

  return (
    <Tag id={id} className={cn("font-display", SIZES[size], className)}>
      {children}
    </Tag>
  );
}
