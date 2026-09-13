import { cn } from "@/lib/cn";

interface EyebrowProps {
  children: string;
  className?: string;
}

/** Надзаголовок секции: капслок, плотный трекинг, короткий градиентный штрих. */
export function Eyebrow({ children, className }: EyebrowProps) {
  return (
    <p
      className={cn(
        "text-fg-2 flex items-center gap-3 text-label font-semibold uppercase",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-px w-8 shrink-0 rounded-full bg-[image:var(--gradient-brand)]"
      />
      {children}
    </p>
  );
}
