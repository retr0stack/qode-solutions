/**
 * Копирует нужные субсеты переменных шрифтов из node_modules в app/fonts,
 * чтобы next/font/local раздавал их с нашего домена (нулевых внешних запросов).
 *
 * Запуск: npm run fonts:sync
 * Файлы коммитятся в репозиторий — пересинхронизация нужна только при
 * обновлении пакетов @fontsource-variable/*.
 */
import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "app", "fonts");
const ogOut = join(root, "app", "og-fonts");

/** @type {Array<[pkg: string, file: string, dest: string]>} */
const FILES = [
  // Display: Space Grotesk закрывает латиницу (в нём нет кириллицы).
  ["space-grotesk", "space-grotesk-latin-wght-normal.woff2", "space-grotesk-latin.woff2"],
  // Display: Manrope закрывает кириллицу — близкая геометрия и пропорции.
  ["manrope", "manrope-cyrillic-wght-normal.woff2", "manrope-cyrillic.woff2"],
  ["manrope", "manrope-cyrillic-ext-wght-normal.woff2", "manrope-cyrillic-ext.woff2"],
  // Text: Inter, латиница + кириллица (+ ext под казахские глифы).
  ["inter", "inter-latin-wght-normal.woff2", "inter-latin.woff2"],
  ["inter", "inter-cyrillic-wght-normal.woff2", "inter-cyrillic.woff2"],
  ["inter", "inter-cyrillic-ext-wght-normal.woff2", "inter-cyrillic-ext.woff2"],
];

/**
 * Шрифты для og-картинки. next/og (satori) не читает woff2 — только
 * ttf/otf/woff, поэтому берём статические .woff из невариативных пакетов.
 * Нужны ровно два начертания: 700 для заголовка и 500 для подписей.
 *
 * @type {Array<[pkg: string, file: string, dest: string]>}
 */
const OG_FILES = [
  ["space-grotesk", "space-grotesk-latin-700-normal.woff", "space-grotesk-700.woff"],
  ["space-grotesk", "space-grotesk-latin-500-normal.woff", "space-grotesk-500.woff"],
  ["manrope", "manrope-cyrillic-700-normal.woff", "manrope-700.woff"],
  ["manrope", "manrope-cyrillic-500-normal.woff", "manrope-500.woff"],
];

await mkdir(out, { recursive: true });
await mkdir(ogOut, { recursive: true });

for (const [pkg, file, dest] of FILES) {
  const from = join(root, "node_modules", `@fontsource-variable/${pkg}`, "files", file);
  await copyFile(from, join(out, dest));
  console.log(`✓ fonts/${dest}`);
}

for (const [pkg, file, dest] of OG_FILES) {
  const from = join(root, "node_modules", `@fontsource/${pkg}`, "files", file);
  await copyFile(from, join(ogOut, dest));
  console.log(`✓ og-fonts/${dest}`);
}
