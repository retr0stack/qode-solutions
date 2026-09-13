"use client";

import { useEffect, useRef, useState } from "react";
import { useHasPointer, usePrefersReducedMotion } from "@/lib/hooks";

/** Насколько кольцо догоняет точку за кадр. Больше — жёстче связка. */
const RING_FOLLOW = 0.28;

const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, summary';

/**
 * Кастомный курсор: точка ровно под пальцем и кольцо, догоняющее её.
 *
 * Точка позиционируется прямо в обработчике pointermove — без пружин, без
 * requestAnimationFrame и без промежуточных состояний. Задержка равна
 * задержке самого события, то есть отклик совпадает с системным курсором.
 *
 * Кольцо — единственное, что отстаёт, и делает это намеренно: его позиция
 * подтягивается к точке в цикле rAF. Один цикл на весь курсор.
 *
 * Главное: за время движения мыши здесь не происходит ни одного React-рендера.
 * Позиции пишутся напрямую в style.transform по рефам, наведение отслеживается
 * событиями pointerover/pointerout (они срабатывают на смене элемента, а не
 * на каждый пиксель), а состояние меняется только когда значение реально
 * другое. Именно ежекадровый setState и пружина на точке давали ощущение,
 * что курсор «плывёт» и не поспевает за рукой.
 *
 * На тач-устройствах и при prefers-reduced-motion компонент не рендерится —
 * там остаётся системный курсор.
 */
export function CustomCursor() {
  const hasPointer = useHasPointer();
  const reduced = usePrefersReducedMotion();
  const enabled = hasPointer && !reduced;

  const dotRef = useRef<HTMLSpanElement>(null);
  const ringRef = useRef<HTMLSpanElement>(null);

  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);

  // Читаются и пишутся только внутри обработчиков и rAF — рендер не трогают.
  const pointer = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const visibleRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.dataset.customCursor = "on";

    const onMove = (event: PointerEvent) => {
      pointer.current.x = event.clientX;
      pointer.current.y = event.clientY;

      // Точка ставится синхронно с событием — это и есть «реальное время».
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }

      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
    };

    /* pointerover/pointerout срабатывают на смене элемента под курсором,
       а не на каждое движение: closest() вызывается в разы реже. */
    const onOver = (event: PointerEvent) => {
      const target = event.target as Element | null;
      const next = Boolean(target?.closest(INTERACTIVE));
      if (next !== activeRef.current) {
        activeRef.current = next;
        setActive(next);
      }
    };

    const onLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    let frame = 0;
    const tick = () => {
      const node = ringRef.current;
      if (node) {
        ring.current.x += (pointer.current.x - ring.current.x) * RING_FOLLOW;
        ring.current.y += (pointer.current.y - ring.current.y) * RING_FOLLOW;
        node.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0)`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      delete document.documentElement.dataset.customCursor;
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 150ms linear" }}
    >
      {/* Обёртки несут позицию, вложенные элементы – центровку и размер.
          Так transform позиции не смешивается с transform центровки. */}
      <span ref={dotRef} className="absolute top-0 left-0 block will-change-transform">
        <span className="block size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[image:var(--gradient-brand)]" />
      </span>

      <span ref={ringRef} className="absolute top-0 left-0 block will-change-transform">
        <span
          className="border-fg/25 block size-9 -translate-x-1/2 -translate-y-1/2 rounded-full border"
          style={{
            transform: `translate(-50%, -50%) scale(${active ? 1.45 : 1})`,
            opacity: active ? 0.9 : 0.5,
            transition: "transform 180ms cubic-bezier(0.22,1,0.36,1), opacity 180ms linear",
          }}
        />
      </span>
    </div>
  );
}
