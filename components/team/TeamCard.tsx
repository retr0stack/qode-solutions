"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { Text } from "@/components/primitives";
import { TeamPhoto } from "./TeamPhoto";
import type { DictTeamMember } from "@/content/i18n";

interface TeamCardProps {
  member: DictTeamMember;
  index: number;
  open: boolean;
  onToggle: () => void;
}

/**
 * Строка участника команды.
 *
 * Страница построена как оглавление: крупные имена одно под другим, между
 * ними волосяные линии. Описание не показывается, пока человек сам не
 * откроет строку — иначе шесть биографий подряд превращают раздел в стену
 * текста, по которой невозможно сориентироваться.
 *
 * Фотография живёт внутри раскрытия, а не рядом с именем: закрытый список
 * должен читаться как список, и шесть портретов в нём — это уже галерея.
 *
 * Раскрытие идёт через grid-template-rows 0fr → 1fr: высота анимируется без
 * замера содержимого. Содержимое остаётся в разметке всегда, поэтому при
 * отключённом JS и для поисковика текст на месте.
 */
export function TeamCard({ member, index, open, onToggle }: TeamCardProps) {
  const id = useId();

  return (
    <article className="border-line border-b">
      <h3>
        <button
          type="button"
          id={`${id}-button`}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          onClick={onToggle}
          className="group flex w-full items-baseline justify-between gap-6 py-6 text-left md:py-8"
        >
          <span className="flex flex-col gap-1.5 md:flex-row md:items-baseline md:gap-6">
            <span
              className={cn(
                "font-display text-[clamp(1.75rem,4vw,3rem)] leading-none font-bold tracking-[-0.03em]",
                "transition-[color,transform] duration-400 ease-brand",
                open ? "text-fg" : "text-fg-2 group-hover:text-fg",
                "motion-safe:group-hover:translate-x-1",
              )}
            >
              {member.name}
            </span>
            <span className="text-caption font-semibold text-[color:var(--color-accent)]">
              {member.role}
            </span>
          </span>

          <span
            aria-hidden="true"
            className={cn(
              "border-line relative flex size-9 shrink-0 items-center justify-center rounded-full border",
              "transition-transform duration-240 ease-brand",
              open && "rotate-45 border-[color:var(--color-accent)]",
            )}
          >
            <span className="bg-fg absolute h-px w-4" />
            <span className="bg-fg absolute h-4 w-px" />
          </span>
        </button>
      </h3>

      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-500 ease-brand",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="grid-12 items-start gap-y-6 pb-10">
            <div className="col-span-4 md:col-span-3 lg:col-span-3">
              <TeamPhoto
                member={member}
                priority={index === 0}
                className="aspect-3/4"
                sizes="(min-width: 1024px) 18rem, (min-width: 768px) 30vw, 92vw"
              />
            </div>

            <div className="col-span-4 flex flex-col gap-4 md:col-span-5 lg:col-span-7 lg:col-start-5">
              <div className="flex flex-col gap-1">
                <p className="text-fg-2 text-small">{member.status}</p>
                <p className="text-fg-2 text-small">{member.education}</p>
              </div>

              <Text size="body" className="border-line max-w-[62ch] border-t pt-5">
                {member.bio}
              </Text>

              <ul className="flex flex-wrap gap-2">
                {member.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full bg-[color:var(--color-paper-4)] px-3.5 py-1.5 text-caption font-medium text-[color:var(--color-accent)]"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
