"use client";

import { useEffect, useRef, useState } from "react";
import { Heading, Text } from "@/components/primitives";
import { cn } from "@/lib/cn";
import type { DictStoryChapter } from "@/content/i18n";

interface StoryDeckProps {
  chapters: readonly DictStoryChapter[];
}

/**
 * История агентства горизонтальной лентой.
 *
 * Колода с перелистыванием отсюда убрана: на карточках текст, который
 * читают, а колода показывала ровно одну главу за раз и заставляла жать
 * кнопку, чтобы увидеть следующую. Лента показывает сразу несколько глав
 * и листается тем же жестом, что и остальные разделы сайта.
 *
 * Анимация не декоративная, а навигационная: карточка в центре вьюпорта
 * поднимается, набирает контраст и цветную полосу, соседние приглушены.
 * Активная определяется через IntersectionObserver по узкой полосе в
 * середине экрана — без обработчика scroll и без пересчёта координат на
 * каждый кадр.
 */
export function StoryDeck({ chapters }: StoryDeckProps) {
  const trackRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-chapter]"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = Number((entry.target as HTMLElement).dataset.chapter);
          setActive(index);
        });
      },
      {
        root: track,
        // Узкая полоса по центру: активна та карточка, что сейчас в фокусе взгляда.
        rootMargin: "0px -45% 0px -45%",
        threshold: 0.1,
      },
    );

    cards.forEach((card) => io.observe(card));
    return () => io.disconnect();
  }, [chapters.length]);

  const scrollTo = (index: number) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(`[data-chapter="${index}"]`);
    if (!track || !card) return;
    /* Считаем позицию сами, а не scrollIntoView: тот прокручивает ещё и
       страницу по вертикали, чтобы дотянуть карточку до центра окна, и
       ленту уносит вместе со всем экраном. */
    const left = card.offsetLeft - (track.clientWidth - card.clientWidth) / 2;
    track.scrollTo({ left, behavior: "smooth" });
  };

  /*
   * Перетаскивание мышью.
   *
   * Лента листается пальцем и шифтом с колесом, но обычной мышью её не
   * сдвинуть: горизонтальной прокрутки у неё нет, а полоса скрыта. Из-за
   * этого на десктопе раздел выглядел статичным. Кнопки ниже решают ту же
   * задачу, но тянуть карточки рукой привычнее.
   */
  const dragRef = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (event: React.PointerEvent<HTMLOListElement>) => {
    const track = trackRef.current;
    if (!track || event.pointerType === "touch") return;
    dragRef.current = { active: true, startX: event.clientX, startLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLOListElement>) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    track.scrollLeft = dragRef.current.startLeft - (event.clientX - dragRef.current.startX);
  };

  const endDrag = (event: React.PointerEvent<HTMLOListElement>) => {
    const track = trackRef.current;
    if (!track || !dragRef.current.active) return;
    dragRef.current.active = false;
    track.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div className="flex flex-col gap-8">
      <ol
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pt-2 pb-6",
          "cursor-grab touch-pan-x select-none active:cursor-grabbing",
          "[mask-image:linear-gradient(90deg,transparent,#000_4%,#000_96%,transparent)]",
        )}
      >
        {chapters.map((chapter, index) => {
          const isActive = index === active;

          return (
            <li
              key={chapter.marker}
              data-chapter={index}
              className="w-[82vw] shrink-0 snap-center sm:w-[26rem]"
            >
              <article
                className={cn(
                  "surface relative flex h-full min-h-[17rem] flex-col gap-3 overflow-hidden p-6 md:p-8",
                  "transition-[transform,opacity,box-shadow] duration-500 ease-brand",
                  isActive
                    ? "opacity-100 motion-safe:-translate-y-2 motion-safe:shadow-[0_28px_60px_-30px_rgb(16_32_46/0.35)]"
                    : "opacity-55",
                )}
              >
                {/* Полоса набирает ширину, когда глава оказывается в центре. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 top-0 h-1 origin-left bg-[image:var(--gradient-brand)]",
                    "transition-transform duration-500 ease-brand",
                    isActive ? "scale-x-100" : "scale-x-0",
                  )}
                />

                <span className="text-fg-2 font-mono text-caption tabular-nums">
                  {chapter.marker}
                </span>

                <Heading level={3} size="title">
                  {chapter.title}
                </Heading>

                <Text size="small">{chapter.text}</Text>

                {chapter.accent ? (
                  <p className="text-gradient font-display mt-auto pt-2 text-small font-semibold">
                    {chapter.accent}
                  </p>
                ) : null}
              </article>
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-4">
        {/* Стрелки: без них мышь ленту не сдвинет, а полосы прокрутки нет. */}
        <div className="flex items-center gap-2">
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() =>
                scrollTo(
                  Math.min(
                    chapters.length - 1,
                    Math.max(0, active + (dir === "prev" ? -1 : 1)),
                  ),
                )
              }
              aria-label={dir === "prev" ? chapters[0]?.title : chapters[chapters.length - 1]?.title}
              disabled={dir === "prev" ? active === 0 : active === chapters.length - 1}
              className="border-line hover:border-[color:var(--color-accent)] inline-flex size-10 items-center justify-center rounded-full border transition-colors disabled:opacity-35"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
                <path
                  d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ))}
        </div>

        <ul className="flex items-center gap-2">
          {chapters.map((chapter, index) => (
            <li key={chapter.marker}>
              <button
                type="button"
                onClick={() => scrollTo(index)}
                aria-label={chapter.title}
                aria-current={index === active ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-400",
                  index === active ? "w-8 bg-[image:var(--gradient-brand)]" : "bg-line w-2",
                )}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
