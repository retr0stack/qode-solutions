"use client";

import Image from "next/image";
import type { DictFounder } from "@/content/i18n";

interface FounderPanelProps {
  founder: DictFounder;
  index: number;
}

/**
 * Колонка одного основателя.
 *
 * Фотография занимает всю высоту экрана, но только свою половину ширины:
 * два портрета стоят рядом и читаются как пара. Поверх кадра — три строки:
 * имя, роль и одна фраза о человеке. Абзацы поверх фотографии не
 * выдерживают никакого затемнения и превращают портрет в подложку.
 *
 * Описание идёт под своим кадром, в своей же колонке — текст всегда рядом
 * с тем, о ком он.
 *
 * Затемнение снизу фиксированное и в тоне --color-ink, поэтому контраст
 * белого текста не зависит от яркости снимка.
 */
export function FounderPanel({ founder, index }: FounderPanelProps) {
  return (
    <article className="flex flex-col">
      <div className="relative flex min-h-svh flex-col justify-end overflow-hidden">
        <Image
          src={founder.photo}
          alt={founder.photoAlt}
          fill
          priority={index === 0}
          quality={90}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />

        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/3 bg-[linear-gradient(to_top,rgb(16_32_46/0.92),rgb(16_32_46/0.5)_48%,transparent)]"
        />

        <div className="relative z-[2] flex flex-col gap-3 p-[var(--gutter)] pb-24 text-[color:var(--color-paper)]">
          <h2 className="font-display text-[clamp(2.25rem,4.5vw,3.5rem)] leading-[0.96] font-bold tracking-[-0.03em]">
            {founder.name}
          </h2>

          <p className="text-small font-semibold text-[color:var(--color-muted)]">
            {founder.role}
          </p>

          <p className="font-display max-w-[24ch] text-title font-semibold">
            {founder.tagline}
          </p>
        </div>

      </div>

      {/* Описание – под своим кадром. */}
      <div className="flex flex-1 flex-col gap-6 p-[var(--gutter)] pt-10">
        {/*
          Первый абзац крупнее остальных и с цветной отбивкой слева: три
          одинаковых абзаца подряд читались как служебная справка, а не как
          рассказ о человеке. Кегль задаёт порядок чтения, а не украшает.
        */}
        {founder.bio.map((paragraph, index) =>
          index === 0 ? (
            <p
              key={paragraph.slice(0, 24)}
              className="border-l-2 border-[color:var(--color-accent)] pl-5 text-lead max-w-[46ch] font-medium"
            >
              {paragraph}
            </p>
          ) : (
            <p key={paragraph.slice(0, 24)} className="max-w-[56ch] text-small">
              {paragraph}
            </p>
          ),
        )}

        {/* Факты вынесены на подложку: это карточка-справка, и она не
            должна сливаться с биографией. */}
        <dl className="mt-auto flex flex-col gap-4 rounded-[var(--radius-lg)] bg-[color:var(--color-paper-4)] p-5">
          {founder.facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-0.5">
              <dt className="text-fg-2 text-caption">{fact.label}</dt>
              <dd className="text-small font-semibold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
