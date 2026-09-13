import { cn } from "@/lib/cn";

interface SplitTextProps {
  text: string;
  /** Задержка перед началом, секунды. */
  delay?: number;
  /** Шаг между символами. 0.028 — быстро и дорого, 0.06 — заметно. */
  step?: number;
  className?: string;
}

/**
 * Посимвольное появление строки — на CSS, без клиентского кода.
 *
 * Каждому символу задаётся своя animation-delay. Плюсы против JS-варианта:
 * компонент остаётся серверным, заголовок видно даже если JS не выполнился,
 * а под prefers-reduced-motion (motion-safe) анимации просто нет.
 *
 * Доступность: строка целиком отдаётся скринридеру одним узлом, а разбитая
 * копия скрыта через aria-hidden — иначе заголовок читался бы по буквам.
 *
 * Разбивка по словам: слово не рвётся на переносе, поэтому переносы строк
 * остаются естественными и layout не скачет.
 */
export function SplitText({ text, delay = 0, step = 0.028, className }: SplitTextProps) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span className={cn("inline-block", className)}>
      <span className="sr-only">{text}</span>

      <span aria-hidden="true" className="inline-block">
        {words.map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
            {[...word].map((char, index) => {
              const charDelay = delay + charIndex * step;
              charIndex += 1;

              return (
                <span
                  key={`${char}-${index}`}
                  className="motion-safe:animate-[char-rise_0.5s_var(--ease-out-expo)_both] inline-block"
                  style={{ animationDelay: `${charDelay.toFixed(3)}s` }}
                >
                  {char}
                </span>
              );
            })}
            {wordIndex < words.length - 1 ? <span>&nbsp;</span> : null}
          </span>
        ))}
      </span>
    </span>
  );
}
