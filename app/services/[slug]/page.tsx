import { notFound, permanentRedirect } from "next/navigation";
import { serviceSlugs } from "@/content";

/**
 * Заготовка под отдельную страницу услуги.
 *
 * Роутинг заложен и статически известен, но самих страниц пока нет: адрес
 * ведёт на соответствующий раздел /services. Так ссылки вида
 * /services/sites уже работают и не отдают 404.
 *
 * Чтобы сделать полноценную страницу:
 *   1. Заменить permanentRedirect на рендер раздела
 *      (getServiceBySlug(slug) из @/content уже возвращает нужные данные).
 *   2. Добавить generateMetadata с title и description раздела.
 *   3. Вернуть цикл по serviceSlugs в app/sitemap.ts.
 */
export function generateStaticParams() {
  return serviceSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export default async function ServiceSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!serviceSlugs.includes(slug)) notFound();

  permanentRedirect(`/services#${slug}`);
}
