"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useAnchorScroll } from "./useAnchorScroll";

/**
 * Инерционный скролл. Один экземпляр Lenis на приложение.
 *
 * Важно:
 * — при prefers-reduced-motion Lenis не запускается вовсе, остаётся нативный
 *   скролл, а якоря доезжают за счёт scroll-padding-top в base.css;
 * — экземпляр кладётся в window.__lenis, чтобы GSAP ScrollTrigger и якорные
 *   ссылки работали с той же временной шкалой, а не боролись с ней;
 * — при смене маршрута скролл сбрасывается мгновенно, без анимации.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      // Кривая близка к --ease-out-expo: длинный выкат, короткий разгон.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      // На тач-устройствах нативный скролл честнее и не ломает pull-to-refresh.
      syncTouch: false,
    });

    window.__lenis = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      delete window.__lenis;
    };
  }, [reduced]);

  useEffect(() => {
    window.__lenis?.scrollTo(0, { immediate: true });
  }, [pathname]);

  useAnchorScroll(!reduced);

  return children;
}
