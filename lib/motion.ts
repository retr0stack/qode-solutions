import type { Transition, Variants } from "framer-motion";

/**
 * Единые тайминги и кривые для JS-анимаций.
 * Значения совпадают с CSS-токенами в app/styles/tokens.css —
 * движение на сайте должно быть узнаваемо одинаковым.
 */
export const EASE = {
  brand: [0.22, 1, 0.36, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
} as const;

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.42,
  scene: 0.72,
} as const;

export const transition = {
  base: { duration: DURATION.base, ease: EASE.brand },
  slow: { duration: DURATION.slow, ease: EASE.brand },
  scene: { duration: DURATION.scene, ease: EASE.outExpo },
} satisfies Record<string, Transition>;

/** Появление блока при скролле. Только opacity + transform. */
export const fadeRise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: transition.scene },
};

/** Контейнер для каскадного появления детей. */
export function stagger(step = 0.07, delay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren: step, delayChildren: delay },
    },
  };
}

/** Посимвольное появление заголовка. */
export const charReveal: Variants = {
  hidden: { opacity: 0, y: "0.4em" },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: EASE.outExpo },
  },
};

/** Порог видимости по умолчанию для useInView / whileInView. */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
