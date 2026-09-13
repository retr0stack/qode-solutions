"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useHasPointer, useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import { useLogoIntro } from "./useLogoIntro";
import { useLogoParallax } from "./useLogoParallax";
import { useLogoTilt } from "./useLogoTilt";

interface HeroLogoProps {
  /** Секция hero — по ней считается область для наклона и сцена скролла. */
  section: React.RefObject<HTMLElement | null>;
  className?: string;
}

/**
 * Знак Q в первом экране.
 *
 * Рисунок больше не собирается кодом: используется исходный файл логотипа
 * /public/logo_q.png. Всё движение построено слоями вокруг него, а сам
 * файл остаётся нетронутым.
 *
 * Слои, снизу вверх:
 *   1) свечение — размытое пятно ПОД знаком, пульсирует с периодом 9 с;
 *   2) знак     — покачивание по оси Y ±6° с периодом 14 с, наклон по курсору;
 *   3) блик     — светлая полоса, раз в 6 с проезжающая по силуэту через маску.
 *
 * Размывается только свечение. Сам знак не имеет ни одного фильтра и
 * остаётся абсолютно резким: раньше блюр лежал на общем контейнере и
 * замыливал логотип вместе с ореолом.
 *
 * Колец, орбит и точек-спутников здесь больше нет. Пять одновременных
 * бесконечных анимаций спорили друг с другом и читались как набор
 * эффектов, а не как одна сцена.
 *
 * Разделение обязательно: бесконечные CSS-анимации и transform от GSAP
 * пишутся в РАЗНЫЕ элементы, иначе они перезаписывали бы друг друга.
 *
 * Движение не зависит от пользователя: даже если ничего не трогать, знак
 * продолжает дышать, орбиты вращаются, блик проезжает по кругу. Наклон по
 * курсору и параллакс по скроллу — только надстройка сверху.
 */
export function HeroLogo({ section, className }: HeroLogoProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const hasPointer = useHasPointer();

  const animate = !reduced;

  useLogoIntro(introRef, animate);
  useLogoParallax(parallaxRef, section, animate);
  useLogoTilt(tiltRef, section, animate && isDesktop && hasPointer);

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none relative aspect-square w-full", className)}
    >
      {/* 1. Ореол. Самый нижний слой, задаёт свечение вокруг знака. */}
      <span
        className={cn(
          "absolute inset-[6%] rounded-full blur-[46px] will-change-transform",
          "bg-[radial-gradient(circle,rgb(34_211_238/0.55),rgb(43_141_255/0.34)_45%,transparent_72%)]",
          /* Период 9 с — в противофазе с покачиванием знака (14 с). */
          "motion-safe:animate-[halo-pulse_9s_var(--ease-in-out-quart)_infinite]",
        )}
      />

      {/* 5. Сам знак. Каждый вид движения – на своём элементе. */}
      <div ref={parallaxRef} className="absolute inset-0 will-change-transform">
        <div ref={introRef} className="size-full">
          <div className="size-full [perspective:1200px]">
            <div className="size-full motion-safe:animate-[logo-sway_14s_var(--ease-in-out-quart)_infinite] [transform-style:preserve-3d]">
              <div
                ref={tiltRef}
                className="relative size-full [perspective:1000px] [transform-style:preserve-3d]"
              >
                <Image
                  src="/logo_q.webp"
                  alt=""
                  fill
                  priority
                  quality={95}
                  sizes="(min-width: 1024px) 36rem, (min-width: 768px) 52vw, 62vw"
                  className="object-contain"
                />

                {/* 6. Блик. Маска по силуэту знака – полоса едет строго по Q. */}
                <span
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    maskImage: "url(/logo_q.webp)",
                    WebkitMaskImage: "url(/logo_q.webp)",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskPosition: "center",
                    WebkitMaskPosition: "center",
                  }}
                >
                  <span className="absolute -inset-y-1/2 left-0 w-2/5 bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.45),transparent)] blur-md motion-safe:animate-[sheen-sweep_6s_var(--ease-in-out-quart)_infinite]" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
