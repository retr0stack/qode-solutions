"use client";

import { useEffect } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Появление знака при загрузке: он «проявляется» из размытия, приезжает
 * из глубины и один раз довольно упруго доворачивается.
 *
 * Анимация одноразовая и живёт на отдельном элементе, чтобы не спорить
 * с бесконечными CSS-циклами (дыхание, покачивание) на соседних слоях.
 *
 * Без JS и при prefers-reduced-motion знак остаётся в конечном состоянии —
 * разметка изначально видима, начальное состояние выставляет уже GSAP.
 */
export function useLogoIntro(
  target: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  useEffect(() => {
    const node = target.current;
    if (!enabled || !node) return;

    const timeline = gsap.timeline();

    timeline
      .fromTo(
        node,
        { autoAlpha: 0, scale: 0.72, rotate: -14, filter: "blur(18px)" },
        {
          autoAlpha: 1,
          scale: 1,
          rotate: 0,
          filter: "blur(0px)",
          duration: 1.5,
          ease: "expo.out",
        },
      )
      // Короткий «доворот»: знак чуть перелетает и возвращается.
      .to(node, { rotate: 3, duration: 0.5, ease: "sine.inOut" }, "-=0.45")
      .to(node, { rotate: 0, duration: 0.9, ease: "elastic.out(1, 0.55)" });

    return () => {
      timeline.kill();
      gsap.set(node, { clearProps: "all" });
    };
  }, [target, enabled]);
}
