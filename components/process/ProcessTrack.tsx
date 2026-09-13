"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";
import { useIsDesktop, usePrefersReducedMotion } from "@/lib/hooks";
import type { ProcessStepItem } from "./types";
import type { DictIntro } from "@/content/i18n";
import { ProcessStepCard } from "./ProcessStepCard";
import { ProcessProgress } from "./ProcessProgress";
import { SectionIntroBlock } from "@/components/primitives";

/**
 * Горизонтальная сцена «Как мы работаем».
 *
 * Разметка одна на все ширины — различается только поведение:
 *   ≥ lg и движение разрешено — секция пинится, трек едет по скроллу (GSAP);
 *   иначе                     — нативный горизонтальный скролл со snap.
 *
 * Так нет ни скачка при гидратации, ни двух разных деревьев, а на тач-экране
 * работает привычный свайп вместо перехвата скролла.
 */
interface ProcessTrackProps {
  steps: readonly ProcessStepItem[];
  /** Подпись региона для скринридеров — приходит из словаря. */
  label: string;
  intro: DictIntro;
}

export function ProcessTrack({ steps, label, intro }: ProcessTrackProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const pinned = isDesktop && !reduced;

  // Сцена на десктопе: пин секции + горизонтальный проезд трека.
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
          pin.style.setProperty("--process-progress", String(self.progress));
        },
      },
    });

    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(track, { clearProps: "all" });
      pin.style.removeProperty("--process-progress");
    };
  }, [pinned]);

  // Нативный режим: прогресс считаем от позиции горизонтального скролла.
  useEffect(() => {
    const viewport = viewportRef.current;
    const pin = pinRef.current;
    if (pinned || !viewport || !pin) return;

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = viewport.scrollWidth - viewport.clientWidth;
        pin.style.setProperty(
          "--process-progress",
          String(max > 0 ? viewport.scrollLeft / max : 0),
        );
      });
    };

    onScroll();
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      viewport.removeEventListener("scroll", onScroll);
    };
  }, [pinned]);

  return (
    <div
      ref={pinRef}
      className="relative flex flex-col justify-center gap-8 lg:h-svh lg:gap-10"
    >
      {/* Подводка едет вместе с карточками: на закреплённом экране они
          читаются как одна сцена, а не как заголовок и пустота под ним. */}
      <div className="gutter-x mx-auto w-full max-w-content">
        <SectionIntroBlock intro={intro} size="display-2" />
      </div>

      <div
        ref={viewportRef}
        // Трек прокручивается сам до lg; на десктопе его двигает GSAP.
        className="no-scrollbar overflow-x-auto snap-x snap-mandatory lg:overflow-hidden lg:snap-none"
        // Нативный трек — это регион, по которому можно ходить с клавиатуры.
        tabIndex={pinned ? -1 : 0}
        role="group"
        aria-label={label}
      >
        <div
          ref={trackRef}
          className="gutter-lead flex items-stretch gap-[var(--gutter)] pr-[var(--gutter)] will-change-transform"
        >
          {steps.map((step, index) => (
            <ProcessStepCard
              key={step.title}
              step={step}
              index={index + 1}
              total={steps.length}
            />
          ))}
        </div>
      </div>

      <div className="gutter-x mx-auto w-full max-w-content">
        <ProcessProgress steps={steps} />
      </div>
    </div>
  );
}
