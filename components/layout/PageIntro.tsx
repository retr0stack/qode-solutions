import { Container, Eyebrow, Heading, Text } from "@/components/primitives";
import { FadeIn, InkBackdrop } from "@/components/motion";
import type { DictIntro } from "@/content/i18n";

interface PageIntroProps {
  intro: DictIntro;
  /**
   * Тёмная шапка вместо светлой. Раньше здесь стояла фотография, но
   * читаемость заголовка зависела от яркости конкретного кадра, а сами
   * снимки ничего не рассказывали о странице. Градиент решает ту же
   * задачу — даёт странице характер — и не спорит с текстом.
   */
  tone?: "sky" | "ink";
  /** Дополнительный блок справа: контакты, счётчик, кнопка. */
  aside?: React.ReactNode;
}

/**
 * Шапка внутренней страницы.
 *
 * Высота на мобильном ограничена 45svh: длинная шапка заставляла
 * прокручивать пол-экрана до первого содержательного блока. Край первого
 * блока должен быть виден сразу.
 *
 * Верхний отступ считается от --header-total, потому что шапка сайта
 * плавающая и занимает высоту капсулы плюс зазоры.
 */
export function PageIntro({ intro, tone = "ink", aside }: PageIntroProps) {
  const ink = tone === "ink";

  return (
    <section
      data-surface={ink ? "dark" : "sky"}
      className="relative flex max-h-[45svh] min-h-[15rem] flex-col justify-end overflow-hidden pt-[calc(var(--header-total)+2rem)] pb-8 md:max-h-none md:min-h-[19rem] md:pb-12 lg:min-h-[21rem]"
    >
      {ink ? <InkBackdrop /> : null}

      <Container className="relative">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-7">
            <FadeIn>
              <Eyebrow>{intro.eyebrow}</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Heading level={1} size="display-2" className="max-w-[20ch]">
                {intro.title}
              </Heading>
            </FadeIn>
            {intro.lead ? (
              <FadeIn delay={0.16}>
                {/* На мобильном подводка обрезается двумя строками: в шапке
                    важен заголовок, а не весь абзац. */}
                <Text size="lead" className="line-clamp-2 max-w-[52ch] md:line-clamp-none">
                  {intro.lead}
                </Text>
              </FadeIn>
            ) : null}
          </div>

          {aside ? (
            <FadeIn
              delay={0.24}
              className="col-span-4 hidden md:col-span-8 md:block lg:col-span-4 lg:col-start-9"
            >
              {aside}
            </FadeIn>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
