"use client";

import { useEffect } from "react";

/**
 * Плавный переход по якорям внутри страницы через Lenis.
 *
 * Без перехвата нативный переход по хешу дерётся с инерцией: страница
 * прыгает, а потом доезжает. Отступ считаем по реальной высоте шапки,
 * а не по токену — так работает на любой ширине.
 *
 * Фокус переносим руками: preventDefault отменяет и его тоже, а без фокуса
 * пользователь клавиатуры после перехода останется на прежнем месте.
 */
export function useAnchorScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest("a");
      const href = anchor?.getAttribute("href");
      if (!href || !href.startsWith("#") || href.length < 2) return;

      const target = document.getElementById(href.slice(1));
      const lenis = window.__lenis;
      if (!target || !lenis) return;

      event.preventDefault();

      const headerHeight = document.querySelector("header")?.offsetHeight ?? 80;
      lenis.scrollTo(target, { offset: -headerHeight - 16 });

      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [enabled]);
}
