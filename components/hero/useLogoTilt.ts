"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/** Максимальный наклон по каждой оси. Больше выглядит как аттракцион. */
const MAX_DEGREES = 12;

/**
 * Наклон знака вслед за курсором.
 *
 * Затухание — на gsap.quickTo: без слушателей rAF и без пересборки твинов
 * на каждое движение мыши. Крутится отдельный вложенный элемент, поэтому
 * параллакс по скроллу и бесконечные CSS-циклы остаются нетронутыми.
 *
 * Когда курсор уходит из секции, наклон плавно возвращается в ноль —
 * знак не «залипает» в перекошенном положении.
 */
export function useLogoTilt(
  target: React.RefObject<HTMLElement | null>,
  scope: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const node = target.current;
    const area = scope.current;
    if (!enabled || !node || !area) return;

    const rotateX = gsap.quickTo(node, "rotationX", { duration: 0.9, ease: "power3.out" });
    const rotateY = gsap.quickTo(node, "rotationY", { duration: 0.9, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const box = area.getBoundingClientRect();
      // Нормируем к [-1, 1] от центра секции.
      const nx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const ny = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      rotateY(gsap.utils.clamp(-1, 1, nx) * MAX_DEGREES);
      rotateX(gsap.utils.clamp(-1, 1, -ny) * MAX_DEGREES);
    };

    const onLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    area.addEventListener("pointermove", onMove, { passive: true });
    area.addEventListener("pointerleave", onLeave);

    return () => {
      area.removeEventListener("pointermove", onMove);
      area.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(node);
      gsap.set(node, { clearProps: "transform" });
    };
  }, [target, scope, enabled]);
}
