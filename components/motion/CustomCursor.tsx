"use client";

import { useEffect, useRef, useState } from "react";
import { useHasPointer, usePrefersReducedMotion } from "@/lib/hooks";

/** Элементы, над которыми курсор реагирует. */
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary';

/**
 * Курсор сайта.
 *
 * Один элемент вместо двух.
 *
 * Прошлая версия состояла из точки и догоняющего кольца, и точка при
 * резком движении оказывалась снаружи. Чинить рассинхрон двух объектов,
 * которые движутся с разной скоростью, бессмысленно: пока они разные,
 * разойтись они могут всегда. Здесь рисуется одна окружность, её позиция
 * ставится синхронно в обработчике движения, и расходиться нечему.
 *
 * Реакция на интерактивные элементы – размером и заливкой, а не вторым
 * объектом: над ссылкой кольцо увеличивается и наливается цветом.
 *
 * Цвет фирменный, а не производный от текста. Полупрозрачное серое
 * кольцо пропадало и на белом, и на тёмно-синем – теперь оно голубое,
 * с тонкой светлой обводкой снаружи и мягким свечением. Обводка держит
 * контур на светлом фоне, свечение – на тёмном.
 *
 * Выключается на тач-устройствах и при prefers-reduced-motion – там
 * системный курсор либо отсутствует, либо нужен как есть.
 */
export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.dataset.customCursor = "on";

    const onMove = (event: PointerEvent) => {
      const node = ref.current;
      if (!node) return;

      /* Позиция ставится прямо здесь, а не в кадре анимации: любая
         отложенная отрисовка – это отставание от настоящего курсора. */
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (!visible) setVisible(true);
    };

    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      setActive(Boolean(target?.closest?.(INTERACTIVE)));
    };

    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.customCursor;
    };
  }, [enabled, visible]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms linear" }}
    >
      {/* Внешняя обёртка несёт позицию, вложенный элемент – центровку и
          размер: так transform позиции не смешивается с transform
          центровки и их не нужно пересчитывать вместе. */}
      <div ref={ref} className="absolute top-0 left-0 will-change-transform">
        <span
          className="block rounded-full border-2 transition-[width,height,background-color,border-color,box-shadow] duration-200 ease-out"
          style={{
            width: active ? 44 : 22,
            height: active ? 44 : 22,
            transform: "translate(-50%, -50%)",
            borderColor: active ? "var(--color-cyan)" : "var(--color-blue)",
            backgroundColor: active
              ? "color-mix(in srgb, var(--color-cyan) 22%, transparent)"
              : "color-mix(in srgb, var(--color-blue) 10%, transparent)",
            /* Светлая обводка снаружи + свечение: первая читается на
               светлом фоне, второе – на тёмном. */
            boxShadow: active
              ? "0 0 0 1px rgb(255 255 255 / 0.5), 0 0 18px rgb(34 211 238 / 0.55)"
              : "0 0 0 1px rgb(255 255 255 / 0.35), 0 0 12px rgb(43 141 255 / 0.45)",
          }}
        />
      </div>
    </div>
  );
}
