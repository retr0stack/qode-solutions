"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Медленное движение градиента внутри Q.
 *
 * Анимируется gradientTransform самого <linearGradient> — заливка едет,
 * а геометрия и размеры не пересчитываются. Единицы объектные
 * (gradientUnits по умолчанию), поэтому сдвиг не зависит от размера знака.
 */
export function useQGradientDrift(
  root: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const gradient = root.current?.querySelector('[data-q="gradient"]');
    if (!enabled || !gradient) return;

    gsap.set(gradient, { attr: { gradientTransform: "translate(-0.16 -0.16)" } });

    const tween = gsap.to(gradient, {
      attr: { gradientTransform: "translate(0.16 0.16)" },
      duration: 7,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    return () => {
      tween.kill();
      gradient.removeAttribute("gradientTransform");
    };
  }, [root, enabled]);
}
