"use client";

import { useMemo } from "react";
import { cases, casesKk, type CaseStudy } from "@/content";
import { useLocale } from "./LanguageProvider";

/**
 * Кейсы на языке интерфейса.
 *
 * Структура проекта – палитра, год, пропорция плитки – от языка не
 * зависит и живёт в content/cases.ts. Переводимые строки лежат отдельно,
 * и здесь они накладываются поверх базовой записи.
 *
 * Раньше компоненты читали cases напрямую, поэтому стена проектов и
 * панель описания оставались русскими при переключении на казахский.
 *
 * Если перевода для кейса нет, возвращается русская запись: недостающий
 * перевод лучше пустой карточки.
 */
export function useCases(): readonly CaseStudy[] {
  const { locale } = useLocale();

  return useMemo(() => {
    if (locale !== "kk") return cases;

    return cases.map((caseStudy) => {
      const translation = casesKk[caseStudy.slug];
      if (!translation) return caseStudy;

      return {
        ...caseStudy,
        industry: translation.industry,
        title: translation.title,
        summary: translation.summary,
        problem: translation.problem,
        solution: translation.solution,
        delivered: translation.delivered,
        metrics: caseStudy.metrics.map((metric, index) => ({
          value: metric.value,
          label: translation.metricLabels[index] ?? metric.label,
        })),
      };
    });
  }, [locale]);
}
