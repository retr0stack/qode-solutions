"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/cn";
import { usePrefersReducedMotion } from "@/lib/hooks";

export interface DriftItem {
  id: string;
  image: string;
  /** Подложка на случай, если файла обложки ещё нет. */
  fallback?: string;
  title: string;
}

interface DriftWallProps {
  items: readonly DriftItem[];
  columns?: number;
  tileWidth?: number;
  tileHeight?: number;
  gap?: number;
  tilt?: number;
  turn?: number;
  perspective?: number;
  depth?: number;
  speed?: number;
  direction?: "up" | "down";
  variance?: number;
  parallax?: number;
  lift?: number;
  fade?: number;
  dim?: number;
  /** Вызывается, когда под курсором оказывается другая плитка. */
  onActiveChange?: (id: string | null) => void;
  /** Подпись группы для скринридера — приходит из словаря. */
  label?: string;
  className?: string;
}

const columnFactor = (index: number, variance: number) => {
  const pseudo = ((index * 0.618_033_988_7 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

/**
 * Дрейфующая стена плиток. Порт компонента React Bits drift-wall.
 *
 * Что изменено против оригинала:
 *   • добавлен колбэк onActiveChange — по нему страница показывает описание
 *     проекта рядом со стеной. В оригинале плитка несёт только картинку,
 *     а нам нужен текст к каждой работе;
 *   • плитка — button, а не div с role="button": клавиатура и скринридер
 *     получают нормальный элемент управления бесплатно;
 *   • цвета подложки и вуали переведены на --color-ink;
 *   • при prefers-reduced-motion колонки стоят на месте, а параллакс
 *     по курсору выключен — стена остаётся статичной галереей.
 *
 * Колонки едут в разные стороны с разной скоростью (columnFactor), плоскость
 * наклонена в 3D и доворачивается за курсором с затуханием. Всё движение —
 * transform в одном rAF-цикле, никаких повторных замеров layout.
 */
export function DriftWall({
  items,
  columns = 4,
  tileWidth = 220,
  tileHeight = 148,
  gap = 18,
  tilt = 14,
  turn = -12,
  perspective = 1200,
  depth = 120,
  speed = 34,
  direction = "up",
  variance = 0.45,
  parallax = 0.6,
  lift = 64,
  fade = 0.62,
  dim = 0.5,
  onActiveChange,
  label,
  className,
}: DriftWallProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const trackRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = useRef<number | null>(null);

  const offsetsRef = useRef<number[]>([]);
  const velocitiesRef = useRef<number[]>([]);
  const hoveredColRef = useRef(-1);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef<number | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  const columnItems = useMemo(() => {
    const cols: DriftItem[][] = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns]?.push(item));
    return cols.map((col) => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map((col) => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry?.contentRect.height || 600);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === "up" ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px: number, py: number) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.16) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) translateZ(${-depth}px)`;
    },
    [tilt, turn, depth],
  );

  useEffect(() => {
    const animate = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = reduced ? 0 : parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      for (let c = 0; c < trackRefs.current.length; c += 1) {
        const meta = columnMeta[c];
        const el = trackRefs.current[c];
        if (!meta || !el) continue;

        if (!reduced) {
          const target = (baseVelocities[c] ?? 0) * (hoveredColRef.current === c ? 0 : 1);
          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] = (velocitiesRef.current[c] ?? 0) + (target - (velocitiesRef.current[c] ?? 0)) * ease;
          let next = (offsetsRef.current[c] ?? 0) + (velocitiesRef.current[c] ?? 0) * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;
        }

        el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback(
    (id: string | null, col: number) => {
      activeIdRef.current = id;
      hoveredColRef.current = col;
      setActiveId(id);
      onActiveChange?.(id);
    },
    [onActiveChange],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (event.clientX - rect.left) / rect.width - 0.5,
          y: (event.clientY - rect.top) / rect.height - 0.5,
        };
      }

      /* Плитки не ловят указатель сами (pointer-events выключены у слоя с
         картинкой), поэтому цель ищем через elementFromPoint. */
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const tile = hit?.closest<HTMLElement>("[data-tile-id]");
      if (!tile) return;

      const id = tile.dataset.tileId ?? null;
      if (id === activeIdRef.current) return;
      activate(id, Number(tile.dataset.col));
    },
    [parallax, reduced, activate],
  );

  const renderTile = (item: DriftItem, key: string, col: number) => (
    <button
      key={key}
      type="button"
      data-tile-id={item.id}
      data-col={col}
      onFocus={() => activate(item.id, col)}
      onBlur={() => activate(null, -1)}
      onClick={() => activate(item.id, col)}
      aria-label={item.title}
      className={cn("dw-tile", activeId === item.id && "is-active")}
    >
      <span
        className="dw-inner"
        /* Подложка под картинкой: если файла обложки ещё нет, плитка
           остаётся фирменной заливкой, а не белым пятном. */
        style={
          item.fallback
            ? { backgroundImage: `url("${item.fallback}")`, backgroundSize: "cover" }
            : undefined
        }
      >
        {/* Обычный img: плиток на экране десятки, и next/image здесь дал бы
            десятки запросов к оптимизатору без выигрыша. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          draggable={false}
          /* Файла может не быть – тогда прячем картинку и оставляем
             подложку вместо иконки битого изображения. */
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
        <span className="dw-overlay" aria-hidden="true" />
      </span>
    </button>
  );

  return (
    <div
      ref={containerRef}
      className={cn("dw-root", className)}
      style={
        {
          "--dw-tile-w": `${tileWidth}px`,
          "--dw-tile-h": `${tileHeight}px`,
          "--dw-gap": `${gap}px`,
          "--dw-perspective": `${perspective}px`,
          "--dw-lift": `${lift}px`,
          "--dw-dim": dim,
          "--dw-edge": `${Math.max(0, (1 - fade) * 100)}%`,
        } as React.CSSProperties
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerRef.current = { x: 0, y: 0 };
        activate(null, -1);
      }}
      role="group"
      aria-label={label}
    >
      <div ref={planeRef} className="dw-plane">
        {columnItems.map((col, c) => (
          <div className="dw-col" key={`col-${c}`}>
            <div
              className="dw-track"
              ref={(el) => {
                trackRefs.current[c] = el;
              }}
            >
              {Array.from({ length: columnMeta[c]?.copies ?? 2 }).map((_, copyIndex) =>
                col.map((item) => renderTile(item, `${c}-${copyIndex}-${item.id}`, c)),
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
