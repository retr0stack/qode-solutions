"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";
import { Q_GEOMETRY, circumference } from "@/components/brand";

const { ring, tailOffset } = Q_GEOMETRY;

/**
 * Сборка знака при загрузке: кольцо рисуется обводкой, заливается градиентом,
 * затем вылетает хвост.
 *
 * `simplified` — мобильная версия: без отрисовки контуров, короче и дешевле.
 * Если анимация не нужна вовсе (prefers-reduced-motion), хук не вызывается,
 * и разметка остаётся в конечном состоянии, как её отдал сервер.
 */
export function useQBuildIn(
  root: React.RefObject<HTMLElement | null>,
  { simplified, enabled }: { simplified: boolean; enabled: boolean },
) {
  useEffect(() => {
    const node = root.current;
    if (!enabled || !node) return;

    const outline = node.querySelector('[data-q="outline"]');
    const circles = node.querySelectorAll('[data-q="outline"] circle');
    const ringEl = node.querySelector('[data-q="ring"]');
    const tailEl = node.querySelector('[data-q="tail"]');
    if (!outline || !ringEl || !tailEl) return;

    const timeline = gsap.timeline({ defaults: { ease: "power2.out" } });

    if (simplified) {
      gsap.set(outline, { autoAlpha: 0 });
      timeline
        .fromTo(ringEl, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5 })
        .fromTo(
          tailEl,
          { autoAlpha: 0, x: -tailOffset.x, y: -tailOffset.y },
          { autoAlpha: 1, x: 0, y: 0, duration: 0.45 },
          "-=0.2",
        );
    } else {
      gsap.set(ringEl, { autoAlpha: 0, scale: 0.94 });
      gsap.set(tailEl, { autoAlpha: 0, x: -tailOffset.x, y: -tailOffset.y, scale: 0.9 });
      gsap.set(circles, {
        strokeDashoffset: (index: number) =>
          circumference(index === 0 ? ring.outer : ring.inner),
      });

      timeline
        // 1. Контуры прочерчиваются.
        .to(circles, {
          strokeDashoffset: 0,
          duration: 0.95,
          ease: "power2.inOut",
          stagger: 0.1,
        })
        // 2. Кольцо заливается градиентом.
        .to(ringEl, { autoAlpha: 1, scale: 1, duration: 0.6 }, "-=0.25")
        // 3. Контуры больше не нужны.
        .to(outline, { autoAlpha: 0, duration: 0.4 }, "-=0.45")
        // 4. Вылетает хвост.
        .to(
          tailEl,
          { autoAlpha: 1, x: 0, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.5)" },
          "-=0.35",
        );
    }

    return () => {
      timeline.kill();
      // Возвращаем разметку в конечное состояние: если компонент
      // перемонтируется, знак не должен остаться полусобранным.
      gsap.set([ringEl, tailEl], { clearProps: "all" });
      gsap.set(outline, { autoAlpha: 0 });
    };
  }, [root, simplified, enabled]);
}
