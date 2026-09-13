import { Container, Heading, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { GradientBlobs } from "@/components/motion";
import { Logo } from "@/components/brand";
import { ru } from "@/content/i18n";

export const metadata = {
  title: ru.notFound.title,
  robots: { index: false, follow: false },
};

/** 404. Светлая зона, как и остальной сайт: тёмных экранов на нём больше нет. */
export default function NotFound() {
  return (
    <section className="relative flex min-h-svh flex-col justify-center overflow-hidden pt-[var(--header-total)]">
      <GradientBlobs />

      <Container className="relative flex flex-col items-start gap-7">
        <Logo variant="mark" />
        <p className="text-fg-2 font-mono text-caption tabular-nums">404</p>
        <Heading level={1} size="display-2" className="max-w-[20ch]">
          {ru.notFound.title}
        </Heading>
        <Text size="lead" className="max-w-[46ch]">
          {ru.notFound.text}
        </Text>
        <div className="flex flex-wrap gap-4">
          <Button href="/" size="lg">
            {ru.notFound.home}
          </Button>
          <Button href="/contacts" variant="secondary" size="lg">
            {ru.notFound.contacts}
          </Button>
        </div>
      </Container>
    </section>
  );
}
