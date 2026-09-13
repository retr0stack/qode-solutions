"use client";

import { motion } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { EASE, VIEWPORT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface RevealProps {
  as?: ElementType;
  /** Задержка в секундах — для ручного каскада вне <Stagger>. */
  delay?: number;
  /** Сдвиг по вертикали в пикселях. 0 — только прозрачность. */
  y?: number;
  className?: string;
  children: ReactNode;
}

/**
 * Появление блока при попадании в вьюпорт.
 * Анимируются только opacity и transform. При prefers-reduced-motion
 * контент рендерится сразу видимым — без задержек и подмен.
 */
export function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  className,
  children,
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as as "div"];

  if (reduced) {
    const Tag = as as "div";
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.72, ease: EASE.outExpo, delay }}
    >
      {children}
    </MotionTag>
  );
}
