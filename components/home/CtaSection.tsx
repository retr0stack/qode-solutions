"use client";

import { Container, Section, SectionIntroBlock, Text } from "@/components/primitives";
import { Button, Disclosure } from "@/components/ui";
import { InkBackdrop, Magnetic, Reveal } from "@/components/motion";
import { LeadForm } from "@/components/forms";
import { useDict } from "@/components/i18n";
import { contacts, socials, whatsappHref, PHONE_ENABLED } from "@/content";
import { track } from "@/lib/analytics";

/**
 * Финальный CTA с формой.
 *
 * Раскладка повторяет страницу контактов: подводка сверху на всю ширину,
 * ниже форма в широкой колонке и каналы связи в узкой. Раньше секция
 * ставила подводку и контакты слева, а форму справа — из-за этого поля,
 * подписи и кнопка делили ширину с третьим столбцом и расползались.
 * Теперь форма везде живёт в одной и той же сетке.
 */
export function CtaSection() {
  const dict = useDict();

  return (
    <Section id="cta" surface="dark" density="lg" className="relative overflow-hidden">
      {/* Фон финального CTA – глубокий синий градиент. Стоковые снимки
          отсюда убраны: под текстом и полями ввода нужна ровная тёмная
          плоскость, а не сюжет, который с ними конкурирует. */}
      <InkBackdrop />

      <Container className="relative">
        {/*
          Подводка живёт внутри левой колонки, а не полосой на всю ширину.
          Из-за полосы правая колонка начиналась ниже заголовка и висела
          на уровне полей – теперь обе колонки стартуют от верхней кромки
          секции, и блок читается как две параллельные дорожки.
        */}
        <div className="grid-12 items-start gap-y-12">
          {/*
            Обе колонки жёстко посажены в первую строку сетки. Без row-start
            авторазмещение уводило вторую колонку на следующую строку, когда
            в первой не оставалось места под её ширину – отсюда и брался
            вертикальный сдвиг между блоками.
          */}
          <div className="col-span-4 flex flex-col gap-12 md:col-span-8 lg:col-span-7 lg:row-start-1">
            <SectionIntroBlock intro={dict.cta.intro} />

            <Reveal>
              <LeadForm />
            </Reveal>
          </div>

          <Reveal
            delay={0.1}
            className="col-span-4 md:col-span-8 lg:col-span-4 lg:col-start-9 lg:row-start-1"
          >
            <div className="flex flex-col gap-8">
              {/* Кнопка стоит первой в колонке, сразу под её подписью:
                  это второй по важности путь связаться, и прятать его
                  ниже контактов незачем. */}
              <div className="flex flex-col gap-5">
                <p className="text-label font-semibold">{dict.cta.whatsappTitle}</p>

                <Magnetic className="w-full">
                  <Button
                    href={whatsappHref}
                    size="lg"
                    onClick={() => track("whatsapp_click")}
                    className="min-h-[52px] w-full"
                  >
                    {dict.common.writeWhatsApp}
                  </Button>
                </Magnetic>

                <Text size="caption">{dict.cta.whatsappNote}</Text>
              </div>

              {/*
                На телефоне почта, покрытие и соцсети занимают пол-экрана и
                оттягивают внимание от формы, ради которой секция и сделана.
                Поэтому до lg они свёрнуты под один тап, а на десктопе,
                где места хватает, показаны сразу.
              */}
              <Disclosure title={dict.cta.otherWays} className="border-t lg:hidden">
                <ContactExtras />
              </Disclosure>

              <div className="max-lg:hidden">
                <ContactExtras />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </Section>
  );
}

/** Почта, покрытие и соцсети — один блок для обеих раскладок. */
function ContactExtras() {
  const dict = useDict();

  return (
    <div className="flex flex-col gap-8">
      <dl className="flex flex-col gap-4">
        {PHONE_ENABLED ? (
          <div className="flex flex-col gap-1">
            <dt className="text-fg-2 text-caption">{dict.cta.phoneLabel}</dt>
            <dd>
              <a
                href={contacts.phoneHref}
                onClick={() => track("phone_click")}
                className="text-small"
              >
                {contacts.phone}
              </a>
            </dd>
          </div>
        ) : null}

        <div className="flex flex-col gap-1">
          <dt className="text-fg-2 text-caption">{dict.cta.emailLabel}</dt>
          <dd>
            <a
              href={contacts.emailHref}
              onClick={() => track("email_click")}
              className="text-small"
            >
              {contacts.email}
            </a>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-fg-2 text-caption">{dict.cta.coverageLabel}</dt>
          <dd className="text-small">{dict.hero.coverage}</dd>
        </div>
      </dl>

      {/* Соцсети – из одного конфига, тот же список, что и в футере. */}
      <ul className="border-line flex flex-wrap gap-x-5 gap-y-2 border-t pt-6">
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
  );
}
