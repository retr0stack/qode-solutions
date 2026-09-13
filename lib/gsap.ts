"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Единая точка входа в GSAP: плагин регистрируется один раз.
 * Lenis скроллит окно нативно, поэтому ScrollTrigger получает обычные
 * события скролла и связывать их вручную не нужно.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export { gsap, ScrollTrigger };
