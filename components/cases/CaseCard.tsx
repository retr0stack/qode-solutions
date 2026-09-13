import Image from "next/image";
import { Heading, Text } from "@/components/primitives";
import { CaseCover } from "./CaseCover";
import type { CaseStudy } from "@/content";

interface CaseCardProps {
  caseStudy: CaseStudy;
  priority?: boolean;
}

/**
 * Проект в витрине портфолио.
 *
 * Карточка намеренно не кликабельна: отдельных страниц под проекты нет,
 * и ссылка в никуда хуже её отсутствия. Ни href, ни курсора-руки, ни
 * подъёма при наведении — это витрина, а не навигация.
 *
 * Тегов под карточкой тоже нет: «Сайты», «Интеграции» повторяются от
 * проекта к проекту и ничего не добавляют к названию и одной строке
 * описания.
 */
export function CaseCard({ caseStudy, priority = false }: CaseCardProps) {
  return (
    <article>
      {caseStudy.cover ? (
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-[var(--radius-lg)]">
          <Image
            src={caseStudy.cover.src}
            alt={caseStudy.cover.alt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 45vw, 92vw"
            className="object-cover"
          />
        </div>
      ) : (
        <CaseCover caseStudy={caseStudy} />
      )}

      <div className="flex flex-col gap-1.5 pt-4">
        <Heading level={3} size="title">
          {caseStudy.title}
        </Heading>

        <Text size="small" className="max-w-[52ch]">
          {caseStudy.summary}
        </Text>
      </div>
    </article>
  );
}
