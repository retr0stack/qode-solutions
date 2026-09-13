import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GridProps {
  className?: string;
  children: ReactNode;
}

/**
 * Базовая сетка: 4 колонки на мобильном, 8 на планшете, 12 на десктопе.
 * Мобильная раскладка задумана отдельно, а не сжата из десктопной.
 */
export function Grid({ className, children }: GridProps) {
  return <div className={cn("grid-12", className)}>{children}</div>;
}
