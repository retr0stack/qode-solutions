import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { PartnersCarousel } from "@/components/partners";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: `${ru.partners.intro.title} – ${site.name}`,
  description: ru.partners.intro.lead,
  alternates: { canonical: "/partners" },
  openGraph: {
    title: `${ru.partners.intro.title} – ${site.name}`,
    description: ru.partners.intro.lead,
    url: "/partners",
  },
};

/**
 * Зарубежные клиенты.
 *
 * ВНИМАНИЕ: список в content/i18n — заглушки-примеры. Заменить на реальных
 * подрядчиков до публикации: чужие названия на сайте без договорённости
 * создают проблему, которую потом дороже разбирать, чем сейчас заполнить.
 */
export default function PartnersPage() {
  return (
    <>
      <PageIntro section="partners" />

      <PartnersCarousel />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.partners.intro.eyebrow, path: "/partners" },
        ])}
      />
    </>
  );
}
