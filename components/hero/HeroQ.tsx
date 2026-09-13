"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useHasPointer, useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { QShape } from "./QShape";
import { useQBuildIn } from "./useQBuildIn";
import { useQGradientDrift } from "./useQGradientDrift";
import { useQTilt } from "./useQTilt";
import { useQDock } from "./useQDock";

interface HeroQProps {
  /** Секция hero: по ней считается сцена скролла и область для наклона. */
  section: React.RefObject<HTMLElement | null>;
}

/**
 * Большая Q в hero.
 *
 * Знак лежит в потоке документа (absolute внутри hero), а не в fixed-слое:
 * место предсказуемо на любой ширине, и на мобильном он не перекрывает текст.
 * Всё движение — только transform и opacity.
 *
 * Позиционирование задаётся исключительно CSS, а transform целиком отдан
 * GSAP: поэтому вертикальное центрирование на десктопе сделано flexbox'ом,
 * а не translate — иначе сцены переписывали бы друг друга.
 *
 * Три режима:
 *   prefers-reduced-motion — статичный знак, никаких сцен;
 *   мобильный             — упрощённая сборка, без наклона по курсору;
 *   десктоп               — полная сборка, движение градиента, наклон, посадка в шапку.
 */
export function HeroQ({ section }: HeroQProps) {
  const moverRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const hasPointer = useHasPointer();

  const animate = !reduced;

  useQBuildIn(moverRef, { simplified: !isDesktop, enabled: animate });
  useQGradientDrift(moverRef, animate);
  useQTilt(svgRef, section, animate && isDesktop && hasPointer);
  useQDock(moverRef, section, animate);

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-0",
        // Знак прижат к правому краю и целиком внутри вьюпорта: за край он
        // не выходит, иначе появлялся бы горизонтальный скролл, а спрятать
        // его через overflow нельзя — по скроллу знак уезжает вверх, в шапку.
        "top-[3svh] right-0 w-[62vw]",
        "md:top-[4svh] md:w-[52vw]",
        // От lg — справа от текстовой колонки, по центру по вертикали.
        "lg:inset-y-0 lg:top-0 lg:right-[2vw] lg:flex lg:w-[40vw] lg:max-w-[36rem] lg:items-center",
      )}
    >
      <div ref={moverRef} className="w-full [perspective:900px] will-change-transform">
        <QShape
          ref={svgRef}
          className="w-full origin-center drop-shadow-[0_0_90px_rgb(43_127_255/0.28)]"
        />
      </div>
    </div>
  );
}
