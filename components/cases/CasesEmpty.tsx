"use client";

import { Heading, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { Logo } from "@/components/brand";
import { Magnetic } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { leadFormHref } from "@/content";

/**
 * Состояние «кейсов ещё нет». Честный текст вместо выдуманных проектов —
 * исчезнет сам, как только в content/cases.ts появится первый объект.
 */
export function CasesEmpty() {
  const dict = useDict();

  return (
    <div className="sky-panel relative flex flex-col items-start gap-6 overflow-hidden p-8 md:p-14">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 right-0 size-[26rem] rounded-full bg-[radial-gradient(circle,rgb(34_211_238/0.26),transparent_68%)] blur-[60px] motion-safe:animate-[aurora-drift_20s_ease-in-out_infinite]"
      />

      <div className="relative">
        <Logo variant="mark" />
      </div>

      <Heading level={2} size="display-3" className="relative max-w-[24ch]">
        {dict.cases.emptyTitle}
      </Heading>
      <Text size="lead" className="relative max-w-[52ch]">
        {dict.cases.emptyText}
      </Text>
      <Magnetic className="relative">
        <Button href={leadFormHref} size="lg">
          {dict.cases.emptyCta}
        </Button>
      </Magnetic>
    </div>
  );
}
