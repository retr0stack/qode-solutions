import { cities, contacts, phones, site, socials } from "@/content";
import { ru } from "@/content/i18n";

/*
 * Разметка для поисковиков собирается из русского словаря: он язык по
 * умолчанию и единственный источник правды по услугам, команде и вопросам.
 * Переключение языка на клиенте JSON-LD не меняет — так и задумано.
 */

const ORGANIZATION_ID = `${site.url}/#organization`;

/** Организация. Ссылка по @id переиспользуется остальными сущностями. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORGANIZATION_ID,
    name: site.name,
    alternateName: site.descriptor,
    url: site.url,
    logo: `${site.url}/icon.svg`,
    email: contacts.email,
    /* E.164 без скобок: разметку читают машины, не люди. */
    telephone: phones.map((phone) => phone.href.replace("tel:", "")),
    foundingDate: String(site.foundingYear),
    sameAs: socials.filter((s) => s.label !== "WhatsApp").map((s) => s.href),
    areaServed: { "@type": "Country", name: "Казахстан" },
    knowsAbout: ru.services.categories.map((category) => category.title),
  };
}

/** Локальный бизнес — головной офис в Астане. */
export function localBusinessSchema() {
  const primary = cities.find((city) => city.primary) ?? cities[0];

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${site.url}/#localbusiness`,
    name: site.name,
    description: site.descriptor,
    url: site.url,
    image: `${site.url}/icon.svg`,
    /* E.164 без скобок: разметку читают машины, не люди. */
    telephone: phones.map((phone) => phone.href.replace("tel:", "")),
    email: contacts.email,
    parentOrganization: { "@id": ORGANIZATION_ID },
    address: {
      "@type": "PostalAddress",
      streetAddress: primary?.address ?? "",
      addressLocality: primary?.city ?? "Астана",
      postalCode: primary?.postalCode ?? "",
      addressCountry: "KZ",
    },
    /* TODO: подставить координаты офиса, когда будет точный адрес */
    priceRange: "₸₸",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "10:00",
      closes: "19:00",
    },
  };
}

/** Вопросы с главной. Разметка ровно та, что видна на странице. */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: ru.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Каталог услуг для страницы /services. */
export function servicesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Услуги QODE SOLUTIONS",
    provider: { "@id": ORGANIZATION_ID },
    itemListElement: ru.services.categories.map((category, index) => ({
      "@type": "OfferCatalog",
      position: index + 1,
      name: category.title,
      description: category.tagline,
      itemListElement: category.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.title, description: item.description },
      })),
    })),
  };
}

/** Команда для страницы /team. */
export function teamSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: ru.team.members.map((member, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.role,
        description: member.bio,
        knowsAbout: member.skills,
        worksFor: { "@id": ORGANIZATION_ID },
      },
    })),
  };
}

/** Хлебные крошки — помогают поиску показывать структуру раздела. */
export function breadcrumbSchema(items: readonly { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.path}`,
    })),
  };
}
