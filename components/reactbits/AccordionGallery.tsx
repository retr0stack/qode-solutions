"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks";

export interface AccordionItem {
  image: string;
  label: string;
  /** Вторая строка подписи: роль, город, что угодно короткое. */
  meta?: string;
  href?: string;
  alt?: string;
}

interface AccordionGalleryProps {
  items: readonly AccordionItem[];
  defaultIndex?: number;
  /** Доля ширины, которую занимает раскрытая панель. 0.2–0.9. */
  expandRatio?: number;
  trigger?: "hover" | "click";
  height?: number;
  gap?: number;
  duration?: number;
  ease?: string;
  parallax?: number;
  tilt?: number;
  stagger?: number;
  grayscale?: boolean;
  className?: string;
}

/**
 * Аккордеон-галерея. Порт компонента React Bits accordion-gallery.
 *
 * Что изменено против оригинала:
 *   • цвета переведены на токены бренда — белый акцент заменён фирменным
 *     градиентом, чёрная подложка на --color-ink;
 *   • картинки идут через next/image, чтобы не терять оптимизацию и
 *     ленивую загрузку;
 *   • подпись получила вторую строку (роль человека), поэтому полоска
 *     выравнивается по верху, а не по центру;
 *   • prefers-reduced-motion проверяется через общий хук проекта, а не
 *     разовым matchMedia в теле компонента.
 *
 * Механика та же: активная панель растёт по flex-grow, соседние
 * поворачиваются по оси Y, медиа внутри уезжает параллаксом, неактивные
 * обесцвечиваются. Ширина медиа фиксирована в пикселях (--ag-media-size),
 * иначе картинка сжималась бы вместе с панелью и «дышала» при каждом
 * переключении.
 */
export function AccordionGallery({
  items,
  defaultIndex = 0,
  expandRatio = 0.42,
  trigger = "hover",
  height = 460,
  gap = 10,
  duration = 0.6,
  ease = "power3.out",
  parallax = 0.5,
  tilt = 8,
  stagger = 0.06,
  grayscale = true,
  className,
}: AccordionGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLElement | null)[]>([]);
  const mediaRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const textRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const firstRunRef = useRef(true);
  const mediaSizeRef = useRef(320);

  const count = items.length;
  const [active, setActive] = useState(Math.min(Math.max(defaultIndex, 0), count - 1));
  const reduced = usePrefersReducedMotion();

  const applyLayout = useCallback(
    (animate: boolean) => {
      const panels = panelRefs.current;
      if (!panels.length) return;

      const ratio = Math.min(Math.max(expandRatio, 0.2), 0.9);
      const grow = count > 1 ? (ratio * (count - 1)) / (1 - ratio) : 1;
      const mediaSize = mediaSizeRef.current;

      tlRef.current?.kill();
      const dur = animate && !reduced ? duration : 0;
      const tl = gsap.timeline();

      panels.forEach((panel, i) => {
        if (!panel) return;
        const isActive = i === active;
        const media = mediaRefs.current[i];
        const bar = barRefs.current[i];
        const text = textRefs.current[i];

        const rot = isActive ? 0 : i < active ? tilt : -tilt;
        tl.to(panel, { flexGrow: isActive ? grow : 1, rotateY: rot, duration: dur, ease }, 0);

        if (media) {
          const drift = Math.max(-1.5, Math.min(1.5, active - i));
          const shift = drift * parallax * mediaSize * 0.06;
          tl.to(
            media,
            {
              xPercent: -50,
              yPercent: -50,
              x: isActive ? 0 : shift,
              "--ag-gray": grayscale ? (isActive ? 0 : 1) : 0,
              "--ag-dim": isActive ? 0 : 0.35,
              duration: dur,
              ease,
            },
            0,
          );
        }

        if (bar && text) {
          if (isActive) {
            tl.to(
              [bar, text],
              { opacity: 1, x: 0, duration: dur, ease, stagger: reduced ? 0 : stagger },
              0,
            );
          } else {
            tl.to([bar, text], { opacity: 0, x: -14, duration: dur * 0.6, ease }, 0);
          }
        }
      });

      tlRef.current = tl;
    },
    [active, count, expandRatio, duration, ease, tilt, parallax, grayscale, stagger, reduced],
  );

  // Пересчёт ширины медиа при изменении размеров контейнера.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const usable = Math.max(rect.width - gap * (count - 1), 120);
      const size = Math.max(140, usable * Math.min(Math.max(expandRatio, 0.2), 0.9) * 1.22);
      mediaSizeRef.current = size;
      el.style.setProperty("--ag-media-size", `${size}px`);
      applyLayout(!firstRunRef.current);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLayout, gap, count, expandRatio]);

  useEffect(() => {
    applyLayout(!firstRunRef.current);
    firstRunRef.current = false;
  }, [applyLayout]);

  useEffect(() => () => void tlRef.current?.kill(), []);

  const onKeyDown = (index: number, event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index + 1) % count);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index - 1 + count) % count);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn("ag-root", className)}
      style={{ ["--ag-gap" as string]: `${gap}px`, height: `${height}px` }}
      role="list"
    >
      {items.map((item, i) => {
        const isActive = i === active;

        return (
          <div
            key={item.label}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="ag-panel"
            onMouseEnter={() => trigger === "hover" && setActive(i)}
            onClick={() => setActive(i)}
            onFocus={() => setActive(i)}
            onKeyDown={(event) => onKeyDown(i, event)}
            role="listitem"
            tabIndex={0}
            aria-current={isActive ? "true" : undefined}
            aria-label={item.meta ? `${item.label} – ${item.meta}` : item.label}
          >
            <span className="ag-frame">
              <span
                className="ag-media"
                ref={(el) => {
                  mediaRefs.current[i] = el;
                }}
              >
                <Image
                  src={item.image}
                  alt={item.alt ?? ""}
                  fill
                  sizes="(min-width: 1024px) 40vw, 90vw"
                  draggable={false}
                  className="object-cover"
                />
              </span>
              <span className="ag-overlay" aria-hidden="true" />
            </span>

            <span className="ag-label" aria-hidden="true">
              <span
                className="ag-bar"
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
              />
              <span
                className="ag-text flex flex-col gap-1"
                ref={(el) => {
                  textRefs.current[i] = el;
                }}
              >
                <span className="font-display text-title leading-tight font-bold">
                  {item.label}
                </span>
                {item.meta ? (
                  <span className="text-[color:var(--color-muted)] text-caption">{item.meta}</span>
                ) : null}
              </span>
            </span>
          </div>
        );
      })}
    </div>
  );
}
