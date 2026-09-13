"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { fadeRise, stagger, VIEWPORT } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface StaggerProps {
  step?: number;
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Контейнер каскада. Дети оборачиваются в <StaggerItem>. */
export function Stagger({ step = 0.07, delay = 0, className, children }: StaggerProps) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={stagger(step, delay)}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const reduced = usePrefersReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={fadeRise}>
      {children}
    </motion.div>
  );
}
