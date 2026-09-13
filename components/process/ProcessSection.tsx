"use client";

import { Section } from "@/components/primitives";
import { useDict } from "@/components/i18n";
import { ProcessTrack } from "./ProcessTrack";

/**
 * «Как мы работаем».
 *
 * Подводка передаётся внутрь трека и живёт в том же закреплённом экране,
 * что и карточки. Раньше она стояла отдельной секцией сверху, а трек
 * занимал целый экран высоты — между заголовком и первой карточкой
 * зияла пустая половина экрана. Теперь заголовок и шаги видно вместе.
 */
export function ProcessSection() {
  return (
    // overflow здесь нельзя: ScrollTrigger пинит секцию через position: fixed,
    // и предок с overflow обрезал бы её.
    <Section id="process" surface="alt" density="sm">
      <ProcessTrackWithIntro />
    </Section>
  );
}

function ProcessTrackWithIntro() {
  const dict = useDict();

  return (
    <ProcessTrack
      steps={dict.process.steps}
      label={dict.process.intro.title}
      intro={dict.process.intro}
    />
  );
}
