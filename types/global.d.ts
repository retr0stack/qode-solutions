import type Lenis from "lenis";

declare global {
  interface Window {
    /** Экземпляр Lenis, если инерционный скролл включён (см. SmoothScrollProvider). */
    __lenis?: Lenis;
  }
}

export {};
