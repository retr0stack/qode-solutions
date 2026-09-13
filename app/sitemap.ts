import type { MetadataRoute } from "next";
import { hasCases, site } from "@/content";

/** Карта сайта. Роуты добавляются здесь же — руками, чтобы не индексировать лишнее. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (path: string) => `${site.url}${path}`;

  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: url("/services"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: url("/team"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/founders"), lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: url("/partners"), lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: url("/contacts"), lastModified: now, changeFrequency: "yearly", priority: 0.8 },
  ];

  /*
   * /services/[slug] пока отдаёт редирект на якорь в /services, поэтому
   * в карте сайта его нет: индексировать редиректы не нужно.
   * Когда появятся полноценные страницы — раскомментировать.
   *
   * for (const slug of serviceSlugs) {
   *   pages.push({ url: url(`/services/${slug}`), lastModified: now,
   *     changeFrequency: "monthly", priority: 0.7 });
   * }
   */

  if (hasCases) {
    pages.push({
      url: url("/portfolio"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  return pages;
}
