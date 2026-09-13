import { cn } from "@/lib/cn";

interface TechGridProps {
  /** Радиальное затухание к краям, чтобы сетка не резала композицию. */
  fade?: boolean;
  className?: string;
}

/** Тонкая техническая сетка. Только для тёмных поверхностей. */
export function TechGrid({ fade = true, className }: TechGridProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("tech-grid pointer-events-none absolute inset-0", className)}
      style={
        fade
          ? {
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 100%)",
            }
          : undefined
      }
    />
  );
}
