"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { leadFormHref, site } from "@/content";
import { Button } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { LanguageSwitcher, useDict } from "@/components/i18n";
import { MobileNav } from "./MobileNav";

/**
 * Шапка — плавающая капсула.
 *
 * Она вынесена из потока и всегда висит поверх страницы (position: fixed),
 * поэтому видна на любой позиции скролла. Внутри — отдельный прямоугольник
 * со скруглением: белое стекло, волосяная граница и мягкая тень.
 *
 * Тени и насыщенность фона немного усиливаются после первого скролла —
 * над самым верхом страницы капсула легче, ниже — плотнее, чтобы контент
 * под ней не просвечивал.
 */
export function Header() {
  const pathname = usePathname();
  const dict = useDict();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Меню закрываем при смене маршрута: иначе оно остаётся поверх новой страницы.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 pt-[var(--header-gap)]">
        <div className="gutter-x mx-auto w-full max-w-wide">
          <div
            className={cn(
              "pointer-events-auto flex h-[var(--header-h)] items-center justify-between gap-4 md:gap-6",
              "rounded-full border px-3 pr-3 md:px-5",
              "transition-[background-color,border-color,box-shadow] duration-300 ease-brand",
              "backdrop-blur-xl",
              scrolled || menuOpen
                ? "border-white/80 bg-white/88 shadow-header"
                : "border-white/70 bg-white/70 shadow-card",
            )}
          >
            <Link
              href="/"
              aria-label={`${site.name} – ${dict.common.toHome}`}
              className="group flex shrink-0 items-center rounded-full pl-1"
            >
              <Image
                src="/logo_website.png"
                alt={site.name}
                width={1790}
                height={496}
                priority
                sizes="(min-width: 768px) 190px, 150px"
                className={cn(
                  "h-6 w-auto md:h-7",
                  "transition-transform duration-300 ease-brand motion-safe:group-hover:scale-[1.03]",
                )}
              />
            </Link>

            <nav aria-label={dict.common.languageLabel} className="hidden lg:block">
              <ul className="flex items-center gap-7">
                {dict.nav.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "group/link relative py-2 text-small font-medium transition-colors",
                          active ? "text-fg" : "text-fg-2 hover:text-fg",
                        )}
                      >
                        {item.label}
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute -bottom-0.5 left-0 h-0.5 w-full origin-left rounded-full bg-[image:var(--gradient-brand)]",
                            "transition-transform duration-300 ease-brand",
                            active ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-100",
                          )}
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <LanguageSwitcher className="hidden sm:flex" />

              <Magnetic strength={5} className="hidden md:block">
                <Button href={leadFormHref}>{dict.common.discuss}</Button>
              </Magnetic>

              <button
                type="button"
                onClick={() => setMenuOpen((value) => !value)}
                aria-expanded={menuOpen}
                aria-label={menuOpen ? dict.common.closeMenu : dict.common.openMenu}
                className="border-line text-fg relative flex size-10 items-center justify-center rounded-full border bg-white/70 lg:hidden"
              >
                <span aria-hidden="true" className="relative block h-3 w-5">
                  <span
                    className={cn(
                      "bg-fg absolute left-0 block h-px w-full transition-transform duration-300 ease-brand",
                      menuOpen ? "top-1.5 rotate-45" : "top-0",
                    )}
                  />
                  <span
                    className={cn(
                      "bg-fg absolute left-0 block h-px w-full transition-transform duration-300 ease-brand",
                      menuOpen ? "top-1.5 -rotate-45" : "top-3",
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
