import { Heading, Text } from "@/components/primitives";
import { Reveal } from "@/components/motion";
import type { ServiceSection } from "@/content";

interface ServiceBlockProps {
  service: ServiceSection;
  index: number;
}

/**
 * Раздел услуг: заголовок и список подпунктов.
 *
 * scroll-margin-top учитывает фиксированную шапку и залипающую ленту чипов —
 * иначе переход по якорю прятал бы заголовок раздела под ними.
 */
export function ServiceBlock({ service, index }: ServiceBlockProps) {
  return (
    <section
      id={service.slug}
      aria-labelledby={`${service.slug}-title`}
      className="scroll-mt-[calc(var(--header-h)+4.5rem)] border-line border-t pt-10 first:border-t-0 first:pt-0 lg:scroll-mt-[calc(var(--header-h)+2rem)] lg:pt-14"
    >
      <header className="mb-10 flex flex-col gap-4">
        <p className="text-fg-2 font-mono text-caption tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </p>
        <Heading level={2} id={`${service.slug}-title`} size="display-3">
          {service.section}
        </Heading>
        <Text size="lead" className="max-w-[48ch]">
          {service.summary}
        </Text>
      </header>

      <dl className="flex flex-col">
        {service.items.map((item, itemIndex) => (
          <Reveal
            as="div"
            key={item.title}
            delay={Math.min(itemIndex, 4) * 0.05}
            y={16}
            className="border-line grid gap-2 border-t py-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10 md:py-7"
          >
            <dt className="font-display text-title font-semibold">{item.title}</dt>
            <dd>
              <Text size="body" className="max-w-[56ch]">
                {item.description}
              </Text>
            </dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
