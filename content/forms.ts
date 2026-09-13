import type { FieldCopy, SelectOption } from "./types";

/** Вилки бюджета в тенге. TODO: сверить с текущим прайсом. */
export const budgetOptions: readonly SelectOption[] = [
  { value: "under-500k", label: "до 500 000 ₸" },
  { value: "500k-1500k", label: "500 000 – 1 500 000 ₸" },
  { value: "1500k-4000k", label: "1 500 000 – 4 000 000 ₸" },
  { value: "over-4000k", label: "более 4 000 000 ₸" },
  { value: "unknown", label: "Пока не знаю" },
];

export const leadForm = {
  title: "Обсудить проект",
  lead: "Заполните форму – вернёмся с вопросами и оценкой в течение рабочего дня.",
  fields: {
    name: {
      label: "Как вас зовут",
      placeholder: "Имя",
    },
    contact: {
      label: "Телефон или почта",
      placeholder: "+7 700 000 00 00 или mail@company.kz",
      hint: "Напишем в WhatsApp, если оставите номер.",
    },
    task: {
      label: "Задача",
      placeholder: "Что нужно сделать и в какие сроки",
    },
    budget: {
      label: "Бюджет",
      placeholder: "Выберите вилку",
      hint: "Помогает сразу предложить реалистичное решение.",
    },
  } satisfies Record<string, FieldCopy>,
  submit: "Отправить заявку",
  submitting: "Отправляем…",
  consent:
    "Отправляя форму, вы соглашаетесь на обработку персональных данных.",
  success: {
    title: "Заявка отправлена",
    text: "Получили. Ответим в рабочее время – обычно в течение дня.",
  },
  error: {
    title: "Не отправилось",
    text: "Что-то сломалось на нашей стороне. Напишите в WhatsApp – так быстрее.",
  },
} as const;

/** Сообщения валидации. Один текст на одно правило, без «поле обязательно». */
export const validationMessages = {
  nameRequired: "Напишите, как к вам обращаться",
  nameTooShort: "Слишком коротко – минимум 2 символа",
  contactRequired: "Оставьте телефон или почту",
  contactInvalid: "Похоже, в телефоне или почте опечатка",
  taskRequired: "Опишите задачу хотя бы в двух словах",
  taskTooShort: "Нужно чуть подробнее – минимум 10 символов",
  budgetRequired: "Выберите вилку бюджета",
} as const;
