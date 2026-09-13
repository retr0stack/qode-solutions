"use client";

import Link from "next/link";
import { useState } from "react";
import { Container, Section } from "@/components/primitives";
import { useDict } from "@/components/i18n";
import { TeamCard } from "./TeamCard";

/**
 * Страница команды — оглавление из имён.
 *
 * Открытой может быть одна строка за раз: два развёрнутых описания
 * возвращают ту же стену текста, от которой раздел и уходит.
 *
 * Рендерятся только опубликованные карточки: у человека без имени
 * строка «Имя Фамилия» на живом сайте бьёт по доверию сильнее, чем его
 * отсутствие в списке.
 */
export function TeamGrid() {
  const dict = useDict();
  const members = dict.team.members.filter((member) => member.published);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <Section density="md">
      <Container className="flex flex-col gap-10">
        <div className="border-line border-t">
          {members.map((member, index) => (
            <TeamCard
              key={member.slug}
              member={member}
              index={index}
              open={openSlug === member.slug}
              onToggle={() => setOpenSlug(openSlug === member.slug ? null : member.slug)}
            />
          ))}
        </div>

        <Link
          href="/founders"
          className="text-small font-semibold underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
        >
          {dict.team.foundersLink}
        </Link>
      </Container>
    </Section>
  );
}
