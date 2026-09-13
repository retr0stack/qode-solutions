import Link from "next/link";
import { cn } from "@/lib/cn";
import { Heading, Text } from "@/components/primitives";

/*
 * Свой оттенок на каждое направление.
 *
 * Пять одинаковых белых плиток подряд читаются как один прямоугольник:
 * глазу не за что зацепиться и нечем отличить «Боты» от «Интеграций».
 * Цвет здесь не украшение — он единственное, что делает карточки
 * различимыми на скорости, с которой их реально просматривают.
 * Все оттенки взяты из фирменного диапазона, за его пределы не выходим.
 */
const ACCENTS = [
  "#22d3ee",
  "#2b8dff",
  "#7c3aed",
  "#0b7ea3",
  "#56e2f5",
] as const;

interface DirectionCardProps {
  card: {
    slug: string;
    title: string;
    description: string;
  };
  moreLabel: string;
  /** Позиция в сетке — определяет оттенок карточки. */
  index: number;
  className?: string;
}

/**
 * Карточка направления. Крупная плитка (`featured`) — «Сайты», основное
 * направление: больше типографика и больше воздуха, но тот же компонент.
 *
 * Вся карточка — одна ссылка: цель нажатия совпадает с визуальной границей,
 * и по клавиатуре это один таб-стоп, а не два.
 */
export function DirectionCard({ card, moreLabel, index, className }: DirectionCardProps) {
  const accent = ACCENTS[index % ACCENTS.length];
  return (
    <Link
      href={`/services#${card.slug}`}
      style={{ "--accent": accent } as React.CSSProperties}
      className={cn(
        "surface border-gradient group relative flex flex-col justify-between gap-8 overflow-hidden",
        "transition-transform duration-300 ease-brand",
        "hover:border-gradient-on focus-visible:border-gradient-on",
        "motion-safe:hover:-translate-y-1",
        "p-6 md:p-7",
        className,
      )}
    >
      {/* Цветная заливка проступает из угла при наведении. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 -right-1/4 size-56 rounded-full opacity-0 blur-[46px] transition-opacity duration-500 ease-brand group-hover:opacity-100"
        style={{ backgroundColor: "var(--accent)" }}
      />

      {/* Вертикальный рельс – тот же оттенок, но всегда виден. */}
      <span
        aria-hidden="true"
        className="absolute top-6 bottom-6 left-0 w-[3px] origin-center scale-y-25 rounded-full transition-transform duration-500 ease-brand group-hover:scale-y-100"
        style={{ backgroundColor: "var(--accent)" }}
      />

      <div className="relative flex flex-col gap-3">
        <Heading level={3} size="title">
          {card.title}
        </Heading>
        <Text size="small" className="max-w-[38ch]">
          {card.description}
        </Text>
      </div>

      <span
        aria-hidden="true"
        className={cn(
          "text-fg-2 relative flex items-center gap-2 text-caption font-semibold",
          "transition-transform duration-300 ease-brand motion-safe:group-hover:translate-x-1",
        )}
      >
        {moreLabel}
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none" aria-hidden="true">
          <path
            d="M2 8h11M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
