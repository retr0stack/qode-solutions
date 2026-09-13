import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { PortfolioNda, PortfolioWall } from "@/components/cases";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.cases.title,
  description: pageSeo.cases.description,
  alternates: { canonical: "/portfolio" },
  /*
   * Кейсы в content/cases.ts пока временные, поэтому страница закрыта от
   * индексации. Снять noindex вместе с заменой данных на настоящие.
   */
  robots: { index: false, follow: true },
  openGraph: {
    title: pageSeo.cases.title,
    description: pageSeo.cases.description,
    url: "/portfolio",
  },
};

/** Портфолио: дрейфующая стена проектов и панель с описанием. */
export default function PortfolioPage() {
  return (
    <>
      <PageIntro intro={ru.cases.intro} />

      <PortfolioWall />

      <PortfolioNda />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.cases.intro.eyebrow, path: "/portfolio" },
        ])}
      />
    </>
  );
}
