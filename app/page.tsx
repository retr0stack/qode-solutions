import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import {
  AdvantagesSection,
  CtaSection,
  DirectionsSection,
  EuropeSection,
  CasesPreview,
} from "@/components/home";
import { ProcessSection } from "@/components/process";
import { FaqSection } from "@/components/faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/lib/schema";
import { pageSeo } from "@/content";

export const metadata: Metadata = {
  title: pageSeo.home.title,
  description: pageSeo.home.description,
  alternates: { canonical: "/" },
};

/**
 * Главная. Плотность секций намеренно разная: после первого экрана
 * крупные направления, затем плотная горизонтальная сцена процесса,
 * пауза на отличиях, компактный стек, вопросы и финальный CTA.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <EuropeSection />
      <DirectionsSection />
      <CasesPreview />

      <ProcessSection />
      <AdvantagesSection />
      <FaqSection />
      <CtaSection />

      <JsonLd data={faqSchema()} />
    </>
  );
}
