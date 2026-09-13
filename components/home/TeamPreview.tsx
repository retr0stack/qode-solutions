"use client";

import Link from "next/link";
import { useMemo } from "react";
import { AccordionGallery, MorphSlider } from "@/components/reactbits";
import { useDict } from "@/components/i18n";
import { useIsDesktop } from "@/lib/hooks";

/**
 * Превью команды на главной.
 *
 * Две разные механики под два разных ввода:
 *
 *   десктоп   — аккордеон-галерея: шесть крупных портретов в ряд, наведение
 *               раскрывает один на половину ширины. Курсор здесь есть, и
 *               наведение — самый дешёвый жест, который вообще бывает.
 *
 *   мобильный — морф-слайдер: один портрет на весь блок, соседний
 *               перетекает в него по свайпу. Шесть панелей в ряд на 390px
 *               превратились бы в шесть полосок по 60px.
 *
 * Раскладка выбирается по медиазапросу, а не двумя блоками с display:none:
 * слайдер держит WebGL-контекст, и создавать его на десктопе, где он скрыт,
 * значит впустую занимать видеопамять.
 */
export function TeamPreview() {
  const dict = useDict();
  const isDesktop = useIsDesktop();

  const members = useMemo(
    () => dict.team.members.filter((member) => member.published),
    [dict.team.members],
  );

  const galleryItems = useMemo(
    () =>
      members.map((member) => ({
        image: member.photo,
        label: member.name,
        meta: member.role,
        alt: `${member.name} – ${member.role}`,
      })),
    [members],
  );

  const sliderItems = useMemo(
    () => members.map((member) => ({ image: member.photo, caption: member.name, meta: member.role })),
    [members],
  );

  return (
    <div className="flex flex-col gap-6">
      {isDesktop ? (
        <AccordionGallery
          items={galleryItems}
          defaultIndex={0}
          expandRatio={0.38}
          height={440}
          tilt={7}
          parallax={0.5}
        />
      ) : (
        <div className="h-[26rem] w-full">
          <MorphSlider items={sliderItems} label={dict.team.intro.eyebrow} />
        </div>
      )}

      <Link
        href="/team"
        className="text-small font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
      >
        {dict.team.allLink} – {members.length} {dict.team.countLabel}
      </Link>
    </div>
  );
}
