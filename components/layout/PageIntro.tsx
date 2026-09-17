"use client";

import { Container, Eyebrow, Heading, Text } from "@/components/primitives";
import { FadeIn, InkBackdrop } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { cn } from "@/lib/cn";
import type { Dict } from "@/content/i18n";

/** Разделы, у которых есть собственная шапка страницы. */
type IntroSection = "services" | "cases" | "partners" | "team" | "founders" | "contacts";

interface PageIntroProps {
  /**
   * Ключ раздела, а не готовый объект.
   *
   * Раньше страницы передавали сюда ru.<раздел>.intro напрямую, и шапка
   * оставалась русской при любом переключении языка – это и был баг с
   * непереводимым тёмным блоком наверху. Теперь текст берётся из активного
   * словаря, а страницы передают только имя раздела.
   */
  section: IntroSection;
  /** Тёмная шапка вместо светлой. */
  tone?: "sky" | "ink";
  /** Заголовок в одну строку: для коротких формулировок вроде «5 – 25». */
  titleNoWrap?: boolean;
  /** Дополнительный блок справа: контакты, счётчик, кнопка. */
  aside?: React.ReactNode;
}

/**
 * Шапка внутренней страницы.
 *
 * Высота на мобильном ограничена 45svh: длинная шапка заставляла
 * прокручивать пол-экрана до первого содержательного блока.
 *
 * Верхний отступ считается от --header-total, потому что шапка сайта
 * плавающая и занимает высоту капсулы плюс зазоры.
 */
export function PageIntro({ section, tone = "ink", titleNoWrap = false, aside }: PageIntroProps) {
  const dict = useDict();
  const intro = (dict[section] as { intro: Dict["cases"]["intro"] }).intro;
  const ink = tone === "ink";

  return (
    <section
      data-surface={ink ? "dark" : "sky"}
      className="relative flex max-h-[45svh] min-h-[15rem] flex-col justify-end overflow-hidden pt-[calc(var(--header-total)+2rem)] pb-8 md:max-h-none md:min-h-[17rem] md:pb-10 lg:min-h-[19rem]"
    >
      {ink ? <InkBackdrop /> : null}

      <Container className="relative">
        <div className="grid-12 items-end gap-y-8">
          <div className="col-span-4 flex flex-col gap-4 md:col-span-8 lg:col-span-7">
            <FadeIn>
              <Eyebrow>{intro.eyebrow}</Eyebrow>
            </FadeIn>
            <FadeIn delay={0.08}>
              <Heading
                level={1}
                size="display-2"
                className={cn(
                  titleNoWrap
                    ? "text-[clamp(1.75rem,3.6vw,3.25rem)] whitespace-nowrap"
                    : "max-w-[20ch]",
                )}
              >
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
