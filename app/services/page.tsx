import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { ServicesShowcase } from "@/components/services";
import { CtaSection } from "@/components/home";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, servicesSchema } from "@/lib/schema";
import { pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.services.title,
  description: pageSeo.services.description,
  alternates: { canonical: "/services" },
  openGraph: {
    title: pageSeo.services.title,
    description: pageSeo.services.description,
    url: "/services",
  },
};

/**
 * Услуги. Пять сцен-направлений с залипающими панелями и раскрывающимися
 * списками — вместо прежней плоской колонки из карточек.
 *
 * Шапка страницы и разметка для поисковиков рендерятся на сервере из русского
 * словаря: он же язык по умолчанию. Интерактивная часть — клиентская и
 * переключается вместе с языком.
 */
export default function ServicesPage() {
  const count = ru.services.categories.reduce(
    (total, category) => total + category.items.length,
    0,
  );

  return (
    <>
      <PageIntro
        section="services"
        titleNoWrap
        aside={
          <p className="text-small lg:text-right">
            {ru.services.categories.length} {ru.services.categoriesLabel} · {count}{" "}
            {ru.services.servicesLabel}. {ru.services.aside}
          </p>
        }
      />

      <ServicesShowcase />

      <CtaSection />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.services.intro.eyebrow, path: "/services" },
        ])}
      />
      <JsonLd data={servicesSchema()} />
    </>
  );
}
