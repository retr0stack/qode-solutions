import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { CaseStudyList, PortfolioNda } from "@/components/cases";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.cases.title,
  description: pageSeo.cases.description,
  alternates: { canonical: "/portfolio" },
  /*
   * Данные кейсов пока вымышленные – страница закрыта от индексации.
   * Снять noindex вместе с заменой на настоящие проекты и цифры.
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
      <PageIntro section="cases" />

      <CaseStudyList />

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
