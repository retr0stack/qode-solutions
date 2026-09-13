import { BRAND_STOPS, Q_GEOMETRY, circumference } from "@/components/brand";

const { ring, tail, viewBox } = Q_GEOMETRY;

interface QShapeProps {
  /** Префикс id: на странице знак один, но перестраховка ничего не стоит. */
  idPrefix?: string;
  className?: string;
  ref?: React.Ref<SVGSVGElement>;
}

/**
 * Разметка большой Q для hero. Ровно та же геометрия, что у знака в шапке
 * (components/brand/geometry.ts), но разложенная на слои, которые можно
 * анимировать по отдельности:
 *
 *   [data-q="outline"] — тонкие контуры, «рисуются» через stroke-dashoffset;
 *   [data-q="ring"]    — толстое кольцо с градиентной заливкой;
 *   [data-q="tail"]    — хвост, вылетает последним;
 *   [data-q="gradient"] — сам градиент, его gradientTransform едет по циклу.
 *
 * Компонент серверный и рендерит знак В КОНЕЧНОМ состоянии: без JS и при
 * prefers-reduced-motion видно готовую Q, а не пустое место.
 * Начальные состояния выставляет GSAP в HeroQ.
 */
export function QShape({ idPrefix = "hero-q", className, ref }: QShapeProps) {
  const gradientId = `${idPrefix}-gradient`;

  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient
          id={gradientId}
          data-q="gradient"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          {BRAND_STOPS.map((stop) => (
            <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
          ))}
        </linearGradient>
      </defs>

      {/* Контуры внешнего и внутреннего края кольца. */}
      <g data-q="outline" fill="none" stroke={`url(#${gradientId})`} strokeWidth={1.5}>
        <circle
          cx={ring.cx}
          cy={ring.cy}
          r={ring.outer}
          strokeDasharray={circumference(ring.outer)}
        />
        <circle
          cx={ring.cx}
          cy={ring.cy}
          r={ring.inner}
          strokeDasharray={circumference(ring.inner)}
        />
      </g>

      <circle
        data-q="ring"
        cx={ring.cx}
        cy={ring.cy}
        r={ring.r}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeWidth={ring.width}
      />

      <path
        data-q="tail"
        d={tail}
        fill={`url(#${gradientId})`}
        stroke={`url(#${gradientId})`}
        strokeWidth={6}
        strokeLinejoin="round"
      />
    </svg>
  );
}
