"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Heading, Text } from "@/components/primitives";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import type { DictStoryChapter } from "@/content/i18n";

interface StoryMosaicProps {
  chapters: readonly DictStoryChapter[];
}

/** Вертикальный сдвиг плиток — мозаика, а не ровный ряд. */
const OFFSET = ["lg:mt-0", "lg:mt-24", "lg:mt-10", "lg:mt-32", "lg:mt-6"];
/** Ширина плитки зависит от объёма главы, а не от её номера. */
const WIDTH = [
  "w-[80vw] sm:w-[62vw] lg:w-[30rem]",
  "w-[80vw] sm:w-[58vw] lg:w-[24rem]",
  "w-[80vw] sm:w-[62vw] lg:w-[32rem]",
  "w-[80vw] sm:w-[58vw] lg:w-[26rem]",
  "w-[80vw] sm:w-[62vw] lg:w-[30rem]",
];

/**
 * История агентства как мозаика, которую разбирают прокруткой.
 *
 * Движение двойное и в этом весь смысл: страница листается вниз, а сцена
 * едет вбок — плитки при этом стоят на разной высоте, поэтому взгляд идёт
 * не по прямой, а зигзагом. Обычный вертикальный таймлайн такого ритма не
 * даёт, а чистый горизонтальный слайдер требует от человека нового жеста.
 *
 * Управление тоже двойное: можно просто скроллить, а можно ткнуть в номер
 * главы внизу — сцена доедет до неё сама. Номера показывают, сколько
 * осталось, и это единственная навигация внутри истории.
 *
 * На узких экранах и при prefers-reduced-motion пина нет: остаётся
 * нативный горизонтальный свайп со snap, а мозаика выравнивается в ряд.
 * Ни одна глава не остаётся невидимой ни в одном из режимов.
 */
export function StoryMosaic({ chapters }: StoryMosaicProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const [active, setActive] = useState(0);

  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const pinned = isDesktop && !reduced;

  // Десктоп: пин секции и горизонтальный проезд трека по скроллу.
  useEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pinned || !pin || !track) return;

    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

    const tween = gsap.to(track, {
      x: () => -distance(),
      ease: "none",
      scrollTrigger: {
        trigger: pin,
        start: "top top",
        end: () => `+=${distance()}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          pin.style.setProperty("--story-progress", String(self.progress));
          // Активная глава — по доле проезда, без замеров DOM на каждый кадр.
          const index = Math.round(self.progress * (chapters.length - 1));
          setActive(index);
        },
      },
    });

    triggerRef.current = tween.scrollTrigger ?? null;
    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      triggerRef.current = null;
      gsap.set(track, { clearProps: "all" });
      pin.style.removeProperty("--story-progress");
    };
  }, [pinned, chapters.length]);

  // Нативный режим: прогресс и активная глава считаются от scrollLeft.
  useEffect(() => {
    const viewport = viewportRef.current;
    const pin = pinRef.current;
    if (pinned || !viewport || !pin) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        const progress = max > 0 ? viewport.scrollLeft / max : 0;
        pin.style.setProperty("--story-progress", String(progress));
        setActive(Math.round(progress * (chapters.length - 1)));
      });
    };

    onScroll();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [pinned, chapters.length]);

  /* Переход к главе по клику. В пине сцены двигаться можно только
     страницей — поэтому здесь пересчёт доли в позицию документа. */
  const goTo = useCallback(
    (index: number) => {
      const share = chapters.length > 1 ? index / (chapters.length - 1) : 0;

      if (pinned && triggerRef.current) {
        const { start, end } = triggerRef.current;
        window.scrollTo({ top: start + (end - start) * share, behavior: "smooth" });
        return;
      }

      const viewport = viewportRef.current;
      if (!viewport) return;
      const max = viewport.scrollWidth - viewport.clientWidth;
      viewport.scrollTo({ left: max * share, behavior: "smooth" });
    },
    [chapters.length, pinned],
  );

  return (
    <div
      ref={pinRef}
      className="relative flex flex-col justify-center gap-10 lg:h-svh"
    >
      <div
        ref={viewportRef}
        className="no-scrollbar snap-x snap-mandatory overflow-x-auto lg:snap-none lg:overflow-hidden"
        tabIndex={pinned ? -1 : 0}
        role="group"
        aria-label={chapters[0]?.title}
      >
        <ol
          ref={trackRef}
          className="gutter-lead flex items-start gap-[var(--gutter)] pr-[var(--gutter)] will-change-transform"
        >
          {chapters.map((chapter, index) => {
            const current = active === index;

            return (
              <li
                key={chapter.marker}
                className={cn(
                  "shrink-0 snap-center lg:snap-align-none",
                  WIDTH[index % WIDTH.length],
                  OFFSET[index % OFFSET.length],
                )}
              >
                <article
                  className={cn(
                    "surface relative flex flex-col gap-4 overflow-hidden p-6 md:p-8",
                    "transition-[opacity,transform] duration-500 ease-brand",
                    current ? "opacity-100 lg:scale-100" : "opacity-100 lg:scale-[0.97] lg:opacity-60",
                  )}
                >
                  {/* Градиентная полоса сверху — маркер текущей главы. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute inset-x-0 top-0 h-[3px] origin-left bg-[image:var(--gradient-brand)]",
                      "transition-transform duration-500 ease-brand",
                      current ? "scale-x-100" : "scale-x-0",
                    )}
                  />

                  <p className="text-fg-2 font-mono text-caption tabular-nums">
                    {chapter.marker}
                  </p>

                  <Heading level={3} size="display-3" className="max-w-[16ch]">
                    {chapter.title}
                  </Heading>

                  <Text size="small" className="max-w-[42ch]">
                    {chapter.text}
                  </Text>

                  {chapter.accent ? (
                    <p className="font-display text-gradient mt-1 max-w-[24ch] text-title font-semibold">
                      {chapter.accent}
                    </p>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Навигация: линия прогресса и номера глав. */}
      <div className="gutter-x mx-auto flex w-full max-w-content flex-col gap-4">
        <div
          aria-hidden="true"
          className="bg-line relative h-px w-full overflow-hidden rounded-full"
        >
          <span
            className="absolute inset-0 origin-left bg-[image:var(--gradient-brand)]"
            style={{ transform: "scaleX(var(--story-progress, 0))" }}
          />
        </div>

        <ul className="flex items-center justify-between gap-2">
          {chapters.map((chapter, index) => (
            <li key={chapter.marker}>
              <button
                type="button"
                onClick={() => goTo(index)}
                aria-current={active === index ? "true" : undefined}
                className={cn(
                  "rounded-full px-2 py-1 font-mono text-caption tabular-nums transition-colors duration-300",
                  active === index
                    ? "text-[color:var(--color-accent)]"
                    : "text-fg-2 hover:text-fg",
                )}
              >
                <span className="lg:hidden">{chapter.marker}</span>
                <span className="hidden lg:inline">
                  {chapter.marker} · {chapter.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
