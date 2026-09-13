"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useHasPointer, usePrefersReducedMotion } from "@/lib/hooks";

interface MagneticProps {
  /** Максимальный сдвиг в пикселях. Больше 10 выглядит дёшево. */
  strength?: number;
  className?: string;
  children: ReactNode;
}

const SPRING = { stiffness: 220, damping: 22, mass: 0.4 } as const;

/**
 * Magnetic-эффект: содержимое слегка тянется к курсору.
 * Только для устройств с точным указателем и без prefers-reduced-motion —
 * на тач-экранах обёртка не навешивает ни одного обработчика.
 *
 * shrink-0 обязателен: кнопка внутри не сжимается (px + whitespace-nowrap),
 * и если обёртку сжать как flex-элемент, кнопка вылезет за её границы
 * и перекроет соседний текст.
 */
export function Magnetic({ strength = 8, className, children }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  if (!enabled) {
    return <div className={cn("shrink-0", className)}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={cn("shrink-0", className)}
      style={{ x, y }}
      onPointerMove={(event) => {
        const box = ref.current?.getBoundingClientRect();
        if (!box) return;
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height / 2);
        // Нормируем по половине размера — сдвиг не зависит от габаритов кнопки.
        rawX.set((dx / (box.width / 2)) * strength);
        rawY.set((dy / (box.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
