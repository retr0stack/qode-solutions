"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger, gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { Heading, Text } from "@/components/primitives";
import { usePrefersReducedMotion } from "@/lib/hooks";
import type { DictStoryChapter } from "@/content/i18n";

interface StoryTimelineProps {
  chapters: readonly DictStoryChapter[];
}

/**
 * История агентства как проводка по странице.
 *
 * Две связанные механики:
 *   1) вертикальный рельс слева заполняется градиентом ровно на долю
 *      пролистанной истории (scrub, поэтому заполнение не «догоняет»);
 *   2) крупный номер главы слева залипает и меняется, когда читатель
 *      переходит к следующей главе.
 *
 * Номер меняет IntersectionObserver, а не расчёты на скролле: браузер
 * считает пересечения вне главного потока, и на прокрутке не появляется
 * работы на каждый кадр.
 *
 * Заполнение рельса — scaleX/scaleY по transform: ни одного свойства,
 * вызывающего reflow. При prefers-reduced-motion рельс просто залит целиком,
 * а главы остаются на местах — контент не прячется никогда.
 */
export function StoryTimeline({ chapters }: StoryTimelineProps) {
  const scopeRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLSpanElement>(null);
  const chapterRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const reduced = usePrefersReducedMotion();

  // Заполнение рельса по прогрессу прокрутки истории.
  useEffect(() => {
    const scope = scopeRef.current;
    const rail = railRef.current;
    if (reduced || !scope || !rail) return;

    const tween = gsap.fromTo(
      rail,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: scope,
          start: "top 60%",
          end: "bottom 75%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );

    void document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      gsap.set(rail, { clearProps: "all" });
    };
  }, [reduced]);

  // Текущая глава для крупного номера слева.
  useEffect(() => {
    const nodes = chapterRefs.current.filter(
      (node): node is HTMLLIElement => node !== null,
    );
    if (nodes.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        const first = visible[0];
        if (!first) return;

        const index = nodes.indexOf(first.target as HTMLLIElement);
        if (index >= 0) setActiveIndex(index);
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 },
    );

    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [chapters.length]);

  return (
    <div ref={scopeRef} className="grid-12 gap-y-10">
      {/* Залипающий номер главы. */}
      <div className="col-span-4 md:col-span-8 lg:col-span-3">
        <div className="lg:sticky lg:top-[calc(var(--header-total)+5rem)]">
          <div className="flex items-baseline gap-4 lg:flex-col lg:items-start lg:gap-2">
            <span className="text-gradient font-display text-display-1 leading-none font-bold tabular-nums">
              {chapters[activeIndex]?.marker}
            </span>
            <span className="text-fg-2 text-caption tabular-nums">
              / {String(chapters.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* Рельс и главы. */}
      <div className="col-span-4 md:col-span-8 lg:col-span-8 lg:col-start-5">
        <div className="relative pl-8 md:pl-12">
          {/* Дорожка рельса и её градиентное заполнение. */}
          <span
            aria-hidden="true"
            className="bg-line absolute top-2 bottom-2 left-0 w-px"
          />
          <span
            ref={railRef}
            aria-hidden="true"
            className={cn(
              "absolute top-2 bottom-2 left-0 w-px origin-top bg-[image:var(--gradient-brand)]",
              reduced && "scale-y-100",
            )}
          />

          <ol className="flex flex-col">
            {chapters.map((chapter, index) => {
              const current = activeIndex === index;

              return (
                <li
                  key={chapter.marker}
                  ref={(node) => {
                    chapterRefs.current[index] = node;
                  }}
                  className="relative flex flex-col gap-4 py-10 first:pt-0 last:pb-0 md:py-14"
                >
                  {/* Узел на рельсе: у текущей главы он ярче и крупнее. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-[3.25rem] -left-8 size-3 -translate-x-1/2 rounded-full transition-all duration-500 ease-brand md:-left-12 md:top-[4.25rem]",
                      current
                        ? "scale-125 bg-[image:var(--gradient-brand)] shadow-[0_0_0_6px_rgb(34_211_238/0.16)]"
                        : "bg-line scale-100",
                    )}
                  />

                  <p className="text-fg-2 font-mono text-caption tabular-nums">
                    {chapter.marker}
                  </p>

                  <Heading level={3} size="display-3" className="max-w-[18ch]">
                    {chapter.title}
                  </Heading>

                  <Text size="lead" className="max-w-[56ch]">
                    {chapter.text}
                  </Text>

                  {chapter.accent ? (
                    <p className="font-display text-gradient mt-2 max-w-[26ch] text-title font-semibold">
                      {chapter.accent}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
}
