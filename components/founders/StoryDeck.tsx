import { Heading, Text } from "@/components/primitives";
import type { DictStoryChapter } from "@/content/i18n";

interface StoryDeckProps {
  chapters: readonly DictStoryChapter[];
}

/**
 * История агентства горизонтальной лентой.
 *
 * Обычная нативная прокрутка и ничего больше: ни колоды, ни наблюдателя,
 * ни перетаскивания, ни кнопок. Все три предыдущие версии ломались именно
 * потому, что подменяли прокрутку своей логикой – то первая карточка не
 * становилась активной, то мышью лента не двигалась, то счётчик
 * расходился с содержимым.
 *
 * Компонент серверный: на клиенте не исполняется ни строки JavaScript.
 *
 * Полоса прокрутки намеренно видимая и тонкая. Скрытая полоса на десктопе
 * означает, что мышью ленту не сдвинуть: колесо крутит страницу, а
 * горизонтального жеста у мыши нет. Видимую полосу можно просто тянуть.
 */
export function StoryDeck({ chapters }: StoryDeckProps) {
  return (
    <ol className="story-track flex snap-x snap-mandatory gap-5 overflow-x-auto pb-5">
      {chapters.map((chapter) => (
        <li key={chapter.marker} className="w-[84vw] shrink-0 snap-start sm:w-[24rem]">
          <article className="surface relative flex h-full min-h-[18rem] flex-col gap-3 overflow-hidden p-6 md:p-8">
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-1 bg-[image:var(--gradient-brand)]"
            />

            <span className="text-fg-2 text-caption font-semibold tabular-nums">
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
      ))}
    </ol>
  );
}
