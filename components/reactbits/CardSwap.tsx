"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactElement,
  type ReactNode,
} from "react";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks";

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i,
});

const placeNow = (el: HTMLElement | null, slot: Slot, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
};

interface CardSwapProps {
  width: number | string;
  height: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  skewAmount?: number;
  easing?: "elastic" | "linear";
  /** Индекс карточки, которая должна оказаться сверху. Управляется извне. */
  index: number;
  onIndexChange: (index: number) => void;
  className?: string;
  children: ReactNode;
}

/**
 * Колода карточек. Порт компонента React Bits card-swap.
 *
 * Главное отличие от оригинала: автопрокрутки по таймеру нет. В оригинале
 * колода перелистывается сама каждые 5 секунд, а здесь на карточках текст,
 * который человек читает — уезжающая из-под глаз карточка это ровно то,
 * что раздражает. Листает пользователь: кнопками, стрелками с клавиатуры
 * или кликом по карточке.
 *
 * Механика анимации сохранена: передняя карточка падает вниз, остальные
 * подтягиваются на слот вперёд, бывшая передняя возвращается в конец
 * колоды. Позиции задаются через gsap.set/to по x/y/z — трансформации,
 * без reflow.
 *
 * При prefers-reduced-motion карточки просто переставляются без анимации.
 */
export function CardSwap({
  width,
  height,
  cardDistance = 56,
  verticalDistance = 64,
  skewAmount = 5,
  easing = "elastic",
  index,
  onIndexChange,
  className,
  children,
}: CardSwapProps) {
  const reduced = usePrefersReducedMotion();

  const config = useMemo(
    () =>
      easing === "elastic"
        ? {
            ease: "elastic.out(0.6,0.9)",
            durDrop: 1.4,
            durMove: 1.4,
            durReturn: 1.4,
            promoteOverlap: 0.9,
            returnDelay: 0.05,
          }
        : {
            ease: "power1.inOut",
            durDrop: 0.7,
            durMove: 0.7,
            durReturn: 0.7,
            promoteOverlap: 0.45,
            returnDelay: 0.2,
          },
    [easing],
  );

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const total = childArr.length;

  const refs = useMemo(
    () => Array.from({ length: total }, () => ({ current: null as HTMLDivElement | null })),
    [total],
  );

  /* Порядок колоды: первый элемент — передняя карточка. Держим в ref, а не
     в состоянии: он меняется внутри анимации и не должен вызывать рендер. */
  const order = useRef<number[]>(Array.from({ length: total }, (_, i) => i));
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const swapRef = useRef<(() => void) | null>(null);
  const animating = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Первичная раскладка.
  useEffect(() => {
    order.current = Array.from({ length: total }, (_, i) => i);
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));
  }, [refs, total, cardDistance, verticalDistance, skewAmount]);

  const swap = useCallback(() => {
    if (order.current.length < 2 || animating.current) return;

    const [front, ...rest] = order.current;
    if (front === undefined) return;
    const elFront = refs[front]?.current;
    if (!elFront) return;

    const finish = () => {
      order.current = [...rest, front];
      animating.current = false;
      const top = order.current[0] ?? 0;
      // Ещё не доехали до цели — делаем следующий шаг сами.
      if (top !== targetRef.current) {
        swapRef.current?.();
        return;
      }
      onIndexChange(top);
    };

    if (reduced) {
      rest.forEach((idx, i) =>
        placeNow(refs[idx]?.current ?? null, makeSlot(i, cardDistance, verticalDistance, total), skewAmount),
      );
      placeNow(elFront, makeSlot(total - 1, cardDistance, verticalDistance, total), skewAmount);
      finish();
      return;
    }

    animating.current = true;
    const tl = gsap.timeline({ onComplete: finish });
    tlRef.current = tl;

    tl.to(elFront, { y: "+=520", duration: config.durDrop, ease: config.ease });
    tl.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

    rest.forEach((idx, i) => {
      const el = refs[idx]?.current;
      if (!el) return;
      const slot = makeSlot(i, cardDistance, verticalDistance, total);
      tl.set(el, { zIndex: slot.zIndex }, "promote");
      tl.to(
        el,
        { x: slot.x, y: slot.y, z: slot.z, duration: config.durMove, ease: config.ease },
        `promote+=${i * 0.12}`,
      );
    });

    const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);
    tl.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
    tl.call(() => void gsap.set(elFront, { zIndex: backSlot.zIndex }), undefined, "return");
    tl.to(
      elFront,
      { x: backSlot.x, y: backSlot.y, z: backSlot.z, duration: config.durReturn, ease: config.ease },
      "return",
    );
  }, [refs, total, cardDistance, verticalDistance, skewAmount, config, reduced, onIndexChange]);

  swapRef.current = swap;

  /*
   * Внешний индекс — источник правды. Колода умеет двигаться только
   * вперёд, поэтому до нужной карточки она доезжает несколькими шагами.
   *
   * Цель держим в ref и дожимаем после каждого шага: раньше эффект делал
   * ровно один swap и на этом останавливался. Если человек тыкал в точку
   * через две-три позиции, подпись менялась сразу, а колода доезжала
   * только на один шаг и замирала — это и выглядело как «нажал, а карточка
   * не перелистнулась».
   */
  const targetRef = useRef(index);
  targetRef.current = index;

  useEffect(() => {
    if (order.current[0] === index || animating.current) return;
    swap();
  }, [index, swap]);

  useEffect(() => () => void tlRef.current?.kill(), []);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child as ReactElement<Record<string, unknown>>, {
          key: i,
          ref: (el: HTMLDivElement | null) => {
            const slot = refs[i];
            if (slot) slot.current = el;
          },
          style: { width, height },
          onClick: swap,
        })
      : child,
  );

  return (
    <div ref={containerRef} className={cn("cs-root", className)} style={{ width, height }}>
      {rendered}
    </div>
  );
}

/** Карточка колоды. Содержимое — текст, а не картинка. */
export function Card({
  ref,
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  ref?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={ref} className={cn("cs-card", className)} {...rest}>
      {children}
    </div>
  );
}
