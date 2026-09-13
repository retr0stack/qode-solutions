import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface GradientTextProps {
  /** `deep` — для светлого фона (AA), `bright` — только для тёмного. */
  tone?: "deep" | "bright";
  className?: string;
  children: ReactNode;
}

/**
 * Слово или фраза, залитая градиентом бренда.
 * Внутри заголовка — только на часть строки, не на всю: градиент акцент.
 */
export function GradientText({
  tone = "deep",
  className,
  children,
}: GradientTextProps) {
  return (
    <span
      className={cn(
        tone === "bright" ? "text-gradient-bright" : "text-gradient",
        className,
      )}
    >
      {children}
    </span>
  );
}
