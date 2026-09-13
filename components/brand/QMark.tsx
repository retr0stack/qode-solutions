import { BRAND_STOPS, Q_GEOMETRY } from "./geometry";

const { ring, tail, viewBox } = Q_GEOMETRY;

interface QMarkProps {
  /**
   * Уникальный id градиента. Обязателен, если на странице несколько знаков:
   * дубли id в SVG ломают заливку. По умолчанию — для единственного знака.
   */
  id?: string;
  /** `gradient` — заливка бренда, `mono` — текущий цвет текста. */
  variant?: "gradient" | "mono";
  className?: string;
  /** Знак декоративный: подпись даём на родителе (логотип, ссылка). */
  title?: string;
}

/**
 * Статичный знак Q. Никакой анимации и клиентского кода — используется
 * в шапке, футере, og-картинке и favicon. Анимированная версия для hero
 * живёт в components/hero и берёт геометрию из ./geometry.
 */
export function QMark({
  id = "qode-mark",
  variant = "gradient",
  className,
  title,
}: QMarkProps) {
  const fill = variant === "gradient" ? `url(#${id})` : "currentColor";

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}

      {variant === "gradient" ? (
        <defs>
          {/* x1/y1 → x2/y2 по диагонали = CSS linear-gradient(135deg, …) */}
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            {BRAND_STOPS.map((stop) => (
              <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
            ))}
          </linearGradient>
        </defs>
      ) : null}

      <circle
        cx={ring.cx}
        cy={ring.cy}
        r={ring.r}
        fill="none"
        stroke={fill}
        strokeWidth={ring.width}
      />
      {/* Обводка тем же цветом округляет углы трапеции на ~3 единицы. */}
      <path d={tail} fill={fill} stroke={fill} strokeWidth={6} strokeLinejoin="round" />
    </svg>
  );
}
