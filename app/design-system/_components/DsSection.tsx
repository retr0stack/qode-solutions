import type { ReactNode } from "react";
import { Container, Heading, Text } from "@/components/primitives";

interface DsSectionProps {
  index: string;
  title: string;
  note?: string;
  children: ReactNode;
}

/** Блок дизайн-системы: номер, заголовок, пояснение, содержимое. */
export function DsSection({ index, title, note, children }: DsSectionProps) {
  return (
    <section className="border-line border-t py-[var(--section-sm)]">
      <Container>
        <header className="mb-10 flex flex-col gap-3 md:flex-row md:items-baseline md:gap-8">
          <span className="text-fg-2 font-mono text-caption tabular-nums">{index}</span>
          <div className="flex flex-col gap-2">
            <Heading level={2} size="display-3">
              {title}
            </Heading>
            {note ? (
              <Text size="small" className="max-w-[56ch]">
                {note}
              </Text>
            ) : null}
          </div>
        </header>
        {children}
      </Container>
    </section>
  );
}

/** Подпись к образцу: имя токена и значение моноширинным. */
export function DsMeta({ token, value }: { token: string; value: string }) {
  return (
    <div className="mt-3 flex flex-col gap-0.5">
      <code className="font-mono text-caption">{token}</code>
      <span className="text-fg-2 font-mono text-caption tabular-nums">{value}</span>
    </div>
  );
}
