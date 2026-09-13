"use client";

import { useEffect } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/**
 * Параллакс знака по скроллу первого экрана: пока hero уезжает вверх,
 * знак отстаёт, слегка уменьшается и доворачивается.
 *
 * Работает на своём элементе-обёртке — бесконечные CSS-циклы висят
 * на вложенных слоях и не конфликтуют с этим transform.
 *
 * scrub: true, поэтому анимация полностью привязана к позиции скролла
 * и не «догоняет» пользователя после остановки.
 */
export function useLogoParallax(
  target: React.RefObject<HTMLElement | null>,
  section: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const node = target.current;
    const hero = section.current;
    if (!enabled || !node || !hero) return;

    const tween = gsap.to(node, {
      yPercent: 16,
      scale: 0.86,
      rotate: 10,
      opacity: 0.35,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });

    // Подмена шрифта меняет высоту hero — пересчитываем после её загрузки.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(node, { clearProps: "all" });
    };
  }, [target, section, enabled]);
}
