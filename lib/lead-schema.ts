import { z } from "zod";
import { serviceOptions } from "@/content";
import { ru } from "@/content/i18n";

/** Значения селекта направления берутся из контента – один источник правды. */
const serviceValues = serviceOptions.map((option) => option.value) as [
  string,
  ...string[],
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
/** Телефон: 10–15 цифр, разделители и +7 допускаются в любом виде. */
const PHONE = /^\+?[\d\s()-]{10,20}$/;

/** Тексты ошибок валидации — приходят из словаря текущего языка. */
export type LeadMessages = (typeof ru)["form"]["validation"];

/**
 * Схема заявки. Одна и та же на клиенте (react-hook-form) и на сервере
 * (/api/lead): клиентская валидация — удобство, серверная — единственная,
 * которой можно доверять.
 *
 * Схема собирается фабрикой, потому что сообщения об ошибках зависят от
 * языка интерфейса: правила одинаковые, тексты разные. Значения бюджета
 * при этом остаются общими ключами и от языка не зависят — иначе заявка,
 * отправленная на казахском, не прошла бы серверную проверку.
 */
export function createLeadSchema(messages: LeadMessages, compact = false) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameTooShort)
      .max(80),
    contact: z
      .string()
      .trim()
      .min(1, messages.contactRequired)
      .max(120)
      .refine(
        (value) => EMAIL.test(value) || PHONE.test(value.replace(/\s/g, "")),
        messages.contactInvalid,
      ),
    /*
     * Описание задачи необязательно в обеих формах.
     *
     * Человек, который пришёл с вопросом «сколько это стоит», не готов
     * писать техническое задание – и уходит, увидев большое обязательное
     * поле. Имени и контакта достаточно, детали выясняются в переписке.
     */
    task: z.string().trim().max(2000).optional(),
    /* Направление – единственный вопрос по сути. В короткой форме его
       тоже не спрашиваем: там важна только скорость. */
    service: compact
      ? z.enum(serviceValues).optional()
      : z.enum(serviceValues, { message: messages.serviceRequired }),
    /**
     * Ловушка для ботов: настоящий человек это поле не видит и не заполнит.
     * Дешевле и незаметнее капчи.
     */
    company: z.string().max(0).optional(),
  });
}

/**
 * Схема по умолчанию — ей проверяет входящие данные /api/lead.
 * Режим compact: сервер обязан принимать и короткую, и полную заявку.
 */
export const leadSchema = createLeadSchema(ru.form.validation, true);

export type LeadInput = z.infer<typeof leadSchema>;

/** Подпись направления по значению – для письма и лога. */
export function serviceLabel(value: string): string {
  return serviceOptions.find((option) => option.value === value)?.label ?? value;
}
