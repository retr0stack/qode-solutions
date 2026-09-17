import type { Metadata } from "next";
import { PageIntro } from "@/components/layout";
import { ContactsBody } from "@/components/contacts";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { pageSeo } from "@/content";
import { ru } from "@/content/i18n";

export const metadata: Metadata = {
  title: pageSeo.contacts.title,
  description: pageSeo.contacts.description,
  alternates: { canonical: "/contacts" },
  openGraph: {
    title: pageSeo.contacts.title,
    description: pageSeo.contacts.description,
    url: "/contacts",
  },
};

export default function ContactsPage() {
  return (
    <>
      <PageIntro section="contacts" />

      <ContactsBody />

      <JsonLd
        data={breadcrumbSchema([
          { name: "Главная", path: "/" },
          { name: ru.contacts.intro.eyebrow, path: "/contacts" },
        ])}
      />
    </>
  );
}
