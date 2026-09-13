"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Переход между страницами.
 *
 * Анимируется только opacity и намеренно нет transform: transform на предке
 * делает его containing block для position: fixed, а внутри страниц есть
 * фиксированные элементы (большая Q в hero). Появление без исчезновения —
 * App Router размонтирует прошлое дерево сразу, и честный exit требовал бы
 * держать оба дерева в памяти ради 200 мс.
 *
 * Здесь же живёт единственный <main> приложения — цель ссылки «Перейти
 * к содержимому», поэтому страницы свой <main> не заводят.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduced = usePrefersReducedMotion();

  if (reduced) {
    return <main id="main">{children}</main>;
  }

  return (
    <motion.main
      id="main"
      key={pathname}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.32, ease: EASE.brand }}
    >
      {children}
    </motion.main>
  );
}
