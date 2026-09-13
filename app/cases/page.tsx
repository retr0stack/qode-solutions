import type { Metadata } from "next";
import { Container, Section } from "@/components/primitives";
import { PageIntro } from "@/components/layout";
import { CaseCard, CasesEmpty } from "@/components/cases";
import { Stagger, StaggerItem } from "@/components/motion";
import { cases, hasCases, pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.cases.title,
  description: pageSeo.cases.description,
  alternates: { canonical: "/cases" },
  // Пока кейсов нет, страницу в индекс не отдаём — см. app/sitemap.ts.
  robots: hasCases ? { index: true, follow: true } : { index: false, follow: true },
};

/**
 * Кейсы. Роут и сетка готовы заранее: чтобы раздел заработал, достаточно
 * дописать объект в content/cases.ts — переделывать ничего не придётся.
 * Первый кейс встаёт крупной плиткой.
 */
export default function CasesPage() {
  return (
    <>
      <PageIntro intro={ru.cases.intro} />

      <Section density="lg">
        <Container>
          {hasCases ? (
            <Stagger step={0.08} className="grid-12 gap-y-[var(--gutter)]">
              {cases.map((caseStudy, index) => (
                <StaggerItem
                  key={caseStudy.slug}
                  className={
                    index === 0
                      ? "col-span-4 md:col-span-8 lg:col-span-12"
                      : "col-span-4 md:col-span-4 lg:col-span-6"
                  }
                >
                  <CaseCard
                    caseStudy={caseStudy}
                    featured={index === 0}
                    priority={index === 0}
                  />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <CasesEmpty />
          )}
        </Container>
      </Section>
    </>
  );
}
