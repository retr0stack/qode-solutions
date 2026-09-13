"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/motion";
import { Text } from "@/components/primitives";
import { usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Аккордеон вопросов. Открыт не больше одного пункта: список короткий,
 * и так проще сравнивать ответы.
 *
 * Доступность: кнопка с aria-expanded и aria-controls, ответ — регион,
 * подписанный своим вопросом. Работает с клавиатуры без своих обработчиков —
 * это обычные кнопки.
 *
 * Раскрытие анимирует высоту: это единственное место на сайте, где
 * затрагивается layout, и только внутри одного пункта на 420 мс.
 */
interface FaqAccordionItem {
  readonly question: string;
  readonly answer: string;
}

export function FaqAccordion({ items }: { items: readonly FaqAccordionItem[] }) {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <ul className="flex flex-col">
      {items.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `${baseId}-q-${index}`;
        const panelId = `${baseId}-a-${index}`;

        return (
          <li key={item.question} className="border-line border-t last:border-b">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenIndex(open ? null : index)}
                className="group flex w-full items-start justify-between gap-6 py-6 text-left md:py-7"
              >
                <span className="font-display text-title font-semibold">
                  {item.question}
                </span>

                {/* Плюс, который становится минусом: две линии и один поворот. */}
                <span
                  aria-hidden="true"
                  className="border-line relative mt-1 flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors group-hover:border-[color:var(--color-blue-ink)]"
                >
                  <span className="bg-fg absolute h-px w-3" />
                  <span
                    className={cn(
                      "bg-fg absolute h-3 w-px transition-transform duration-300 ease-brand",
                      open ? "scale-y-0" : "scale-y-100",
                    )}
                  />
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={reduced ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduced ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.42, ease: EASE.brand }}
                  className="overflow-hidden"
                >
                  <Text size="body" className="max-w-[62ch] pb-7">
                    {item.answer}
                  </Text>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
