"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/cn";
import { createLeadSchema, type LeadInput } from "@/lib/lead-schema";
import { LEAD_FORM_ID, whatsappHref } from "@/content";
import { useDict } from "@/components/i18n";
import { Heading, Text } from "@/components/primitives";
import { Button } from "@/components/ui";
import { Magnetic } from "@/components/motion";
import { Field, SelectShell } from "./Field";
import { track } from "@/lib/analytics";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Форма заявки. Валидация — zod через react-hook-form, те же правила
 * проверяют данные на сервере в /api/lead.
 *
 * Схема пересобирается при смене языка: правила одни и те же, а тексты
 * ошибок приходят из словаря. Значения бюджета остаются общими ключами,
 * поэтому заявка с казахского интерфейса проходит серверную проверку.
 *
 * Состояния: покой, отправка, успех, ошибка. При ошибке сразу предлагаем
 * WhatsApp — не заставляем человека чинить нашу форму.
 */
interface LeadFormProps {
  /**
   * `compact` — два поля, имя и контакт. Это основной вариант на всех
   * страницах: каждое дополнительное поле стоит части заявок, а задачу и
   * бюджет проще выяснить в переписке, чем требовать до первого контакта.
   *
   * `full` — расширенный вариант для страницы контактов, куда человек
   * приходит уже готовым рассказать подробности.
   */
  variant?: "compact" | "full";
  className?: string;
}

export function LeadForm({ variant = "compact", className }: LeadFormProps) {
  const compact = variant === "compact";
  const dict = useDict();
  const [status, setStatus] = useState<Status>("idle");

  const schema = useMemo(
    () => createLeadSchema(dict.form.validation, compact),
    [dict.form.validation, compact],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      track("lead_form");
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  });

  if (status === "success") {
    return (
      <div
        id={LEAD_FORM_ID}
        role="status"
        className={cn("surface flex flex-col gap-4 p-8 md:p-10", className)}
      >
        <span
          aria-hidden="true"
          className="h-1 w-14 rounded-full bg-[image:var(--gradient-brand)]"
        />
        <Heading level={3} size="display-3">
          {dict.form.successTitle}
        </Heading>
        <Text size="lead" className="max-w-[42ch]">
          {dict.form.successText}
        </Text>
        <div className="mt-2">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            {dict.form.sendMore}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      id={LEAD_FORM_ID}
      onSubmit={onSubmit}
      noValidate
      className={cn("flex flex-col gap-6", className)}
    >
      {/* gap-5 совпадает с шагом правой колонки секции – строки двух
          колонок встают на одни и те же базовые линии. */}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="lead-name" label={dict.form.nameLabel} error={errors.name?.message}>
          {(props) => (
            <input
              {...props}
              {...register("name")}
              type="text"
              autoComplete="name"
              placeholder={dict.form.namePlaceholder}
            />
          )}
        </Field>

        <Field
          id="lead-contact"
          label={dict.form.contactLabel}
          hint={dict.form.contactHint}
          error={errors.contact?.message}
        >
          {(props) => (
            <input
              {...props}
              {...register("contact")}
              type="text"
              inputMode="tel"
              autoComplete="tel email"
              placeholder={dict.form.contactPlaceholder}
            />
          )}
        </Field>
      </div>

      {compact ? null : (
        <>
      <Field
        id="lead-service"
        label={dict.form.serviceLabel}
        hint={dict.form.serviceHint}
        error={errors.service?.message}
      >
        {(props) => (
          <SelectShell>
            <select
              {...props}
              {...register("service")}
              defaultValue=""
              className={cn(props.className, "appearance-none pr-11")}
            >
              <option value="" disabled>
                {dict.form.servicePlaceholder}
              </option>
              {dict.form.serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SelectShell>
        )}
      </Field>

      <Field id="lead-task" label={dict.form.taskLabel} error={errors.task?.message}>
        {(props) => (
          <textarea
            {...props}
            {...register("task")}
            rows={5}
            placeholder={dict.form.taskPlaceholder}
            className={cn(props.className, "resize-y")}
          />
        )}
      </Field>
        </>
      )}

      {/* Ловушка для ботов: скрыта от людей, но не от автозаполнялок. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="lead-company">{dict.form.honeypot}</label>
        <input id="lead-company" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      {status === "error" ? (
        <div role="alert" className="border-danger flex flex-col gap-2 rounded-md border p-5">
          <p className="text-small font-semibold">{dict.form.errorTitle}</p>
          <Text size="small">{dict.form.errorText}</Text>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-small underline underline-offset-4"
          >
            {dict.common.writeWhatsApp}
          </a>
        </div>
      ) : null}

      {/*
        Кнопка и служебные подписи идут в одну колонку на всю ширину.
        Раньше подписи стояли справа от кнопки и образовывали третью колонку,
        которой в форме из двух полей взяться неоткуда – именно она и ломала
        вёрстку в секционной версии.
      */}
      <div className="flex flex-col gap-4">
        {/* Во всю ширину колонки: так кнопка отправки и кнопка WhatsApp
            в соседней колонке одинаковой высоты и стоят на одной линии. */}
        <Magnetic className="w-full">
          <Button
            type="submit"
            size="lg"
            disabled={status === "submitting"}
            className="w-full"
          >
            {status === "submitting" ? dict.form.submitting : dict.form.submit}
          </Button>
        </Magnetic>

        <div className="flex flex-col gap-1">
          {/* Страх навязчивого обзвона – настоящая причина не оставлять номер. */}
          <Text size="caption">{dict.form.reply}</Text>
          <Text size="caption">{dict.form.consent}</Text>
        </div>
      </div>
    </form>
  );
}
