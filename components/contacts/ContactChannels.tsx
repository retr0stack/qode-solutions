"use client";

import { Heading, Text } from "@/components/primitives";
import { Button, Disclosure } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { useDict } from "@/components/i18n";
import { contacts, socials, whatsappHref, PHONE_ENABLED } from "@/content";
import { track } from "@/lib/analytics";

/**
 * Каналы связи.
 *
 * На телефоне страница строится так: сначала действие, потом всё
 * остальное. Кнопка WhatsApp стоит первой и во всю ширину, а списки
 * контактов и география свёрнуты — раньше они занимали пол-экрана до того,
 * как человек вообще доходил до формы.
 *
 * Привязки к офису здесь нет: сначала честно сказано, что работаем по
 * всему Казахстану, и только отдельным пунктом — что в Астане можно
 * встретиться лично.
 */
export function ContactChannels({ part = "all" }: { part?: "cta" | "details" | "all" }) {
  const dict = useDict();

  /* Части разнесены, потому что на телефоне между кнопкой и списками
     должна стоять форма: сначала самое быстрое действие, потом форма,
     и только потом справочная информация. */
  const showCta = part === "cta" || part === "all";
  const showDetails = part === "details" || part === "all";

  return (
    <div className="flex flex-col gap-8">
      {showCta ? (
      <div className="flex flex-col gap-4">
        <Magnetic className="max-lg:w-full lg:self-start">
          <Button
            href={whatsappHref}
            size="lg"
            onClick={() => track("whatsapp_click")}
            className="max-lg:w-full"
          >
            {dict.common.writeWhatsApp}
          </Button>
        </Magnetic>
        <Text size="caption">{dict.contacts.hoursNote}</Text>
      </div>
      ) : null}

      {/* До lg – два аккордеона, с lg – обычные блоки. */}
      <div className={showDetails ? "lg:hidden" : "hidden"}>
        <div className="border-line border-t">
          <Disclosure title={dict.contacts.channelsTitle}>
            <Channels />
          </Disclosure>
          <Disclosure title={dict.contacts.geographyTitle}>
            <Geography />
          </Disclosure>
        </div>
      </div>

      <div className={showDetails ? "flex flex-col gap-8 max-lg:hidden" : "hidden"}>
        <Channels />
        <Geography />
      </div>
    </div>
  );
}

/** Телефон, почта, Telegram и соцсети. */
function Channels() {
  const dict = useDict();

  return (
    <div className="flex flex-col gap-6">
      <dl className="flex flex-col gap-6">
        {/* Телефон появится, когда в конфиге включат PHONE_ENABLED. */}
        {PHONE_ENABLED ? (
          <div className="flex flex-col gap-1">
            <dt className="text-fg-2 text-label font-semibold uppercase">
              {dict.contacts.phoneLabel}
            </dt>
            <dd>
              <a
                href={contacts.phoneHref}
                onClick={() => track("phone_click")}
                className="font-display text-title font-semibold"
              >
                {contacts.phone}
              </a>
            </dd>
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <dt className="text-fg-2 text-label font-semibold uppercase">
            {dict.contacts.emailLabel}
          </dt>
          <dd>
            <a
              href={contacts.emailHref}
              onClick={() => track("email_click")}
              className="font-display text-title font-semibold"
            >
              {contacts.email}
            </a>
          </dd>
        </div>

        <div className="flex flex-col gap-1">
          <dt className="text-fg-2 text-label font-semibold uppercase">
            {dict.contacts.telegramLabel}
          </dt>
          <dd>
            <a
              href={`https://t.me/${contacts.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track("telegram_click")}
              className="font-display text-title font-semibold"
            >
              @{contacts.telegram}
            </a>
          </dd>
        </div>
      </dl>

      <div className="border-line flex flex-col gap-4 border-t pt-6">
        <p className="text-fg-2 text-label font-semibold uppercase">
          {dict.contacts.socialsLabel}
        </p>
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
    </div>
  );
}

/** Покрытие и личная встреча — одним списком, без баннеров. */
function Geography() {
  const dict = useDict();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Heading level={3} size="title">
          {dict.contacts.coverageTitle}
        </Heading>
        <Text size="small">{dict.contacts.coverageText}</Text>
      </div>

      <div className="border-line flex flex-col gap-3 border-t pt-6">
        <Heading level={3} size="title">
          {dict.contacts.meetingTitle}
        </Heading>
        <Text size="small">{dict.contacts.meetingText}</Text>

      </div>
    </div>
  );
}
