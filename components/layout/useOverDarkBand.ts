"use client";

import { useEffect, useState } from "react";

/**
 * Стоит ли шапка сейчас над тёмной полосой в начале страницы.
 *
 * Ищем первую секцию с data-surface="dark", прижатую к верху документа
 * (hero на главной, PageIntro на внутренних), и сравниваем её низ с текущим
 * скроллом. Так шапка перекрашивается по факту вёрстки, а не по магическому
 * порогу вроде «70% высоты экрана», и работает одинаково на всех страницах.
 *
 * Начальное значение — true: все страницы сайта начинаются тёмной полосой,
 * поэтому при первой отрисовке шапка светлая по контенту и не мигает.
 * Если тёмной полосы нет, первый же замер вернёт false.
 */
export function useOverDarkBand(pathname: string): boolean {
  const [overDark, setOverDark] = useState(true);

  useEffect(() => {
    let bandBottom = 0;
    let frame = 0;

    const measure = () => {
      const band = document.querySelector<HTMLElement>('#main [data-surface="dark"]');
      if (!band) {
        bandBottom = 0;
        return;
      }
      const rect = band.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      // Полоса должна начинаться у самого верха — иначе это тёмная секция
      // где-то в середине страницы, и шапку она не касается.
      bandBottom = top > 8 ? 0 : top + rect.height;
    };

    const update = () => {
      const headerHeight = document.querySelector("header")?.offsetHeight ?? 0;
      setOverDark(window.scrollY + headerHeight < bandBottom);
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Подмена шрифта меняет высоту полосы — замеряем ещё раз после загрузки.
    void document.fonts?.ready.then(onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [pathname]);

  return overDark;
}
