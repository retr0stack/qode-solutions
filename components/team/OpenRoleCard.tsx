import Link from "next/link";
import { Heading, Text } from "@/components/primitives";
import { cn } from "@/lib/cn";
import { teamOpenRole } from "@/content";

/**
 * Заготовка под расширение команды: плашка вакансии в конце сетки.
 * Включается флагом teamOpenRole.enabled в content/team.ts.
 */
export function OpenRoleCard() {
  if (!teamOpenRole.enabled) return null;

  return (
    <Link
      href={teamOpenRole.href}
      className={cn(
        "border-line border-gradient group flex h-full min-h-[18rem] flex-col justify-between gap-6 rounded-lg border border-dashed p-6 md:p-8",
        "hover:border-gradient-on focus-visible:border-gradient-on",
        "transition-transform duration-300 ease-brand motion-safe:hover:-translate-y-1",
      )}
    >
      <div className="flex flex-col gap-3">
        <Heading level={2} size="title">
          {teamOpenRole.title}
        </Heading>
        <Text size="small" className="max-w-[34ch]">
          {teamOpenRole.description}
        </Text>
      </div>
      <span
        aria-hidden="true"
        className="text-fg-2 text-caption font-semibold uppercase tracking-[0.1em]"
      >
        Написать
      </span>
    </Link>
  );
}
