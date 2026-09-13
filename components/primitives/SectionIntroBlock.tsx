import { cn } from "@/lib/cn";
import type { SectionIntro } from "@/content";
import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";
import { Text } from "./Text";

interface SectionIntroBlockProps {
  intro: SectionIntro;
  level?: 2 | 3;
  size?: "display-2" | "display-3";
  align?: "start" | "center";
  className?: string;
}

/** Надзаголовок + заголовок + лид. Один паттерн шапки секции на весь сайт. */
export function SectionIntroBlock({
  intro,
  level = 2,
  size = "display-2",
  align = "start",
  className,
}: SectionIntroBlockProps) {
  return (
    <header
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      <Eyebrow>{intro.eyebrow}</Eyebrow>
      <Heading level={level} size={size} className="max-w-[20ch]">
        {intro.title}
      </Heading>
      {intro.lead ? (
        <Text size="lead" className="max-w-[52ch]">
          {intro.lead}
        </Text>
      ) : null}
    </header>
  );
}
