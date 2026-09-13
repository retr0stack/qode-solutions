"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { contacts, whatsappHref, PHONE_ENABLED } from "@/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useDict } from "@/components/i18n";
import { track } from "@/lib/analytics";

/** Иконка WhatsApp — собственный путь, не сторонний спрайт. */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.19-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.24 8.24 0 0 1 8.22 8.24c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.79.97-.14.16-.29.18-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.42.06-.64.31-.22.25-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.17 1.69 2.58 4.09 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.52.1.46-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"
      />
    </svg>
  );
}

/**
 * Связь в один тап с любой точки любой страницы.
 *
 * Десктоп — круглая кнопка справа снизу. Мобильный — закреплённая панель на
 * всю ширину: на телефоне палец живёт внизу экрана, и попадать в маленький
 * круг в углу неудобно.
 *
 * Появляется после четверти прокрутки, а не сразу. На первом экране уже есть
 * две кнопки, и третья поверх них только спорит с ними за внимание; смысл
 * плавающей кнопки в том, чтобы догнать человека, который уже читает.
 *
 * Пульсирует ровно один раз при появлении. Бесконечное мигание в углу — это
 * то, что люди отучились замечать, и оно мешает читать текст рядом.
 *
 * Панель прячется, когда фокус стоит в поле ввода: на низких экранах она
 * перекрывала бы поле и кнопку отправки формы.
 */
export function WhatsAppFab() {
  const dict = useDict();
  const reduced = usePrefersReducedMotion();

  const [shown, setShown] = useState(false);
  const [typing, setTyping] = useState(false);

  // Порог появления — четверть прокручиваемой высоты.
  useEffect(() => {
    const onScroll = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      setShown(progress >= 0.25);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* focusin/focusout всплывают, поэтому хватает пары слушателей на документ
     вместо обработчиков на каждом поле формы. */
  useEffect(() => {
    const isField = (node: EventTarget | null) =>
      node instanceof Element && Boolean(node.closest("input, textarea, select"));

    const onFocusIn = (event: FocusEvent) => setTyping(isField(event.target));
    const onFocusOut = () => setTyping(false);

    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  const visible = shown && !typing;
  const label = PHONE_ENABLED ? `${dict.whatsapp.aria} – ${contacts.phone}` : dict.whatsapp.aria;

  return (
    <>
      {/* Десктоп: круглая кнопка в углу. */}
      <motion.a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click")}
        aria-label={label}
        title={dict.whatsapp.tooltip}
        className="fixed right-[var(--gutter)] bottom-[var(--gutter)] z-40 hidden size-14 items-center justify-center rounded-full text-white shadow-lift md:flex"
        style={{ backgroundColor: "#25D366", pointerEvents: visible ? "auto" : "none" }}
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.8 }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { type: "spring", stiffness: 420, damping: 26, mass: 0.7 }
        }
        whileHover={reduced ? undefined : { scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Один импульс при появлении: кольцо запускается вместе с кнопкой
            и больше не повторяется. */}
        {visible && !reduced ? (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]"
            initial={{ opacity: 0.55, scale: 1 }}
            animate={{ opacity: 0, scale: 1.7 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
          />
        ) : null}

        <WhatsAppIcon className="relative size-7" />
      </motion.a>

      {/* Мобильный: нижняя панель на всю ширину. */}
      <motion.div
        className="fixed inset-x-0 bottom-0 z-40 flex gap-2 border-t border-[color:var(--color-line)] bg-white/90 p-3 backdrop-blur-md md:hidden"
        style={{ pointerEvents: visible ? "auto" : "none" }}
        initial={false}
        animate={{ y: visible ? 0 : "110%", opacity: visible ? 1 : 0 }}
        transition={
          reduced
            ? { duration: 0.01 }
            : { type: "spring", stiffness: 380, damping: 32, mass: 0.8 }
        }
      >
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => track("whatsapp_click")}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-full py-3.5 text-small font-semibold text-white"
          style={{ backgroundColor: "#25D366" }}
        >
          <WhatsAppIcon className="size-5" />
          {dict.whatsapp.barCta}
        </a>

        {PHONE_ENABLED ? (
          <a
            href={contacts.phoneHref}
            onClick={() => track("phone_click")}
            aria-label={contacts.phone}
            className="border-line text-fg flex size-12 shrink-0 items-center justify-center rounded-full border"
          >
            <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"
              />
            </svg>
          </a>
        ) : null}
      </motion.div>
    </>
  );
}
