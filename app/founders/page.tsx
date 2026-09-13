import type { Metadata } from "next";
import { FoundersContent } from "@/components/founders";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: `${ru.founders.intro.title} – ${site.name}`,
  description: ru.founders.intro.lead,
  alternates: { canonical: "/founders" },
  openGraph: {
    title: `${ru.founders.intro.title} – ${site.name}`,
    description: ru.founders.intro.lead,
    url: "/founders",
  },
};

/** Основатели: две биографии и история появления агентства. */
export default function FoundersPage() {
  return (
    <>
      {/* Шапки здесь нет намеренно: страница открывается портретами
          во весь экран, а подводка над ними только отодвигала бы их вниз. */}
      <FoundersContent />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.founders.intro.eyebrow, path: "/founders" },
        ])}
      />
    </>
  );
}
