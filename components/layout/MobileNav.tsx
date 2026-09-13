"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { EASE } from "@/lib/motion";
import { contacts, whatsappHref, PHONE_ENABLED } from "@/content";
import { track } from "@/lib/analytics";
import { Button } from "@/components/ui";
import { GradientBlobs } from "@/components/motion";
import { LanguageSwitcher, useDict } from "@/components/i18n";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Мобильное меню: светлая панель на весь экран, Esc и клик по ссылке закрывают.
 * Фон — то же мягкое голубое свечение, что и на секциях сайта.
 */
export function MobileNav({ open, onClose }: MobileNavProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // Пока меню открыто, страница под ним не должна прокручиваться.
    window.__lenis?.stop();
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.__lenis?.start();
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const dict = useDict();

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={dict.common.openMenu}
          className="gutter-x fixed inset-0 z-40 flex flex-col justify-between overflow-hidden bg-white/95 pt-[calc(var(--header-total)+1.5rem)] pb-10 backdrop-blur-xl lg:hidden"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.28, ease: EASE.brand }}
        >
          <GradientBlobs />

          <nav aria-label={dict.common.openMenu} className="relative">
            <ul className="flex flex-col gap-1">
              {dict.nav.map((item, index) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 + index * 0.05, ease: EASE.outExpo }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="font-display block py-3 text-display-3 font-semibold"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="relative flex flex-col gap-6">
            <LanguageSwitcher size="wide" />

            <Button href={whatsappHref} size="lg" className="w-full" onClick={() => track("whatsapp_click")}>
              {dict.common.writeWhatsApp}
            </Button>

            <div className="flex flex-col gap-1.5">
              {/* Телефон появится, когда в конфиге включат PHONE_ENABLED. */}
              {PHONE_ENABLED ? (
                <a
                  href={contacts.phoneHref}
                  onClick={() => track("phone_click")}
                  className="text-small"
                >
                  {contacts.phone}
                </a>
              ) : null}
              <a
                href={contacts.emailHref}
                onClick={() => track("email_click")}
                className="text-fg-2 text-small"
              >
                {contacts.email}
              </a>
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
