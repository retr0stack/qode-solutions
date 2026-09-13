"use client";

import Image from "next/image";
import Link from "next/link";
import { Container, Text } from "@/components/primitives";
import { GradientBlobs } from "@/components/motion";
import { contacts, site, socials, whatsappHref, PHONE_ENABLED } from "@/content";
import { track } from "@/lib/analytics";
import { useDict } from "@/components/i18n";

/**
 * Футер. Светлая голубая зона — тёмной плашки внизу страницы больше нет.
 *
 * Логотип берётся из /public/logo_website.png: у него тёмная словесная часть,
 * поэтому фон здесь обязан оставаться светлым.
 *
 * Нижней строки с копирайтом и дескриптором нет намеренно — она убрана
 * по требованию: футер заканчивается ссылками и контактами.
 */
export function Footer() {
  const dict = useDict();

  return (
    <footer
      data-surface="sky"
      className="relative overflow-hidden border-t border-white/70"
    >
      <GradientBlobs />

      <Container className="relative pt-[var(--section-md)] pb-14">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 flex flex-col gap-6 md:col-span-8 lg:col-span-4">
            <Link href="/" aria-label={`${site.name} – ${dict.common.toHome}`} className="w-fit">
              <Image
                src="/logo_website.png"
                alt={site.name}
                width={1790}
                height={496}
                sizes="240px"
                className="h-9 w-auto md:h-10"
              />
            </Link>

            <Text size="small" className="max-w-[36ch]">
              {dict.footer.tagline}
            </Text>

            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-small underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {dict.footer.groups.map((group) => (
            <nav
              key={group.title}
              aria-label={group.title}
              className="col-span-2 flex flex-col gap-4 md:col-span-4 lg:col-span-2"
            >
              <p className="text-fg-2 text-label font-semibold uppercase">{group.title}</p>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-small opacity-80 transition-opacity hover:opacity-100"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="col-span-4 flex flex-col gap-6 md:col-span-4 lg:col-span-4">
            <div className="flex flex-col gap-4">
              <p className="text-fg-2 text-label font-semibold uppercase">
                {dict.footer.contactTitle}
              </p>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("whatsapp_click")}
                    className="text-small"
                  >
                    WhatsApp
                  </a>
                </li>
                {/* Телефон появится, когда в конфиге включат PHONE_ENABLED. */}
                {PHONE_ENABLED ? (
                  <li>
                    <a
                      href={contacts.phoneHref}
                      onClick={() => track("phone_click")}
                      className="text-small"
                    >
                      {contacts.phone}
                    </a>
                  </li>
                ) : null}
                <li>
                  <a
                    href={contacts.emailHref}
                    onClick={() => track("email_click")}
                    className="text-small"
                  >
                    {contacts.email}
                  </a>
                </li>
                <li className="text-fg-2 text-small">{contacts.workingHours}</li>
              </ul>
            </div>

          </div>
        </div>
      </Container>
    </footer>
  );
}
