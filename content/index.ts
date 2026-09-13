/**
 * Единая точка входа в контент. Компоненты импортируют отсюда:
 *   import { hero, services } from "@/content";
 *
 * Когда подключим i18n, здесь появится резолвер локали, а сигнатуры
 * останутся теми же – страницы менять не придётся. См. content/README.md.
 */
export * from "./types";
export * from "./site";
export * from "./nav";
export * from "./home";
export * from "./services";
export * from "./process";
export * from "./stack";
export * from "./faq";
export * from "./team";
export * from "./cases";
export * from "./forms";
export * from "./seo";
