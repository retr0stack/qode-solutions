"use client";

import { useEffect } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";

/** С какого прогресса начинается передача эстафеты знаку в шапке. */
const HANDOFF_START = 0.86;

interface Measurement {
  dx: number;
  dy: number;
  scale: number;
}

/**
 * По скроллу знак уменьшается и уезжает в шапку, на своё место в логотипе.
 *
 * Считается по факту, а не по магическим числам: замеряем, где лежит слот
 * [data-q-dock] в шапке и где — сам знак, и получаем нужные сдвиг и масштаб.
 * Пересчёт на каждом refresh (ресайз, смена шрифта), поэтому посадка точная
 * на любой ширине.
 *
 * В конце пути travelling-Q гаснет, а знак в шапке проявляется через
 * --header-mark-opacity — на глаз это одна и та же фигура.
 */
export function useQDock(
  mover: React.RefObject<HTMLElement | null>,
  section: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const node = mover.current;
    const hero = section.current;
    const root = document.documentElement;

    if (!enabled || !node || !hero) {
      // Без сцены знак в шапке нужен сразу.
      root.style.setProperty("--header-mark-opacity", "1");
      return;
    }

    root.style.setProperty("--header-mark-opacity", "0");
    gsap.set(node, { transformOrigin: "0 0" });

    const measure = (): Measurement => {
      const slot = document.querySelector<HTMLElement>("[data-q-dock]");
      if (!slot) return { dx: 0, dy: 0, scale: 1 };

      // Снимаем трансформ, чтобы получить честную геометрию макета.
      const saved = node.style.transform;
      node.style.transform = "none";
      const qRect = node.getBoundingClientRect();
      node.style.transform = saved;

      const slotRect = slot.getBoundingClientRect();
      const scrollAtEnd = hero.offsetTop + hero.offsetHeight;

      return {
        dx: slotRect.left - (qRect.left + window.scrollX),
        dy: slotRect.top - (qRect.top + window.scrollY - scrollAtEnd),
        scale: slotRect.width / qRect.width,
      };
    };

    let measured = measure();

    const tween = gsap.to(node, {
      x: () => measured.dx,
      y: () => measured.dy,
      scale: () => measured.scale,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
        invalidateOnRefresh: true,
        onRefresh: () => {
          measured = measure();
        },
        onUpdate: (self) => {
          const handoff = gsap.utils.clamp(
            0,
            1,
            (self.progress - HANDOFF_START) / (1 - HANDOFF_START),
          );
          root.style.setProperty("--header-mark-opacity", String(handoff));
          node.style.opacity = String(1 - handoff);
        },
      },
    });

    // Подмена шрифта меняет высоту hero — пересчитываем после её загрузки.
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(node, { clearProps: "all" });
      root.style.removeProperty("--header-mark-opacity");
    };
  }, [mover, section, enabled]);
}
