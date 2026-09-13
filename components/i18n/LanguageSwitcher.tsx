"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { LOCALES, dictionaries } from "@/content/i18n";
import { useDict, useLocale } from "./LanguageProvider";

interface LanguageSwitcherProps {
  /** `pill` — компактный переключатель в шапке, `wide` — в мобильном меню. */
  size?: "pill" | "wide";
  className?: string;
}

/**
 * Переключатель языка. Две кнопки в одной капсуле; активная подсвечивается
 * градиентной плашкой, которая переезжает между ними через layoutId —
 * это transform, поэтому кадр дешёвый.
 *
 * Это радиогруппа по смыслу: обе кнопки видимы, состояние передаётся
 * через aria-pressed, а не только цветом.
 */
export function LanguageSwitcher({ size = "pill", className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale();
  const dict = useDict();

  return (
    <div
      role="group"
      aria-label={dict.common.languageLabel}
      className={cn(
        "border-line/80 relative flex shrink-0 items-center gap-0.5 rounded-full border bg-white/70 p-1 backdrop-blur-sm",
        size === "wide" && "w-full justify-center gap-1 p-1.5",
        className,
      )}
    >
      {LOCALES.map((code) => {
        const active = code === locale;

        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={dictionaries[code].meta.label}
            className={cn(
              "relative rounded-full px-2.5 py-1 text-caption font-semibold transition-colors duration-200",
              size === "wide" && "flex-1 px-4 py-2 text-small",
              active ? "text-white" : "text-fg-2 hover:text-fg",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`lang-pill-${size}`}
                aria-hidden="true"
                className="absolute inset-0 rounded-full bg-[image:var(--gradient-brand-deep)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative">{dictionaries[code].meta.short}</span>
          </button>
        );
      })}
    </div>
  );
}
